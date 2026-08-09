'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { onPreloaderDone } from '@/components/Preloader/Preloader'
import type { CarouselSlide } from './CylinderCarousel'

const CylinderCarousel = dynamic(
  () => import('./CylinderCarousel'),
  { ssr: false }
)

// Text intro timings — start as carousel intro settles (carousel is 3.5s)
const TEXT_DELAY    = 2.4   // when the headline mask reveal kicks in (first load)
const LINE_DURATION = 0.9   // headline mask-in
const LINE_OUT      = 0.55  // headline mask-out between messages
const TYPE_DURATION = 1.4   // typewriter reveal of the serif line
const TYPE_OVERLAP  = 0.35  // typewriter starts this long before the mask-in ends
const ERASE_DUR     = 0.5   // typewriter erase between messages
const MSG_HOLD      = 3.2   // seconds each message stays fully visible

// Headline (mask reveal) + serif line (typewriter) pairs the hero cycles through.
const DEFAULT_MESSAGES = [
  {
    heading: 'THE CREDIBILITY OF JOURNALISM',
    subheading: 'LENDS YOUR BRAND THE CREDIBILITY AUDIENCES ALREADY BELIEVE.',
  },
  {
    heading: 'THE EXPERTISE BEHIND THE STORIES',
    subheading: 'POSITIONS YOUR BRAND AS AN AUTHORITATIVE VOICE.',
  },
  {
    heading: 'DATA-LED AUDIENCE INTELLIGENCE',
    subheading: 'TURNS AUDIENCE BEHAVIOUR INTO MARKETING ADVANTAGE.',
  },
  {
    heading: 'AN INTEGRATED ECOSYSTEM',
    subheading: 'DELIVERS STRATEGY TO EXECUTION AS ONE SEAMLESS SOLUTION.',
  },
]

export type HeroMessage = {
  heading: string
  subheading: string
}

export type HeroProps = {
  messages?: HeroMessage[]
  slides?: CarouselSlide[]
}

export default function HeroSection({ messages, slides }: HeroProps = {}) {
  const MESSAGES = messages?.length ? messages : DEFAULT_MESSAGES
  const sectionRef = useRef<HTMLElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const headingInner = section.querySelector<HTMLElement>('h1 .line-inner')
    const typewriter = section.querySelector<HTMLElement>('.typewriter')
    if (!headingInner || !typewriter) return

    // Hide everything immediately so it doesn't flash before the preloader hands off
    gsap.set(headingInner, { yPercent: 110 })
    gsap.set(typewriter, { clipPath: 'inset(0 100% 0 0)' })

    const tweens: gsap.core.Tween[] = []
    const timelines: gsap.core.Timeline[] = []

    const start = (instant: boolean) => {
      const msgs = MESSAGES
      // First load: long delay choreographed around the preloader handoff and
      // the 3.5s carousel intro. Client-side navigation: quick reveal instead.
      const textDelay = instant ? 0.15 : TEXT_DELAY
      const typeDelay = textDelay + LINE_DURATION - TYPE_OVERLAP

      tweens.push(
        gsap.to(headingInner, {
          yPercent: 0,
          delay: textDelay,
          duration: LINE_DURATION,
          ease: 'power3.out',
        }),
        gsap.to(typewriter, {
          clipPath: 'inset(0 0% 0 0)',
          delay: typeDelay,
          duration: TYPE_DURATION,
          ease: 'steps(30)',
        }),
      )

      // Message cycle: erase + mask out, swap copy, mask in + type in, hold.
      if (msgs.length < 2) return
      let idx = 0
      const loopTl = gsap.timeline({
        delay: typeDelay + TYPE_DURATION + MSG_HOLD,
        repeat: -1,
      })
      msgs.forEach(() => {
        loopTl
          .to(typewriter, {
            clipPath: 'inset(0 100% 0 0)',
            duration: ERASE_DUR,
            ease: 'steps(18)',
          })
          .to(headingInner, {
            yPercent: -110,
            duration: LINE_OUT,
            ease: 'power3.in',
          }, '<')
          .call(() => {
            idx = (idx + 1) % msgs.length
            headingInner.textContent = msgs[idx].heading
            typewriter.textContent = msgs[idx].subheading
          })
          .set(headingInner, { yPercent: 110 })
          .to(headingInner, {
            yPercent: 0,
            duration: LINE_DURATION,
            ease: 'power3.out',
          })
          .to(typewriter, {
            clipPath: 'inset(0 0% 0 0)',
            duration: TYPE_DURATION,
            ease: 'steps(30)',
          }, `-=${TYPE_OVERLAP}`)
          .to({}, { duration: MSG_HOLD })
      })
      timelines.push(loopTl)
    }

    const unsubscribe = onPreloaderDone(start)

    return () => {
      unsubscribe()
      tweens.forEach((t) => t.kill())
      timelines.forEach((t) => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`hero-parent${isHovering ? ' is-dim' : ''}`}

      style={{
        width: '100%',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      <div className="hero-copy">
        <h1 className="h1-v3 dark">
          <span className="line"><span className="line-inner">{MESSAGES[0].heading}</span></span>
        </h1>
        <p className="h2-serif dark">
          {/* Inline-block so the clip-path typewriter wipe clips to the text box. */}
          <span className="typewriter">{MESSAGES[0].subheading}</span>
        </p>
      </div>
      <CylinderCarousel onHoverChange={setIsHovering} slides={slides} />
    </section>
  )
}
