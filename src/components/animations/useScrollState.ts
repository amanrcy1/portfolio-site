'use client';

import { useState, useEffect } from 'react';

interface ScrollState {
  isPastThreshold: boolean;
}

export function useScrollState(threshold: number = 100): ScrollState {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > threshold);
    };

    handleScroll(); // Check initial position
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isPastThreshold };
}
