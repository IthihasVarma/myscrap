/**
 * Video Service - Fetches DIY videos dynamically from the internet
 * Uses multiple strategies to find relevant DIY/craft videos
 */

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  source: 'youtube' | 'dailymotion' | 'vimeo';
  duration?: string;
  views?: number;
  channel?: string;
}

export interface VideoSearchResult {
  videos: Video[];
  query: string;
  timestamp: number;
  hasMore: boolean;
}

/**
 * Search for DIY videos using a public API
 * We use the RapidAPI YouTube API or similar free alternatives
 */
async function searchYouTubeVideos(query: string, limit: number = 12): Promise<Video[]> {
  try {
    // Using a free public YouTube search approach via a CORS proxy
    // This uses invidious.io API (a free, privacy-focused YouTube alternative)
    const encoded = encodeURIComponent(query);
    const invidious_url = `https://invidious.io/api/v1/search?q=${encoded}&type=video&fields=videoId,title,description,lengthSeconds,viewCountText&sort_by=relevance`;
    
    const response = await fetch(invidious_url);
    
    if (!response.ok) {
      throw new Error(`Invidious API failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.slice(0, limit).map((item: any) => ({
      id: item.videoId,
      title: item.title,
      description: item.description || '',
      thumbnail: `https://invidious.io/vi/${item.videoId}/maxres.jpg`,
      url: `https://www.youtube.com/watch?v=${item.videoId}`,
      source: 'youtube' as const,
      duration: formatDuration(item.lengthSeconds),
      views: parseViewCount(item.viewCountText),
      channel: item.author,
    }));
  } catch (error) {
    console.error('YouTube search failed:', error);
    return [];
  }
}

/**
 * Alternative: Use YouTube's public embed approach
 * This doesn't require API key but has limitations
 */
async function searchYouTubeVideosAlt(query: string, limit: number = 12): Promise<Video[]> {
  try {
    // Use a different CORS proxy or approach
    const encoded = encodeURIComponent(query);
    
    // Try YouTube.com search with a CORS proxy
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encoded}`;
    const proxyUrl = corsProxy + encodeURIComponent(youtubeUrl);
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('CORS proxy failed');
    }

    const html = await response.text();
    
    // Extract video data from YouTube HTML (fragile but works)
    const videoIds = (html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/g) || [])
      .slice(0, limit)
      .map(m => m.match(/"videoId":"([a-zA-Z0-9_-]{11})"/)![1]);

    return videoIds.map(id => ({
      id,
      title: query, // We don't have titles from this approach
      description: '',
      thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${id}`,
      source: 'youtube' as const,
    }));
  } catch (error) {
    console.error('YouTube alt search failed:', error);
    return [];
  }
}

/**
 * Format duration from seconds to readable string
 */
function formatDuration(seconds: string | number): string {
  const totalSeconds = typeof seconds === 'string' ? parseInt(seconds) : seconds;
  
  if (totalSeconds < 60) return `${totalSeconds}s`;
  
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  
  if (minutes < 60) {
    return `${minutes}m ${secs > 0 ? secs + 's' : ''}`.trim();
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return `${hours}h ${mins > 0 ? mins + 'm' : ''}`.trim();
}

/**
 * Parse view count from text like "1.2M views"
 */
function parseViewCount(text: string): number {
  if (!text) return 0;
  
  const match = text.match(/[\d.,]+/);
  if (!match) return 0;
  
  let numStr = match[0].replace(/[.,]/g, '');
  
  if (text.includes('M')) numStr += '000000';
  else if (text.includes('K')) numStr += '000';
  
  return parseInt(numStr) || 0;
}

/**
 * Build comprehensive DIY search query from user items
 * Example: ['cardboard', 'glue'] -> ['DIY cardboard craft', 'DIY glue project']
 */
export function buildSearchQueries(items: string[]): string[] {
  if (items.length === 0) return [];

  const queries: string[] = [];
  
  // Main combined query
  const itemsStr = items.slice(0, 3).join(' ');
  queries.push(`DIY craft using ${itemsStr}`);
  queries.push(`DIY projects with ${itemsStr}`);
  
  // Individual item queries
  items.slice(0, 2).forEach(item => {
    queries.push(`DIY ${item} craft`);
    queries.push(`${item} craft tutorial`);
  });
  
  // Household items focus
  if (items.length > 1) {
    queries.push(`creative DIY with ${items[0]} and ${items[1]}`);
  }
  
  return [...new Set(queries)]; // Remove duplicates
}

/**
 * Main video search function - fetches from multiple sources
 */
export async function searchDIYVideos(items: string[], limit: number = 15): Promise<Video[]> {
  const queries = buildSearchQueries(items);
  const allVideos: Video[] = [];
  const videoIds = new Set<string>();

  // Search using primary method
  for (const query of queries) {
    if (allVideos.length >= limit) break;
    
    try {
      const videos = await searchYouTubeVideos(query, 5);
      
      for (const video of videos) {
        if (!videoIds.has(video.id) && allVideos.length < limit) {
          videoIds.add(video.id);
          allVideos.push(video);
        }
      }
    } catch (error) {
      console.error(`Search failed for query "${query}":`, error);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // If we don't have enough results, try alternative method
  if (allVideos.length < limit / 2) {
    try {
      const videos = await searchYouTubeVideosAlt(queries[0], limit - allVideos.length);
      
      for (const video of videos) {
        if (!videoIds.has(video.id) && allVideos.length < limit) {
          videoIds.add(video.id);
          allVideos.push(video);
        }
      }
    } catch (error) {
      console.error('Alternative search failed:', error);
    }
  }

  return allVideos;
}

/**
 * Enhanced video search with caching (session-based only)
 */
const searchCache = new Map<string, { videos: Video[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function searchDIYVideosWithCache(items: string[], limit: number = 15): Promise<Video[]> {
  const cacheKey = items.sort().join('|');
  const cached = searchCache.get(cacheKey);

  // Return cached result if still fresh
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.videos.slice(0, limit);
  }

  // Fetch fresh results
  const videos = await searchDIYVideos(items, limit);
  
  // Cache the results (session-only)
  searchCache.set(cacheKey, {
    videos,
    timestamp: Date.now(),
  });

  return videos;
}
