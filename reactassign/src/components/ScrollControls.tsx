import React from 'react';
import { ArrowUp, ArrowDown, FastForward } from 'lucide-react';

interface ScrollControlsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Cubic-bezier eased smooth scroll utility for silky smooth navigation.
 */
function easedScrollTo(element: HTMLElement, targetTop: number, durationMs: number = 380) {
  const startTop = element.scrollTop;
  const delta = targetTop - startTop;
  if (Math.abs(delta) < 2) return;

  const startTime = performance.now();

  // Easing: cubic bezier easeInOutCubic
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    element.scrollTop = startTop + delta * easeInOutCubic(progress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

/**
 * Single Responsibility: Smooth scroll programmatic controls.
 * Clean modern white theme pill buttons with cubic-bezier animated smooth scrolling.
 */
export const ScrollControls: React.FC<ScrollControlsProps> = ({ containerRef }) => {
  const scrollToTop = () => {
    const el = containerRef.current;
    if (!el) return;
    easedScrollTo(el, 0, 420);
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    easedScrollTo(el, el.scrollHeight, 450);
  };

  const jumpAhead = (deltaPx: number) => {
    const el = containerRef.current;
    if (!el) return;
    easedScrollTo(el, el.scrollTop + deltaPx, 280);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <button
        onClick={scrollToTop}
        title="Smooth Scroll to Top"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md hover:text-indigo-600 hover:shadow-lg hover:scale-105 transition-all border border-slate-200 cursor-pointer"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      <button
        onClick={() => jumpAhead(72 * 20)}
        title="Jump 20 Items Down"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md hover:text-indigo-600 hover:shadow-lg hover:scale-105 transition-all border border-slate-200 cursor-pointer"
      >
        <FastForward className="h-4 w-4" />
      </button>

      <button
        onClick={scrollToBottom}
        title="Smooth Scroll to Bottom"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md hover:text-indigo-600 hover:shadow-lg hover:scale-105 transition-all border border-slate-200 cursor-pointer"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
    </div>
  );
};
