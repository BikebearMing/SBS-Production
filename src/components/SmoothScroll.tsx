'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { scrollState } from '@/lib/scroll'

export default function SmoothScroll() {
  const pathname = usePathname()

  // After a client-side route change Lenis keeps the PREVIOUS page's cached
  // dimensions, so its max-scroll stays clamped to the old (often shorter) page
  // — you can't scroll to the bottom of a taller page until a hard refresh.
  // (Lenis's autoResize observer doesn't catch the App-Router content swap.)
  // Recompute dimensions, then re-sync the position (back/forward restores the
  // old scrollY, which would otherwise teleport on the next wheel input).
  // Repeat on a few delays to catch late-loading content (images, 3D canvas).
  useEffect(() => {
    const sync = () => {
      scrollState.lenis?.resize()
      scrollState.lenis?.scrollTo(window.scrollY, { immediate: true, force: true })
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(sync))
    const timers = [250, 800, 1600].map((ms) => setTimeout(sync, ms))
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [pathname])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    scrollState.lenis = lenis

    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      scrollState.velocity = velocity
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      scrollState.velocity = 0
      scrollState.lenis = null
    }
  }, [])

  return null
}
