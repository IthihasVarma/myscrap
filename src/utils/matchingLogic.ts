/**
 * User Input Parsing & Validation
 * Step 1 from requirements: Normalize User Input
 */

// Parse user input into clean item list
export function parseUserItems(input: string): string[] {
  // Handle comma-separated or newline-separated input
  const items = input
    .split(/[,\n]+/)
    .map(item => item.trim().toLowerCase())
    .filter(item => item.length > 0 && item.length < 50) // Filter empty and suspiciously long
    .filter(item => !/^[\d\s]+$/.test(item)) // Filter number-only entries
    .filter(item => !/[<>{}[\]]/.test(item)) // Filter potential injection
    .slice(0, 20); // Limit to 20 items
  
  // Remove duplicates
  return [...new Set(items)];
}

/**
 * Validate if input is meaningful
 */
export function isValidUserInput(items: string[]): boolean {
  if (items.length === 0) return false;
  if (items.length > 20) return false;
  
  // Check if input is mostly meaningful (not just numbers or gibberish)
  const meaningfulItems = items.filter(item => {
    const normalized = item.toLowerCase();
    // Must have at least 2 characters and not be pure numbers
    return normalized.length >= 2 && !/^\d+$/.test(normalized);
  });
  
  return meaningfulItems.length > 0;
}

/**
 * Legacy interfaces - kept for potential backward compatibility
 */
export interface MatchResult {
  project: any;
  matchedMaterials: string[];
  suggestedMaterials: string[];
  matchScore: number;
}

// Legacy function - returns empty for new video-based flow
export function findMatchingProjects(userItems: string[]): MatchResult[] {
  // This is replaced by video-based matching in the new flow
  return [];
}

// Legacy function - returns generic message
export function getResultsMessage(results: MatchResult[], itemCount: number): string {
  if (itemCount === 0) {
    return "Add some items you have at home to discover DIY projects!";
  }
  return "Loading DIY ideas...";
}
