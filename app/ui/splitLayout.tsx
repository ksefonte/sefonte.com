'use client'

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Menu from './menu';

interface MenuItem {
  name: string;
  url: string;
}

interface SplitLayoutProps {
  leftContent: React.ReactNode;
  menuItems?: MenuItem[];
}

export default function SplitLayout({ leftContent, menuItems = [] }: SplitLayoutProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const desktopRightContentRef = useRef<HTMLDivElement>(null);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isHovering && dividerRef.current) {
      if (isMobile) {
        // Animate divider line from left to right (horizontal)
        gsap.fromTo(
          dividerRef.current,
          { width: 0, opacity: 0 },
          {
            width: '100%',
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              setShowMenu(true);
            }
          }
        );
      } else {
        // Animate divider line from top to bottom (vertical)
        gsap.fromTo(
          dividerRef.current,
          { height: 0, opacity: 0 },
          {
            height: '100%',
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              setShowMenu(true);
            }
          }
        );
      }
    } else if (!isHovering && dividerRef.current) {
      // Hide menu and divider when not hovering
      setShowMenu(false);
      if (isMobile) {
        gsap.to(dividerRef.current, {
          width: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
      } else {
        gsap.to(dividerRef.current, {
          height: 0,
          opacity: 0,
          delay: 0.3,
          duration: 0.6,
          ease: 'power2.in'
        });
      }
    }
  }, [isHovering, isMobile]);

  useEffect(() => {
    if (showMenu && leftSideRef.current && menuRef.current && contentRef.current) {
      // Darken background and reveal menu
      gsap.to(leftSideRef.current, {
        backgroundColor: 'rgba(0, 0, 0, 0.01)',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        }
      );

      if (isMobile) {
        // Mobile: Fade out content
        gsap.to(contentRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      } else {
        // Desktop: Slide content to the right (fades out due to mask)
        gsap.to(contentRef.current, {
          x: '50vw',
          duration: 0.5,
          ease: 'power2.inOut'
        });

        // Show right content (fades in from left)
        if (desktopRightContentRef.current) {
          gsap.fromTo(
            desktopRightContentRef.current,
            { x: '-50vw' },
            {
              x: 0,
              duration: 0.5,
              ease: 'power2.inOut'
            }
          );
        }
      }
    } else if (!showMenu && leftSideRef.current && menuRef.current && contentRef.current) {
      gsap.to(leftSideRef.current, {
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.in'
      });
      gsap.to(menuRef.current, {
        backgroundColor: 'transparent',
        opacity: 0,
        y: -20,
        duration: 0.2,
        ease: 'power2.in'
      });

      if (isMobile) {
        // Fade content back in
        gsap.to(contentRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      } else {
        // Slide content back left
        gsap.to(contentRef.current, {
          x: 0,
          duration: 0.5,
          ease: 'power2.inOut'
        });

        // Hide right content (slides back to left)
        if (desktopRightContentRef.current) {
          gsap.to(desktopRightContentRef.current, {
            x: '-50vw',
            duration: 0.5,
            ease: 'power2.inOut'
          });
        }
      }
    }
  }, [showMenu, isMobile]);

  return (
    <div className="flex lg:flex-row flex-col-reverse min-h-screen w-full overflow-hidden">
      {/* Desktop left side / Mobile full screen container */}
      <div
        ref={leftSideRef}
        className="relative lg:w-[35%] lg:flex-none lg:h-auto lg:min-h-screen min-h-screen flex items-end pb-16 lg:pb-32 px-8 transition-colors duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={() => setIsHovering(true)}
        onTouchCancel={() => setIsHovering(false)}
      >
        {/* Main content that slides and fades */}
        <div
          ref={contentRef}
          className="relative z-20"
          style={{
            maskImage: isMobile
              ? undefined
              : 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: isMobile
              ? undefined
              : 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)'
          }}
        >
          {leftContent}
        </div>

        {/* Menu content - desktop in left side, mobile full screen */}
        <div
          ref={menuRef}
          className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          style={{ pointerEvents: showMenu ? 'auto' : 'none' }}
        >
          <Menu
            items={menuItems}
            isVisible={showMenu}
            onClose={() => setIsHovering(false)}
            isMobile={isMobile}
          />
        </div>

        {/* Dividing line - vertical on desktop, horizontal on mobile */}
        <div
          ref={dividerRef}
          className="absolute lg:top-0 lg:right-0 lg:w-px lg:h-0 top-1/2 right-0 w-0 h-px bg-zinc-950 dark:bg-zinc-50 opacity-0 z-40"
        />
      </div>

      {/* Desktop right side only */}
      <div className={`hidden lg:flex lg:flex-1
      lg:items-end lg:pb-32 lg:px-16 overflow-hidden delay-700 transition-shadow duration-700 ${isHovering ? 'shadow-xl' : ''}`}>
        <div
          ref={desktopRightContentRef}
          className="relative"
          style={{
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 100%)',
            transform: 'translateX(-50vw)'
          }}
        >
          {leftContent}
        </div>
      </div>
    </div>
  );
}
