'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

export type PillarItem = { label: string; copy: string }

const DEFAULT_PILLARS: PillarItem[] = [
  {
    label: 'CREDIBILITY',
    copy: 'We bring editorial authority to your brand, built on decades of trusted journalism. Our newsroom experience shapes how we research, question, and craft stories with clarity and integrity.',
  },
  {
    label: 'TRUSTED IMPACT',
    copy: 'Where credibility meets creativity. We don’t just tell stories—we deliver content that informs, engages, and moves audiences to action.',
  },
  {
    label: 'AUDIENCE-CENTRIC\nCREATIVITY',
    copy: 'Creativity grounded in data, culture, and human insight. We combine audience understanding with multimedia storytelling to produce content that captures attention and builds trust.',
  },
]

const DURATION = 0.7
const STAGGER = 0.06
const EASE = 'power3.out'

export default function Pillars({ items }: { items?: PillarItem[] } = {}) {
  const PILLARS = items?.length ? items : DEFAULT_PILLARS
  const listRef = useRef<HTMLUListElement>(null)
  const innersRef = useRef<HTMLElement[][]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const copies = Array.from(list.querySelectorAll<HTMLElement>('.pillar__copy-inner'))
    const splits = copies.map((el) => new SplitText(el, { type: 'lines', linesClass: 'line' }))

    const groups: HTMLElement[][] = splits.map((split) =>
      split.lines.map((line) => {
        const inner = document.createElement('span')
        inner.className = 'line-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
        return inner
      })
    )
    innersRef.current = groups

    groups.forEach((inners, i) => {
      gsap.set(inners, { yPercent: i === 0 ? 0 : 110 })
    })

    return () => {
      splits.forEach((s) => s.revert())
    }
  }, [])

  // Mobile: hover/tap discovery doesn't work — reveal each pillar (label
  // opacity + copy mask-up) once it scrolls into view, like the Our Story
  // page's enter-viewport reveals. Desktop keeps the hover behaviour.
  useEffect(() => {
    if (!window.matchMedia('(max-width: 768px)').matches) return
    const list = listRef.current
    if (!list) return
    const items = Array.from(list.querySelectorAll<HTMLElement>('.pillar'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          const inners = innersRef.current[items.indexOf(entry.target as HTMLElement)]
          if (inners?.length) {
            gsap.to(inners, { yPercent: 0, duration: DURATION, stagger: STAGGER, ease: EASE })
          }
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.35 }
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Mobile reveals are scroll-driven (above); the tap-follows-active swap
    // would re-hide already-revealed pillars.
    if (window.matchMedia('(max-width: 768px)').matches) return
    innersRef.current.forEach((inners, i) => {
      gsap.to(inners, {
        yPercent: i === active ? 0 : 110,
        duration: DURATION,
        stagger: STAGGER,
        ease: EASE,
        overwrite: 'auto',
      })
    })
  }, [active])

  return (
    <ul className="pillars" ref={listRef} onMouseLeave={() => setActive(0)}>
      {PILLARS.map((p, i) => (
        <li
          key={p.label}
          className={`pillar${i === active ? ' is-active' : ''}`}
          onMouseEnter={() => setActive(i)}
        >
          <span className="h1 pillar__label">{p.label}</span>
          <span className="pillar__line" aria-hidden="true"></span>
          <p className="body pillar__copy">
            <span className="pillar__copy-inner">{p.copy}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}
