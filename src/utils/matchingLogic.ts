import { DIYProject, diyProjects, materialAliases } from '@/data/diyProjects';

// Simple fuzzy match using Levenshtein-like similarity
function similarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Check word overlap
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const overlap = words1.filter(w => words2.some(w2 => w2.includes(w) || w.includes(w2)));
  
  if (overlap.length > 0) return 0.6;
  
  return 0;
}

// Normalize user input item to match our materials
function normalizeItem(item: string): string[] {
  const normalized = item.toLowerCase().trim();
  const matches = [normalized];
  
  // Check aliases
  for (const [canonical, aliases] of Object.entries(materialAliases)) {
    if (aliases.some(alias => similarity(normalized, alias) > 0.6) || 
        similarity(normalized, canonical) > 0.6) {
      matches.push(canonical);
    }
  }
  
  return [...new Set(matches)];
}

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

export interface MatchResult {
  project: DIYProject;
  matchedMaterials: string[]; // Exact user items that matched
  suggestedMaterials: string[]; // Materials user needs to get
  matchScore: number; // 0-1, how well the user's items match
}

// Find matching projects based on user's items
export function findMatchingProjects(userItems: string[]): MatchResult[] {
  if (userItems.length === 0) return [];
  
  const results: MatchResult[] = [];
  
  // Normalize all user items
  const normalizedUserItems = userItems.flatMap(item => normalizeItem(item));
  
  for (const project of diyProjects) {
    const matchedMaterials: string[] = [];
    const suggestedMaterials: string[] = [];
    
    for (const material of project.materials) {
      const materialNormalized = material.toLowerCase();
      const materialVariants = normalizeItem(materialNormalized);
      
      // Check if any user item matches this material
      const hasMatch = normalizedUserItems.some(userItem => 
        materialVariants.some(variant => 
          similarity(userItem, variant) > 0.5 || 
          similarity(userItem, materialNormalized) > 0.5
        )
      );
      
      if (hasMatch) {
        // Find the original user item that matched
        const originalMatch = userItems.find(item => 
          materialVariants.some(variant => 
            similarity(item.toLowerCase(), variant) > 0.5 ||
            similarity(item.toLowerCase(), materialNormalized) > 0.5
          )
        );
        if (originalMatch) matchedMaterials.push(originalMatch);
      } else {
        suggestedMaterials.push(material);
      }
    }
    
    // Calculate match score (percentage of materials the user has)
    const matchScore = matchedMaterials.length / project.materials.length;
    
    // Only include projects where user has at least 1 material
    if (matchScore > 0) {
      results.push({
        project,
        matchedMaterials: [...new Set(matchedMaterials)],
        suggestedMaterials,
        matchScore,
      });
    }
  }
  
  // Sort by match score (best matches first), then by fewer missing materials
  return results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.suggestedMaterials.length - b.suggestedMaterials.length;
  });
}

// Get friendly message based on results
export function getResultsMessage(results: MatchResult[], itemCount: number): string {
  if (results.length === 0) {
    if (itemCount === 0) {
      return "Add some items you have at home to discover DIY projects!";
    }
    return "We couldn't find projects matching those exact items. Try adding common craft supplies like scissors, glue, or paper!";
  }
  
  const perfectMatches = results.filter(r => r.matchScore === 1).length;
  const goodMatches = results.filter(r => r.matchScore >= 0.5).length;
  
  if (perfectMatches > 0) {
    return `Amazing! You have everything needed for ${perfectMatches} project${perfectMatches > 1 ? 's' : ''}! 🎉`;
  }
  
  if (goodMatches > 0) {
    return `Found ${goodMatches} project${goodMatches > 1 ? 's' : ''} you're almost ready to make!`;
  }
  
  return `Found ${results.length} project${results.length > 1 ? 's' : ''} you could try with a few extra supplies.`;
}
