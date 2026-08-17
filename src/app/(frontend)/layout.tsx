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

export const metadata: Metadata = {
  title: 'Star Brand Studio',
  description: 'Creative studio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${interTight.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/bpi7jxx.css" />
      </head>
      <body>
        <SmoothScroll />
        <MaskUpHeadings />
        <PageTransition>{children}</PageTransition>
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
