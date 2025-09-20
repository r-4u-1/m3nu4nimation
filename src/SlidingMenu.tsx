import React, { useRef, useState } from 'react';
import { AnimatedCollapse } from './components/AnimatedCollapse';
import { lockCurrentHeight } from './utils/domAnimation';
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
  const collapseRef = useRef<HTMLDivElement | null>(null);

  const handleMenuClick = (idx: number) => {
    if (openIndex !== null && idx !== openIndex) {
  if (collapseRef.current) lockCurrentHeight(collapseRef.current);
      requestAnimationFrame(() => setOpenIndex(idx));
      return;
    }
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const isOpen = openIndex !== null;

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

      <AnimatedCollapse
  ref={collapseRef}
        id="submenu"
        className={`submenu${isOpen ? ' open' : ''}`}
        labelledBy={isOpen ? `menu-bar-item-${openIndex}` : undefined}
        ariaHidden={!isOpen}
        isOpen={isOpen}
        contentKey={openIndex ?? 'closed'}
        durationMs={1000}
        timing={'cubic-bezier(0.7, 0, 0.3, 1)'}
      >
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
      </AnimatedCollapse>
    </div>
  );
};
