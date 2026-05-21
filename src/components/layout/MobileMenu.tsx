'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from './Navbar';

const menuContainerVariants = {
  open: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0,
      duration: 0.2,
    },
  },
};

const menuItemVariants = {
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: i * 0.05,
      ease: 'easeOut' as const,
    },
  }),
  closed: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn' as const,
    },
  },
};

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-md p-2 text-brand-text/70 hover:text-brand-text hover:bg-brand-surface transition-colors"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-16 z-50 border-b border-brand-surface bg-brand-background shadow-lg"
          >
            <motion.ul
              className="flex flex-col px-4 py-4 space-y-1"
              variants={menuContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  custom={index}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-brand-text/70 hover:text-brand-text hover:bg-brand-surface transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
