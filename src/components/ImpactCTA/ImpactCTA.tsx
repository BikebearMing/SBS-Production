import { Fragment } from 'react'
import ImageTrail from './ImageTrail'
import ImpactCursor from './ImpactCursor'

// Fallbacks used when the CMS block is empty/unavailable. Swap these out for
// your own assets, or upload trail images in the admin (Impact CTA block).
const DEFAULT_TRAIL_IMAGES = [
  'https://picsum.photos/seed/sb-impact-1/600/400',
  'https://picsum.photos/seed/sb-impact-2/600/400',
  'https://picsum.photos/seed/sb-impact-3/600/400',
  'https://picsum.photos/seed/sb-impact-4/600/400',
  'https://picsum.photos/seed/sb-impact-5/600/400',
  'https://picsum.photos/seed/sb-impact-6/600/400',
  'https://picsum.photos/seed/sb-impact-7/600/400',
  'https://picsum.photos/seed/sb-impact-8/600/400',
]

const DEFAULT_HEADING_TOP = 'LET’S'
const DEFAULT_COPY = 'TOGETHER, WE’LL BUILD SOMETHING\nWORTH TALKING ABOUT.'
const DEFAULT_IMPACT_WORD = 'CONNECT'

export type ImpactCTAProps = {
  headingTop?: string
  copy?: string
  impactWord?: string
  images?: string[]
}

export default function ImpactCTA({
  headingTop,
  copy,
  impactWord,
  images,
}: ImpactCTAProps = {}) {
  const trail = images?.length ? images : DEFAULT_TRAIL_IMAGES
  const heading = headingTop ?? DEFAULT_HEADING_TOP
  const copyText = copy ?? DEFAULT_COPY
  const word = impactWord ?? DEFAULT_IMPACT_WORD
  const copyLines = copyText.split('\n')

  return (
    <section className="impact-cta">
      <ImpactCursor />
      <ImageTrail items={trail} variant={1} threshold={80} />
      <div className="impact-cta__inner">
        <div className="impact-cta__top">
          <h2 className="h1-v2-sm amp-mask impact-cta__heading">{heading}</h2>
          <p className="body">
            {copyLines.map((line, i) => (
              <Fragment key={i}>
                {line}
                {i < copyLines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        </div>
        <div className="impact-cta__bottom">
          <span className="h1-v2-sm impact-cta__impact">{word}</span>
        </div>
      </div>
    </section>
  )
}
