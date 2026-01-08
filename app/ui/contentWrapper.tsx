'use client'

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useMenu } from '../context/MenuContext';

interface ContentWrapperProps {
  title: string;
  content: React.ReactNode;
}

export default function ContentWrapper({ title, content }: ContentWrapperProps) {
  const { showMenu, isMobile } = useMenu();
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate content when menu opens/closes
  useEffect(() => {
    if (contentRef.current) {
      if (showMenu) {
        if (isMobile) {
          // Mobile: Fade out content
          gsap.to(contentRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          });
        } else {
          // Desktop: Slide content to the right and fade out
          gsap.to(contentRef.current, {
            x: '35vw',
            opacity: 0.3,
            duration: 0.5,
            ease: 'power2.inOut'
          });
        }
      } else {
        if (isMobile) {
          // Fade content back in
          gsap.to(contentRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.inOut'
          });
        } else {
          // Slide content back left and fade in
          gsap.to(contentRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut'
          });
        }
      }
    }
  }, [showMenu, isMobile]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-elms dark:bg-black overflow-hidden">
      <div
        ref={contentRef}
        className="relative min-h-screen py-4"
      >
        <div className="max-w-4xl px-8 py-16 lg:py-24">
          <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 mb-8">
            {title}
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
