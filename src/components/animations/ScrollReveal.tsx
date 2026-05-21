'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { fadeVariants, slideVariants, reducedMotionTransition } from './variants';

type RevealVariant = 'fade' | 'slide-up' | 'slide-left' | 'slide-right';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  duration?: number;
  distance?: number;
  threshold?: number;
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = 'fade',
  duration = 0.5,
  distance = 24,
  threshold = 0.2,
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const prefersReducedMotion = useReducedMotion();

  const getVariants = () => {
    if (prefersReducedMotion) return fadeVariants;
    switch (variant) {
      case 'slide-up':
        return slideVariants('up', distance);
      case 'slide-left':
        return slideVariants('left', distance);
      case 'slide-right':
        return slideVariants('right', distance);
      default:
        return fadeVariants;
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={getVariants()}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={prefersReducedMotion ? reducedMotionTransition : { duration, delay }}
    >
      {children}
    </motion.div>
  );
}
