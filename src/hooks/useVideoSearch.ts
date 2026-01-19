import { useState, useCallback } from 'react';
import { Video, searchDIYVideosWithCache } from '@/services/videoService';
import { scoreAndRankVideos, VideoScoreResult } from '@/services/videoScoring';

interface UseVideoSearchState {
  videos: Video[];
  results: VideoScoreResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

interface UseVideoSearchResult extends UseVideoSearchState {
  search: (items: string[]) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for managing video search, scoring, and error handling
 * Implements Step 3, 4, 5 from requirements
 */
export function useVideoSearch(): UseVideoSearchResult {
  const [state, setState] = useState<UseVideoSearchState>({
    videos: [],
    results: [],
    isLoading: false,
    error: null,
    hasSearched: false,
  });

  const search = useCallback(async (items: string[]) => {
    // Validate input
    if (!items || items.length === 0) {
      setState(prev => ({
        ...prev,
        error: 'Please add at least one item to search',
        isLoading: false,
      }));
      return;
    }

    // Start loading
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Step 3: Fetch videos from internet
      const videos = await searchDIYVideosWithCache(items, 15);

      // Handle empty results
      if (!videos || videos.length === 0) {
        setState(prev => ({
          ...prev,
          videos: [],
          results: [],
          isLoading: false,
          error: "We couldn't find DIY videos for those items. Try adding common craft supplies like scissors, glue, paper, or tape!",
          hasSearched: true,
        }));
        return;
      }

      // Step 4: Score and rank videos
      const scoredResults = scoreAndRankVideos(videos, items);

      // Step 5: Display results
      setState(prev => ({
        ...prev,
        videos,
        results: scoredResults,
        isLoading: false,
        error: null,
        hasSearched: true,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      
      console.error('Video search error:', err);

      setState(prev => ({
        ...prev,
        videos: [],
        results: [],
        isLoading: false,
        error: `Failed to fetch videos: ${errorMessage}. Please check your internet connection and try again.`,
        hasSearched: true,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      videos: [],
      results: [],
      isLoading: false,
      error: null,
      hasSearched: false,
    });
  }, []);

  return {
    ...state,
    search,
    reset,
  };
}
