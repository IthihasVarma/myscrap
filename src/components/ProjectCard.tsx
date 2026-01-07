import { Clock, ExternalLink, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MatchResult } from '@/utils/matchingLogic';

interface ProjectCardProps {
  result: MatchResult;
  index: number;
  generatedImage?: string;
}

const difficultyColors = {
  Beginner: 'bg-secondary text-secondary-foreground',
  Intermediate: 'bg-tape text-foreground',
  Advanced: 'bg-accent text-accent-foreground',
};

export function ProjectCard({ result, index, generatedImage }: ProjectCardProps) {
  const { project, matchedMaterials, suggestedMaterials, matchScore } = result;
  const isPerfectMatch = matchScore === 1;

  // Rotation variations for scrapbook feel
  const rotations = ['rotate-slight-left', '', 'rotate-slight-right', ''];
  const rotation = rotations[index % rotations.length];

  // Washi tape color variations
  const tapeColors = ['bg-tape-pink/70', 'bg-tape-sage/70', 'bg-tape/70', 'bg-accent/50'];
  const tapeColor = tapeColors[index % tapeColors.length];

  return (
    <div
      className={`relative group opacity-0 animate-scale-bounce stagger-${(index % 6) + 1}`}
    >
      {/* Washi tape decoration */}
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${tapeColor} rounded-sm ${rotation} z-20`} />
      
      {/* Card shadow/depth */}
      <div className={`absolute inset-0 bg-kraft/20 rounded-xl translate-x-1 translate-y-1`} />
      
      {/* Main card */}
      <div className={`relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-lifted transition-all duration-300 hover:-translate-y-1 paper-texture ${rotation}`}>
        {/* Perfect match banner */}
        {isPerfectMatch && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-secondary text-secondary-foreground font-semibold px-3 py-1 shadow-soft">
              ✨ Ready to make!
            </Badge>
          </div>
        )}

        {/* Project image */}
        <div className="relative h-48 bg-muted overflow-hidden">
          {generatedImage ? (
            <img 
              src={generatedImage} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-6xl opacity-50">🎨</span>
            </div>
          )}
          
          {/* Match percentage indicator */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium">
              <div 
                className="w-10 h-2 bg-muted rounded-full overflow-hidden"
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${matchScore * 100}%` }}
                />
              </div>
              <span className="text-muted-foreground ml-1">{Math.round(matchScore * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title & difficulty */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-display text-foreground leading-tight">
              {project.title}
            </h3>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={`${difficultyColors[project.difficulty]} text-xs font-medium`}>
              {project.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {project.timeEstimate}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Materials */}
          <div className="space-y-2 mb-4">
            {/* Matched materials */}
            {matchedMaterials.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {matchedMaterials.map((material, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/50 text-secondary-foreground text-xs rounded-full"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {material}
                  </span>
                ))}
              </div>
            )}

            {/* Suggested/needed materials */}
            {suggestedMaterials.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {suggestedMaterials.map((material, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    {material}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tutorial link */}
          <Button
            asChild
            variant="outline"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
          >
            <a href={project.tutorialUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Watch Tutorial
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
