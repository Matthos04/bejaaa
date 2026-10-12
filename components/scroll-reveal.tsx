'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function ScrollReveal({
  children,
  className = '',
  stagger = 95,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  'aria-label'?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(root.children) as HTMLElement[];
    let observer: IntersectionObserver | undefined;
    const showAll = () => {
      observer?.disconnect();
      root.removeAttribute('data-reveal-ready');
    };
    if (reduced.matches) return;

    observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => cards.indexOf(a.target as HTMLElement) - cards.indexOf(b.target as HTMLElement))
        .forEach(entry => {
          const card = entry.target as HTMLElement;
          card.style.setProperty('--reveal-delay', `${cards.indexOf(card) * stagger}ms`);
          card.setAttribute('data-revealed', 'true');
          observer?.unobserve(card);
        });
    }, { threshold: 0.12 });

    root.setAttribute('data-reveal-ready', 'true');
    cards.forEach(card => observer?.observe(card));
    reduced.addEventListener('change', showAll);
    return () => {
      showAll();
      reduced.removeEventListener('change', showAll);
      cards.forEach(card => {
        card.removeAttribute('data-revealed');
        card.style.removeProperty('--reveal-delay');
      });
    };
  }, [stagger]);

  return <div ref={ref} className={`scroll-reveal ${className}`.trim()} role={ariaLabel ? 'group' : undefined} aria-label={ariaLabel}>{children}</div>;
}
