'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface CounterOptions {
  target: number;
  duration?: number;         // default: 2000 (ms)
  isPercentage?: boolean;    // default: false
  startOnView?: boolean;     // default: true
}

interface CounterResult {
  ref: React.RefObject<HTMLElement>;
  displayValue: string;
  isComplete: boolean;
}

/** Ease-out cubic: 1 - (1 - t)^3 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Format an integer value with comma separators */
function formatInteger(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/** Format a percentage value with one decimal place */
function formatPercentage(value: number): string {
  return value.toFixed(1) + '%';
}

/** Format counter value based on type */
export function formatCounterValue(value: number, isPercentage: boolean): string {
  if (isPercentage) {
    return formatPercentage(value);
  }
  return formatInteger(value);
}

export function useCounterAnimation(options: CounterOptions): CounterResult {
  const { target, duration = 2000, isPercentage = false, startOnView = true } = options;
  const ref = useRef<HTMLElement>(null!);
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const hasTriggered = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Handle edge cases: NaN or negative targets
  const isInvalidTarget = isNaN(target) || target < 0;

  const finalFormattedValue = isInvalidTarget
    ? '0'
    : formatCounterValue(target, isPercentage);

  const animate = useCallback(() => {
    if (isInvalidTarget) {
      setDisplayValue('0');
      setIsComplete(true);
      return;
    }

    if (prefersReducedMotion) {
      setDisplayValue(finalFormattedValue);
      setIsComplete(true);
      return;
    }

    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutCubic(t);
      const currentValue = easedT * target;

      setDisplayValue(formatCounterValue(currentValue, isPercentage));

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(finalFormattedValue);
        setIsComplete(true);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [target, duration, isPercentage, prefersReducedMotion, isInvalidTarget, finalFormattedValue]);

  useEffect(() => {
    // Immediately handle invalid targets
    if (isInvalidTarget) {
      setDisplayValue('0');
      setIsComplete(true);
      return;
    }

    // If reduced motion, show final value immediately
    if (prefersReducedMotion) {
      setDisplayValue(finalFormattedValue);
      setIsComplete(true);
      return;
    }

    // If startOnView is false, start animation immediately
    if (!startOnView) {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        animate();
      }
      return;
    }

    // Set up IntersectionObserver to trigger at 20% visibility
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasTriggered.current) {
            hasTriggered.current = true;
            observer.disconnect();
            animate();
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startOnView, animate, isInvalidTarget, prefersReducedMotion, finalFormattedValue]);

  return {
    ref,
    displayValue,
    isComplete,
  };
}
