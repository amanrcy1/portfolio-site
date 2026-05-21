'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BRAND } from '@/lib/constants';
import { MobileMenu } from './MobileMenu';
import { AnimatedNavLink, useScrollState } from '@/components/animations';

export const NAV_LINKS = [
  { href: '/', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/blog', label: 'Blog' },
  { href: '/videos', label: 'Videos' },
  { href: '/contact', label: 'Contact' },
] as const;

export function Navbar() {
  const { isPastThreshold } = useScrollState(100);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-brand-surface bg-brand-background/95"
      style={{
        backdropFilter: isPastThreshold ? 'blur(8px)' : 'blur(0px)',
        WebkitBackdropFilter: isPastThreshold ? 'blur(8px)' : 'blur(0px)',
        transition: 'backdrop-filter 200ms ease, -webkit-backdrop-filter 200ms ease',
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image
            src={BRAND.logo}
            alt="QA Portfolio Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-heading font-semibold text-brand-text">
            QA Portfolio
          </span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <AnimatedNavLink href={link.href} label={link.label} />
            </li>
          ))}
        </ul>

        {/* Mobile menu */}
        <MobileMenu />
      </nav>
    </header>
  );
}
