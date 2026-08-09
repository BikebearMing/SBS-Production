'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const SLIDE_DURATION = 1.0    // seconds for the slide-up transition
const POST_LOTTIE_HOLD = 0.15 // brief beat after the lottie completes before sliding

export const PRELOADER_DONE_EVENT = 'preloader:done'

// The preloader only lives on the homepage and only plays on the very first
// page view of a session. Module flags survive client-side navigations (the
// whole JS context persists) and reset on a full reload.
let preloaderDone = false // the intro finished and the event was dispatched
let armed = false         // a preloader is (or was) playing this session
let appNavigated = false  // a client-side navigation has happened

/** Called by PageTransition so a later mount of the homepage skips the intro. */
export function markAppNavigated() {
  appNavigated = true
}

/**
 * Run `cb` when the preloader intro finishes. If no preloader is going to
 * play (other entry page, or returning to home mid-session), run immediately
 * with `instant: true` so callers can skip their first-load choreography.
 * Returns an unsubscribe function.
 */
export function onPreloaderDone(cb: (instant: boolean) => void): () => void {
  if (preloaderDone || !armed) {
    cb(true)
    return () => {}
  }
  const handler = () => cb(false)
  window.addEventListener(PRELOADER_DONE_EVENT, handler, { once: true })
  return () => window.removeEventListener(PRELOADER_DONE_EVENT, handler)
}

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const lottieHostRef = useRef<HTMLDivElement>(null)
  const [removed, setRemoved] = useState(false)

  // Decide once, on the client, whether this mount should play the intro.
  // (On the server this is always true so the SSR'd homepage includes the
  // shell — the client makes the real decision at hydration.)
  const [shouldPlay] = useState(
    () => typeof window === 'undefined' || (!appNavigated && !armed),
  )

  // Set synchronously on the client so sibling components that mount in the
  // same pass (hero, headings) see an armed preloader before their effects
  // call onPreloaderDone. Render order puts <Preloader> first on the page.
  if (typeof window !== 'undefined' && shouldPlay) {
    armed = true
  }

  useEffect(() => {
    if (!shouldPlay) return
    const host = lottieHostRef.current
    const root = rootRef.current
    if (!host || !root) return

    document.body.style.overflow = 'hidden'

    let anim: { destroy: () => void } | null = null
    let cancelled = false

    import('lottie-web').then((mod) => {
      if (cancelled) return
      const lottie = mod.default
      const instance = lottie.loadAnimation({
        container: host,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: '/Logo Preloader Animation.json',
      })
      anim = instance

      instance.addEventListener('complete', () => {
        gsap.to(root, {
          yPercent: -100,
          duration: SLIDE_DURATION,
          delay: POST_LOTTIE_HOLD,
          ease: 'power3.inOut',
          onStart: () => {
            preloaderDone = true
            window.dispatchEvent(new Event(PRELOADER_DONE_EVENT))
          },
          onComplete: () => {
            document.body.style.overflow = ''
            setRemoved(true)
          },
        })
      })
    })

    return () => {
      cancelled = true
      anim?.destroy()
      document.body.style.overflow = ''
    }
  }, [shouldPlay])

  if (removed || !shouldPlay) return null

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        background: '#000',
        display: 'grid',
        placeItems: 'center',
        willChange: 'transform',
      }}
    >
      <div
        ref={lottieHostRef}
        style={{
          width: 'min(45vw, 45vh)',
          aspectRatio: '1 / 1',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.111,
          pointerEvents: 'none',
          backgroundImage: 'url(/tv-static.gif)',
          backgroundPosition: '0 0',
          backgroundSize: 'auto',
        }}
      />
    </div>
  )
}
