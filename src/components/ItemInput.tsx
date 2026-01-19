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
    <div className={`min-h-screen px-4 py-8 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'} relative overflow-hidden`}>
      {/* Floating neon circles */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-10 w-28 h-28 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="relative z-20 mb-8 text-foreground hover:text-primary border-2 border-transparent hover:border-primary/50 rounded-full px-4 py-2 hover:bg-primary/10 transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header with sketchy doodle effect */}
        <div className="relative inline-block mb-6">
          <div className="absolute -top-6 left-0 transform -rotate-12">
            <div className="bg-accent text-doodle-stroke px-4 py-1 rounded-full font-bold text-xs border-2 border-doodle-stroke">
              ✂️ GRAB YOUR ITEMS ✂️
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-display text-foreground neon-glow">
            What do you have?
          </h2>
          <div className="sketchy-border w-full mt-2 border-primary rounded-xl" />
        </div>

        <p className="text-foreground mb-8 text-lg font-body mt-6">
          List the items you have at home. Separate them with commas or put each on a new line.
        </p>

        {/* Input area with sketchy border */}
        <div className="relative mb-6">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="scissors, glue, old magazines, cardboard..."
            className="sketchy-border min-h-[200px] text-lg bg-background/95 border-4 border-primary rounded-2xl p-6 placeholder:text-foreground/40 focus:border-secondary focus:ring-secondary/30 resize-none font-marker text-lg placeholder:font-body"
          />
        </div>

        {/* Item count indicator - pop sticker style */}
        {itemCount > 0 && (
          <p className="text-sm text-foreground mb-6 flex items-center gap-3 font-bold">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full text-xs font-black text-background border-2 border-doodle-stroke transform -rotate-12 shadow-lg">
              {itemCount}
            </span>
            <span className="text-base">item{itemCount !== 1 ? 's' : ''} ready to craft! 🎉</span>
          </p>
        )}

        {/* Example suggestions - pop stickers */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-foreground mb-4 font-bold">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span>Try an example:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {exampleItems.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="pop-sticker text-sm px-4 py-2 transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Submit button - extra pop */}
        <Button
          onClick={handleSubmit}
          disabled={itemCount === 0}
          size="lg"
          className="w-full md:w-auto text-lg px-10 py-6 h-auto bg-gradient-to-r from-primary via-accent to-secondary hover:from-secondary hover:to-primary text-background font-black shadow-lifted hover:shadow-lg transition-all duration-300 hover:-translate-y-2 rounded-full disabled:opacity-50 disabled:hover:translate-y-0 border-4 border-doodle-stroke transform hover:scale-110"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Find DIY Projects
        </Button>

        {/* Doodle decorations */}
        <div className="mt-16 flex items-center justify-center gap-6 opacity-60">
          <span className="text-3xl animate-bounce">✨</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>✂️</span>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎨</span>
        </div>
      </div>
    </div>
  );
}
