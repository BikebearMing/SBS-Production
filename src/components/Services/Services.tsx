'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useScrollJoin } from '@/lib/useScrollJoin'

gsap.registerPlugin(SplitText)

export type ServiceItem = { title: string; copy: string }

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: 'INTEGRATED MARKETING & CREATIVE STRATEGY',
    copy: 'By connecting strategy, storytelling, and media across platforms, we create campaigns that reach the right audiences and deliver results for your brand.',
  },
  {
    title: 'EDITORIAL STORYTELLING',
    copy: 'We craft narratives with the discipline of journalism and the impact of great creative.',
  },
  {
    title: 'YOUTH & SOCIAL IMPACT PROGRAMME',
    copy: 'We design programmes that engage young audiences around causes that matter through meaningful partnerships.',
  },
  {
    title: 'SOCIAL MEDIA & INFLUENCER ENGAGEMENT',
    copy: 'We manage always-on presence and hand-picked creator partnerships as a single integrated system \u2014 brand voice, community, and earned attention in lockstep.',
  },
  {
    title: 'DIGITAL EXPERIENCES',
    copy: 'Websites, apps, interactive campaigns. We design and build digital products that carry the same narrative discipline as editorial work.',
  },
  {
    title: 'MEDIA STRATEGY & BUYING',
    copy: 'Data-led planning across paid, owned and earned \u2014 designed to put the right message in front of the right people at the moment it matters.',
  },
]

const REVEAL_DURATION = 0.6
const REVEAL_DELAY = 0.55
const REVEAL_STAGGER = 0.06

export default function Services({ items }: { items?: ServiceItem[] } = {}) {
  const SERVICES = items?.length ? items : DEFAULT_SERVICES
  const listRef = useRef<HTMLUListElement>(null)
  const innersRef = useRef<HTMLElement[][]>([])
  const [active, setActive] = useState<number | null>(null)
  const prevActiveRef = useRef<number | null>(null)
  const { headingRef, beforeRef, afterRef } = useScrollJoin<HTMLHeadingElement, HTMLSpanElement>()

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const copies = Array.from(list.querySelectorAll<HTMLElement>('.service__copy-inner'))
    const splits = copies.map((el) => new SplitText(el, { type: 'lines', linesClass: 'line' }))

    innersRef.current = splits.map((split) =>
      split.lines.map((line) => {
        const inner = document.createElement('span')
        inner.className = 'line-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
        return inner
      })
    )

    innersRef.current.forEach((inners) => gsap.set(inners, { yPercent: 110 }))

    const items = Array.from(list.querySelectorAll<HTMLElement>('.service'))
    gsap.set(items, { x: '-6vw', opacity: 0 })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = items.indexOf(entry.target as HTMLElement)
          gsap.to(entry.target, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: idx * 0.06,
          })
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.2 }
    )
    items.forEach((item) => observer.observe(item))

    return () => {
      observer.disconnect()
      splits.forEach((s) => s.revert())
    }
  }, [])

  useEffect(() => {
    const prev = prevActiveRef.current
    if (prev !== null && prev !== active) {
      const prevInners = innersRef.current[prev]
      if (prevInners) {
        gsap.to(prevInners, {
          yPercent: 110,
          duration: 0.25,
          ease: 'power2.in',
          overwrite: 'auto',
        })
      }
    }
    if (active !== null) {
      const inners = innersRef.current[active]
      if (inners) {
        gsap.fromTo(
          inners,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: REVEAL_DURATION,
            stagger: REVEAL_STAGGER,
            ease: 'power3.out',
            delay: REVEAL_DELAY,
            overwrite: 'auto',
          }
        )
      }
    }
    prevActiveRef.current = active
  }, [active])

  const toggle = (i: number) => setActive((prev) => (prev === i ? null : i))

  return (
    <>
      <div className="services-heading">
        <h2 ref={headingRef} className="h1 amplitude dark services-heading__title">
          <span ref={beforeRef} className="services-heading__word">FULL-FLEDGED</span>{' '}
          <span ref={afterRef} className="services-heading__word text-highlight">SERVICES</span>
        </h2>
      </div>

      <ul className="services-list" ref={listRef}>
        {SERVICES.map((s, i) => {
          const isOpen = active === i
          const indexLabel = String(i + 1).padStart(2, '0')
          return (
            <li
              key={s.title}
              className={`service${isOpen ? ' is-open' : ''}`}
              onMouseEnter={() => setActive(i)}
            >
              <button className="service__row" type="button" onClick={() => toggle(i)} aria-expanded={isOpen}>
                <span className="body service__index">{indexLabel}</span>
                <h3 className="h3 amp-mask service__title">{s.title}</h3>
                <div className="service__copy-slot">
                  <div className="service__copy-content">
                    <p className="body service__copy">
                      <span className="service__copy-inner">{s.copy}</span>
                    </p>
                  </div>
                </div>
                <span className="service__toggle" aria-hidden="true">
                  <svg className="service__toggle-icon service__toggle-icon--plus" viewBox="0 0 24 24" fill="none">
                    <path d="M 12 5 L 12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    <path d="M 5 12 L 19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                  <svg className="service__toggle-icon service__toggle-icon--arrow" viewBox="0 0 24 24" fill="none">
                    <path d="M 17 7 L 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    <path d="M 9 7 L 17 7 L 17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
