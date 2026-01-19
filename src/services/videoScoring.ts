/**
 * Video Scoring & Matching Logic
 * Ranks videos based on material matching and relevance
 */

import { Video } from './videoService';

export interface VideoScoreResult {
  video: Video;
  matchedItems: string[];
  suggestedItems: string[];
  matchScore: number; // 0-1
  matchPercentage: number;
  isExactMatch: boolean;
  matchType: 'exact' | 'partial' | 'suggested';
  relevanceScore: number; // 0-1, based on title/description
}

/**
 * Normalize text for matching (remove special chars, lowercase, trim)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Calculate text similarity score (0-1)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const norm1 = normalizeText(text1);
  const norm2 = normalizeText(text2);

  if (norm1 === norm2) return 1;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8;

  // Word-level matching
  const words1 = norm1.split(/\s+/);
  const words2 = norm2.split(/\s+/);
  
  const matches = words1.filter(w1 =>
    words2.some(w2 => w1.includes(w2) || w2.includes(w1))
  ).length;

  return matches > 0 ? Math.min(matches / Math.max(words1.length, words2.length), 0.7) : 0;
}

/**
 * Extract keywords from text (title + description)
 */
function extractKeywords(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 20); // Limit to first 20 words
}

/**
 * Common DIY material aliases for fuzzy matching
 */
const materialAliases: Record<string, string[]> = {
  'cardboard': ['box', 'carton', 'packaging', 'corrugated'],
  'glue': ['adhesive', 'paste', 'cement', 'hot glue', 'craft glue', 'super glue'],
  'scissors': ['shears', 'cutting tool', 'cutter'],
  'paper': ['sheet', 'construction paper', 'craft paper', 'scrapbook'],
  'tape': ['adhesive tape', 'masking tape', 'duct tape', 'washi tape'],
  'paint': ['acrylic', 'spray paint', 'watercolor', 'marker'],
  'fabric': ['cloth', 'textile', 'material', 'felt', 'cotton'],
  'string': ['twine', 'cord', 'yarn', 'rope', 'thread'],
  'bottle': ['plastic bottle', 'glass bottle', 'container'],
  'jar': ['mason jar', 'glass jar', 'container'],
  'magazine': ['newspaper', 'publication', 'print'],
  'wood': ['stick', 'dowel', 'timber', 'lumber'],
  'metal': ['aluminum', 'tin', 'wire', 'copper'],
  't-shirt': ['shirt', 'tee', 'old shirt', 'clothing'],
};

/**
 * Get all possible aliases for a material
 */
function getMaterialVariants(material: string): string[] {
  const normalized = normalizeText(material);
  const variants = [normalized];

  // Add direct aliases
  for (const [key, aliases] of Object.entries(materialAliases)) {
    if (normalized === normalizeText(key)) {
      variants.push(
        ...aliases.map(normalizeText),
        ...extractKeywords(key)
      );
    }
  }

  // Find aliases that contain this material
  for (const [key, aliases] of Object.entries(materialAliases)) {
    if (aliases.some(alias => calculateSimilarity(normalized, alias) > 0.7)) {
      variants.push(
        normalizeText(key),
        ...aliases.map(normalizeText)
      );
    }
  }

  return [...new Set(variants)];
}

/**
 * Score a video based on user's items
 * Step 4 from requirements: Scoring & Ranking
 */
export function scoreVideo(
  video: Video,
  userItems: string[]
): VideoScoreResult {
  if (!video || userItems.length === 0) {
    return {
      video,
      matchedItems: [],
      suggestedItems: [],
      matchScore: 0,
      matchPercentage: 0,
      isExactMatch: false,
      matchType: 'suggested',
      relevanceScore: 0,
    };
  }

  // Extract content to search
  const videoContent = `${video.title} ${video.description}`.toLowerCase();
  const videoKeywords = extractKeywords(videoContent);

  // Track matches
  const matchedItems: string[] = [];
  const suggestedItems: string[] = [];
  const similarityScores: number[] = [];

  // For each user item, check if it matches video content
  for (const userItem of userItems) {
    const itemVariants = getMaterialVariants(userItem);
    let bestMatch = 0;

    // Check each variant against video keywords
    for (const variant of itemVariants) {
      for (const keyword of videoKeywords) {
        const similarity = calculateSimilarity(variant, keyword);
        if (similarity > bestMatch) {
          bestMatch = similarity;
        }
      }
    }

    // Also check title directly
    const titleSimilarity = calculateSimilarity(userItem, video.title);
    bestMatch = Math.max(bestMatch, titleSimilarity);

    if (bestMatch > 0.5) {
      matchedItems.push(userItem);
      similarityScores.push(bestMatch);
    }
  }

  // Calculate scores
  const matchScore = matchedItems.length / userItems.length;
  const matchPercentage = Math.round(matchScore * 100);
  const avgSimilarity = similarityScores.length > 0
    ? similarityScores.reduce((a, b) => a + b) / similarityScores.length
    : 0;

  // Additional relevance based on keyword density
  const diyKeywords = ['diy', 'craft', 'tutorial', 'how to', 'make', 'project'];
  const isDIYVideo = diyKeywords.some(kw => videoContent.includes(kw));
  const relevanceBonus = isDIYVideo ? 0.2 : 0;

  const relevanceScore = Math.min(
    avgSimilarity + relevanceBonus,
    1
  );

  const isExactMatch = matchPercentage === 100;
  
  // Determine match type
  let matchType: 'exact' | 'partial' | 'suggested';
  if (matchPercentage === 100) {
    matchType = 'exact';
  } else if (matchPercentage >= 70) {
    matchType = 'partial';
  } else {
    matchType = 'suggested';
  }

  // Items not matched are "suggested" (user would need to get)
  const suggestedItems_list = userItems.filter(item => !matchedItems.includes(item));

  return {
    video,
    matchedItems,
    suggestedItems: suggestedItems_list,
    matchScore,
    matchPercentage,
    isExactMatch,
    matchType,
    relevanceScore,
  };
}

/**
 * Score and rank multiple videos
 * Step 4 from requirements: Scoring & Ranking
 */
export function scoreAndRankVideos(
  videos: Video[],
  userItems: string[]
): VideoScoreResult[] {
  const results = videos
    .map(video => scoreVideo(video, userItems))
    // Filter out videos with very low match (below 30%)
    .filter(result => result.matchPercentage > 30 || result.isExactMatch || result.relevanceScore > 0.4)
    // Sort by match quality (exact > partial > suggested, then by relevance)
    .sort((a, b) => {
      // First priority: match type (exact > partial > suggested)
      const typeOrder = { exact: 3, partial: 2, suggested: 1 };
      if (typeOrder[a.matchType] !== typeOrder[b.matchType]) {
        return typeOrder[b.matchType] - typeOrder[a.matchType];
      }

      // Second priority: match percentage
      if (a.matchPercentage !== b.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }

      // Third priority: relevance score
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }

      // Fourth priority: fewer suggested items
      return a.suggestedItems.length - b.suggestedItems.length;
    });

  return results;
}

/**
 * Get human-friendly message about results quality
 */
export function getVideoResultsMessage(results: VideoScoreResult[], itemCount: number): string {
  if (results.length === 0) {
    if (itemCount === 0) {
      return "Add some items you have at home to discover DIY projects! ✂️✨";
    }
    return "We couldn't find DIY videos matching those items right now. Try adding common craft supplies like scissors, glue, paper, or tape!";
  }

  const exactMatches = results.filter(r => r.matchType === 'exact').length;
  const partialMatches = results.filter(r => r.matchType === 'partial').length;
  
  if (exactMatches > 0) {
    return `🎉 Found ${exactMatches} video${exactMatches > 1 ? 's' : ''} where you have everything needed!`;
  }

  if (partialMatches > 0) {
    return `✨ Found ${partialMatches} project${partialMatches > 1 ? 's' : ''} you're almost ready to make!`;
  }

  return `Found ${results.length} creative option${results.length > 1 ? 's' : ''} you can explore!`;
}

/**
 * Get difficulty estimate from video title/description
 */
export function estimateDifficulty(video: Video): 'Beginner' | 'Intermediate' | 'Advanced' {
  const content = `${video.title} ${video.description}`.toLowerCase();
  
  const advancedKeywords = ['advanced', 'complex', 'professional', 'expert', 'difficult'];
  const intermediateKeywords = ['intermediate', 'medium', 'skilled'];
  const beginnerKeywords = ['beginner', 'easy', 'simple', 'quick', 'diy for kids', 'no sew'];

  if (advancedKeywords.some(kw => content.includes(kw))) {
    return 'Advanced';
  }
  
  if (intermediateKeywords.some(kw => content.includes(kw))) {
    return 'Intermediate';
  }
  
  if (beginnerKeywords.some(kw => content.includes(kw))) {
    return 'Beginner';
  }

  // Default: if it's a short video, likely beginner
  if (video.duration && (video.duration.includes('m') && !video.duration.includes('h'))) {
    const minutes = parseInt(video.duration);
    if (minutes < 15) return 'Beginner';
    if (minutes < 45) return 'Intermediate';
  }

  return 'Intermediate';
}
