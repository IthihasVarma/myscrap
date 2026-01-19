import { ExternalLink, Clock, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoScoreResult, estimateDifficulty } from '@/services/videoScoring';

interface VideoCardProps {
  result: VideoScoreResult;
  index: number;
}

const difficultyColors = {
  Beginner: 'bg-gradient-to-r from-pastel-mint to-secondary text-background font-black',
  Intermediate: 'bg-gradient-to-r from-pastel-yellow to-primary text-background font-black',
  Advanced: 'bg-gradient-to-r from-accent to-neon-lime text-background font-black',
};

const matchTypeColors = {
  exact: 'bg-gradient-to-r from-primary to-secondary text-background font-black border-2 border-doodle-stroke',
  partial: 'bg-gradient-to-r from-pastel-yellow to-sunset text-background font-black border-2 border-doodle-stroke',
  suggested: 'bg-gradient-to-r from-pastel-purple to-pastel-mint text-background font-black border-2 border-doodle-stroke',
};

const matchTypeLabels = {
  exact: '✓ Exact Match',
  partial: '◐ Partial Match',
  suggested: '? Similar Project',
};

export function VideoCard({ result, index }: VideoCardProps) {
  const { video, matchedItems, suggestedItems, matchPercentage, matchType, relevanceScore } = result;
  const difficulty = estimateDifficulty(video);

  // Rotation variations for pop art feel
  const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
  const rotation = rotations[index % rotations.length];

  // Neon sticker color variations
  const stickerColors = [
    'bg-gradient-to-br from-primary to-secondary',
    'bg-gradient-to-br from-accent to-neon-lime',
    'bg-gradient-to-br from-pastel-yellow to-sunset',
    'bg-gradient-to-br from-pastel-purple to-pastel-mint',
  ];
  const stickerBg = stickerColors[index % stickerColors.length];

  return (
    <div className={`relative group opacity-0 animate-scale-bounce stagger-${(index % 6) + 1}`}>
      {/* Pop sticker decoration - rotated label */}
      <div
        className={`absolute -top-5 -right-4 z-20 ${stickerBg} text-background px-4 py-2 rounded-full font-black text-xs transform ${rotation} shadow-lg border-3 border-doodle-stroke`}
      >
        {matchType === 'exact' && '⭐ PERFECT'}
        {matchType === 'partial' && '💫 CLOSE'}
        {matchType === 'suggested' && '✨ TRY IT'}
      </div>

      {/* Main card with sketchy border */}
      <div
        className={`sketchy-border relative bg-gradient-to-br from-background to-background/90 rounded-2xl overflow-hidden shadow-lifted hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-4 border-foreground ${rotation} transform`}
      >
        {/* Match badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className={`${matchTypeColors[matchType]} px-4 py-2 rounded-full text-sm`}>
            {matchPercentage}% Match
          </Badge>
        </div>

        {/* Thumbnail */}
        <div className="relative h-48 bg-muted overflow-hidden group">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />

          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          </div>

          {/* Match percentage indicator - neon glow */}
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary to-secondary text-background rounded-full text-xs font-black border-2 border-doodle-stroke shadow-lg">
              <div className="w-12 h-3 bg-background rounded-full overflow-hidden border-2 border-background">
                <div
                  className="h-full bg-gradient-to-r from-accent to-neon-lime rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>
              <span className="text-white">{matchPercentage}%</span>
            </div>
          </div>

          {/* Fallback placeholder */}
          <div className="absolute inset-0 hidden group-[.img-error]:flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-4xl opacity-50">🎬</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-display text-foreground leading-tight mb-3 line-clamp-2 hover:neon-glow transition-all">
            {video.title}
          </h3>

          {/* Description preview */}
          <p className="text-sm text-foreground/70 mb-4 line-clamp-2 font-body">
            {video.description || 'DIY craft video tutorial'}
          </p>

          {/* Badges row - pop stickers */}
          <div className="flex flex-wrap gap-3 mb-5">
            <Badge className={`${difficultyColors[difficulty]} px-3 py-1 rounded-full text-sm`}>
              {difficulty}
            </Badge>
            {video.duration && (
              <Badge className="bg-gradient-to-r from-pastel-purple to-pastel-coral text-background font-black px-3 py-1 rounded-full text-sm border-2 border-doodle-stroke">
                <Clock className="w-3 h-3 mr-1" />
                {video.duration}
              </Badge>
            )}
          </div>

          {/* Matched materials - green neon */}
          {matchedItems.length > 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-pastel-mint/30 to-secondary/20 border-2 border-doodle-stroke rounded-lg">
              <p className="text-xs font-black text-foreground mb-2">
                ✅ YOU HAVE:
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedItems.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-pastel-mint text-doodle-stroke text-xs font-bold rounded-full border border-doodle-stroke"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested materials - pastel colors */}
          {suggestedItems.length > 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-pastel-yellow/20 to-pastel-coral/20 border-2 border-doodle-stroke rounded-lg">
              <p className="text-xs font-black text-foreground mb-2">
                💡 ADD THESE:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedItems.slice(0, 3).map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-pastel-coral text-doodle-stroke text-xs font-bold rounded-full border border-doodle-stroke"
                  >
                    {item}
                  </span>
                ))}
                {suggestedItems.length > 3 && (
                  <span className="px-3 py-1 text-xs text-foreground font-black">
                    +{suggestedItems.length - 3} more ✨
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Source info & CTA */}
          <div className="flex items-center justify-between pt-4 border-t-3 border-doodle-stroke">
            <span className="text-xs font-bold text-foreground">
              {video.source === 'youtube' && '▶ YOUTUBE'}
              {video.source === 'dailymotion' && '● DAILYMOTION'}
              {video.source === 'vimeo' && '▶ VIMEO'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary text-background hover:text-background hover:shadow-lg font-black px-4 py-2 rounded-full border-2 border-doodle-stroke h-auto transform hover:scale-110 transition-all"
              asChild
            >
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                Watch
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
