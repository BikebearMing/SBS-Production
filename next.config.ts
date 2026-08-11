import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Content-Security-Policy.
 *
 * The external origins below are the ones the site actually loads:
 *   use.typekit.net / p.typekit.net  Adobe Typekit stylesheet + font files (frontend layout)
 *   picsum.photos                    ImpactCTA fallback trail images
 *   streamable.com                   seeded CMS video URLs rendered into <video src>
 *   www.youtube-nocookie.com         work-detail page embeds
 *
 * picsum and streamable both 302 to a CDN subdomain (fastly.picsum.photos,
 * cdn-cf-east.streamable.com) and CSP re-checks the redirect target against the
 * source list, so the wildcard forms are required — allowing only the apex host
 * blocks the images and the showreel video.
 *
 * Google fonts (next/font/google) are self-hosted at build time, so they need no
 * external origin.
 *
 * 'unsafe-inline' is required for both scripts and styles: Next inlines its own bootstrap
 * scripts, several components render inline style="" attributes, and the Payload admin
 * (same origin, /admin) relies on inline scripts/styles and dangerouslySetInnerHTML.
 */
const cspDirectives = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `frame-ancestors 'self'`,
  `form-action 'self'`,
  // dev needs 'unsafe-eval' for HMR; production does not
  `script-src 'self' 'unsafe-inline'${isDev ? ` 'unsafe-eval'` : ''}`,
  `style-src 'self' 'unsafe-inline' https://use.typekit.net`,
  `font-src 'self' data: https://use.typekit.net https://p.typekit.net`,
  `img-src 'self' data: blob: https://picsum.photos https://*.picsum.photos https://*.typekit.net`,
  `media-src 'self' blob: https://streamable.com https://*.streamable.com`,
  // dev needs ws: for the HMR socket
  `connect-src 'self' https://performance.typekit.net${isDev ? ' ws: wss:' : ''}`,
  `frame-src 'self' https://www.youtube-nocookie.com`,
  `worker-src 'self' blob:`,
  `manifest-src 'self'`,
  `upgrade-insecure-requests`,
].join('; ')

/**
 * Deny the sensitive features outright, but keep the ones the YouTube iframe declares in its
 * `allow` attribute — revoking those breaks playback.
 */
const permissionsPolicy = [
  `camera=()`,
  `microphone=()`,
  `geolocation=()`,
  `payment=()`,
  `usb=()`,
  `magnetometer=()`,
  `browsing-topics=()`,
  `interest-cohort=()`,
  `accelerometer=(self "https://www.youtube-nocookie.com")`,
  `gyroscope=(self "https://www.youtube-nocookie.com")`,
  `autoplay=(self "https://www.youtube-nocookie.com")`,
  `encrypted-media=(self "https://www.youtube-nocookie.com")`,
  `fullscreen=(self "https://www.youtube-nocookie.com")`,
  `picture-in-picture=(self "https://www.youtube-nocookie.com")`,
].join(', ')

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Drops `X-Powered-By: Next.js`, which securityheaders.com flags as
  // information disclosure and which caps the grade below A+.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async headers() {
    return [
      {
        // The six headers securityheaders.com grades on, plus COOP. Applied to
        // every route, admin included.
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: cspDirectives },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: permissionsPolicy },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // Media is user-uploadable and SVG is an allowed mime type (see src/collections/Media.ts),
        // so anything served from here gets a much tighter policy on top of the global rule —
        // navigating straight to an uploaded SVG then can't run script. The other global
        // headers (HSTS, nosniff, ...) still apply here.
        source: '/api/media/file/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'none'; style-src 'unsafe-inline'; sandbox`,
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
