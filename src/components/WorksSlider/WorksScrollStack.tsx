'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { scrollState } from '@/lib/scroll'
import type { WorksSlide } from './WorksSlider'
import WorksMasonryBg from './WorksMasonryBg'

// Scroll distance (in viewport heights) the page travels per slide. Higher =
// slower/lazier scrub; lower = each slide flicks past in less scrolling.
const STEP_VH = 0.7

// Content reveal vs. proximity to the bracket (distance, in slide-steps, from
// the centred work — 0 = dead centre, 0.5 = exactly between two works). The
// copy is fully shown when within REVEAL_LO and fully hidden past REVEAL_HI, so
// it reveals as a work enters the frame and fades as it leaves.
const REVEAL_LO = 0.12
const REVEAL_HI = 0.4

function revealAt(proximity: number) {
  const u = Math.min(1, Math.max(0, (proximity - REVEAL_LO) / (REVEAL_HI - REVEAL_LO)))
  return 1 - u * u * (3 - 2 * u) // 1 near centre → 0 between works (smoothstep)
}

/**
 * Desktop works experience — scroll-driven vertical stack.
 *
 * A tall `.works-scroll` track holds a `position: sticky` 100vh section (same
 * pin technique as the homepage hero — no Lenis stop, no page-wrapper transform,
 * so it can't reintroduce a scroll lock). As the page scrolls, the image stack
 * is translated continuously through a fixed bracket reticle at the viewport
 * centre. Whenever a work enters the bracket's vicinity its copy (title / year /
 * description / tags) and the VIEW PROJECT link reveal, then fade as it leaves.
 */
export default function WorksScrollStack({ slides }: { slides: WorksSlide[] }) {
  const N = slides.length
  const scrollRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const metrics = useRef({ sh: 0, gap: 0, vh: 0 })
  const updateFn = useRef<() => void>(() => {})
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  // Measure the slide height + gap, size the scroll track, and position the
  // stack. Re-runs on resize.
  useLayoutEffect(() => {
    const update = () => {
      const scroll = scrollRef.current
      const stack = stackRef.current
      if (!scroll || !stack) return
      const { sh, gap, vh } = metrics.current
      if (!sh) return
      const total = scroll.offsetHeight
      const rect = scroll.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / (total - vh)))
      const c = progress * (N - 1) // linear, continuous scrub — no dwelling
      // Centre slide `c`: shift the stack so that position's middle hits vh/2.
      gsap.set(stack, { y: vh / 2 - sh / 2 - c * (sh + gap) })

      // Reveal the copy only while a work is within the bracket's vicinity.
      const nearest = Math.round(c)
      const reveal = revealAt(Math.abs(c - nearest))
      gsap.set([titleRef.current, detailRef.current, linkRef.current], { opacity: reveal })
      if (linkRef.current) linkRef.current.style.pointerEvents = reveal > 0.5 ? 'auto' : 'none'

      // Swap which work's copy is shown at the midpoint (where reveal ≈ 0), so
      // the text changes while hidden — no flicker.
      if (nearest !== activeRef.current) {
        activeRef.current = nearest
        setActive(nearest)
      }
    }

    const measure = () => {
      const scroll = scrollRef.current
      const stack = stackRef.current
      if (!scroll || !stack) return
      const first = stack.children[0] as HTMLElement | undefined
      const vh = window.innerHeight
      metrics.current = {
        sh: first ? first.offsetHeight : vh * 0.3,
        gap: parseFloat(getComputedStyle(stack).rowGap || '0') || 0,
        vh,
      }
      scroll.style.height = `${(N - 1) * STEP_VH * vh + vh}px`
      update()
    }

    updateFn.current = update
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [N])

  // Drive the scrub off Lenis (smooth) with a native-scroll fallback.
  useEffect(() => {
    const onScroll = () => updateFn.current()
    // scrollState.lenis is the live Lenis instance (its typed handle omits on/off).
    const lenis = scrollState.lenis as unknown as
      | { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void }
      | null
    lenis?.on('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      lenis?.off('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const cur = slides[active] ?? slides[0]

  return (
    <div className="works-scroll" ref={scrollRef}>
      <section className="works-page works-page--pinned">
        <WorksMasonryBg images={slides.map((s) => s.image)} />
        <nav className="body breadcrumb works-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> / <span>WORKS</span>
        </nav>
        <div className="works-title">
          <h2 className="h1 amplitude dark">
            The <br />
            <span className="text-highlight">Works</span>
          </h2>
          <p className="body dark">we&rsquo;re proud of</p>
        </div>

        <p className="body dark works-showcase__title" ref={titleRef}>
          {cur.title}
        </p>

        <div className="works-stack-viewport">
          <div className="works-stack" ref={stackRef}>
            {slides.map((s, i) => (
              <div className="works-stack__slide" key={i}>
                <img className="works-stack__img" src={s.image} alt={s.alt ?? s.title ?? ''} />
              </div>
            ))}
          </div>

          {/* Fixed centre reticle framing whichever slide is centred. */}
          <div className="works-reticle" aria-hidden="true">
            <span className="works-reticle__corner works-reticle__corner--tl" />
            <span className="works-reticle__corner works-reticle__corner--tr" />
            <span className="works-reticle__corner works-reticle__corner--br" />
            <span className="works-reticle__corner works-reticle__corner--bl" />
          </div>
          <a
            className="custom-button works-reticle__link"
            href={cur.href ?? '#'}
            ref={linkRef}
            key={cur.href ?? active}
          >
            <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="ring ring--outer" cx="12" cy="12" r="11" />
              <circle className="ring ring--middle" cx="12" cy="12" r="7" />
              <circle className="ring ring--inner" cx="12" cy="12" r="3" />
            </svg>
            <span>VIEW PROJECT</span>
          </a>
        </div>

        <div className="works-showcase__detail" ref={detailRef}>
          <p className="bodys dark works-showcase__year">{cur.year}</p>
          <div className="works-showcase__detail-body">
            <div className="works-showcase__detail-text">
              <h4 className="dark works-showcase__campaign">{cur.title}</h4>
              <p className="body dark works-showcase__description">{cur.description}</p>
            </div>
            <div className="works-showcase__tags">
              {cur.tags?.map((tag) => (
                <p className="body dark works-showcase__tag" key={tag}>
                  {tag}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
