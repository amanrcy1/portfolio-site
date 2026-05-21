'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { slideVariants, fadeVariants } from './variants';

type SlideDirection = 'up' | 'down' | 'left' | 'right';

interface SlideInProps {
  children: React.ReactNode;
  direction?: SlideDirection;
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = 'up',
  distance = 24,
  duration = 0.5,
  delay = 0,
  className,
}: SlideInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <motion.div
        className={className}
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  const variants = slideVariants(direction, distance);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
