import { Variants, Transition } from 'framer-motion';

/** Standard fade-in variant */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Slide-up variant with configurable distance */
export function slideUpVariants(distance: number = 24): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  };
}

/** Slide direction variants */
export function slideVariants(direction: 'up' | 'down' | 'left' | 'right', distance: number = 24): Variants {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const sign = direction === 'down' || direction === 'right' ? -1 : 1;
  return {
    hidden: { opacity: 0, [axis]: distance * sign },
    visible: { opacity: 1, [axis]: 0 },
  };
}

/** Stagger container variant */
export function staggerContainerVariants(staggerDelay: number = 0.1): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay },
    },
  };
}

/** Page transition variants */
export const pageExitVariants: Variants = {
  initial: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const pageEnterVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/** Card hover variants */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    borderColor: 'rgba(30, 41, 59, 1)',
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    borderColor: 'rgba(37, 99, 235, 1)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

/** Reduced motion fallback transitions */
export const reducedMotionTransition: Transition = {
  duration: 0.15,
};

/** Standard spring for interactive elements */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
};
