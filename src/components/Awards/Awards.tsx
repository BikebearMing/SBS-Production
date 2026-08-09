'use client'

import { Fragment } from 'react'

import AwardsSlider, { type AwardSlide } from './AwardsSlider'
import { useScrollJoin } from '@/lib/useScrollJoin'

export type AwardImage = AwardSlide

const DEFAULT_AWARDS: AwardSlide[] = [
  { src: '/award1.png', name: 'AWARD' },
  { src: '/award2.png', name: 'AWARD' },
  { src: '/award3.png', name: 'AWARD' },
  { src: '/award4.png', name: 'AWARD' },
  { src: '/award5.png', name: 'AWARD' },
]

const DEFAULT_CAPTION = 'AWARD-WINNING IDEAS \nGROUNDED IN GOOD\nSTORYTELLING'

type AwardsProps = {
  title?: string
  buttonLabel?: string
  caption?: string
  recognitions?: string
  items?: AwardSlide[]
}

export default function Awards({
  title = 'AWARDS',
  buttonLabel = 'VIEW ALL AWARDS',
  caption = DEFAULT_CAPTION,
  recognitions = '& RECOGNITIONS',
  items,
}: AwardsProps = {}) {
  const AWARDS = items?.length ? items : DEFAULT_AWARDS
  const captionLines = caption.split('\n')
  // Scroll-scrubbed converge — same as the Projects heading: the title slides
  // in from the left and "& RECOGNITIONS" from the right as the section rises.
  const { headingRef, beforeRef, afterRef } = useScrollJoin<HTMLDivElement, HTMLHeadingElement>()

  return (
    <section className="awards">
      <div className="awards__inner">
        <div className="awards__heading" ref={headingRef}>
          <div className="awards__heading-top">
            <h2 ref={beforeRef} className="h1 awards__title">
              <span className="text-highlight">{title}</span>
            </h2>
            <a href="/awards" className="custom-button awards__button">
              <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                <circle className="ring ring--inner" cx="12" cy="12" r="3" />
              </svg>
              <span>{buttonLabel}</span>
            </a>
          </div>
          <div className="awards__heading-bottom">
            <p className="body awards__caption">
              {/* The space before each <br> is invisible on desktop but keeps
                  the words apart on mobile, where the breaks are display:none
                  so the caption flows across the whole row. */}
              {captionLines.map((line, i) => (
                <Fragment key={i}>
                  {line}
                  {i < captionLines.length - 1 && <> <br /></>}
                </Fragment>
              ))}
            </p>
            <h3 ref={afterRef} className="h1 amplitude awards__rec">{recognitions}</h3>
          </div>
        </div>

        <AwardsSlider slides={AWARDS} />
      </div>
    </section>
  )
}
