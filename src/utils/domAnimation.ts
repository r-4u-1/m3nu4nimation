export function lockCurrentHeight(el: HTMLElement, fallbackMs = 1000, fallbackTiming = 'cubic-bezier(0.7, 0, 0.3, 1)') {
  const cs = getComputedStyle(el);
  const prop = cs.transitionProperty || 'height';
  const dur = cs.transitionDuration || `${fallbackMs}ms`;
  const tf = cs.transitionTimingFunction || fallbackTiming;

  el.style.transition = 'none';
  const from = el.offsetHeight;
  el.style.height = `${from}px`;
  // Force reflow
  void el.offsetHeight;
  el.style.transitionProperty = prop;
  el.style.transitionDuration = dur;
  el.style.transitionTimingFunction = tf;
}
