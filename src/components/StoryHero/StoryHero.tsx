'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Our Story — top hero.
 * Heading (.h1) reveals with the homepage's line mask-up (each line is a
 * `.line` with overflow:hidden and a `.line-inner` that slides up from
 * yPercent 110 — same duration / stagger / ease as the hero). The full-width
 * image sits at the bottom of the section in its natural spot; at the top of
 * the page it's scaled down and lifted up, and as the section scrolls through
 * it settles back to full size / full width.
 */

// Hero reveal timings, copied from the homepage hero.
const LINE_DURATION = 0.9
const LINE_STAGGER = 0.12
const TYPE_DURATION = 0.8

// Placeholder still — swap for the real production image.
const DEFAULT_IMAGE = '/works/rhb-masthead.jpg'
const DEFAULT_LINE1 = 'WE TELL STORIES'
const DEFAULT_LINE2 = 'FOR A LIVING.'
const DEFAULT_HIGHLIGHT = 'THIS ONE’S OURS.'

// Initial (scroll = 0) transform of the image: scaled down, nudged right + up.
// Eyeballed from the design — easy to tune.
const START_SCALE = 0.42
const START_X = 0 // vw, rightward (0 = centred)
const START_Y = -44 // vw, upward

type Props = {
  image?: string
  line1?: string
  line2?: string
  highlight?: string
}

export default function StoryHero({
  image = DEFAULT_IMAGE,
  line1 = DEFAULT_LINE1,
  line2 = DEFAULT_LINE2,
  highlight = DEFAULT_HIGHLIGHT,
}: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  // Heading reveal — copied from the homepage hero: the plain lines mask-up,
  // then the highlighted phrase reveals with the homepage typewriter
  // (clip-path eased with steps()). Runs on load (section is at the top).
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    // No hero animation on mobile — leave the heading static (CSS reveals the
    // typewriter there). See the max-width: 768px block in globals.css.
    if (window.innerWidth <= 768) return
    const lineInners = Array.from(
      section.querySelectorAll<HTMLElement>('.story-hero__title .line-inner'),
    )
    const typewriter = section.querySelector<HTMLElement>('.story-hero__title .typewriter')

    gsap.set(lineInners, { yPercent: 110 })
    if (typewriter) gsap.set(typewriter, { clipPath: 'inset(0 100% 0 0)' })

    const tl = gsap.timeline({ delay: 0.2 })
    tl.to(lineInners, {
      yPercent: 0,
      duration: LINE_DURATION,
      stagger: LINE_STAGGER,
      ease: 'power3.out',
    })
    if (typewriter) {
      tl.to(
        typewriter,
        { clipPath: 'inset(0 0% 0 0)', duration: TYPE_DURATION, ease: 'steps(5)' },
        '-=0.15',
      )
    }
    return () => {
      tl.kill()
    }
  }, [])

  // Scroll-linked image transform.
  useEffect(() => {
    const section = sectionRef.current
    const media = mediaRef.current
    if (!section || !media) return
    // No scroll-grow on mobile — the image stays full-width at the bottom.
    if (window.innerWidth <= 768) return

    let rafId = 0
    let visible = true
    const clamp = (v: number) => Math.min(1, Math.max(0, v))

    const tick = () => {
      if (visible) {
        const rect = section.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        // 0 at the top of the section, 1 once it has scrolled fully through.
        const p = scrollable > 0 ? clamp(-rect.top / scrollable) : 1
        const scale = START_SCALE + (1 - START_SCALE) * p
        const tx = START_X * (1 - p)
        const ty = START_Y * (1 - p)
        media.style.transform = `translate(${tx}vw, ${ty}vw) scale(${scale})`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { rootMargin: '200px' },
    )
    io.observe(section)

    return () => {
      cancelAnimationFrame(rafId)
      io.disconnect()
    }
  }, [])

  return (
    <section className="story-hero" ref={sectionRef}>
      <nav className="body breadcrumb" aria-label="Breadcrumb">
        <a href="/">HOME</a> <span aria-hidden="true">/</span> <span>OUR STORY</span>
      </nav>
      <h1 className="h1 amplitude dark story-hero__title">
        <span className="story-hero__title-inner">
          <span className="line"><span className="line-inner">{line1}</span></span>
          <span className="line"><span className="line-inner">{line2}</span></span>
          <span className="typewriter text-highlight">{highlight}</span>
        </span>
      </h1>
      <div className="story-hero__media" ref={mediaRef}>
        <img src={image} alt="" />
      </div>
    </section>
  )
}
