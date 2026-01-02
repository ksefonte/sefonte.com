'use client'

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function BurgerMenu({ isOpen, onToggle }: BurgerMenuProps) {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Animate to X
      gsap.to(line1Ref.current, {
        rotation: 45,
        y: 8,
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(line2Ref.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      });
      gsap.to(line3Ref.current, {
        rotation: -45,
        y: -8,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      // Animate back to hamburger
      gsap.to(line1Ref.current, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(line2Ref.current, {
        opacity: 1,
        duration: 0.2,
        delay: 0.1,
        ease: 'power2.out'
      });
      gsap.to(line3Ref.current, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isOpen]);

  return (
    <button
      onClick={onToggle}
      className="fixed top-8 left-8 z-50 w-12 h-12 flex flex-col items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div
        ref={line1Ref}
        className="w-6 h-0.5 bg-zinc-950 dark:bg-zinc-50 origin-center"
      />
      <div
        ref={line2Ref}
        className="w-6 h-0.5 bg-zinc-950 dark:bg-zinc-50"
      />
      <div
        ref={line3Ref}
        className="w-6 h-0.5 bg-zinc-950 dark:bg-zinc-50 origin-center"
      />
    </button>
  );
}
