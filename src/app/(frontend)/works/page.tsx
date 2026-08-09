import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@payload-types'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import WorksShowcase from '@/components/WorksSlider/WorksShowcase'
import { type WorksSlide } from '@/components/WorksSlider/WorksSlider'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Works — Star Brand Studio',
  description: 'Selected works from Star Brand Studio.',
}

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

async function getWorks() {
  try {
    const payload = await getPayload({ config })
    // `_order` is the drag-to-reorder field on the works collection.
    const [works, footer] = await Promise.all([
      payload.find({ collection: 'works', sort: '_order', depth: 1, limit: 100 }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
    ])
    return { works: works.docs, footer }
  } catch {
    // If Payload/DB is unavailable, the slider/footer fall back to defaults.
    return { works: undefined, footer: undefined }
  }
}

export default async function WorksRoute() {
  const { works, footer } = await getWorks()

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

  const slides: WorksSlide[] | undefined = works
    ?.map((s): WorksSlide | undefined => {
      const image = mediaUrl(s.image)
      if (!image) return undefined
      return {
        image,
        title: s.title ?? undefined,
        href: `/works/${s.slug}`,
        year: s.year ?? undefined,
        description: s.description ?? undefined,
        tags: s.tags?.map((t) => t.label).filter((l): l is string => Boolean(l)),
      }
    })
    .filter((s): s is WorksSlide => Boolean(s))

  return (
    <main className="grain-effect">
      <Header />
      {/* Breadcrumb + "The Works" title now live inside WorksShowcase so they
          pin with the sticky scroll-stack section on desktop. */}
      <WorksShowcase slides={slides} />
      <Footer {...footerProps} />
    </main>
  )
}
