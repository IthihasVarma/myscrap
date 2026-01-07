import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ItemInput } from '@/components/ItemInput';
import { ResultsScreen } from '@/components/ResultsScreen';
import { findMatchingProjects, MatchResult } from '@/utils/matchingLogic';

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
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('input');
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = (userItems: string[]) => {
    setItems(userItems);
    const matchResults = findMatchingProjects(userItems);
    setResults(matchResults);
    trackSearch(userItems.length, matchResults.length);
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('results');
      setIsTransitioning(false);
    }, 300);
  };

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
      setResults([]);
      setIsTransitioning(false);
    }, 300);
  };

  const handleStartOver = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('input');
      setItems([]);
      setResults([]);
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
        <ResultsScreen 
          items={items} 
          results={results} 
          onBack={handleBackToInput}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default Index;
