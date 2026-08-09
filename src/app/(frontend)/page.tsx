import { Fragment } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Page } from '@payload-types'

import Awards from '@/components/Awards/Awards'
import Preloader from '@/components/Preloader/Preloader'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import HeroSection from '@/components/Hero/HeroSection'
import LogoCarousel from '@/components/LogoCarousel/LogoCarousel'
import Pillars from '@/components/Pillars/Pillars'
import Services from '@/components/Services/Services'
import Projects from '@/components/Projects/Project'
import VideoPopup from '@/components/VideoPopup/VideoPopup'
import ImpactCTA from '@/components/ImpactCTA/ImpactCTA'
import ContactForm, { type ContactField } from '@/components/ContactForm/ContactForm'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

type Block = NonNullable<Page['layout']>[number]
type BlockOf<T extends Block['blockType']> = Extract<Block, { blockType: T }>

function findBlock<T extends Block['blockType']>(
  layout: Page['layout'],
  type: T,
): BlockOf<T> | undefined {
  return layout?.find((b): b is BlockOf<T> => b.blockType === type)
}

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

// Pull the first paragraph of plain text out of a Lexical rich-text value.
function lexicalToText(node: unknown): string | undefined {
  if (!node || typeof node !== 'object') return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = (node as any).root
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walk = (n: any): string =>
    typeof n?.text === 'string'
      ? n.text
      : Array.isArray(n?.children)
        ? n.children.map(walk).join('')
        : ''
  const text = root ? walk(root).trim() : ''
  return text || undefined
}

async function getHome() {
  try {
    const payload = await getPayload({ config })
    const [pages, footer, forms] = await Promise.all([
      payload.find({
        collection: 'pages',
        where: { slug: { equals: 'home' } },
        depth: 2,
        limit: 1,
      }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
      payload.find({
        collection: 'forms',
        where: { title: { equals: 'Contact' } },
        depth: 0,
        limit: 1,
      }),
    ])
    return { layout: pages.docs[0]?.layout, footer, contactForm: forms.docs[0] }
  } catch {
    // If Payload/DB is unavailable, components fall back to their defaults.
    return { layout: undefined, footer: undefined, contactForm: undefined }
  }
}

export default async function Home() {
  const { layout, footer, contactForm } = await getHome()

  // Form Builder stores fields as a flat block array; map to the shape ContactForm needs.
  const contactFields = contactForm?.fields?.flatMap((f) => {
    if (!('name' in f) || !f.name) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const af = f as any
    const field: ContactField = {
      name: af.name,
      label: af.label ?? undefined,
      blockType: af.blockType,
      required: Boolean(af.required),
      width: typeof af.width === 'number' ? af.width : undefined,
      options: Array.isArray(af.options)
        ? af.options.map((o: { label: string; value: string }) => ({ label: o.label, value: o.value }))
        : undefined,
    }
    return [field]
  })

  const hero = findBlock(layout, 'hero')
  const whatWeDo = findBlock(layout, 'whatWeDo')
  const pillars = findBlock(layout, 'pillars')
  const logos = findBlock(layout, 'logos')
  const awards = findBlock(layout, 'awards')
  const projects = findBlock(layout, 'projects')
  const services = findBlock(layout, 'services')
  const impactCTA = findBlock(layout, 'impactCTA')

  const heroSlides = hero?.carousel?.flatMap((c) => {
    const url = mediaUrl(c.image)
    return url ? [{ url, brand: c.brand, copy: c.copy ?? undefined }] : []
  })

  const logoUrls = logos?.items?.flatMap((it) => {
    const url = mediaUrl(it.logo)
    return url ? [url] : []
  })

  // Strip images come from the home page's own Awards block (Pages → Home →
  // Awards → Items) — kept independent of the awards collection behind /awards.
  const awardItems = awards?.items?.flatMap((it) => {
    const src = mediaUrl(it.image)
    return src ? [{ src, name: it.name || it.alt || 'AWARD' }] : []
  })

  const projectItems = projects?.items?.flatMap((p) => {
    const thumbnail = mediaUrl(p.thumbnail)
    return thumbnail
      ? [
          {
            key: p.key,
            title: p.title,
            year: p.year ?? '2025',
            thumbnail,
            hoverVideoUrl: p.hoverVideoUrl ?? undefined,
            hoverImageUrl: mediaUrl(p.hoverImage),
            copy: p.copy ?? '',
            tags: p.tags?.map((t) => t.tag) ?? [],
            link: p.link ?? undefined,
          },
        ]
      : []
  })

  const impactImages = impactCTA?.trailImages?.flatMap((t) => {
    const url = mediaUrl(t.image)
    return url ? [url] : []
  })

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
      {/* Must stay first: it arms itself during render so the hero/headings
          below know to wait for the intro before animating. */}
      <Preloader />
      <Header />
      <div className="pin-stack">
        <HeroSection
          messages={hero?.messages?.map((m) => ({
            heading: m.heading,
            subheading: m.subheading,
          }))}
          slides={heroSlides}
        />
        <section className="what-we-do red-section">
          <div className="wrapper">
            <div className="top">
              <div className="left">
                <h3 className="subhead amp-mask">
                  {whatWeDo?.label ?? 'WHAT WE DO'}
                </h3>
                <h4 className="h2 amp-mask">
                  {whatWeDo?.headingBefore ??
                    'Across every platform—digital, radio, on-ground, print and social—we bring brand'}{' '}
                  <span>
                    <img
                      src={mediaUrl(whatWeDo?.inlineLogo) ?? '/SMG_Logo-Loop-Animation.gif'}
                      alt=""
                    />
                  </span>{' '}
                  {whatWeDo?.headingAfter ??
                    'ideas to life, creating moments that spark connection and inspire action.'}
                </h4>
              </div>

              <div className="right">
                <VideoPopup
                  showreelUrl={whatWeDo?.showreelUrl ?? undefined}
                  showreelThumbnail={whatWeDo?.showreelThumbnail ?? undefined}
                />
              </div>

            </div>
          </div>
        </section>

        <section className="pillars-section">
          <h3 className="h3 amp-mask">
            {pillars?.heading
              ? pillars.heading.split('\n').map((line, i, arr) => (
                  <Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </Fragment>
                ))
              : (
                <>
                  ROOTED IN AUDIENCE INSIGHTS AND <br /> CREDIBLE JOURNALISM, WE DELIVER :
                </>
              )}
          </h3>
          <div className="wrapper">
            <Pillars items={pillars?.items?.map((p) => ({ label: p.label, copy: p.copy }))} />
          </div>
        </section>

        <LogoCarousel logos={logoUrls} />
        <Awards
          title={awards?.title ?? undefined}
          buttonLabel={awards?.buttonLabel ?? undefined}
          caption={awards?.caption ?? undefined}
          recognitions={awards?.recognitions ?? undefined}
          items={awardItems}
        />
        <Projects
          headingBefore={projects?.headingBefore ?? undefined}
          headingHighlight={projects?.headingHighlight ?? undefined}
          items={projectItems}
        />

        <section className="services">
          <div className="wrapper">
            <Services items={services?.items?.map((s) => ({ title: s.title, copy: s.copy }))} />
          </div>
        </section>
      </div>
      <ImpactCTA
        headingTop={impactCTA?.headingTop ?? undefined}
        copy={impactCTA?.copy ?? undefined}
        impactWord={impactCTA?.impactWord ?? undefined}
        images={impactImages}
      />
      <section className="contact-section" id="contact">
        <div className="contact-section__inner">
          <ContactForm
            formId={contactForm?.id}
            fields={contactFields}
            submitLabel={contactForm?.submitButtonLabel ?? undefined}
            confirmationMessage={lexicalToText(contactForm?.confirmationMessage)}
          />
        </div>
      </section>
      <Footer {...footerProps} />
    </main>
  )
}
