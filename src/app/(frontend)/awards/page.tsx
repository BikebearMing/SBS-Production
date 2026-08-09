import { readdirSync } from 'fs'
import path from 'path'

import { getPayload } from 'payload'
import config from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Media } from '@payload-types'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import AwardsPage, { type AwardYear } from '@/components/AwardsPage/AwardsPage'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Awards — Star Brand Studio',
  description: 'Award-winning ideas, grounded in the craft of storytelling.',
}

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

// Award images are also committed as static assets under `public/awards`. The
// Payload media volume on prod has dropped some of these files (group photos and
// every Sharp size-variant 500 there), so when a committed twin exists we serve
// that instead — it's baked into the build and never depends on the media volume.
// Genuine CMS-only uploads (no committed twin) keep their Payload URL.
const AWARDS_STATIC: Set<string> = (() => {
  try {
    return new Set(readdirSync(path.join(process.cwd(), 'public', 'awards')))
  } catch {
    return new Set<string>()
  }
})()

function resolveAwardImage(m: number | Media | null | undefined): string | undefined {
  const url = mediaUrl(m)
  if (!url) return undefined
  const filename = url.split('/').pop()
  if (filename && AWARDS_STATIC.has(filename)) return `/awards/${filename}`
  return url
}

async function getAwards() {
  try {
    const payload = await getPayload({ config })
    const [awards, awardsPage, footer] = await Promise.all([
      // Awards are their own collection (a custom post type) — sorted by the
      // drag-to-reorder `_order`, then grouped by year below.
      payload.find({ collection: 'awards', sort: '_order', depth: 1, limit: 100 }),
      payload.findGlobal({ slug: 'awardsPage', depth: 1 }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
    ])
    return { awards, awardsPage, footer }
  } catch {
    // If Payload/DB is unavailable, components fall back to their defaults.
    return { awards: undefined, awardsPage: undefined, footer: undefined }
  }
}

export default async function AwardsRoute() {
  const { awards, awardsPage, footer } = await getAwards()

  // Group the flat award documents into year groups. Years always render
  // newest → oldest; `_order` (drag in admin) controls the entries within a year.
  let years: AwardYear[] | undefined
  if (awards?.docs.length) {
    const byYear = new Map<string, AwardYear>()
    const groups: AwardYear[] = []
    for (const doc of awards.docs) {
      let group = byYear.get(doc.year)
      if (!group) {
        group = { year: doc.year, entries: [] }
        byYear.set(doc.year, group)
        groups.push(group)
      }
      const toHtml = (data: unknown) =>
        data
          ? convertLexicalToHTML({ data: data as SerializedEditorState, disableContainer: true })
          : undefined
      group.entries.push({
        label: doc.label ?? undefined,
        middleHtml: toHtml(doc.middle),
        rightHtml: toHtml(doc.campaign),
        awardImage: resolveAwardImage(doc.awardImage),
        groupPhoto: resolveAwardImage(doc.groupPhoto),
      })
    }
    groups.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0))
    years = groups
  }

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

  return (
    <main className="grain-effect">
      <Header />
      <AwardsPage
        eyebrow={awardsPage?.eyebrow ?? undefined}
        heading={awardsPage?.heading ?? undefined}
        years={years}
      />
      <Footer {...footerProps} />
    </main>
  )
}
