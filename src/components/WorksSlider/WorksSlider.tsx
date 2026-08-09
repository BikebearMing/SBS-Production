'use client'

import { useEffect, useRef } from 'react'
import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import '@splidejs/splide/css/core'

export type WorksSlide = {
  image: string
  alt?: string
  title?: string
  description?: string
  tags?: string[]
  year?: string
  /** URL of this work's inner page. */
  href?: string
}

type Props = {
  slides?: WorksSlide[]
  /** Called with the active slide's (real) index whenever the slider moves. */
  onActiveChange?: (index: number) => void
  /** Desktop only: the hovered slide's (real) index, or null when nothing is hovered. */
  onHoverChange?: (index: number | null) => void
}

// Fallback so the page still renders a slider with an empty/unavailable CMS.
const DEFAULT_SLIDES: WorksSlide[] = [
  { image: '/media/placeholder.png' },
  { image: '/media/placeholder.png' },
  { image: '/media/placeholder.png' },
]

export default function WorksSlider({ slides, onActiveChange, onHoverChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const SLIDES = slides?.length ? slides : DEFAULT_SLIDES

  // Keep the latest callbacks in refs so they can change without re-mounting Splide.
  const onActiveChangeRef = useRef(onActiveChange)
  onActiveChangeRef.current = onActiveChange
  const onHoverChangeRef = useRef(onHoverChange)
  onHoverChangeRef.current = onHoverChange

  useEffect(() => {
    if (!ref.current) return

    // Desktop only: scroll continuously like a carousel. Mobile keeps the plain
    // drag/snap slider (no auto-scroll), so touch users drive it by hand.
    const isDesktop = window.matchMedia('(min-width: 769px)').matches

    const splide = new Splide(ref.current, {
      type: 'loop', // infinite loop
      // Desktop: a vertical (top-to-bottom) auto-scrolling carousel.
      // Mobile: a horizontal slider, centered slide focused with its neighbours
      // peeking (~30% of their width) so it reads as swipeable — see `padding`.
      direction: isDesktop ? 'ttb' : 'ltr',
      width: '100%',
      heightRatio: isDesktop ? 0.5 : 0.78,
      gap: isDesktop ? '2.2vw' : '4vw',
      perPage: 1,
      focus: 'center',
      // Mobile peek: shrink the active slide so the prev/next slides show on
      // either side, signalling the slider can be swiped. No effect on desktop.
      padding: isDesktop ? 0 : '18%',
      arrows: false,
      pagination: false,
      drag: true,
      // Constant-speed continuous scroll; pauses while the pointer is over the
      // slider and resumes after a drag. Dragging stays enabled (`drag` above).
      autoScroll: isDesktop
        ? { speed: 0.6, pauseOnHover: true, pauseOnFocus: false, rewind: false }
        : false,
    })

    // `moved` reports the active index already normalised to a real slide
    // (loop clones excluded), so the text panels can mirror it directly.
    splide.on('moved', (index) => onActiveChangeRef.current?.(index))
    splide.on('mounted', () => {
      onActiveChangeRef.current?.(splide.index)

      // Clicking a slide scrolls it into focus, using the slide's position within
      // the <ul> rather than Splide's own index. The list is laid out as
      // [head clones][real slides][tail clones] with equal clone counts on each
      // side, so the real index is `domIndex - leadingClones`. `go()` wraps that
      // back onto a real slide (it applies `(n + count) % count` in loop mode).
      const list = splide.Components.Elements.list
      const items = Array.from(list.children)
      const leadingClones = (items.length - SLIDES.length) / 2
      // Map any DOM slide (clone or real) back to its real data index.
      const realIndex = (domIndex: number) =>
        (((domIndex - leadingClones) % SLIDES.length) + SLIDES.length) % SLIDES.length

      items.forEach((item, domIndex) => {
        item.addEventListener('click', () => splide.go(domIndex - leadingClones))
        // Reveal this slide's details (desktop hover). Leaving is handled on the
        // list, not per-slide, so sliding between adjacent slides doesn't flicker.
        item.addEventListener('mouseenter', () => onHoverChangeRef.current?.(realIndex(domIndex)))
      })
      list.addEventListener('mouseleave', () => onHoverChangeRef.current?.(null))
    })

    splide.mount({ AutoScroll })
    return () => {
      splide.destroy()
    }
  }, [SLIDES.length])

  return (
    <div className="splide works-slider" ref={ref}>
      <div className="splide__track">
        <ul className="splide__list">
          {SLIDES.map((slide, i) => (
            <li className="splide__slide works-slider__slide cursor-target" key={i}>
              <img className="works-slider__img" src={slide.image} alt={slide.alt ?? ''} />
              <a
                className="custom-button works-slider__link"
                href={slide.href ?? '#'}
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                  <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                  <circle className="ring ring--inner" cx="12" cy="12" r="3" />
                </svg>
                <span>VIEW PROJECT</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
