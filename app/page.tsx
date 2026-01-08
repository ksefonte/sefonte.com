'use client'

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useMenu } from './context/MenuContext';
import HomeText from "./ui/homeText";

export default function Home() {
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
        className="min-h-screen flex items-end pb-16 lg:pb-32 px-8"
      >
        <HomeText
          header="sefonte.com"
          subHeader="web & software development shennanigans. and possibly other stuff."
        />
      </div>
    </div>
  );
}
