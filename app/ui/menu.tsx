'use client'

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubMenuItem {
  name: string;
  url: string;
}

interface MenuItem {
  name: string;
  url: string;
  subItems?: SubMenuItem[];
}

interface MenuProps {
  items: MenuItem[];
  isVisible: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  variant?: 'homepage' | 'page';
}

export default function Menu({ items, isVisible, onClose, isMobile = false, variant = 'homepage' }: MenuProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isVisible) {
      // Cascade animation - each item appears one at a time
      gsap.fromTo(
        menuItemsRef.current.filter(Boolean),
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
      // Reset expanded state when menu closes
      setExpandedIndex(null);
    }
  }, [isVisible, isMobile]);

  const toggleExpanded = (index: number, hasSubItems: boolean) => {
    if (hasSubItems) {
      setExpandedIndex(expandedIndex === index ? null : index);
    }
  };

  const handleLinkClick = () => {
    // Close menu when clicking a routing link
    if (onClose) {
      onClose();
    }
  };

  const isPageVariant = variant === 'page';

  return (
    <div className="w-full h-full flex flex-col relative">
      <nav className={`w-full ${isPageVariant ? 'max-w-md' : 'max-w-md'} mt-auto mb-16 lg:mb-32 px-6`}>
        <ul className="flex flex-col gap-6">
          {items.map((item, index) => {
            const isExternal = item.url.startsWith('http');
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedIndex === index;
            const isActive = isPageVariant && pathname === item.url;

            return (
              <li key={index}>
                <div
                  ref={(el) => { menuItemsRef.current[index] = el; }}
                  className="flex flex-col gap-3"
                  style={{ opacity: 0 }}
                >
                  {/* Main menu item */}
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleExpanded(index, true)}
                      className={`text-4xl font-bold transition-all duration-200 text-left flex items-center gap-2 rounded-lg px-2 py-1 -mx-2 ${
                        isActive
                          ? 'text-zinc-950 dark:text-zinc-50'
                          : 'text-zinc-800 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      } focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:bg-zinc-200 dark:focus:bg-zinc-800`}
                    >
                      {item.name}
                      <svg
                        className={`w-6 h-6 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  ) : isExternal ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="text-4xl font-bold text-zinc-800 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all duration-200 rounded-lg px-2 py-1 -mx-2 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:bg-zinc-200 dark:focus:bg-zinc-800"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.url}
                      onClick={handleLinkClick}
                      className={`text-4xl font-bold transition-all duration-200 rounded-lg px-2 py-1 -mx-2 ${
                        isActive
                          ? 'text-zinc-950 dark:text-zinc-50 underline'
                          : 'text-zinc-800 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      } focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:bg-zinc-200 dark:focus:bg-zinc-800`}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Sub-items */}
                  {hasSubItems && isExpanded && (
                    <ul className="flex flex-col gap-2 pl-4">
                      {item.subItems!.map((subItem, subIndex) => {
                        const isSubActive = isPageVariant && pathname === subItem.url;
                        return (
                          <li key={subIndex}>
                            <Link
                              href={subItem.url}
                              onClick={handleLinkClick}
                              className={`text-2xl font-medium transition-all duration-200 rounded-lg px-2 py-1 -mx-2 inline-block ${
                                isSubActive
                                  ? 'text-zinc-950 dark:text-zinc-50 underline'
                                  : 'text-zinc-600 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                              } focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:bg-zinc-200 dark:focus:bg-zinc-800`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
