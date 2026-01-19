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
    <div className="min-h-screen px-4 py-8 relative overflow-hidden">
      {/* Floating neon circles */}
      <div className="absolute top-32 right-20 w-40 h-40 bg-primary/12 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 left-10 w-36 h-36 bg-secondary/12 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="relative z-10 mb-6 text-foreground hover:text-primary border-2 border-transparent hover:border-primary/50 rounded-full px-4 py-2 hover:bg-primary/10 transition-all font-bold"
        disabled={isLoading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Edit items
      </Button>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="relative inline-block mb-6">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-foreground neon-glow">
              Your DIY Ideas
            </h2>
            <div className="sketchy-border w-full mt-2 border-accent rounded-2xl" />
          </div>

          {/* User's items - pop stickers */}
          <div className="flex flex-wrap gap-3 mb-8">
            {items.map((item, index) => (
              <div
                key={index}
                className={`pop-sticker text-sm px-4 py-2 ${index % 2 === 0 ? '' : 'pop-sticker-cyan'}`}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Results message - Memphis box */}
          <div className="memphis-box p-5 bg-gradient-to-br from-pastel-yellow via-pastel-purple to-pastel-mint border-4 border-doodle-stroke rounded-3xl">
            <p className="text-foreground font-black text-lg">{message}</p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 text-primary animate-spin neon-glow" />
              <div className="absolute inset-0 animate-pulse">
                <div className="w-16 h-16 bg-primary/20 rounded-full blur-xl" />
              </div>
            </div>
            <p className="text-foreground text-xl font-display font-bold">Finding creative DIY ideas...</p>
            <p className="text-foreground/70 text-base mt-3 font-body">This may take a few seconds</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="sketchy-border p-8 bg-gradient-to-br from-pastel-coral/20 to-sunset/20 border-4 border-primary rounded-3xl max-w-md text-center">
              <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4 neon-glow" />
              <h3 className="font-display font-black text-xl text-foreground mb-3">Oops! 😅</h3>
              <p className="text-base text-foreground/80 mb-6 font-body">{error}</p>
              <Button onClick={onStartOver} className="bg-primary hover:bg-secondary text-background font-black px-6 py-3 rounded-full border-2 border-doodle-stroke">
                Try different items
              </Button>
            </div>
          </div>
        )}

        {/* No results state */}
        {!isLoading && !error && !hasResults && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="sketchy-border p-8 bg-gradient-to-br from-pastel-purple/20 to-pastel-mint/20 border-4 border-secondary rounded-3xl max-w-md text-center transform -rotate-1">
              <Frown className="w-16 h-16 text-secondary mx-auto mb-4 opacity-70" />
              <h3 className="font-display font-black text-2xl text-foreground mb-3">
                Hmm, no matches yet! 🤔
              </h3>
              <p className="text-base text-foreground/80 mb-8 font-body">
                Try adding common craft supplies like scissors, glue, paper, or tape. They work with almost any project!
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={onBack} className="pop-sticker text-sm px-5 py-2">
                  Add more items
                </Button>
                <Button onClick={onStartOver} className="pop-sticker pop-sticker-cyan text-sm px-5 py-2">
                  Start over
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results grid */}
        {!isLoading && !error && hasResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {results.map((result, index) => (
                <VideoCard key={result.video.id} result={result} index={index} />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-8 border-t-4 border-doodle-stroke">
              <Button onClick={onStartOver} className="bg-gradient-to-r from-accent to-neon-lime text-background font-black px-6 py-3 rounded-full border-2 border-doodle-stroke hover:shadow-lg">
                <Search className="w-5 h-5 mr-2" />
                Search again
              </Button>
              <Button onClick={onBack} className="bg-gradient-to-r from-pastel-purple to-pastel-coral text-background font-black px-6 py-3 rounded-full border-2 border-doodle-stroke hover:shadow-lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Edit items
              </Button>
            </div>
          </>
        )}

        {/* Video count */}
        {!isLoading && !error && videos.length > 0 && (
          <div className="text-center mt-10 text-base text-foreground font-bold">
            <p>🎥 Found <span className="text-primary font-black text-lg">{results.length}</span> of <span className="text-secondary font-black text-lg">{videos.length}</span> video ideas</p>
          </div>
        )}
      </div>
    </div>
  );
}
