import React, { forwardRef, useEffect } from 'react';
import { useAnimatedHeight } from '../hooks/useAnimatedHeight';

export interface AnimatedCollapseProps {
  id?: string;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
  isOpen: boolean;
  contentKey?: string | number;
  role?: string;
  ariaHidden?: boolean;
  children: React.ReactNode;
  durationMs?: number;
  timing?: string;
}

export const AnimatedCollapse = forwardRef<HTMLDivElement, AnimatedCollapseProps>(
  function AnimatedCollapse(
    {
      id,
      className,
      innerClassName = 'submenu-inner',
      labelledBy,
      isOpen,
      contentKey,
      role = 'region',
      ariaHidden,
      children,
      durationMs = 1000,
      timing = 'cubic-bezier(0.7, 0, 0.3, 1)',
    },
    ref
  ) {
    const { containerRef, innerRef, setOpen } = useAnimatedHeight({ durationMs, timing, deps: [contentKey] });

    useEffect(() => {
      setOpen(isOpen);
    }, [isOpen, setOpen]);

    return (
      <div
        id={id}
        className={className}
        aria-hidden={ariaHidden}
        role={role}
        aria-labelledby={labelledBy}
        ref={(node) => {
          containerRef.current = node;
          if (!ref) return;
          if (typeof ref === 'function') ref(node);
          else (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
      >
        <div className={innerClassName} ref={innerRef}>
          {children}
        </div>
      </div>
    );
  }
);
