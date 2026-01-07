import { Sparkles, Heart, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-tape-pink/40 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-20 right-16 w-20 h-20 bg-secondary/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-10 w-12 h-12 bg-tape/40 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo/Title area with washi tape effect */}
        <div className="relative inline-block mb-8">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-tape-pink/70 rounded-sm rotate-[-2deg]" />
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display text-foreground tracking-wide">
            Craftify
          </h1>
        </div>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl font-body text-muted-foreground mb-4 font-medium">
          Turn what you have into something{' '}
          <span className="highlight-marker font-semibold text-foreground">beautiful</span>
        </p>
        
        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
          List items you already own, and we'll suggest creative DIY projects 
          just for you. Less waste, more making.
        </p>
        
        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-2 bg-secondary/50 rounded-full">
              <Recycle className="w-4 h-4 text-secondary-foreground" />
            </div>
            <span>Reduce waste</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-2 bg-tape-pink/30 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span>Get inspired</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-2 bg-accent/30 rounded-full">
              <Heart className="w-4 h-4 text-accent-foreground" />
            </div>
            <span>Make with love</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button 
          onClick={onStart}
          size="lg"
          className="text-lg px-10 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lifted hover:shadow-soft transition-all duration-300 hover:-translate-y-1 rounded-full"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Creating
        </Button>
        
        {/* Decorative doodle lines */}
        <div className="mt-16 flex justify-center gap-8 opacity-30">
          <svg width="60" height="20" viewBox="0 0 60 20" className="text-doodle">
            <path d="M0,10 Q15,5 30,10 T60,10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <svg width="40" height="20" viewBox="0 0 40 20" className="text-primary">
            <path d="M0,10 Q10,2 20,10 T40,10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <svg width="50" height="20" viewBox="0 0 50 20" className="text-secondary-foreground">
            <path d="M0,10 Q12,15 25,10 T50,10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
