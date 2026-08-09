'use client'

import { useEffect, useRef, useState } from 'react'
import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import '@splidejs/splide/css/core'

export type AwardSlide = { src: string; name: string }

// Cursor-following label tuning — mirrors the hero cylinder label so the two
// hover interactions feel identical across the site.
const LABEL_OFFSET_X = 18
const LABEL_OFFSET_Y = 18
const LABEL_FOLLOW_EASE = 0.18

type Props = { slides: AwardSlide[] }

export default function AwardsSlider({ slides }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [hoveredName, setHoveredName] = useState<string | null>(null)
  // Keep the last hovered name mounted while the label eases out, so the text
  // doesn't blank mid-transition (same trick as the hero cylinder label).
  const [stickyLabel, setStickyLabel] = useState(slides[0]?.name ?? '')

  const setHoveredNameRef = useRef(setHoveredName)
  setHoveredNameRef.current = setHoveredName

  useEffect(() => {
    if (hoveredName) setStickyLabel(hoveredName)
  }, [hoveredName])

  // Horizontal auto-scrolling marquee — constant speed, pauses on hover.
  useEffect(() => {
    if (!ref.current || !slides.length) return

    const isDesktop = window.matchMedia('(min-width: 769px)').matches

    const splide = new Splide(ref.current, {
      type: 'loop', // infinite continuous scroll
      direction: 'ltr',
      fixedWidth: isDesktop ? '14vw' : '44vw',
      gap: isDesktop ? '2vw' : '4vw',
      focus: 'center',
      arrows: false,
      pagination: false,
      drag: true,
      autoScroll: {
        speed: isDesktop ? 0.8 : 0.6,
        pauseOnHover: true,
        pauseOnFocus: false,
        rewind: false,
      },
    })

    splide.on('mounted', () => {
      // Splide clones slides for the loop, so React's per-slide handlers won't
      // fire on the clones. Attach hover listeners to every DOM item and map
      // back to the real slide index (same approach as the works slider).
      const list = splide.Components.Elements.list
      const items = Array.from(list.children)
      const leadingClones = (items.length - slides.length) / 2
      const realIndex = (domIndex: number) =>
        (((domIndex - leadingClones) % slides.length) + slides.length) % slides.length

      items.forEach((item, domIndex) => {
        item.addEventListener('mouseenter', () =>
          setHoveredNameRef.current(slides[realIndex(domIndex)]?.name ?? null),
        )
      })
      list.addEventListener('mouseleave', () => setHoveredNameRef.current(null))
    })

    splide.mount({ AutoScroll })
    return () => {
      splide.destroy()
    }
  }, [slides])

  // The label eases toward the cursor every frame — copied from the hero
  // cylinder so the motion matches exactly.
  useEffect(() => {
    const wrapper = wrapperRef.current
    const label = labelRef.current
    if (!wrapper || !label) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let primed = false
    let rafId = 0

    const handleMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      targetX = e.clientX - rect.left + LABEL_OFFSET_X
      targetY = e.clientY - rect.top + LABEL_OFFSET_Y
      if (!primed) {
        currentX = targetX
        currentY = targetY
        primed = true
      }
    }

    const tick = () => {
      currentX += (targetX - currentX) * LABEL_FOLLOW_EASE
      currentY += (targetY - currentY) * LABEL_FOLLOW_EASE
      label.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove)
    rafId = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="awards-slider-wrapper">
      <div className="splide awards-slider" ref={ref}>
        <div className="splide__track">
          <ul className="splide__list">
            {slides.map((slide, i) => (
              <li className="splide__slide awards-slider__slide" key={i}>
                <img className="awards-slider__img" src={slide.src} alt={slide.name} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        ref={labelRef}
        className={`cylinder-hover-label${hoveredName !== null ? ' is-visible' : ''}`}
      >
        <span className="body cylinder-hover-label__brand">
          <span>{stickyLabel}</span>
        </span>
      </div>
    </div>
  )
}
