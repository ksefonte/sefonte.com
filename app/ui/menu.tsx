'use client'

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

interface MenuItem {
  name: string;
  url: string;
}

interface MenuProps {
  items: MenuItem[];
  isVisible: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Menu({ items, isVisible, onClose, isMobile = false }: MenuProps) {
  const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Cascade animation - each item appears one at a time
      gsap.fromTo(
        menuItemsRef.current,
        {
          opacity: 0,
          y: -20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1, // 0.1s delay between each item
          ease: 'power4.out'
        }
      );

      // Animate close button on mobile
      if (isMobile && closeButtonRef.current) {
        gsap.fromTo(
          closeButtonRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            delay: 0.4,
            ease: 'back.out(1.7)'
          }
        );
      }
    } else {
      // Reset items when menu is hidden
      gsap.set(menuItemsRef.current, { opacity: 0, y: 20 });
      if (closeButtonRef.current) {
        gsap.set(closeButtonRef.current, { opacity: 0, scale: 0.8 });
      }
    }
  }, [isVisible, isMobile]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <nav className="w-full max-w-md mt-auto mb-32 px-6">
        <ul className="flex flex-col gap-6">
          {items.map((item, index) => {
            const isExternal = item.url.startsWith('http');

            return (
              <li
                key={index}
                ref={(el) => { menuItemsRef.current[index] = el; }}
                className="opacity-0"
              >
                {isExternal ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-4xl font-bold text-zinc-950 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    href={item.url}
                    className="text-4xl font-bold text-zinc-950 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Close button - mobile only */}
      {isMobile && onClose && (
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-600 drop-shadow-2xl dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors duration-200 opacity-0"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
