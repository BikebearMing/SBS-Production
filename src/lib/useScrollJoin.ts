import { useEffect, useRef } from 'react'

/**
 * Scroll-scrubbed two-word heading: the `before` and `after` words start
 * `spread` vw apart on each side and slide back into their original joined
 * position as the heading rises to ~45% up the viewport. Reverses on scroll up.
 *
 * The word elements must be `display: inline-block` for the transform to take.
 */
export function useScrollJoin<H extends HTMLElement, W extends HTMLElement>(spread = 9) {
  const headingRef = useRef<H>(null)
  const beforeRef = useRef<W>(null)
  const afterRef = useRef<W>(null)

  useEffect(() => {
    const heading = headingRef.current
    const before = beforeRef.current
    const after = afterRef.current
    if (!heading || !before || !after) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0

    const update = () => {
      raf = 0
      const rect = heading.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the heading enters from the bottom, 1 once it has risen to
      // ~45% up the viewport (fully joined from there on up).
      const p = (vh - rect.top) / (vh - vh * 0.45)
      const joined = Math.min(1, Math.max(0, p))
      const offset = (1 - joined) * spread
      before.style.transform = `translateX(${-offset}vw)`
      after.style.transform = `translateX(${offset}vw)`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [spread])

  return { headingRef, beforeRef, afterRef }
}
