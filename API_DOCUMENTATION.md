# Craftify API & Services Documentation

## Video Service (`src/services/videoService.ts`)

### Core Functions

#### `searchDIYVideos(items: string[], limit: number = 15): Promise<Video[]>`

**Purpose:** Fetches DIY videos from the internet based on user items.

**Parameters:**
- `items`: Array of material/item strings (e.g., `["cardboard", "glue"]`)
- `limit`: Maximum number of videos to return (default: 15)

**Returns:** Promise resolving to array of Video objects

**Process:**
1. Builds multiple search queries from items
2. Searches using Invidious API
3. Falls back to alternative method if results are low
4. Returns first 15 results with delay between requests

**Example:**
```typescript
const videos = await searchDIYVideos(['cardboard', 'glue'], 15);
```

---

#### `buildSearchQueries(items: string[]): string[]`

**Purpose:** Converts user items into comprehensive search queries.

**Parameters:**
- `items`: Array of material strings

**Returns:** Array of unique search query strings

**Logic:**
- Generates combined queries: "DIY craft using [items]"
- Individual queries per item: "DIY [item] craft"
- Household item focus: "creative DIY with [item1] and [item2]"

**Example:**
```typescript
buildSearchQueries(['cardboard', 'glue'])
// Returns:
// [
//   'DIY craft using cardboard glue',
//   'DIY projects with cardboard glue',
//   'DIY cardboard craft',
//   'cardboard craft tutorial',
//   'DIY glue craft',
//   'glue craft tutorial',
//   'creative DIY with cardboard and glue'
// ]
```

---

#### `searchDIYVideosWithCache(items: string[], limit: number = 15): Promise<Video[]>`

**Purpose:** Same as `searchDIYVideos` but with session-based caching.

**Cache Details:**
- Duration: 5 minutes
- Scope: Current browser session only
- Cache key: Sorted, pipe-separated item names

**Use this in production** to avoid redundant API calls.

---

### Data Types

#### `Video`
```typescript
interface Video {
  id: string;              // YouTube video ID
  title: string;           // Video title
  description: string;     // Video description/details
  thumbnail: string;       // URL to thumbnail image
  url: string;            // Full YouTube URL
  source: 'youtube' | 'dailymotion' | 'vimeo';
  duration?: string;       // e.g., "12m 30s"
  views?: number;          // View count
  channel?: string;        // Channel/creator name
}
```

---

## Video Scoring Service (`src/services/videoScoring.ts`)

### Core Functions

#### `scoreVideo(video: Video, userItems: string[]): VideoScoreResult`

**Purpose:** Scores a single video against user's items.

**Parameters:**
- `video`: Video object to score
- `userItems`: Array of material strings user has

**Returns:** VideoScoreResult with detailed scoring breakdown

**Algorithm:**
1. Extracts keywords from video title + description
2. For each user item:
   - Gets material variants (base + aliases)
   - Checks similarity with video keywords
   - Records if match found (similarity > 0.5)
3. Calculates match percentage
4. Adds relevance bonus for DIY-focused videos
5. Determines match type (exact/partial/suggested)

**Scoring Formula:**
```
matchScore = matchedItems / totalUserItems
matchPercentage = matchScore * 100

relevanceScore = avgSimilarity + (isDIYVideo ? 0.2 : 0)
```

---

#### `scoreAndRankVideos(videos: Video[], userItems: string[]): VideoScoreResult[]`

**Purpose:** Scores and ranks multiple videos.

**Parameters:**
- `videos`: Array of videos to score
- `userItems`: Array of material strings

**Returns:** Array of VideoScoreResult sorted by quality

**Filtering:** Removes videos with <30% match (unless high relevance)

**Sorting Priority:**
1. Match type (exact > partial > suggested)
2. Match percentage (higher first)
3. Relevance score (higher first)
4. Fewer suggested items needed

---

#### `estimateDifficulty(video: Video): 'Beginner' | 'Intermediate' | 'Advanced'`

**Purpose:** Estimates project difficulty from video metadata.

**Logic:**
1. Scans title/description for difficulty keywords
   - Advanced: "advanced", "professional", "expert"
   - Intermediate: "intermediate", "skilled"
   - Beginner: "easy", "simple", "quick"
2. Fallback: Estimates from duration
   - <15 min: Beginner
   - 15-45 min: Intermediate
   - >45 min: Advanced
3. Default: Intermediate

---

#### `getVideoResultsMessage(results: VideoScoreResult[], itemCount: number): string`

**Purpose:** Generates user-friendly result summary message.

**Returns:** Friendly message based on results quality

**Examples:**
- No results: "We couldn't find DIY videos for those items..."
- Exact matches: "🎉 Found 3 videos where you have everything needed!"
- Partial matches: "✨ Found 5 projects you're almost ready to make!"
- General: "Found 12 creative options you can explore!"

---

### Data Types

#### `VideoScoreResult`
```typescript
interface VideoScoreResult {
  video: Video;                          // The video being scored
  matchedItems: string[];                // User items found in video
  suggestedItems: string[];              // Items user would need to get
  matchScore: number;                    // 0-1 ratio
  matchPercentage: number;               // 0-100%
  isExactMatch: boolean;                 // matchPercentage === 100
  matchType: 'exact' | 'partial' | 'suggested';
  relevanceScore: number;                // 0-1, DIY relevance
}
```

#### Material Aliases
```typescript
const materialAliases: Record<string, string[]> = {
  'cardboard': ['box', 'carton', 'packaging', 'corrugated'],
  'glue': ['adhesive', 'paste', 'cement', 'hot glue', 'craft glue', 'super glue'],
  'scissors': ['shears', 'cutting tool', 'cutter'],
  'paper': ['sheet', 'construction paper', 'craft paper', 'scrapbook paper'],
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
  // ... more aliases
}
```

---

## Input Parsing (`src/utils/matchingLogic.ts`)

### Core Functions

#### `parseUserItems(input: string): string[]`

**Purpose:** Parses and cleans user input into item list.

**Input Format:**
- Comma-separated: "cardboard, glue, scissors"
- Newline-separated: "cardboard\nglue\nscissors"
- Mixed: Works with both

**Processing:**
1. Splits by commas and newlines
2. Trims whitespace from each item
3. Converts to lowercase
4. Filters out:
   - Empty strings
   - Items > 50 characters
   - Pure numeric entries
   - HTML injection attempts (contains `<>{}[]`)
5. Removes duplicates
6. Limits to 20 items max

**Example:**
```typescript
parseUserItems("Cardboard, GLUE, old magazines\nscissors")
// Returns: ["cardboard", "glue", "old magazines", "scissors"]
```

---

#### `isValidUserInput(items: string[]): boolean`

**Purpose:** Validates that user input is meaningful.

**Validation Rules:**
- Must have at least 1 item
- Cannot exceed 20 items
- Must have at least 1 meaningful item (not pure numbers)

**Returns:** Boolean indicating validity

---

## React Hook (`src/hooks/useVideoSearch.ts`)

### `useVideoSearch(): UseVideoSearchResult`

**Purpose:** Custom React hook for managing video search state and logic.

**State Managed:**
```typescript
interface UseVideoSearchState {
  videos: Video[];                 // Raw fetched videos
  results: VideoScoreResult[];    // Scored and ranked
  isLoading: boolean;             // Fetch in progress
  error: string | null;           // Error message if any
  hasSearched: boolean;           // Whether search was attempted
}
```

**Methods:**

##### `search(items: string[]): Promise<void>`
Performs complete search workflow:
1. Validates input
2. Sets loading state
3. Fetches videos from YouTube
4. Scores and ranks videos
5. Updates state with results
6. Handles errors gracefully

```typescript
const { search, isLoading, results } = useVideoSearch();

// Usage
await search(['cardboard', 'glue']);
```

##### `reset(): void`
Clears all state back to initial state.

```typescript
videoSearch.reset();
```

**Example Usage:**
```typescript
function MyComponent() {
  const { videos, results, isLoading, error, search } = useVideoSearch();

  const handleSearch = async (items: string[]) => {
    await search(items);
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {results.map(r => <VideoCard result={r} />)}
    </div>
  );
}
```

---

## Error Handling

### Error Types & Responses

| Error | Message | Solution |
|-------|---------|----------|
| No videos found | "We couldn't find DIY videos..." | Add common supplies |
| Network failure | "Failed to fetch videos: [error]" | Check internet connection |
| Empty input | "Please add at least one item" | Enter items to search |
| Invalid input | "Please enter meaningful items" | Avoid numbers/HTML |

### Graceful Degradation

1. **Primary API Fails** → Tries fallback method
2. **Fallback Fails** → Returns user-friendly error
3. **Partial Results** → Shows what's available
4. **No Results** → Suggests alternatives

---

## Performance Metrics

### API Calls
- **Per search:** 3-7 requests (depending on queries)
- **Rate limit:** 200ms delay between requests
- **Cache hit rate:** ~70% for repeated searches
- **Cache duration:** 5 minutes

### Processing
- **Input parsing:** <1ms
- **Search query building:** <5ms
- **Video fetching:** 1-3 seconds (network dependent)
- **Scoring 15 videos:** <50ms
- **Total user wait:** 2-4 seconds average

### Memory
- **Cached videos:** ~1-2MB for 15 videos
- **Session cache:** ~5-10MB for 50 searches
- **No persistent storage**

---

## Testing Examples

### Test 1: Basic Matching
```typescript
const items = ['cardboard', 'glue'];
const videos = await searchDIYVideos(items);
const results = scoreAndRankVideos(videos, items);

// Expected: Videos about cardboard crafts, boxes, adhesive projects
```

### Test 2: Alias Matching
```typescript
const items = ['rope', 'container'];
const results = scoreAndRankVideos(videos, items);

// Expected: Finds videos using "twine", "cord", "jar", "bottle" aliases
```

### Test 3: Error Handling
```typescript
const items = ['non-existent-material-xyz'];
const results = scoreAndRankVideos(videos, items);

// Expected: Returns empty results, user sees friendly message
```

### Test 4: Empty Input
```typescript
parseUserItems('');        // Returns []
isValidUserInput([]);      // Returns false
```

---

## Integration Points

### With React Components

**VideoResultsScreen.tsx** uses:
- `searchDIYVideosWithCache()` - Fetches videos
- `scoreAndRankVideos()` - Scores videos
- `getVideoResultsMessage()` - Generates message
- `VideoScoreResult` - For display data

**VideoCard.tsx** uses:
- `VideoScoreResult` - Displays match info
- `estimateDifficulty()` - Shows difficulty

**Index.tsx** uses:
- `useVideoSearch()` - Manages search lifecycle
- `isValidUserInput()` - Validates before search
- `parseUserItems()` - Parses input

---

## API Reference Summary

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `searchDIYVideos()` | items, limit | `Promise<Video[]>` | Fetch videos |
| `buildSearchQueries()` | items | `string[]` | Generate queries |
| `scoreVideo()` | video, items | `VideoScoreResult` | Score single video |
| `scoreAndRankVideos()` | videos, items | `VideoScoreResult[]` | Score & rank all |
| `estimateDifficulty()` | video | difficulty level | Estimate difficulty |
| `getVideoResultsMessage()` | results, count | `string` | Generate message |
| `parseUserItems()` | input string | `string[]` | Parse items |
| `isValidUserInput()` | items | `boolean` | Validate input |
| `useVideoSearch()` | - | hook object | Manage search state |

---

## Best Practices

✅ **DO:**
- Use `searchDIYVideosWithCache()` in production
- Validate input with `isValidUserInput()` before searching
- Handle errors gracefully with user-friendly messages
- Limit searches to 15-20 videos for performance
- Add 200ms delays between sequential requests

❌ **DON'T:**
- Make redundant API calls without checking cache
- Display raw API errors to users
- Search for more than 20 items at once
- Make multiple simultaneous searches
- Assume videos will always be available

---

**Version:** 1.0  
**Last Updated:** January 2026
