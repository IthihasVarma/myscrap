import { ExternalLink, Clock, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoScoreResult, estimateDifficulty } from '@/services/videoScoring';

interface VideoCardProps {
  result: VideoScoreResult;
  index: number;
}

const difficultyColors = {
  Beginner: 'bg-secondary text-secondary-foreground',
  Intermediate: 'bg-tape text-foreground',
  Advanced: 'bg-accent text-accent-foreground',
};

const matchTypeColors = {
  exact: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  partial: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  suggested: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
};

const matchTypeLabels = {
  exact: '✓ Exact Match',
  partial: '◐ Partial Match',
  suggested: '? Similar Project',
};

export function VideoCard({ result, index }: VideoCardProps) {
  const { video, matchedItems, suggestedItems, matchPercentage, matchType, relevanceScore } = result;
  const difficulty = estimateDifficulty(video);

  // Rotation variations for scrapbook feel
  const rotations = ['rotate-slight-left', '', 'rotate-slight-right', ''];
  const rotation = rotations[index % rotations.length];

  // Washi tape color variations
  const tapeColors = ['bg-tape-pink/70', 'bg-tape-sage/70', 'bg-tape/70', 'bg-accent/50'];
  const tapeColor = tapeColors[index % tapeColors.length];

  return (
    <div className={`relative group opacity-0 animate-scale-bounce stagger-${(index % 6) + 1}`}>
      {/* Washi tape decoration */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${tapeColor} rounded-sm ${rotation} z-20`}
      />

      {/* Card shadow/depth */}
      <div className={`absolute inset-0 bg-kraft/20 rounded-xl translate-x-1 translate-y-1`} />

      {/* Main card */}
      <div
        className={`relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lifted transition-all duration-300 hover:-translate-y-1 paper-texture ${rotation}`}
      >
        {/* Match badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className={`${matchTypeColors[matchType]} font-semibold px-3 py-1 shadow-soft`}>
            {matchTypeLabels[matchType]}
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

          {/* Match percentage indicator */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium">
              <div className="w-10 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>
              <span className="text-muted-foreground ml-1">{matchPercentage}%</span>
            </div>
          </div>

          {/* Fallback placeholder */}
          <div className="absolute inset-0 hidden group-[.img-error]:flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-4xl opacity-50">🎬</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-lg font-display text-foreground leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors">
            {video.title}
          </h3>

          {/* Description preview */}
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {video.description || 'DIY craft video tutorial'}
          </p>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={`${difficultyColors[difficulty]} text-xs font-medium`}>
              {difficulty}
            </Badge>
            {video.duration && (
              <Badge variant="outline" className="text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.duration}
              </Badge>
            )}
          </div>

          {/* Matched materials */}
          {matchedItems.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-secondary-foreground mb-1">
                ✓ You have:
              </p>
              <div className="flex flex-wrap gap-1">
                {matchedItems.map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-secondary/30 text-secondary-foreground text-xs rounded font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested materials */}
          {suggestedItems.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                + You could get:
              </p>
              <div className="flex flex-wrap gap-1">
                {suggestedItems.slice(0, 3).map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded"
                  >
                    {item}
                  </span>
                ))}
                {suggestedItems.length > 3 && (
                  <span className="px-2 py-1 text-xs text-muted-foreground">
                    +{suggestedItems.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Source info */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {video.source === 'youtube' && '▶ YouTube'}
              {video.source === 'dailymotion' && '● Dailymotion'}
              {video.source === 'vimeo' && '▶ Vimeo'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 h-8 px-2"
              asChild
            >
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                Watch
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
