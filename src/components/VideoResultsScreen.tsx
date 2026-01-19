import { ArrowLeft, Frown, AlertCircle, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoCard } from './VideoCard';
import { VideoScoreResult, getVideoResultsMessage } from '@/services/videoScoring';
import { Video } from '@/services/videoService';

interface VideoResultsScreenProps {
  items: string[];
  videos: Video[];
  results: VideoScoreResult[];
  isLoading: boolean;
  error?: string;
  onBack: () => void;
  onStartOver: () => void;
}

export function VideoResultsScreen({
  items,
  videos,
  results,
  isLoading,
  error,
  onBack,
  onStartOver,
}: VideoResultsScreenProps) {
  const message = getVideoResultsMessage(results, items.length);
  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 text-muted-foreground hover:text-foreground"
        disabled={isLoading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Edit items
      </Button>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute -top-3 left-2 w-14 h-4 bg-tape-pink/70 rounded-sm rotate-[-1deg]" />
            <h2 className="text-4xl md:text-5xl font-display text-foreground">
              Your DIY Ideas
            </h2>
          </div>

          {/* User's items */}
          <div className="flex flex-wrap gap-2 mb-6">
            {items.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary/50 text-secondary-foreground text-sm rounded-full font-medium"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Results message */}
          <div className="mb-6 p-4 bg-tape-pink/20 border border-tape-pink/40 rounded-lg">
            <p className="text-foreground font-medium">{message}</p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-lg">Finding creative DIY ideas...</p>
            <p className="text-muted-foreground text-sm mt-2">This may take a few seconds</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 max-w-md text-center">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Oops!</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={onStartOver} variant="outline" size="sm">
                Try different items
              </Button>
            </div>
          </div>
        )}

        {/* No results state */}
        {!isLoading && !error && !hasResults && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-muted/50 border border-border rounded-lg p-8 max-w-md text-center">
              <Frown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">
                No exact matches found
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Try adding common craft supplies like scissors, glue, paper, or tape. They work with almost any project!
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={onBack} variant="outline" size="sm">
                  Add more items
                </Button>
                <Button onClick={onStartOver} size="sm">
                  Start over
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results grid */}
        {!isLoading && !error && hasResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {results.map((result, index) => (
                <VideoCard key={result.video.id} result={result} index={index} />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-border">
              <Button onClick={onStartOver} variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search again
              </Button>
              <Button onClick={onBack} variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Edit items
              </Button>
            </div>
          </>
        )}

        {/* Video count */}
        {!isLoading && !error && videos.length > 0 && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Showing {results.length} of {videos.length} results</p>
          </div>
        )}
      </div>
    </div>
  );
}
