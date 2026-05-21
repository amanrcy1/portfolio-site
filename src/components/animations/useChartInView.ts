'use client';

import { useRef, useState, useEffect } from 'react';

interface ChartInViewResult {
  ref: React.RefObject<HTMLDivElement>;
  shouldAnimate: boolean;
}

export function useChartInView(): ChartInViewResult {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, shouldAnimate };
}
