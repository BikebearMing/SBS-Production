import { Fragment } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Media } from '@payload-types'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

// Editors paste bare URLs as plain text (no link node gets saved), so wrap
// them in real anchors at render time. Walks tag/text segments so it never
// touches tag attributes and never nests inside an editor-made <a>.
function linkifyHtml(html: string): string {
  let insideAnchor = false
  return html
    .split(/(<[^>]+>)/g)
    .map((seg) => {
      if (seg.startsWith('<')) {
        if (/^<a[\s>]/i.test(seg)) insideAnchor = true
        else if (/^<\/a>/i.test(seg)) insideAnchor = false
        return seg
      }
      if (insideAnchor || !seg) return seg
      // Trailing punctuation stays outside the link ("…future." → link + ".").
      return seg.replace(
        /https?:\/\/[^\s<]*[^\s<.,)\]!?;:]/g,
        (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
      )
    })
    .join('')
}

// "1h2m30s" | "90" → seconds, for YouTube's ?t= start parameter.
function parseStartSeconds(t: string): number {
  if (/^\d+$/.test(t)) return parseInt(t, 10)
  const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!m) return 0
  return parseInt(m[1] ?? '0', 10) * 3600 + parseInt(m[2] ?? '0', 10) * 60 + parseInt(m[3] ?? '0', 10)
}

// A native <video> can't play YouTube pages — turn any pasted YouTube link
// (watch / youtu.be / shorts / embed) into an embed URL for an <iframe>.
// Returns undefined for everything else (direct mp4/streamable links).
function youTubeEmbedUrl(url: string): string | undefined {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    let id: string | undefined
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0]
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v') ?? undefined
      else if (u.pathname.startsWith('/embed/') || u.pathname.startsWith('/shorts/'))
        id = u.pathname.split('/')[2]
    }
    if (!id) return undefined
    const params = new URLSearchParams({ rel: '0' })
    const t = u.searchParams.get('t') ?? u.searchParams.get('start')
    const start = t ? parseStartSeconds(t) : 0
    if (start) params.set('start', String(start))
    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
  } catch {
    return undefined
  }
}

async function getWorkData(slug: string) {
  try {
    const payload = await getPayload({ config })
    const [works, footer] = await Promise.all([
      payload.find({
        collection: 'works',
        where: { slug: { equals: slug } },
        depth: 1,
        limit: 1,
      }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
    ])
    return { work: works.docs[0], footer }
  } catch {
    // If Payload/DB is unavailable there's nothing to show for this work.
    return { work: undefined, footer: undefined }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { work } = await getWorkData(slug)
  const title = work?.title ?? 'Works'
  return {
    title: `${title} — Star Brand Studio`,
    description: work?.description ?? 'Selected works from Star Brand Studio.',
  }
}

export default async function WorkDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { work: slide, footer } = await getWorkData(slug)

  if (!slide) notFound()

  const footerProps = footer
    ? {
        address: footer.address ?? undefined,
        phones: footer.phones?.map((p) => p.number),
        directory: footer.directory?.map((d) => ({ label: d.label, href: d.href })),
        updatesLabel: footer.updatesLabel ?? undefined,
        showSocials: footer.showSocials ?? true,
        socials: footer.socials?.map((s) => ({
          label: s.label,
          href: s.href,
          icon: mediaUrl(s.icon),
        })),
        brandLogo: mediaUrl(footer.brandLogo),
        copyright: footer.copyright ?? undefined,
        email: footer.email ?? undefined,
      }
    : {}

  const image = mediaUrl(slide.image)
  const tags = slide.tags?.map((t) => t.label).filter((l): l is string => Boolean(l)) ?? []

  return (
    <main className="grain-effect">
      <Header />
      <section className="work-detail">
        <nav className="body breadcrumb work-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> / <Link href="/works">WORKS</Link> /{' '}
          <span>{slide.title ?? 'PROJECT'}</span>
        </nav>

        <div className="work-detail__head">
          {slide.title && <h1 className="h1-v2 dark work-detail__title">{slide.title}</h1>}
          <div className="work-detail__meta">
            {slide.year && <p className="body dark work-detail__year">{slide.year}</p>}
            {tags.length > 0 && (
              <div className="work-detail__tags">
                {tags.map((tag) => (
                  <p className="body dark work-detail__tag" key={tag}>
                    {tag}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {image && (
          <div className="work-detail__media">
            <img className="work-detail__img" src={image} alt={slide.title ?? ''} />
          </div>
        )}

        {/* Inner-page content blocks render in the editor-defined (draggable) order. */}
        {slide.content?.map((block, i) => {
          switch (block.blockType) {
            case 'textSection': {
              // WYSIWYG body takes priority; a state with no actual text (an
              // opened-then-emptied editor serializes to empty paragraphs)
              // falls back to the legacy plain-text body.
              const toHtml = (data: unknown) => {
                if (!data) return undefined
                const out = convertLexicalToHTML({
                  data: data as SerializedEditorState,
                  disableContainer: true,
                })
                return out.replace(/<[^>]*>/g, '').trim() ? linkifyHtml(out) : undefined
              }
              const html = toHtml(block.bodyRich)
              // Filled right column = manual two-column layout: the editor
              // controls exactly which lines sit in each column.
              const htmlRight = toHtml(block.bodyRichRight)
              if (!html && !htmlRight && !block.body) return null
              // Auto-flowing CSS columns stay as the fallback for existing
              // "Big Idea" content that has no manual right column.
              const isColumns = !htmlRight && /big idea/i.test(block.heading ?? '')
              const bodyClass = `body work-detail__section-body${
                isColumns ? ' work-detail__section-body--columns' : ''
              }`
              const left = html ? (
                <div className={bodyClass} dangerouslySetInnerHTML={{ __html: html }} />
              ) : block.body ? (
                <p className={bodyClass}>
                  {/* Render newlines from the textarea as real <br> — SplitText
                      (MaskUpHeadings) keeps them as line breaks; plain "\n" gets
                      torn out when the paragraph is re-split into animated lines. */}
                  {block.body.split('\n').map((line, j, arr) => (
                    <Fragment key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </Fragment>
                  ))}
                </p>
              ) : null
              return (
                <div className="work-detail__section" key={block.id ?? i}>
                  {block.heading && (
                    <p className="body work-detail__section-heading">{block.heading}</p>
                  )}
                  {htmlRight ? (
                    <div className="work-detail__section-cols">
                      {left}
                      <div
                        className="body work-detail__section-body"
                        dangerouslySetInnerHTML={{ __html: htmlRight }}
                      />
                    </div>
                  ) : (
                    left
                  )}
                </div>
              )
            }
            case 'twoImages': {
              const left = mediaUrl(block.left)
              const right = mediaUrl(block.right)
              if (!left && !right) return null
              return (
                <div className="work-detail__grid" key={block.id ?? i}>
                  {left && <img className="work-detail__grid-img" src={left} alt={slide.title ?? ''} />}
                  {right && <img className="work-detail__grid-img" src={right} alt={slide.title ?? ''} />}
                </div>
              )
            }
            case 'gallery': {
              const images =
                block.images?.flatMap((it) => {
                  const src = mediaUrl(it.image)
                  return src ? [src] : []
                }) ?? []
              if (!images.length) return null
              return (
                <div className="work-detail__gallery" key={block.id ?? i}>
                  {images.map((src, j) => (
                    <img className="work-detail__gallery-img" src={src} alt={slide.title ?? ''} key={j} />
                  ))}
                </div>
              )
            }
            case 'video': {
              if (!block.url) return null
              const embed = youTubeEmbedUrl(block.url)
              return (
                <div className="work-detail__media work-detail__video" key={block.id ?? i}>
                  {embed ? (
                    <iframe
                      className="work-detail__video-player"
                      src={embed}
                      title={slide.title ?? 'Video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="work-detail__video-player"
                      src={block.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      preload="metadata"
                    />
                  )}
                </div>
              )
            }
            case 'oneImage': {
              const src = mediaUrl(block.image)
              if (!src) return null
              return (
                <div className="work-detail__media work-detail__footer-media" key={block.id ?? i}>
                  <img className="work-detail__img" src={src} alt={slide.title ?? ''} />
                </div>
              )
            }
            default:
              return null
          }
        })}

        {/* Awards this campaign won — image with the award name underneath. */}
        {(slide.awards?.length ?? 0) > 0 && (
          <div className="work-detail__awards">
            <p className="body work-detail__section-heading">AWARDS</p>
            <div className="work-detail__awards-list">
              {slide.awards!.map((award, i) => {
                const src = mediaUrl(award.image)
                if (!src) return null
                return (
                  <div className="work-detail__award" key={award.id ?? i}>
                    <img className="work-detail__award-img" src={src} alt={award.name ?? ''} />
                    {award.name && <p className="body dark work-detail__award-name">{award.name}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      <Footer {...footerProps} />
    </main>
  )
}
