import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';

interface UseScrollDeltaAnchorOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalLoadedItems: number;
  filterResetKey?: string;
  onScrollEnd?: () => void;
  onHighVelocity?: (velocity: number) => void;
}

export interface ScrollTelemetry {
  scrollTop: number;
  scrollHeight: number;
  isScrollingUp: boolean;
  velocity: number;
}

// Calibrated scroll speed dampening & smooth kinetic interpolation parameters
const SCROLL_SPEED_DAMPENING = 0.52; // Slows down scroll rate by ~48% for solid 60-120 FPS
const LERP_FACTOR = 0.14; // Silky-smooth kinetic deceleration curve

/**
 * Single Responsibility: Scroll telemetry & dampened smooth scrolling controller.
 * Slows down high-frequency wheel flings to reduce DOM virtualization thrashing and maintain 60-120 FPS.
 * Uses mutable useRef to allocate ZERO React Fiber nodes on high-frequency scroll ticks.
 */
export function useScrollDeltaAnchor({
  containerRef,
  totalLoadedItems,
  filterResetKey,
  onScrollEnd,
  onHighVelocity
}: UseScrollDeltaAnchorOptions) {
  // Mutable telemetry refs (Zero-allocation hot paths)
  const prevScrollHeightRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);
  const isScrollingUpRef = useRef<boolean>(false);
  const lastTimestampRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Smooth dampened wheel animation refs
  const targetScrollTopRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Expose low-frequency settled metrics for UI telemetry without 120Hz thrashing
  const [telemetry, setTelemetry] = useState<ScrollTelemetry>({
    scrollTop: 0,
    scrollHeight: 0,
    isScrollingUp: false,
    velocity: 0
  });

  // Whenever filterResetKey changes, reset scroll to top and clear running animations
  useEffect(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    prevScrollHeightRef.current = 0;
    lastScrollTopRef.current = 0;
    targetScrollTopRef.current = 0;
    isScrollingUpRef.current = false;
    velocityRef.current = 0;

    const el = containerRef.current;
    if (el) {
      el.scrollTop = 0;
    }
  }, [filterResetKey, containerRef]);

  // Track scrollHeight changes and preserve scroll telemetry without disruptive offset jumping
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const currentScrollHeight = el.scrollHeight;

    // When a fresh search/filter is loaded, ensure scroll starts cleanly at top
    if (totalLoadedItems <= 100 && prevScrollHeightRef.current === 0 && el.scrollTop > 0) {
      el.scrollTop = 0;
      targetScrollTopRef.current = 0;
    }

    prevScrollHeightRef.current = currentScrollHeight;
  }, [totalLoadedItems, containerRef]);

  // Handle native scroll events (scrollbar dragging, touch, or programmatic jumps)
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const now = performance.now();
    const currentScrollTop = el.scrollTop;
    const currentScrollHeight = el.scrollHeight;
    const deltaTop = currentScrollTop - lastScrollTopRef.current;
    const timeDelta = Math.max(1, now - lastTimestampRef.current);

    // Sync target scroll position if user dragged scrollbar directly
    if (rafIdRef.current === null) {
      targetScrollTopRef.current = currentScrollTop;
    }

    // Compute velocity (px/ms)
    const velocity = Math.abs(deltaTop) / timeDelta;
    velocityRef.current = velocity;

    // Upward scroll detection
    const isUp = deltaTop < 0;
    isScrollingUpRef.current = isUp;
    lastScrollTopRef.current = currentScrollTop;
    lastTimestampRef.current = now;

    // Trigger high-velocity ejection callback if rapid scroll fling detected
    if (velocity > 3.0 && onHighVelocity) {
      onHighVelocity(velocity);
    }

    // Fallback for browsers lacking native scrollend
    if (!('onscrollend' in window)) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        onScrollEnd?.();
        setTelemetry({
          scrollTop: currentScrollTop,
          scrollHeight: currentScrollHeight,
          isScrollingUp: isUp,
          velocity: 0
        });
      }, 100);
    }
  }, [containerRef, onHighVelocity, onScrollEnd]);

  // Dampened wheel scroll event listener for slowed-down, silky-smooth scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Initial measurement
    prevScrollHeightRef.current = el.scrollHeight;
    lastScrollTopRef.current = el.scrollTop;
    targetScrollTopRef.current = el.scrollTop;
    lastTimestampRef.current = performance.now();

    // Smooth animation loop
    const animateScroll = () => {
      if (!containerRef.current) {
        rafIdRef.current = null;
        return;
      }

      const element = containerRef.current;
      const current = element.scrollTop;
      const target = targetScrollTopRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.5) {
        element.scrollTop = target;
        rafIdRef.current = null;
        return;
      }

      // Apply kinetic exponential decay for buttery smooth pacing
      element.scrollTop = current + diff * LERP_FACTOR;
      rafIdRef.current = requestAnimationFrame(animateScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept ctrl+wheel (zoom) or pure horizontal gestures
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      const delta = e.deltaMode === 1 ? e.deltaY * 28 : e.deltaY;
      const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);

      // Slow down scroll rate using calibrated multiplier to guarantee 60-120 FPS
      targetScrollTopRef.current = Math.max(
        0,
        Math.min(maxScroll, targetScrollTopRef.current + delta * SCROLL_SPEED_DAMPENING)
      );

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(animateScroll);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', handleScroll, { passive: true });

    // Modern native scrollend listener
    const handleNativeScrollEnd = () => {
      onScrollEnd?.();
      setTelemetry({
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
        isScrollingUp: isScrollingUpRef.current,
        velocity: 0
      });
    };

    if ('onscrollend' in window) {
      el.addEventListener('scrollend', handleNativeScrollEnd);
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleScroll);
      if ('onscrollend' in window) {
        el.removeEventListener('scrollend', handleNativeScrollEnd);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [containerRef, handleScroll, onScrollEnd]);

  return {
    telemetry,
    isScrollingUpRef,
    prevScrollHeightRef,
    lastScrollTopRef,
    velocityRef
  };
}
