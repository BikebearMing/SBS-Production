'use client'

import { useEffect, useRef } from 'react'
import { scrollState } from '@/lib/scroll'

const DEFAULT_LOGOS = [
  'thestar.png',
  'mstar.png',
  'star-property.png',
  'rage.png',
  'kuntum.png',
  'suria.png',
  '988.png',
].map((file) => `/logos/${file}`)

const BASE_SPEED   = 0.6   // px per frame baseline drift
const SCROLL_BOOST = 0.45  // scroll-velocity multiplier
const SCROLL_DAMP  = 0.08  // ease-in/out for scroll boost

export default function LogoCarousel({ logos }: { logos?: string[] } = {}) {
  const LOGOS = logos?.length ? logos : DEFAULT_LOGOS
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const originalItems = Array.from(track.children) as HTMLElement[]
    if (originalItems.length === 0) return

    // Duplicate the original set once so the visible viewport is always covered
    // by either set 1 or set 2 — the wrap point is invisible.
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
      // Distance from start of set 1 to start of set 2 = N item widths + N gaps
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
    <section className="logo-carousel">
      <div className="logo-carousel-wrapper">
        <div className="carousel-header">
          <h2 className="h4 amp-mask logo-carousel__h4">
            Reaching Over 17.1 million Malaysians across diverse segments
          </h2>
        </div>

        <div className="carousel-container" ref={containerRef}>
          <div className="carousel-track" ref={trackRef}>
            {LOGOS.map((src, i) => (
              <div className="carousel-item" key={`${src}-${i}`}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
