'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { isWipeInFlight, onWipeReveal } from '@/components/PageTransition/PageTransition'

export type AwardEntry = {
  /** Admin-only label; not rendered on the site. */
  label?: string
  /** Middle column (show title + category bullets), pre-rendered to HTML on the server. */
  middleHtml?: string
  /** Right column (campaign), pre-rendered to HTML on the server. */
  rightHtml?: string
  awardImage?: string
  groupPhoto?: string
}

export type AwardYear = {
  year: string
  entries: AwardEntry[]
}

type Props = {
  eyebrow?: string
  heading?: string
  recognitions?: string
  years?: AwardYear[]
}

// Mirrors the seeded Awards Page so the route always renders, even with no DB.
const DEFAULT_GROUPS: AwardYear[] = [
  {
    year: '2026',
    entries: [
      {
        middleHtml:
          '<p><strong>Wan-Ifra Digital Media Awards Asia 2026</strong></p><ul><li>Best Marketing Campaign for a News Brand - SILVER</li></ul>',
        rightHtml:
          '<p>Campaign: Powering The Future in partnership with Tenaga Nasional Berhad</p>',
      },
    ],
  },
  {
    year: '2025',
    entries: [
      {
        middleHtml:
          '<p><strong>MDA d-Awards 2025</strong></p><ul><li>Digital Publisher Of The Year - SILVER</li></ul>',
        rightHtml: '<p>The Star ESG: Bridging ESG Knowledge Into Action</p>',
      },
      {
        middleHtml:
          '<p><strong>Waste Management Association of Malaysia (WMAM)</strong></p><ul><li>Green Journalism Award</li></ul>',
        rightHtml: '<p>The Star ESG Publication</p>',
      },
    ],
  },
  {
    year: '2024',
    entries: [
      {
        middleHtml:
          '<p><strong>Wan-Ifra Digital Media Awards Asia 2024</strong></p><ul><li>Best Use of AI in Revenue Strategy - SILVER</li></ul>',
        rightHtml:
          '<p>Campaign: #JomSapot BeliLokal Gen AI- Led Integrated Marketing Campaign</p>',
      },
      {
        middleHtml:
          '<p><strong>MDA d-Awards 2024</strong></p><ul><li>Best B2B Marketing Campaign - SILVER</li><li>Best Use of Digital Marketing Innovation - SILVER</li></ul>',
        rightHtml:
          '<p>Campaign: #JomSapot BeliLokal Gen AI- Led Integrated Marketing Campaign</p>',
      },
      {
        middleHtml:
          '<p><strong>PMAA Dragons of Asia 2024</strong></p><ul><li>Best Digital Campaign 2024 - BRONZE</li></ul>',
        rightHtml:
          '<p>Campaign: #JomSapot BeliLokal Gen AI- Led Integrated Marketing Campaign</p>',
      },
      {
        middleHtml:
          '<p><strong>PMAA Dragons of Malaysia 2024</strong></p><ul><li>Best Digital Campaign 2024 - GOLD</li></ul>',
        rightHtml:
          '<p>Campaign: #JomSapot BeliLokal Gen AI- Led Integrated Marketing Campaign</p>',
      },
    ],
  },
  {
    year: '2023',
    entries: [
      {
        middleHtml:
          '<p><strong>WAN-IFRA Digital Media Awards Asia 2023</strong></p><ul><li>Best Native Advertising/Sponsored Content Campaign - GOLD</li></ul>',
        rightHtml:
          '<p>Campaign: Sime Darby Property – Elmina Rainforest Knowledge Centre (ERKC) Sustainability Campaign</p>',
      },
    ],
  },
]

const DEFAULT_EYEBROW = 'AWARDS'
const DEFAULT_RECOGNITIONS = '& RECOGNITIONS'

// Scroll-in reveal of the award rows. The row cells are rich HTML (<p>/<ul>),
// which SplitText line-masking can't split — so the cells fade + rise as
// whole blocks instead (MaskUpHeadings excludes them).
const ROW_DURATION = 0.8
const ROW_STAGGER = 0.08 // between the two cells of a row
const ROW_EASE = 'power3.out'
const ROW_Y = 26 // px each cell rises from
// Matches MaskUpHeadings: after a wipe navigation, hold the reveal until the
// red panel starts lifting, plus this beat.
const WIPE_TEXT_DELAY_MS = 600

export default function AwardsPage({ eyebrow, recognitions, years }: Props) {
  const GROUPS = years?.length ? years : DEFAULT_GROUPS
  // Active row, scoped per group so each year shows its own image. Desktop:
  // set on hover (image in the shared media box). Touch: toggled by tap
  // (image expands accordion-style inside the row — see the mobile CSS).
  const [active, setActive] = useState<{ g: number; r: number } | null>(null)
  const [hoverable, setHoverable] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)

  // Reveal each row's text cells as the row scrolls into view. Cells are
  // hidden from JS (not CSS) so the page renders normally without it, and
  // clearProps removes every transient style once a row has revealed.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const rows = Array.from(list.querySelectorAll<HTMLElement>('.awards-page__row'))
    if (!rows.length) return
    const cellsOf = (row: HTMLElement) =>
      row.querySelectorAll<HTMLElement>('.awards-page__middle, .awards-page__right')

    rows.forEach((row) => gsap.set(cellsOf(row), { autoAlpha: 0, y: ROW_Y }))

    let cancelled = false
    let unsubWipe: (() => void) | null = null
    let wipeTimer: ReturnType<typeof setTimeout> | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          gsap.to(cellsOf(entry.target as HTMLElement), {
            autoAlpha: 1,
            y: 0,
            duration: ROW_DURATION,
            stagger: ROW_STAGGER,
            ease: ROW_EASE,
            clearProps: 'all',
          })
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15 },
    )

    const arm = () => {
      if (cancelled) return
      rows.forEach((row) => observer.observe(row))
    }

    if (isWipeInFlight()) {
      // Mounted behind the red wipe panel — hold the reveal until the panel
      // starts lifting, plus a beat, so it happens where the user can see it.
      unsubWipe = onWipeReveal(() => {
        wipeTimer = setTimeout(arm, WIPE_TEXT_DELAY_MS)
      })
    } else {
      arm()
    }

    return () => {
      cancelled = true
      unsubWipe?.()
      if (wipeTimer) clearTimeout(wipeTimer)
      observer.disconnect()
      rows.forEach((row) => {
        const cells = cellsOf(row)
        gsap.killTweensOf(cells)
        gsap.set(cells, { clearProps: 'all' })
      })
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)')
    const apply = () => setHoverable(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const title = eyebrow ?? DEFAULT_EYEBROW

  return (
    <section className="awards-page">
      <div className="awards-page__head">
        <nav className="body breadcrumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> / <span>{title}</span>
        </nav>
        {/* Banner mirrors the home "Awards & Recognition" strip: the caption
            shares the bottom row with the giant "& RECOGNITIONS" line. */}
        <div className="awards-page__banner">
          <h1 className="h1 awards-page__title">
            <span className="text-highlight">{title}</span>
          </h1>
          <div className="awards-page__banner-bottom">
            <p className="body awards-page__caption">
              Award-winning ideas, grounded in the craft of storytelling.
            </p>
            <p className="h1 amplitude amp-mask awards-page__rec">
              {recognitions ?? DEFAULT_RECOGNITIONS}
            </p>
          </div>
        </div>
      </div>

      <div className="awards-page__list" ref={listRef}>
        {GROUPS.map((group, g) => {
          const activeEntry = active?.g === g ? group.entries[active.r] : undefined
          return (
            <div className="awards-page__group" key={`${group.year}-${g}`}>
              <p className="body">{group.year}</p>

              <div className="awards-page__media" aria-hidden="true">
                {activeEntry?.groupPhoto && (
                  <img className="awards-page__media-img" src={activeEntry.groupPhoto} alt="" />
                )}
              </div>

              <ul className="awards-page__rows">
                {group.entries.map((entry, r) => (
                  <li
                    key={r}
                    className={`awards-page__row${
                      active?.g === g && active?.r === r ? ' is-active' : ''
                    }`}
                    onMouseEnter={() => hoverable && setActive({ g, r })}
                    onMouseLeave={() => hoverable && setActive(null)}
                    onClick={() =>
                      !hoverable &&
                      setActive(active?.g === g && active?.r === r ? null : { g, r })
                    }
                  >
                    <div
                      className="body awards-page__middle"
                      dangerouslySetInnerHTML={{ __html: entry.middleHtml ?? '' }}
                    />
                    <div
                      className="body awards-page__right"
                      dangerouslySetInnerHTML={{ __html: entry.rightHtml ?? '' }}
                    />
                    {entry.groupPhoto && (
                      <div className="awards-page__row-media" aria-hidden="true">
                        <img src={entry.groupPhoto} alt="" />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
