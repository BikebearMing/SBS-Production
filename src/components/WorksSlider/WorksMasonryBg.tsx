// Decorative backdrop for the works page — a masonry collage of the works'
// own images, rendered B&W at low opacity under a black radial vignette
// (same recipe as the homepage projects background). Each column drifts
// vertically on a slow CSS loop, so its tiles are rendered twice — the
// animation translates by exactly one copy's height and wraps seamlessly.
const COLUMN_COUNT = 4
const TILES_PER_COLUMN = 8

// Aspect variants cycle per tile so the columns stagger like a real masonry.
// Assigned in JS (not :nth-child) so both copies get identical heights.
const RATIO_VARIANTS = [
  'works-bg__img--landscape',
  'works-bg__img--square',
  'works-bg__img--portrait',
  'works-bg__img--wide',
]

type Props = {
  images: string[]
}

export default function WorksMasonryBg({ images }: Props) {
  if (!images.length) return null
  // Offset each column's rotation through the image list so rows don't align.
  const columns = Array.from({ length: COLUMN_COUNT }, (_, c) =>
    Array.from({ length: TILES_PER_COLUMN }, (_, i) => ({
      src: images[(c * 5 + i) % images.length],
      variant: RATIO_VARIANTS[(c + i) % RATIO_VARIANTS.length],
    })),
  )

  return (
    <div className="works-bg" aria-hidden="true">
      <div className="works-bg__grid">
        {columns.map((tiles, c) => (
          <div className="works-bg__col" key={c}>
            {[0, 1].map((copy) =>
              tiles.map((t, i) => (
                <img
                  className={`works-bg__img ${t.variant}`}
                  src={t.src}
                  alt=""
                  key={`${copy}-${i}`}
                />
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
