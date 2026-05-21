'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

interface LoadingSkeletonProps {
  width?: string | number;   // default: '100%'
  height?: string | number;  // default: '1rem'
  rounded?: string;          // default: 'rounded-md'
  className?: string;
}

export function LoadingSkeleton({ width = '100%', height = '1rem', rounded = 'rounded-md', className = '' }: LoadingSkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`${rounded} ${className} ${prefersReducedMotion ? '' : 'animate-shimmer'}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        background: prefersReducedMotion
          ? 'rgb(30, 41, 59)'
          : 'linear-gradient(90deg, rgb(30, 41, 59) 25%, rgb(51, 65, 85) 50%, rgb(30, 41, 59) 75%)',
        backgroundSize: '200% 100%',
      }}
      aria-hidden="true"
    />
  );
}

interface SkeletonGroupProps {
  isLoading: boolean;
  minDisplayTime?: number;   // default: 400 (ms)
  children: React.ReactNode;
  skeleton: React.ReactNode;
  onTimeout?: () => void;    // called after 10s if still loading
}

export function SkeletonGroup({ isLoading, minDisplayTime = 400, children, skeleton, onTimeout }: SkeletonGroupProps) {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const mountTimeRef = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - mountTimeRef.current;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, remaining);

      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(true);
      mountTimeRef.current = Date.now();
    }
  }, [isLoading, minDisplayTime]);

  useEffect(() => {
    if (isLoading && onTimeout) {
      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, 10000);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [isLoading, onTimeout]);

  return (
    <AnimatePresence mode="wait">
      {showSkeleton ? (
        <motion.div key="skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          {skeleton}
        </motion.div>
      ) : (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
