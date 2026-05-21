'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { fadeVariants, reducedMotionTransition } from './variants';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, duration = 0.5, delay = 0, className }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      transition={prefersReducedMotion ? reducedMotionTransition : { duration, delay }}
    >
      {children}
    </motion.div>
  );
}
