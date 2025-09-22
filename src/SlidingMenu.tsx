import React, { useState } from 'react';
import { useAnimatedHeight } from './hooks/useAnimatedHeight';
import './SlidingMenu.css';

interface MenuItem {
  label: string;
  submenu: string[];
}

const menuItems: MenuItem[] = [
  { label: 'Home', submenu: Array.from({ length: 10 }, (_, i) => `Home Option ${i + 1}`) },
  { label: 'Profile', submenu: Array.from({ length: 25 }, (_, i) => `Profile Option ${i + 1}`) },
  { label: 'Help', submenu: Array.from({ length: 15 }, (_, i) => `Help Option ${i + 1}`) },
];

export const SlidingMenu: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const { containerRef, innerRef, lockForSwap } = useAnimatedHeight(isOpen, {
    durationMs: 1000,
    timing: 'cubic-bezier(0.7, 0, 0.3, 1)',
    contentKey: openIndex ?? 'closed',
  });

  const handleMenuClick = (idx: number) => {
    const next = openIndex === idx ? null : idx
    // If we are swapping content while open, lock current height to ensure animation
    if (isOpen && next !== openIndex) {
      lockForSwap()
      // Defer state update to the next frame so the lock is committed before content swap
      requestAnimationFrame(() => setOpenIndex(next))
      return
    }
    setOpenIndex(next)
  };

  return (
    <div className="sliding-menu-container">
      <nav className="menu-bar">
        {menuItems.map((item, idx) => (
          <button
            key={item.label}
            className={`menu-bar-item${openIndex === idx ? ' active' : ''}`}
            onClick={() => handleMenuClick(idx)}
            aria-expanded={openIndex === idx}
            aria-controls="submenu"
            id={`menu-bar-item-${idx}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div
        id="submenu"
        className={`submenu${isOpen ? ' open' : ''}`}
        aria-hidden={!isOpen}
        role="region"
        aria-labelledby={isOpen ? `menu-bar-item-${openIndex}` : undefined}
        ref={containerRef}
      >
        <div className="submenu-inner" ref={innerRef}>
          {isOpen && (
            <ul role="menu">
              {menuItems[openIndex!].submenu.map((sub, subIdx) => (
                <li
                  key={subIdx}
                  role="menuitem"
                  tabIndex={0}
                  aria-label={sub}
                >
                  {sub}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
