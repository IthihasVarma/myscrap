import { Sparkles, Heart, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Floating neon circles - 2016 LA vibes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-16 w-24 h-24 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-accent/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo/Title with pop sticker effect */}
        <div className="relative inline-block mb-8">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 transform -rotate-12">
            <div className="bg-accent text-doodle px-6 py-2 rounded-full font-bold text-sm border-3 border-doodle-stroke">
              ✨ HOT & FRESH ✨
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display text-foreground tracking-wider neon-glow drop-shadow-2xl">
            CRAFTIFY
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary via-secondary to-accent blur-sm opacity-70" />
        </div>
        
        {/* Memphis-style tagline box */}
        <div className="mt-12 p-6 bg-gradient-to-br from-pastel-yellow via-pastel-purple to-pastel-mint border-4 border-doodle-stroke rounded-3xl transform rotate-1 shadow-lg mb-8">
          <p className="text-lg md:text-2xl font-display text-doodle-stroke font-bold">
            Turn Your Trash Into TREASURE 🎨
          </p>
          <p className="text-sm md:text-base text-doodle-stroke mt-2 font-body">
            Find epic DIY ideas from what you've got lying around!
          </p>
        </div>
        
        {/* Feature badges - pop stickers */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <div className="pop-sticker">🔄 Zero Waste</div>
          <div className="pop-sticker pop-sticker-cyan">💡 Fresh Ideas</div>
          <div className="pop-sticker pop-sticker-lime">❤️ Creative Vibes</div>
        </div>
        
        {/* CTA Button - Extra pop */}
        <Button 
          onClick={onStart}
          size="lg"
          className="text-xl px-12 py-8 h-auto bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary hover:to-secondary text-background font-black shadow-lifted hover:shadow-soft transition-all duration-300 hover:-translate-y-2 rounded-full border-4 border-doodle-stroke transform hover:scale-110"
        >
          🎉 START CREATING NOW 🎉
        </Button>
        
        {/* Doodle decorations */}
        <div className="mt-16 space-y-4">
          <div className="flex justify-center gap-2">
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>✨</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎨</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>✂️</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎉</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
          </div>
          
          {/* Sketchy doodle lines */}
          <div className="flex justify-center gap-8 opacity-60 mt-8">
            <svg width="60" height="30" viewBox="0 0 60 30" className="text-primary">
              <path d="M0,15 Q15,5 30,15 T60,15 M2,12 L58,18" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <svg width="60" height="30" viewBox="0 0 60 30" className="text-secondary">
              <path d="M0,15 Q15,25 30,15 T60,15 M2,18 L58,12" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
