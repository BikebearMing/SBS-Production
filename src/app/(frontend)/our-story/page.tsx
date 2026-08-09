import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@payload-types'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import StoryHero from '@/components/StoryHero/StoryHero'
import OurStory from '@/components/OurStory/OurStory'
import OurDifference from '@/components/OurDifference/OurDifference'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Our Story — Star Brand Studio',
  description:
    'The full-service marketing arm of Star Media Group — combining the credibility of journalism, the rigour of data, and the reach of an integrated media group.',
}

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

async function getData() {
  try {
    const payload = await getPayload({ config })
    const [story, footer] = await Promise.all([
      payload.findGlobal({ slug: 'ourStoryPage', depth: 1 }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
    ])
    return { story, footer }
  } catch {
    // If Payload/DB is unavailable, components fall back to their defaults.
    return { story: undefined, footer: undefined }
  }
}

export default async function OurStoryRoute() {
  const { story, footer } = await getData()

  // Our Story global → component props (each component falls back to its own
  // hardcoded defaults when a value is missing, so the page never breaks).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = story as any
  const heroImage = mediaUrl(s?.hero?.image)
  const marqueeImages: string[] | undefined = s?.intro?.marquee?.flatMap(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (m: any) => {
      const url = mediaUrl(m.image)
      return url ? [url] : []
    },
  )
  const introCopy: [string, string] | undefined =
    s?.intro?.copy1 && s?.intro?.copy2 ? [s.intro.copy1, s.intro.copy2] : undefined
  const cards: { title: string; body: string }[] | undefined = s?.difference?.cards
    ?.filter((c: { title?: string; body?: string }) => c?.title && c?.body)
    .map((c: { title: string; body: string }) => ({ title: c.title, body: c.body }))

  // Footer mirrors the rest of the site; ensure "Our Story" is in the directory.
  const directory = footer?.directory?.map((d) => ({ label: d.label, href: d.href })) ?? []
  if (!directory.some((d) => d.href === '/our-story')) {
    directory.push({ label: 'OUR STORY', href: '/our-story' })
  }
  const footerProps = footer
    ? {
        address: footer.address ?? undefined,
        phones: footer.phones?.map((p) => p.number),
        directory,
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
    : { directory }

  return (
    <main className="grain-effect">
      <Header />
      <StoryHero
        image={heroImage}
        line1={s?.hero?.line1 ?? undefined}
        line2={s?.hero?.line2 ?? undefined}
        highlight={s?.hero?.highlight ?? undefined}
      />
      <OurStory
        title={s?.intro?.title ?? undefined}
        copy={introCopy}
        images={marqueeImages}
      />
      <OurDifference
        titlePre={s?.difference?.titlePre ?? undefined}
        titleHighlight={s?.difference?.titleHighlight ?? undefined}
        cards={cards}
      />
      <Footer {...footerProps} />
    </main>
  )
}
