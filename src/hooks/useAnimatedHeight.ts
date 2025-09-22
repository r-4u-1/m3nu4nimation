import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

/**
 * useAnimatedHeight
 * Single-hook solution to animate a container's height on open/close and when its content changes.
 * Handles shrink/grow reliably via height locking, forced reflow, double rAF, and a transition guard.
 */
export function useAnimatedHeight(
  isOpen: boolean,
  options?: {
    durationMs?: number
    timing?: string // CSS timing function
    contentKey?: string | number // changes trigger re-measure/animate
    observeWhileOpen?: boolean // respond to inner size changes while open
  }
) {
  const {
    durationMs = 1000,
    timing = 'cubic-bezier(0.7, 0, 0.3, 1)',
    contentKey,
    observeWhileOpen = true,
  } = options || {}

  const containerRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const isTransitioningRef = useRef(false)

  // Initialize transition styles once deps change
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.style.overflow = 'hidden'
    el.style.height = '0px'
    el.style.transitionProperty = 'height'
    el.style.transitionDuration = `${durationMs}ms`
    el.style.transitionTimingFunction = timing
    el.style.willChange = 'height'
  }, [durationMs, timing])

  const animateToCurrentContentHeight = useCallback(() => {
    const el = containerRef.current
    const inner = innerRef.current
    if (!el) return

    // Always capture current visual height and restart the transition.
    // This cancels any in-flight animation and ensures a fresh from->to.
    const from = el.offsetHeight

    // Disable transition to lock starting height without animating
    el.style.transition = 'none'
    el.style.height = `${from}px`
    void el.offsetHeight // force reflow

    // Restore transition longhands
    el.style.transitionProperty = 'height'
    el.style.transitionDuration = `${durationMs}ms`
    el.style.transitionTimingFunction = timing

    // Double rAF to schedule the target height change after layout settles
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const to = isOpen && inner ? inner.scrollHeight : 0

        if (to === from) {
          // No change; normalize without animating
          if (isOpen) el.style.height = 'auto'
          else el.style.height = '0px'
          return
        }

        isTransitioningRef.current = true
        el.style.height = `${to}px`
      })
    })
  }, [isOpen, durationMs, timing])

  // Animate on open/close and when contentKey changes
  useLayoutEffect(() => {
    animateToCurrentContentHeight()
  }, [isOpen, contentKey, animateToCurrentContentHeight])

  // After transition ends, normalize height and handle pending rerun
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'height' || e.target !== el) return
      if (isOpen) el.style.height = 'auto'
      else el.style.height = '0px'
      isTransitioningRef.current = false
    }
    el.addEventListener('transitionend', onEnd as EventListener)
    return () => el.removeEventListener('transitionend', onEnd as EventListener)
  }, [isOpen, animateToCurrentContentHeight])

  // Observe inner size changes while open to animate dynamic content
  useEffect(() => {
    if (!observeWhileOpen) return
    const inner = innerRef.current
    if (!inner) return
    if (!isOpen) return

    const ro = new ResizeObserver(() => {
      animateToCurrentContentHeight()
    })
    ro.observe(inner)
    return () => ro.disconnect()
  }, [isOpen, observeWhileOpen, animateToCurrentContentHeight])

  const lockForSwap = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    // Lock current height so the next content change has a proper animated from-state
    const cs = getComputedStyle(el)
    const prop = cs.transitionProperty
    const dur = cs.transitionDuration
    const tf = cs.transitionTimingFunction

    el.style.transition = 'none'
    const from = el.offsetHeight
    el.style.height = `${from}px`
    void el.offsetHeight
    // restore longhands to keep only height animating
    el.style.transitionProperty = prop || 'height'
    el.style.transitionDuration = dur || `${durationMs}ms`
    el.style.transitionTimingFunction = tf || timing
  }, [durationMs, timing])

  return { containerRef, innerRef, lockForSwap } as const
}
