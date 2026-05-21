'use client';

import Link from 'next/link';

interface AnimatedNavLinkProps {
  href: string;
  label: string;
}

export function AnimatedNavLink({ href, label }: AnimatedNavLinkProps) {
  return (
    <Link
      href={href}
      className="relative group inline-block text-sm font-medium text-brand-text/70 transition-colors hover:text-brand-primary"
    >
      <span>{label}</span>
      <span
        className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary transform origin-center scale-x-0 transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100 motion-reduce:opacity-0 motion-reduce:group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  );
}
