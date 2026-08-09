'use client'

import { useScrollJoin } from '@/lib/useScrollJoin'

/**
 * Our Story — section 2: "What makes us different".
 * Title (.h2) matches the homepage section headings (Services/Projects): the two
 * halves slide together on scroll (useScrollJoin) and the highlight word sits in
 * the global .text-highlight serif box. Below it, four red cards each with a
 * .h3 title and a .body paragraph.
 *
 * Content is hardcoded (DEFAULT_* pattern). Copy was transcribed from the design
 * screenshot — confirm exact wording.
 */

type Card = { title: string; body: string }

// NOTE: transcribed from the screenshot — please confirm exact copy.
const DEFAULT_CARDS: Card[] = [
  {
    title: 'BACKED BY JOURNALISTS AND MEDIA',
    body: 'OUR TEAM INCLUDES EXPERIENCED JOURNALISTS, AND WE WORK ACROSS THE WIDER MEDIA LANDSCAPE — STAR MEDIA GROUP’S OWN ECOSYSTEM AND PARTNERS BEYOND IT. THAT GIVES OUR WORK EDITORIAL CREDIBILITY AND GENUINE REACH: THE ABILITY TO SHAPE A STORY AND PUT IT IN FRONT OF THE RIGHT AUDIENCE, NOT JUST PRODUCE CONTENT AND HOPE IT LANDS.',
  },
  {
    title: 'DATA-CENTRIC BY DEFAULT',
    body: 'EVERY ENGAGEMENT STARTS WITH EVIDENCE, NOT ASSUMPTIONS. WE DRAW ON DATA ANALYTICS — AUDIENCE INSIGHTS, MEDIA DATA, AND RESEARCH — TO READ WHAT’S RESONATING AND HOW PERCEPTIONS ARE SHIFTING, SO DECISIONS ARE GROUNDED IN REAL INTELLIGENCE, NOT GUESSWORK.',
  },
  {
    title: 'SUBJECT-MATTER EXPERTISE',
    body: 'WE GO DEEP ON THE ISSUES DEFINING BUSINESS AND SOCIETY — FROM SUSTAINABILITY AND ESG TO NATION-BUILDING, YOUTH ENGAGEMENT, EDUCATION, INNOVATION, AND ECONOMIC DEVELOPMENT. THIS LETS ORGANISATIONS TAKE A CREDIBLE POSITION IN IMPORTANT DEBATES, RATHER THAN COMMENT FROM THE SIDELINES.',
  },
  {
    title: 'ONE TEAM, END TO END',
    body: 'THE SAME TEAM TAKES A PROJECT FROM INSIGHT TO EXECUTION — RESEARCH, STRATEGY, CONTENT AND VIDEO PRODUCTION, MEDIA AMPLIFICATION, YOUTH & SOCIAL IMPACT PROGRAMMES, AND EXPERIENTIAL ACTIVATION, ALL UNDER ONE STRATEGY. STORYTELLING AND DELIVERY STAY CONNECTED FROM START TO FINISH, WITH ONE ACCOUNTABLE TEAM BEHIND EVERY STAGE.',
  },
]

type OurDifferenceProps = {
  cards?: Card[]
  titlePre?: string
  titleHighlight?: string
}

export default function OurDifference({
  cards,
  titlePre = 'WHAT MAKES US',
  titleHighlight = 'DIFFERENT',
}: OurDifferenceProps = {}) {
  const CARDS = cards?.length ? cards : DEFAULT_CARDS
  const { headingRef, beforeRef, afterRef } = useScrollJoin<HTMLHeadingElement, HTMLSpanElement>()

  return (
    <section className="our-difference">
      <h2 ref={headingRef} className="h2 our-difference__title">
        <span ref={beforeRef} className="our-difference__word">{titlePre}</span>{' '}
        <span ref={afterRef} className="our-difference__word text-highlight">{titleHighlight}</span>
      </h2>

      <div className="our-difference__cards">
        {CARDS.map((card) => (
          <article className="our-difference__card" key={card.title}>
            <h3 className="h3 our-difference__card-title">{card.title}</h3>
            <p className="body our-difference__card-body">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
