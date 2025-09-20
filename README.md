# Sliding Menu (React + TypeScript)

A small, focused project that demonstrates a horizontal navigation bar with a sliding submenu sibling that opens/closes with a smooth 1s animation (fast start, slow end). Includes ARIA attributes, keyboard focus, and multi-column submenu for large option sets.

## Develop

Requirements: Node >= 20.19.0.

- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

Open http://localhost:5173 (default) and click the top menu items to see the dropdown slide.

## Structure

- `src/SlidingMenu.tsx` — main component wiring the menu and shared submenu container
- `src/SlidingMenu.css` — styling, 1s cubic-bezier(0.7, 0, 0.3, 1) easing
- `src/components/AnimatedCollapse.tsx` — reusable height animation wrapper
- `src/hooks/useAnimatedHeight.ts` — hook powering the CSS height transition
- `src/utils/domAnimation.ts` — utility `lockCurrentHeight(el)` to smooth swaps

## Notes

- The project originally started from a Vite template; template visuals and docs were removed to keep this project focused.
