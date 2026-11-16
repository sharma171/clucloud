import React from 'react';

interface VirtualScrollerProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

/**
 * Single Responsibility: Scroll viewport container.
 * Encapsulates hardware-accelerated smooth scrolling CSS, overscroll containment, and DOM ref binding.
 */
export const VirtualScroller: React.FC<VirtualScrollerProps> = ({
  children,
  containerRef,
  className = ''
}) => {
  return (
    <div
      ref={containerRef}
      className={`virtual-scroller relative w-full h-full select-none ${className}`}
      tabIndex={0}
      role="feed"
      aria-label="Virtualized 50k users list"
    >
      {children}
    </div>
  );
};
