'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cardHoverVariants } from './variants';
import { useReducedMotion } from './useReducedMotion';

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MotionCard({ children, className }: MotionCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate={isFocusWithin ? 'hover' : 'rest'}
      onFocus={() => setIsFocusWithin(true)}
      onBlur={() => setIsFocusWithin(false)}
    >
      {children}
    </motion.div>
  );
}
