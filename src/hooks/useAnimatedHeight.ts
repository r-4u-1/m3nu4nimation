import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Smoothly animates a container's height for open/close and content swaps.
 */
export function useAnimatedHeight(options?: {
  durationMs?: number;
  timing?: string; // CSS timing function
  deps?: (string | number | boolean | null | undefined)[]; // trigges re-measurement
}) {
  const { durationMs = 1000, timing = 'cubic-bezier(0.5, 0, 0.2, 1)', deps = [] } = options || {};

  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.overflow = 'hidden';
    el.style.height = '0px';
    el.style.transitionProperty = 'height';
    el.style.transitionDuration = `${durationMs}ms`;
    el.style.transitionTimingFunction = timing;
    el.style.willChange = 'height';
  }, [durationMs, timing]);

  const depsKey = deps.join('|');

  useLayoutEffect(() => {
    const el = containerRef.current;
    const inner = innerRef.current;
    if (!el) return;

    const from = el.offsetHeight;
    el.style.height = `${from}px`;

    const raf = requestAnimationFrame(() => {
      const to = isOpen && inner ? inner.scrollHeight : 0;
      el.style.height = `${to}px`;
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen, depsKey]);


  return {
    containerRef,
    innerRef,
    isOpen,
    setOpen,
  } as const;
}
