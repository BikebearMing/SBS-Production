'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { scrollState } from '@/lib/scroll'
import { markAppNavigated } from '@/components/Preloader/Preloader'

// ─── CONTROLS ────────────────────────────────────────────────────────────────
// Exit sequence: blur → scale down → red panel up → (route swap) → reveal.
// Each step starts before the previous fully ends (the *_OVERLAP values) so the
// whole thing reads as one continuous motion rather than three separate steps.
const BLUR_DURATION = 0.5    // 1. outgoing page blurs
const SCALE_DURATION = 0.7   // 2. outgoing page shrinks
const SCALE_OVERLAP = 0.2    // …starting this long before the blur finishes
const COVER_DURATION = 0.8   // 3. red panel slides up from the bottom to cover
const COVER_OVERLAP = 0.3    // …starting this long before the scale finishes
const REVEAL_DURATION = 0.8  // 4. red panel slides off the top to reveal
const EXIT_SCALE = 0.92      // outgoing page shrinks to this while being covered
const EXIT_BLUR = 10         // px of blur on the outgoing page
const EASE = 'power3.inOut'
const FAILSAFE_MS = 8000     // clear the panel if the new route never commits
// ─────────────────────────────────────────────────────────────────────────────

// ── Wipe signal (mirrors Preloader's onPreloaderDone pattern) ──
// The new page mounts while the red panel still covers the screen, so entrance
// animations (MaskUpHeadings) would otherwise play invisibly behind it. These
// module-level helpers let them wait for the moment the panel starts sliding
// off. Flushed from every exit path (reveal start, cleanup, failsafe) so a
// subscriber can never be left waiting forever.
let wipeInFlight = false
const wipeRevealCallbacks = new Set<() => void>()

/** True between a wipe navigation starting and its panel beginning to reveal. */
export function isWipeInFlight() {
  return wipeInFlight
}

/** Run `cb` when the wipe panel starts revealing (immediately if no wipe is up). */
export function onWipeReveal(cb: () => void): () => void {
  if (!wipeInFlight) {
    cb()
    return () => {}
  }
  wipeRevealCallbacks.add(cb)
  return () => wipeRevealCallbacks.delete(cb)
}

function flushWipeReveal() {
  wipeInFlight = false
  const cbs = Array.from(wipeRevealCallbacks)
  wipeRevealCallbacks.clear()
  cbs.forEach((cb) => cb())
}

/**
 * Red "wipe" page transition.
 *
 * Runs ONLY when navigating TO a non-home page (home→other and other→other).
 * Navigating back to home ("/") is deliberately left as a plain client-side
 * navigation — no wipe.
 *
 * On a qualifying internal link click: a solid red panel (brand `--red`) slides
 * up from the bottom to cover the screen, the new route is pushed behind it,
 * then the panel keeps sliding up and off the top to reveal the new page.
 *
 * While the panel covers, the OUTGOING page blurs and scales down slightly
 * (a transient transform/filter on <main>).
 *
 * ── Scroll-safety (hard requirements) ──
 *   • The panel is a `position: fixed; inset: 0` element appended to <body>, so
 *     it NEVER contributes to document height — it can't cause scroll/clamp
 *     issues. The page tree is never wrapped.
 *   • The exit transform/filter on <main> exists ONLY during the cover phase and
 *     is unconditionally cleared (cover complete, cleanup AND failsafe paths)
 *     the moment the screen is fully red — a transform that survives navigation
 *     breaks the sticky hero and scrolling. The fixed .site-header is pinned
 *     to the current viewport top for those 0.6s, because a transformed <main>
 *     would otherwise re-anchor it to the document top (off-screen when
 *     scrolled).
 *   • Lenis is NEVER stopped (that previously left smooth-scroll permanently
 *     disabled). We only reset the scroll position with `lenis.scrollTo(0)`.
 * See [[page-transition-scroll-lock]].
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const covering = useRef(false) // panel is up, waiting for the new route
  const busy = useRef(false)     // a transition is in flight
  const firstPath = useRef(true)
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigateRef = useRef<(href: string) => void>(() => {})
  const revealRef = useRef<() => void>(() => {})
  // Undoes the outgoing page's blur/scale — MUST be callable from every exit
  // path (cover complete, cleanup, failsafe) so no transform survives.
  const clearExitRef = useRef<() => void>(() => {})

  const cleanup = () => {
    if (failsafe.current) {
      clearTimeout(failsafe.current)
      failsafe.current = null
    }
    clearExitRef.current()
    panelRef.current?.remove()
    panelRef.current = null
    covering.current = false
    busy.current = false
    flushWipeReveal() // backstop — no-op when the reveal already flushed
  }

  // Slide the panel up and off the top, then tear everything down.
  revealRef.current = () => {
    covering.current = false
    if (failsafe.current) {
      clearTimeout(failsafe.current)
      failsafe.current = null
    }
    const panel = panelRef.current
    if (!panel) return cleanup()
    // Let the new page paint a frame before uncovering it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        gsap.to(panel, {
          y: '-100%',
          duration: REVEAL_DURATION,
          ease: EASE,
          onStart: flushWipeReveal, // panel is lifting — release held animations
          onComplete: cleanup,
        })
      }),
    )
  }

  navigateRef.current = (href: string) => {
    if (busy.current) return
    busy.current = true
    wipeInFlight = true

    // Blur + scale the outgoing page while the panel covers it. Transient by
    // design: cleared the moment the screen is fully red (see clearExitRef).
    const page = document.querySelector<HTMLElement>('main')
    const header = page?.querySelector<HTMLElement>('.site-header')

    // Solid red panel parked just below the fold. `position: fixed` keeps it out
    // of document flow, so it never affects page height / scrolling.
    const panel = document.createElement('div')
    panel.setAttribute('aria-hidden', 'true')
    Object.assign(panel.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background: 'var(--red)',
      transform: 'translateY(100%)',
      willChange: 'transform',
      pointerEvents: 'auto',
    } as CSSStyleDeclaration)
    document.body.appendChild(panel)
    panelRef.current = panel

    // One timeline choreographs the exit: blur → scale (joins late in the
    // blur) → panel up (joins late in the scale).
    const exitTl = gsap.timeline()
    if (page) {
      // The fixed header would re-anchor to the transformed <main> (document
      // top — off-screen when scrolled); pin it to the viewport for the effect.
      if (header) {
        header.style.position = 'absolute'
        header.style.top = `${window.scrollY}px`
      }
      exitTl
        .to(page, {
          filter: `blur(${EXIT_BLUR}px)`,
          duration: BLUR_DURATION,
          ease: 'power2.inOut',
        })
        .to(page, {
          scale: EXIT_SCALE,
          // Scale about the centre of what's on screen, not the page box.
          transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px`,
          duration: SCALE_DURATION,
          ease: EASE,
        }, `-=${SCALE_OVERLAP}`)
    }
    clearExitRef.current = () => {
      exitTl.kill()
      if (page) gsap.set(page, { clearProps: 'transform,filter,transformOrigin' })
      if (header) {
        header.style.position = ''
        header.style.top = ''
      }
      clearExitRef.current = () => {}
    }

    exitTl.to(panel, {
      y: '0%',
      duration: COVER_DURATION,
      ease: EASE,
      onComplete: () => {
        // Screen is fully red — undo the exit effect NOW, while it's invisible,
        // so the transform can never leak into the next page.
        clearExitRef.current()
        // Reset to the top WITHOUT stopping Lenis — sync its internal position
        // too, otherwise Lenis would snap the window back on its next frame.
        scrollState.lenis?.scrollTo(0, { immediate: true, force: true })
        window.scrollTo(0, 0)
        covering.current = true
        router.push(href)
        failsafe.current = setTimeout(() => {
          if (covering.current) revealRef.current()
        }, FAILSAFE_MS)
      },
    }, page ? `-=${COVER_OVERLAP}` : 0)
  }

  // Intercept internal link clicks globally — capture phase runs before
  // next/link's own handler, which bails out when defaultPrevented is set.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element | null)?.closest?.('a')
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return
      if (url.pathname === window.location.pathname) return // already here
      // This is a real internal navigation — let the preloader know it's not a
      // fresh visit (so home won't replay its intro), regardless of the wipe.
      markAppNavigated()
      // Going back to home: no wipe — let next/link navigate normally.
      if (url.pathname === '/') return
      e.preventDefault()
      navigateRef.current(url.pathname + url.search + url.hash)
    }

    document.addEventListener('click', onClick, true)
    // Back/forward swaps the page without the wipe — still flag the navigation.
    window.addEventListener('popstate', markAppNavigated)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', markAppNavigated)
    }
  }, [])

  // The new route committed (pathname changed) — uncover it.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false
      return
    }
    if (covering.current) revealRef.current()
  }, [pathname])

  return <>{children}</>
}
