import { ArrowLeft, Search, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './ProjectCard';
import { MatchResult, getResultsMessage } from '@/utils/matchingLogic';

interface ResultsScreenProps {
  items: string[];
  results: MatchResult[];
  onBack: () => void;
  onStartOver: () => void;
}

export function ResultsScreen({ items, results, onBack, onStartOver }: ResultsScreenProps) {
  const message = getResultsMessage(results, items.length);
  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 text-muted-foreground hover:text-foreground"
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
          <div className="flex flex-wrap gap-2 mb-4">
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
          <p className="text-lg text-muted-foreground font-medium">
            {message}
          </p>
        </div>

        {hasResults ? (
          /* Pinterest-style masonry grid */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {results.map((result, index) => (
              <div key={result.project.id} className="break-inside-avoid">
                <ProjectCard result={result} index={index} />
              </div>
            ))}
          </div>
        ) : (
          /* No results state */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
              <Frown className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-display text-foreground mb-3">
              No projects found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              We couldn't find DIY projects using only these items. 
              Try adding common craft supplies like scissors, glue, paper, or fabric!
            </p>
            <Button
              onClick={onStartOver}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Search className="w-4 h-4 mr-2" />
              Try Different Items
            </Button>
          </div>
        )}

        {/* Footer action */}
        {hasResults && (
          <div className="text-center mt-12 pb-8">
            <div className="inline-block relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-tape-sage/70 rounded-sm" />
              <Button
                onClick={onStartOver}
                variant="outline"
                className="border-2"
              >
                <Search className="w-4 h-4 mr-2" />
                Try Different Items
              </Button>
            </div>
          </div>
        )}

        {/* Decorative footer doodles */}
        <div className="mt-12 flex justify-center gap-6 opacity-30">
          <svg width="80" height="20" viewBox="0 0 80 20" className="text-doodle">
            <path d="M0,10 Q20,5 40,10 T80,10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <svg width="60" height="20" viewBox="0 0 60 20" className="text-primary">
            <path d="M0,10 Q15,2 30,10 T60,10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
