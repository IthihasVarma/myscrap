# Craftify: DIY Discovery Platform - Implementation Guide

## 🌿 Overview

Craftify is a modern DIY discovery web application where users input objects they own, and the platform suggests creative DIY projects using those items. **All results are fetched dynamically from the internet in real-time** - there is no pre-saved dataset.

## 🎯 System Architecture

### Core Components

```
src/
├── services/
│   ├── videoService.ts          # Live video fetching from YouTube
│   └── videoScoring.ts          # Intelligent video ranking & matching
├── hooks/
│   └── useVideoSearch.ts        # React hook for search state management
├── components/
│   ├── VideoCard.tsx            # Individual video result card
│   ├── VideoResultsScreen.tsx   # Results grid display
│   ├── ItemInput.tsx            # User input form (existing)
│   └── WelcomeScreen.tsx        # Landing page (existing)
├── pages/
│   └── Index.tsx                # Main app orchestrator (updated)
└── utils/
    └── matchingLogic.ts         # Input parsing & validation
```

## ⚙️ How It Works (Step-by-Step)

### Step 1: User Input Normalization
**File:** `src/utils/matchingLogic.ts`

```typescript
parseUserItems(input: string): string[]
```

- Accepts comma-separated or newline-separated input
- Normalizes to lowercase, trims whitespace
- Removes duplicates
- Filters invalid entries (numbers-only, too long, HTML injection attempts)
- Returns max 20 items

**Example:**
```
Input: "cardboard, glue, OLD MAGAZINES"
Output: ["cardboard", "glue", "old magazines"]
```

### Step 2: Search Query Building
**File:** `src/services/videoService.ts`

```typescript
buildSearchQueries(items: string[]): string[]
```

Converts user items into comprehensive search phrases:
- Combined query: "DIY craft using cardboard glue"
- Alternative: "DIY projects with cardboard glue"
- Individual queries: "DIY cardboard craft", "glue craft tutorial"
- Household focus: "creative DIY with cardboard and glue"

This ensures we cast a wide net for relevant videos.

### Step 3: Live Video Fetching
**File:** `src/services/videoService.ts`

```typescript
searchDIYVideos(items: string[], limit: number = 15): Promise<Video[]>
```

**Primary Method:** Uses Invidious API (free, privacy-focused YouTube wrapper)
- No authentication required
- CORS-enabled
- Returns real-time search results

**Fallback Method:** Direct YouTube CORS proxy approach
- Additional layer of redundancy
- Slower but works when primary fails

**Features:**
- 200ms delays between requests to avoid rate limiting
- Automatic retry with alternative queries
- Session-based caching (5 min) to reduce API calls
- Graceful error handling

**Example Response:**
```json
{
  "id": "dQw4w9WgXcQ",
  "title": "DIY Cardboard Box Organizer",
  "description": "Learn how to make...",
  "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "source": "youtube",
  "duration": "12m 30s",
  "views": 15000
}
```

### Step 4: Video Scoring & Ranking
**File:** `src/services/videoScoring.ts`

```typescript
scoreAndRankVideos(videos: Video[], userItems: string[]): VideoScoreResult[]
```

Each video is scored on multiple dimensions:

#### Material Matching (Primary)
- Extracts keywords from video title + description
- Compares with user items using fuzzy matching
- Score: 0-1 (percentage of user items found in video)
- Uses material aliases for semantic matching

**Example:**
```
User items: ["cardboard", "glue", "scissors"]
Video: "DIY Cardboard Gift Box with Adhesive"

Matched: "cardboard" (exact), "glue" (via "adhesive" alias)
Suggested: "scissors" (not found)
Match %: 66% (2 out of 3 items)
```

#### Relevance Scoring
- Checks for DIY keywords: "diy", "craft", "tutorial", "how to", "make"
- Bonus (+0.2) if video is DIY-focused
- Combined with material matching for final score

#### Match Types
1. **Exact Match** (100%): User has all materials
2. **Partial Match** (70-99%): User has most materials  
3. **Suggested** (<70%): Similar to user's interests

#### Filtering & Sorting
- **Filters:** Only shows videos with >30% match OR high relevance
- **Sort Priority:**
  1. Match type (exact > partial > suggested)
  2. Match percentage (higher first)
  3. Relevance score (higher first)
  4. Fewer missing materials

### Step 5: Results Display
**File:** `src/components/VideoResultsScreen.tsx` & `VideoCard.tsx`

Displays videos in a Pinterest-style grid with:
- Thumbnail image with play button overlay
- Video title
- Matched items (highlighted in green)
- Suggested items needed (in muted gray)
- Difficulty level (Beginner/Intermediate/Advanced)
- Duration estimate
- Match percentage bar
- Direct link to video

## 🔍 Fuzzy Matching & Aliases

The system understands material variations through aliases:

```typescript
materialAliases = {
  'glue': ['adhesive', 'paste', 'cement', 'hot glue', 'craft glue', 'super glue'],
  'scissors': ['shears', 'cutting tool', 'cutter'],
  'string': ['twine', 'cord', 'yarn', 'rope', 'thread'],
  // ... and many more
}
```

**Similarity Calculation:**
- 1.0: Exact match ("glue" = "glue")
- 0.8: Substring match ("glue" in "hot glue")
- 0.6-0.7: Word overlap ("craft" shared in contexts)
- 0.0: No match

## 🎨 User Experience Flow

```
1. Welcome Screen
   ↓
2. Item Input
   User enters: "cardboard, glue, old magazines"
   ↓
3. Processing
   - Normalize input
   - Build search queries
   - Fetch videos from YouTube
   - Score videos
   - Rank results
   ↓
4. Results Display
   - Show 15 most relevant videos
   - Highlight what they have
   - Show what they'd need
   - Link to full video
```

## 🛡️ Error Handling & Edge Cases

### No Input
- Shows validation message
- Prompts user to add items

### No Videos Found
- Friendly message: "We couldn't find DIY videos for those items..."
- Suggests adding common craft supplies
- Option to try different items

### Network Failure
- Captures error details
- Shows user-friendly message
- Retries with fallback methods
- Allows starting over

### Empty or Meaningless Input
- Filters out: pure numbers, single characters, potential HTML injection
- Validates: minimum 1 meaningful item required

### API Rate Limiting
- Automatic 200ms delays between requests
- Session-based caching (5 minutes)
- Fallback to alternative search methods

## 📊 Key Features

✅ **Live Video Fetching**
- No pre-saved dataset
- Real-time results from YouTube
- Fresh content for each search

✅ **Intelligent Matching**
- Fuzzy matching for material names
- Material aliases for variations
- Difficulty estimation

✅ **Responsive Design**
- Mobile-first approach
- Pinterest-inspired scrapbook layout
- Smooth animations & transitions

✅ **Session Caching**
- Prevents duplicate API calls
- Improves performance
- Respects privacy (no permanent storage)

✅ **Graceful Degradation**
- Multiple API fallbacks
- User-friendly error messages
- Continues working even with partial failures

## 🔧 Installation & Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Key Files

| File | Purpose |
|------|---------|
| `videoService.ts` | YouTube API integration, video fetching |
| `videoScoring.ts` | Scoring algorithm, material matching |
| `useVideoSearch.ts` | React hook for search logic |
| `VideoCard.tsx` | Individual result card component |
| `VideoResultsScreen.tsx` | Results grid & layout |
| `Index.tsx` | Main app orchestrator |

## 🚀 How to Test

1. **Basic Flow:**
   ```
   Items: "scissors, paper"
   Expected: Videos for paper crafts, simple paper projects
   ```

2. **Alias Matching:**
   ```
   Items: "glue, rope"
   Expected: Videos for "adhesive" or "twine" projects
   ```

3. **Mixed Relevance:**
   ```
   Items: "random stuff"
   Expected: Shows matches if any, friendly "no match" message
   ```

4. **Error Handling:**
   - Disconnect internet → Shows error + retry option
   - Empty input → Shows validation message
   - 50+ items → Limits to 20, processes normally

## 📱 Responsive Breakpoints

- **Mobile:** 1 column
- **Tablet:** 2 columns
- **Desktop:** 3 columns

## 🎯 Performance Optimizations

- Session-based caching (avoid redundant API calls)
- Lazy loading of images
- Staggered animations (avoid janky renders)
- Efficient fuzzy matching algorithm
- Limited to 15 results per search

## 🔒 Privacy & Data

- ✅ No user data stored permanently
- ✅ No tracking beyond local analytics
- ✅ Session-only caching
- ✅ Direct links to public YouTube videos
- ✅ Uses privacy-focused Invidious API when possible

## 🐛 Known Limitations

- YouTube API limitations may reduce available results in some regions
- Video quality depends on YouTube's current catalog
- Title/description parsing may miss some context-specific materials
- Duration estimates are approximate

## 🚀 Future Enhancements

- [ ] Support for multiple video sources (TikTok, Instagram Reels)
- [ ] User-created project templates
- [ ] Save favorite projects to collection
- [ ] Share project ideas with friends
- [ ] Difficulty filtering
- [ ] Video preview on hover
- [ ] Exact quantity matching (e.g., "5 bottles")
- [ ] Material substitution suggestions

## 📞 Support

If videos aren't loading:
1. Check internet connection
2. Try different search terms (add common supplies like "glue", "scissors")
3. Wait a few seconds and retry
4. Clear browser cache

---

**Built with:** React + TypeScript + Tailwind CSS + shadcn/ui + Vite
