'use client'

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useMenu } from '../context/MenuContext';
import BurgerMenu from './burgerMenu';
import Menu from './menu';

export default function MenuOverlay() {
  const { isMenuOpen, showMenu, isMobile, toggleMenu, setIsMobile, setShowMenu } = useMenu();
  const dividerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
    {
      name: "Projects",
      url: "/projects",
      subItems: [
        { name: "Project A", url: "/projects/project-a" },
        { name: "Project B", url: "/projects/project-b" }
      ]
    }
  ];

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  // Animate divider line
  useEffect(() => {
    if (isMenuOpen && dividerRef.current) {
      if (isMobile) {
        // Mobile: line appears instantly, menu fades in
        gsap.to(dividerRef.current, {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            setShowMenu(true);
          }
        });
      } else {
        // Desktop: Animate divider line from top to bottom
        gsap.set(dividerRef.current, { transformOrigin: 'top center' });
        gsap.fromTo(
          dividerRef.current,
          {
            height: '0vh',
            opacity: 0
          },
          {
            height: '100vh',
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              setShowMenu(true);
            }
          }
        );
      }
    } else if (!isMenuOpen && dividerRef.current && menuRef.current) {
      // When closing, first fade out menu content, then animate line
      if (isMobile) {
        // Mobile: fade out menu first
        gsap.to(menuRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            // Then fade out divider
            gsap.to(dividerRef.current, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
              onComplete: () => {
                setShowMenu(false);
              }
            });
          }
        });
      } else {
        // Desktop: fade out menu content first
        gsap.to(menuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            // Then animate line back up
            gsap.set(dividerRef.current, { transformOrigin: 'top center' });
            gsap.to(dividerRef.current, {
              height: '0vh',
              opacity: 0,
              duration: 0.6,
              ease: 'power2.in',
              onComplete: () => {
                setShowMenu(false);
              }
            });
          }
        });
      }
    }
  }, [isMenuOpen, isMobile, setShowMenu]);

  // Animate menu background and content when opening
  useEffect(() => {
    if (showMenu && leftSideRef.current && menuRef.current) {
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
    } else if (!showMenu && leftSideRef.current) {
      // Reset background when fully closed
      gsap.to(leftSideRef.current, {
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }, [showMenu]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        toggleMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen, toggleMenu]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMenuOpen || !leftSideRef.current) return;

      const target = event.target as Node;

      // Don't close if clicking the burger menu button
      const burgerButton = document.querySelector('[data-burger-menu]');
      if (burgerButton?.contains(target)) return;

      // Close if clicking outside the menu overlay
      if (!leftSideRef.current.contains(target)) {
        toggleMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, toggleMenu]);

  return (
    <>
      <BurgerMenu isOpen={isMenuOpen} onToggle={toggleMenu}/>

      {/* Menu overlay - 35% on desktop, full width on mobile */}
      <div
        ref={leftSideRef}
        className="fixed left-0 top-0 lg:w-[35%] w-full h-screen transition-colors duration-300 overflow-hidden z-40 bg-[#f7f7f7] dark:bg-black pointer-events-none"
        style={{ pointerEvents: showMenu ? 'auto' : 'none', opacity: isMenuOpen ? 1 : 0 }}
      >
        {/* Menu content */}
        <div
          ref={menuRef}
          className="w-full h-full flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <Menu
            items={menuItems}
            isVisible={showMenu}
            onClose={() => toggleMenu()}
            isMobile={isMobile}
            variant="page"
          />
        </div>

        {/* Dividing line - vertical on desktop, hidden on mobile */}
        <div
          ref={dividerRef}
          className="absolute top-0 right-0 lg:w-px lg:h-0 w-0 h-0 bg-zinc-950 dark:bg-zinc-50 opacity-0 z-40"
        />
      </div>
    </>
  );
}
