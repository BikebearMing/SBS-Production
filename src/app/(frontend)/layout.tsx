import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Instrument_Serif, Inter_Tight } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import PageTransition from '@/components/PageTransition/PageTransition'
import MaskUpHeadings from '@/components/MaskUpHeadings/MaskUpHeadings'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--serif',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--inter',
  display: 'swap',
})

/**
 * Google Analytics 4. Loaded on the frontend only — the Payload admin has its own
 * layout, so /admin is never measured. The googletagmanager / google-analytics
 * origins are allowlisted in `cspDirectives` (next.config.ts); dropping them there
 * makes the browser block this silently.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-17JNB6DNJ5'

/**
 * Google Tag Manager. Independent of the gtag.js block above: this only loads the
 * container, and whatever tags the container holds fire on their own. If a GA4 tag
 * for GA_MEASUREMENT_ID is ever added inside the container, remove the gtag.js
 * scripts below or every pageview is counted twice.
 *
 * Same CSP note as GA4 — plus the <noscript> iframe needs www.googletagmanager.com
 * in `frame-src`.
 */
const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-MNFVNRFT'

/**
 * Canonical origin. Google picks the search-result site name from the WebSite
 * structured data below, and needs the `url` there to be the canonical homepage —
 * so this has to match the address the site is actually indexed under (no trailing
 * slash). Override per-environment with NEXT_PUBLIC_SITE_URL.
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://smgbrandstudio.my').replace(
  /\/$/,
  '',
)

const SITE_NAME = 'SMG Brand Studio'

/**
 * The site name in Google results comes from three signals that must agree —
 * the WebSite JSON-LD `name`, `og:site_name`, and the homepage <title>. If they
 * disagree Google picks its own, which is how the old "Star Brand Studio" name
 * got locked in. Change the name in one place (SITE_NAME) so they can't drift.
 */
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: 'Creative studio',
  applicationName: SITE_NAME,
  // No `alternates.canonical` / `openGraph.url` here on purpose — root metadata is
  // inherited by every route, so a value of '/' would canonicalise the whole site
  // to the homepage. Each page sets its own.
  openGraph: {
    // No `title`/`description` here — Next falls back to each page's resolved
    // values (title template included). Pinning them would give every route the
    // homepage's title and blurb in link previews.
    type: 'website',
    siteName: SITE_NAME,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${interTight.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/bpi7jxx.css" />
        {/* Plain <script type="application/ld+json"> — a data block, not executed
            code, so the CSP in next.config.ts does not apply to it. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        {/* GTM's no-JavaScript fallback. Must be the first thing in <body>, and it
            cannot be a next/script — it is an iframe, not a script. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <SmoothScroll />
        <MaskUpHeadings />
        <PageTransition>{children}</PageTransition>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
