import { useState } from 'react';
import { ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { parseUserItems } from '@/utils/matchingLogic';

interface ItemInputProps {
  onBack: () => void;
  onSubmit: (items: string[]) => void;
}

const exampleItems = [
  'mason jar, fairy lights, twine',
  'old t-shirt, scissors',
  'cardboard box, glue, paper',
  'tin can, hammer, nail, spray paint',
];

export function ItemInput({ onBack, onSubmit }: ItemInputProps) {
  const [input, setInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = () => {
    const items = parseUserItems(input);
    if (items.length > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        onSubmit(items);
      }, 300);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  const itemCount = parseUserItems(input).length;

  return (
    <div className={`min-h-screen px-4 py-8 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-8 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto">
        {/* Header with washi tape effect */}
        <div className="relative inline-block mb-6">
          <div className="absolute -top-3 left-4 w-16 h-4 bg-tape-sage/70 rounded-sm rotate-[1deg]" />
          <h2 className="text-4xl md:text-5xl font-display text-foreground">
            What do you have?
          </h2>
        </div>

        <p className="text-muted-foreground mb-8 text-lg">
          List the items you have at home. Separate them with commas or put each on a new line.
        </p>

        {/* Input area styled like a notebook */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-paper rounded-xl shadow-card rotate-slight-right" />
          <div className="absolute -inset-2 bg-card rounded-xl shadow-soft" />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="scissors, glue, old magazines, cardboard..."
            className="relative z-10 min-h-[200px] text-lg bg-transparent border-2 border-kraft/30 rounded-xl p-6 placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-primary/20 resize-none font-body"
          />
        </div>

        {/* Item count indicator */}
        {itemCount > 0 && (
          <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-secondary/50 rounded-full text-xs font-semibold">
              {itemCount}
            </span>
            item{itemCount !== 1 ? 's' : ''} added
          </p>
        )}

        {/* Example suggestions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Try an example:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleItems.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-2 text-sm bg-muted/50 hover:bg-muted text-muted-foreground rounded-full transition-colors border border-border/50 hover:border-border"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          disabled={itemCount === 0}
          size="lg"
          className="w-full md:w-auto text-lg px-10 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lifted hover:shadow-soft transition-all duration-300 hover:-translate-y-1 rounded-full disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Find DIY Projects
        </Button>

        {/* Decorative elements */}
        <div className="mt-16 flex items-center justify-center gap-4 opacity-40">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <div className="w-2 h-2 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
