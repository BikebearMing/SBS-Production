'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import WorksSlider, { type WorksSlide } from './WorksSlider'
import WorksScrollStack from './WorksScrollStack'
import WorksMasonryBg from './WorksMasonryBg'

type Props = {
  slides?: WorksSlide[]
}

// Fallback so the page still renders with an empty/unavailable CMS.
const DEFAULT_SLIDES: WorksSlide[] = [
  {
    image: '/media/placeholder.png',
    title: 'GUCCI WALK YOUR WAY',
    year: '2025',
    description:
      'AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.',
    tags: ['FASHION', 'VIDEO PRODUCTION & MEDIA'],
  },
]

/**
 * Picks the works experience by viewport:
 *   • Desktop → scroll-driven vertical stack (WorksScrollStack).
 *   • Mobile  → the existing horizontal swipe slider (WorksSlider).
 *
 * `mode` starts as 'pre' on the server / first paint and resolves on mount, so
 * we never render the desktop pin during SSR (it needs measured DOM + Lenis).
 */
export default function WorksShowcase({ slides }: Props) {
  const SLIDES = slides?.length ? slides : DEFAULT_SLIDES
  const [mode, setMode] = useState<'pre' | 'desktop' | 'mobile'>('pre')

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)')
    const apply = () => setMode(mq.matches ? 'desktop' : 'mobile')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (mode === 'desktop') return <WorksScrollStack slides={SLIDES} />

  return <MobileWorks slides={SLIDES} />
}

/** Mobile / fallback layout: the centred slide drives the title + tags. */
function MobileWorks({ slides }: { slides: WorksSlide[] }) {
  const [active, setActive] = useState(0)
  const current = slides[active] ?? slides[0]

  return (
    <section className="works-page">
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

      <p className="body dark works-showcase__title">{current.title}</p>
      <WorksSlider slides={slides} onActiveChange={setActive} />
      <div className="works-showcase__detail">
        <p className="bodys dark works-showcase__year">{current.year}</p>
        <div className="works-showcase__detail-body">
          <div className="works-showcase__detail-text">
            <h4 className="dark works-showcase__campaign">{current.title}</h4>
            <p className="body dark works-showcase__description">{current.description}</p>
          </div>
          <div className="works-showcase__tags">
            {current.tags?.map((tag) => (
              <p className="body dark works-showcase__tag" key={tag}>
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile CTA: the per-slide overlay button is hidden on touch (see
          globals.css); this one sits below the carousel and points at the
          centered work. */}
      <a className="custom-button works-showcase__cta" href={current.href ?? '#'}>
        <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="ring ring--outer" cx="12" cy="12" r="11" />
          <circle className="ring ring--middle" cx="12" cy="12" r="7" />
          <circle className="ring ring--inner" cx="12" cy="12" r="3" />
        </svg>
        <span>VIEW PROJECT</span>
      </a>
    </section>
  )
}
