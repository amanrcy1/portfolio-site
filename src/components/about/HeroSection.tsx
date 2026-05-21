'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReducedMotion, StaggerContainer } from '@/components/animations';
import { fadeVariants } from '@/components/animations/variants';

/**
 * TypingEffect - reveals text character by character.
 * In reduced motion mode, shows the full text immediately.
 */
function TypingEffect({ text, charRate = 50 }: { text: string; charRate?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const clampedText = text.slice(0, 100);
  const [displayedCount, setDisplayedCount] = useState(prefersReducedMotion ? clampedText.length : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedCount(clampedText.length);
      return;
    }

    if (displayedCount >= clampedText.length) return;

    const interval = setInterval(() => {
      setDisplayedCount((prev) => {
        if (prev >= clampedText.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, charRate);

    return () => clearInterval(interval);
  }, [clampedText, charRate, prefersReducedMotion, displayedCount]);

  return (
    <span aria-label={clampedText}>
      <span aria-hidden="true">{clampedText.slice(0, displayedCount)}</span>
      <span className="sr-only">{clampedText}</span>
    </span>
  );
}

/**
 * Stagger item variant for child elements within the StaggerContainer.
 */
const staggerChildVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const philosophy =
    'Quality is not a phase — it is a mindset woven into every line of code, every user story, and every deployment. I believe the best QA engineers prevent defects through collaboration, automation, and relentless curiosity, turning testing from a gate into a guide that accelerates delivery with confidence.';

  const subtitle = 'Building quality into every layer of the software lifecycle.';

  return (
    <StaggerContainer staggerDelay={0.2} className="w-full max-w-4xl mx-auto text-center py-16 px-4">
      {/* Heading with fade-in + scale-up */}
      <motion.h1
        className="text-4xl md:text-5xl font-heading font-bold text-brand-text mb-4"
        variants={prefersReducedMotion ? fadeVariants : undefined}
        initial={prefersReducedMotion ? 'hidden' : { opacity: 0, scale: 0.8 }}
        animate={prefersReducedMotion ? 'visible' : { opacity: 1, scale: 1 }}
        transition={prefersReducedMotion ? { duration: 0.15 } : { duration: 0.6 }}
      >
        QA Engineer Portfolio
      </motion.h1>

      {/* Subtitle with typing effect */}
      <motion.p
        className="text-lg text-brand-text/70 mb-8 font-body"
        variants={staggerChildVariant}
      >
        <TypingEffect text={subtitle} charRate={50} />
      </motion.p>

      {/* Blockquote with gradient border animation */}
      <motion.blockquote
        className={`text-brand-text/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto pl-6 text-left font-body border-l-4 ${
          prefersReducedMotion ? 'border-brand-primary' : 'gradient-border-animated'
        }`}
        variants={staggerChildVariant}
      >
        {philosophy}
      </motion.blockquote>
    </StaggerContainer>
  );
}
