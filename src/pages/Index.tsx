import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ItemInput } from '@/components/ItemInput';
import { VideoResultsScreen } from '@/components/VideoResultsScreen';
import { useVideoSearch } from '@/hooks/useVideoSearch';
import { isValidUserInput } from '@/utils/matchingLogic';

type AppScreen = 'welcome' | 'input' | 'results';

// Simple anonymous analytics - just counts in localStorage
function trackSearch(itemCount: number, resultCount: number) {
  try {
    const analytics = JSON.parse(localStorage.getItem('craftify_analytics') || '{}');
    analytics.totalSearches = (analytics.totalSearches || 0) + 1;
    analytics.totalItems = (analytics.totalItems || 0) + itemCount;
    analytics.lastSearch = new Date().toISOString();
    localStorage.setItem('craftify_analytics', JSON.stringify(analytics));
  } catch {
    // Silently fail if localStorage unavailable
  }
}

const Index = () => {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [items, setItems] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoSearch = useVideoSearch();

  const handleStart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('input');
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = async (userItems: string[]) => {
    // Validate input
    if (!isValidUserInput(userItems)) {
      alert('Please enter at least one meaningful item');
      return;
    }

    setItems(userItems);
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('results');
      setIsTransitioning(false);
    }, 300);
  };

  // Trigger video search when we navigate to results screen
  useEffect(() => {
    if (screen === 'results' && items.length > 0 && !videoSearch.hasSearched) {
      videoSearch.search(items);
      trackSearch(items.length, 0); // Track will update when results come in
    }
  }, [screen, items, videoSearch]);

  const handleBackToInput = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('input');
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToWelcome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('welcome');
      setItems([]);
      videoSearch.reset();
      setIsTransitioning(false);
    }, 300);
  };

  const handleStartOver = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('input');
      setItems([]);
      videoSearch.reset();
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {screen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      {screen === 'input' && (
        <ItemInput onBack={handleBackToWelcome} onSubmit={handleSubmit} />
      )}
      {screen === 'results' && (
        <VideoResultsScreen
          items={items}
          videos={videoSearch.videos}
          results={videoSearch.results}
          isLoading={videoSearch.isLoading}
          error={videoSearch.error}
          onBack={handleBackToInput}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default Index;
