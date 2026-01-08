'use client';

import { useState, useRef, useEffect } from 'react';

export interface TimelineItem {
  id: string | number;
  content: string | React.ReactNode;
  order: number;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(items.length - 1); // Start at most recent
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sort items by order ascending
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  // Scroll to current item
  useEffect(() => {
    if (itemRefs.current[currentIndex] && scrollContainerRef.current) {
      const item = itemRefs.current[currentIndex];
      const container = scrollContainerRef.current;
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const containerWidth = container.offsetWidth;

      // Center the item
      const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [currentIndex]);

  // Handle manual scroll to update current index
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;

    // Find which item is closest to center
    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  };

  return (
    <div className="relative w-full">
      {/* Timeline Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex items-center gap-0 px-[50vw] py-12 min-h-50">
          {sortedItems.map((item, index) => (
            <div key={item.id} className="flex items-center shrink-0">
              {/* Textbox */}
              <div
                ref={(el) => (itemRefs.current[index] = el)}
                className="relative transition-all duration-500"
              >
                <SketchyBox
                  isActive={index === currentIndex}
                  isPast={index < currentIndex}
                >
                  <div className="p-8 min-w-70 max-w-[320px]">
                    {typeof item.content === 'string' ? (
                      <p className={`text-center whitespace-pre-wrap ${
                        index === currentIndex
                          ? 'text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {item.content}
                      </p>
                    ) : (
                      item.content
                    )}
                  </div>
                </SketchyBox>
              </div>

              {/* Connecting Line */}
              {index < sortedItems.length - 1 ? (
                <AnimatedLine isActive={index === currentIndex} />
              ) : (
                // Last item: show line with "?" for future
                <div className="flex items-center">
                  <AnimatedLine isActive={false} />
                  <div className="relative">
                    <SketchyBox isActive={false} isPast={false} isFuture>
                      <div className="p-8 min-w-70 max-w-[320px]">
                        <p className="text-6xl text-center text-zinc-400 dark:text-zinc-600">
                          ?
                        </p>
                      </div>
                    </SketchyBox>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hand-drawn sketchy box component
function SketchyBox({
  children,
  isActive,
  isPast,
  isFuture = false,
}: {
  children: React.ReactNode;
  isActive: boolean;
  isPast: boolean;
  isFuture?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        if (containerRef.current) {
          setDimensions({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
          });
        }
      };

      updateDimensions();

      // Update on resize
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [children]);

  // Create slightly irregular path for hand-drawn effect
  const createSketchyPath = (width: number, height: number, seed: number) => {
    const variance = 3; // How much the line varies
    const random = (n: number) => Math.sin(n * seed * 12.9898) * 0.5 + 0.5;

    const w = width;
    const h = height;

    const points = [
      [variance * random(1), variance * random(2)],
      [w - variance * random(3), variance * random(4)],
      [w - variance * random(5), h - variance * random(6)],
      [variance * random(7), h - variance * random(8)],
    ];

    return `M ${points[0][0]} ${points[0][1]}
            L ${points[1][0]} ${points[1][1]}
            L ${points[2][0]} ${points[2][1]}
            L ${points[3][0]} ${points[3][1]} Z`;
  };

  const bgColor = isActive
    ? 'bg-zinc-950 dark:bg-zinc-900'
    : isFuture
    ? 'bg-zinc-100 dark:bg-zinc-800'
    : isPast
    ? 'bg-zinc-200 dark:bg-zinc-800'
    : 'bg-zinc-100 dark:bg-zinc-800';

  const borderColor = isActive
    ? 'stroke-zinc-800 dark:stroke-zinc-700'
    : 'stroke-zinc-400 dark:stroke-zinc-600';

  return (
    <div ref={containerRef} className={`relative ${bgColor} rounded-lg transition-all duration-500`}>
      {/* Hand-drawn border overlay */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ filter: 'url(#pencil-texture)' }}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="pencil-texture">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.5"
                numOctaves="4"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
          <path
            d={createSketchyPath(dimensions.width, dimensions.height, isActive ? 1 : isPast ? 2 : 3)}
            vectorEffect="non-scaling-stroke"
            fill="none"
            className={`${borderColor} transition-all duration-500`}
            strokeWidth={isActive ? '3' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Animated connecting line
function AnimatedLine({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-32 h-1 mx-4">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3">
              <animate
                attributeName="stop-opacity"
                values="0.3;0.8;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.6">
              <animate
                attributeName="stop-opacity"
                values="0.6;1;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.3">
              <animate
                attributeName="stop-opacity"
                values="0.3;0.8;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* Hand-drawn wavy line */}
        <path
          d="M 0 4 Q 20 2, 40 4 T 80 4 T 128 4"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className={`${
            isActive
              ? 'text-zinc-700 dark:text-zinc-400'
              : 'text-zinc-400 dark:text-zinc-600'
          } transition-colors duration-500`}
        />
      </svg>
    </div>
  );
}
