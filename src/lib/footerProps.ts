import type { Footer as FooterGlobal, Media } from '@payload-types'
import type { FooterProps } from '@/components/Footer/Footer'

/**
 * The footer directory always ends with Our Story — older CMS data was seeded
 * without it, so it's appended when missing rather than relied on being there.
 */
const OUR_STORY = { label: 'OUR STORY', href: '/our-story' }

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

/**
 * Maps the Payload `footer` global onto <Footer /> props. Every page renders the
 * same footer, so they all go through here. Missing values are left `undefined`
 * so the component falls back to its own DEFAULT_* constants, which keeps the
 * footer intact when the CMS/DB is unavailable.
 */
export function toFooterProps(footer: FooterGlobal | null | undefined): FooterProps {
  if (!footer) return {}

  // Left undefined when the CMS has no links, so DEFAULT_DIRECTORY applies.
  const directory = footer.directory?.length
    ? footer.directory.map((d) => ({ label: d.label, href: d.href }))
    : undefined
  if (directory && !directory.some((d) => d.href === OUR_STORY.href)) {
    directory.push({ ...OUR_STORY })
  }

  return {
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
}
