'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { onPreloaderDone } from '@/components/Preloader/Preloader'
import { isWipeInFlight, onWipeReveal } from '@/components/PageTransition/PageTransition'

gsap.registerPlugin(SplitText)

const SELECTOR = [
  '.amp-mask',
  // Awards rows are rich HTML (<p>/<ul>) — SplitText line-masking can't handle
  // nested block elements, so AwardsPage animates those cells itself.
  '.body:not(.pillar__copy):not(.service__copy):not(.service__index):not(.cylinder-hover-label__brand):not(.cylinder-hover-label__copy):not(.awards-page__middle):not(.awards-page__right)',
].join(', ')
const DURATION = 0.9
const STAGGER = 0.08
const EASE = 'power3.out'
// After a wipe navigation, hold the reveals this long past the moment the red
// panel starts lifting, so in-view text animates where the user can see it.
const WIPE_TEXT_DELAY_MS = 600

export default function MaskUpHeadings() {
  // Re-split on every route change — this component lives in the persistent
  // layout, but each page brings its own headings to animate.
  const pathname = usePathname()

  useEffect(() => {
    const splits: SplitText[] = []
    let observer: IntersectionObserver | null = null
    let cancelled = false
    let unsubWipe: (() => void) | null = null
    let wipeTimer: ReturnType<typeof setTimeout> | null = null

    const init = () => {
      if (cancelled) return
      // Mobile ignores the awards caption's manual <br>s so it flows across
      // the row (.awards__caption br { display: none }). SplitText would bake
      // those breaks back in as block-level line wrappers, so skip it there.
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
        (el) => !(isMobile && el.classList.contains('awards__caption')),
      )
      const elLines = new WeakMap<Element, Element[]>()

      elements.forEach((el) => {
        const split = new SplitText(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'amp-mask-line',
        })
        splits.push(split)
        gsap.set(split.lines, { yPercent: 110 })
        elLines.set(el, split.lines as Element[])
      })

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const lines = elLines.get(entry.target)
            if (lines) {
              gsap.to(lines, {
                yPercent: 0,
                duration: DURATION,
                stagger: STAGGER,
                ease: EASE,
              })
            }
            observer?.unobserve(entry.target)
          })
        },
        { threshold: 0.15 }
      )

      const arm = () => {
        if (cancelled) return
        elements.forEach((el) => observer!.observe(el))
      }

      if (isWipeInFlight()) {
        // This page mounted behind the red wipe panel. Lines are already split
        // and hidden (above); don't start observing until the panel begins to
        // lift, plus a beat, so the reveal happens in view — not under the panel.
        unsubWipe = onWipeReveal(() => {
          wipeTimer = setTimeout(arm, WIPE_TEXT_DELAY_MS)
        })
      } else {
        arm()
      }
    }

    const unsubscribe = onPreloaderDone(init)
    return () => {
      cancelled = true
      unsubscribe()
      unsubWipe?.()
      if (wipeTimer) clearTimeout(wipeTimer)
      observer?.disconnect()
      splits.forEach((s) => s.revert())
    }
  }, [pathname])

  return null
}
