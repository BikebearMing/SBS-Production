'use client'

import { Fragment, useEffect, useRef } from 'react'
import { scrollState } from '@/lib/scroll'

/**
 * Our Story — section 1.
 * Left: title (.h3). Right: two body copies (.body). Below: an angled image
 * marquee that reuses the homepage LogoCarousel scroll mechanism (constant
 * drift + scroll-velocity boost, duplicated set for a seamless wrap), tilted
 * by transform: rotate(4deg).
 *
 * Content is hardcoded here (DEFAULT_* pattern) so it's trivial to lift into
 * Payload later. Copy was transcribed from the design screenshot — confirm the
 * exact wording.
 */

// NOTE: transcribed from the screenshot — please confirm exact copy.
const DEFAULT_TITLE =
  'SMG BRAND STUDIO — THE FULL-SERVICE MARKETING ARM OF STAR MEDIA GROUP.'

const DEFAULT_COPY: [string, string] = [
  'WE HELP ORGANISATIONS NAVIGATE COMPLEX ISSUES AND CONNECT WITH THE AUDIENCES THAT MATTER — COMBINING THE CREDIBILITY OF JOURNALISM, THE RIGOUR OF DATA, AND THE REACH OF AN INTEGRATED MEDIA GROUP.',
  'INSTEAD OF STARTING WITH A CREATIVE CONCEPT, WE START WITH EVIDENCE AND WITH PEOPLE. WHAT THEY READ, WHAT THEY CARE ABOUT, AND THE FORCES DRIVING THE CONVERSATIONS AROUND THEM. FROM THERE, WE BUILD AND ACTIVATE NARRATIVES THAT EARN ATTENTION RATHER THAN CHASE IT.',
]

// Placeholder marquee stills — swap for the real production images.
const DEFAULT_IMAGES = [
  '/works/rhb-masthead.jpg',
  '/works/mpoc-1.jpg',
  '/works/sngei-1.jpg',
  '/busan2.jpg',
  '/MastheadRHB_Shot.jpg',
]

const BASE_SPEED = 0.6 // px per frame baseline drift
const SCROLL_BOOST = 0.45 // scroll-velocity multiplier
const SCROLL_DAMP = 0.08 // ease-in/out for scroll boost

type OurStoryProps = {
  title?: string
  copy?: [string, string]
  images?: string[]
}

export default function OurStory({ title, copy, images }: OurStoryProps = {}) {
  const TITLE = title ?? DEFAULT_TITLE
  const COPY = copy ?? DEFAULT_COPY
  const IMAGES = images?.length ? images : DEFAULT_IMAGES

  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const originalItems = Array.from(track.children) as HTMLElement[]
    if (originalItems.length === 0) return

    // Duplicate the set once so the viewport is always covered; wrap is invisible.
    const clones = originalItems.map((item) => {
      const clone = item.cloneNode(true) as HTMLElement
      clone.setAttribute('aria-hidden', 'true')
      track.appendChild(clone)
      return clone
    })

    let setWidth = 0
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0
      setWidth = originalItems.reduce(
        (acc, item) => acc + item.getBoundingClientRect().width,
        0,
      )
      setWidth += gap * originalItems.length
    }
    measure()

    let position = 0
    let scrollBoost = 0
    let rafId = 0

    const tick = () => {
      const targetBoost = Math.abs(scrollState.velocity) * SCROLL_BOOST
      scrollBoost += (targetBoost - scrollBoost) * SCROLL_DAMP

      position -= BASE_SPEED + scrollBoost
      if (setWidth > 0 && -position >= setWidth) {
        position += setWidth
      }
      track.style.transform = `translate3d(${position}px, 0, 0)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onResize = () => measure()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      clones.forEach((clone) => clone.remove())
      track.style.transform = ''
    }
  }, [])

  return (
    <section className="our-story">
      <div className="our-story__intro">
        <h2 className="h3 amp-mask our-story__title">
          {/* Editors break lines with Enter in the textarea, or a typed <br> —
              normalize both to real <br> elements (text renders literally). */}
          {TITLE.replace(/<br\s*\/?>/gi, '\n')
            .split('\n')
            .map((line, i, arr) => (
              <Fragment key={i}>
                {line.trim()}
                {i < arr.length - 1 && <br />}
              </Fragment>
            ))}
        </h2>
        <div className="our-story__copy">
          <p className="body">{COPY[0]}</p>
          <p className="body">{COPY[1]}</p>
        </div>
      </div>

      <div className="our-story__marquee">
        <div className="our-story__track" ref={trackRef}>
          {IMAGES.map((src, i) => (
            <div className="our-story__slide" key={`${src}-${i}`}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
