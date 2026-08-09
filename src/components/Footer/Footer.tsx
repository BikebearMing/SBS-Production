type FooterLink = { label: string; href: string }
type FooterSocial = { label: string; href: string; icon?: string }

export type FooterProps = {
  address?: string
  phones?: string[]
  directory?: FooterLink[]
  updatesLabel?: string
  /** CMS toggle — when false the whole socmed column is display:none. */
  showSocials?: boolean
  socials?: FooterSocial[]
  brandLogo?: string
  copyright?: string
  email?: string
}

const DEFAULT_ADDRESS =
  'Menara Star, 15, Jalan 16/11, Seksyen 16, 46350 Petaling Jaya, Selangor Darul Ehsan, Malaysia'
const DEFAULT_PHONES = ['+603 7967 1388', '+60126429027']
const DEFAULT_DIRECTORY: FooterLink[] = [
  { label: 'HOME', href: '/' },
  { label: 'WORKS', href: '/works' },
  { label: 'AWARDS', href: '/awards' },
  { label: 'OUR STORY', href: '/our-story' },
]
const DEFAULT_SOCIALS: FooterSocial[] = [
  { label: 'Facebook', href: '#', icon: '/footer/facebook.svg' },
  { label: 'Instagram', href: '#', icon: '/footer/instagram.svg' },
]

export default function Footer({
  address = DEFAULT_ADDRESS,
  phones,
  directory,
  updatesLabel = 'GET THE LATEST UPDATES',
  showSocials = true,
  socials,
  brandLogo = '/footer/smg-brand-studio.png',
  copyright = 'Copyrights © of Star Media Group 2026',
  email = 'SMGBRANDSTUDIO@THESTAR.COM.MY',
}: FooterProps = {}) {
  const PHONES = phones?.length ? phones : DEFAULT_PHONES
  const DIRECTORY = directory?.length ? directory : DEFAULT_DIRECTORY
  const SOCIALS = socials?.length ? socials : DEFAULT_SOCIALS

  return (
    <footer className="custom-footer">
      <div className="footer-top">
        <div className="footer-column-left">
          <div className="footer-location">
            <p className="body">{address}</p>
          </div>
          <div className="footer-contact-no">
            {PHONES.map((num, i) => (
              <p className="body" key={i}>{num}</p>
            ))}
          </div>
        </div>

        <div className="footer-column-middle">
          <div className="footer-directory">
            {DIRECTORY.map((link, i) => (
              <p className="body" key={i}><a href={link.href}>{link.label}</a></p>
            ))}
          </div>
        </div>

        <div
          className="footer-column-right"
          style={showSocials ? undefined : { display: 'none' }}
        >
          <div className="footer-socmed-excerpt">
            <p className="body">{updatesLabel}</p>
          </div>
          <div className="footer-socmed">
            {SOCIALS.map((social, i) => (
              <a href={social.href} aria-label={social.label} key={i}>
                {social.icon && <img src={social.icon} alt={social.label} />}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-top">
          <img src={brandLogo} alt="SMG BRAND STUDIO" />
          <p className="body">{copyright}</p>
        </div>
        <div className="footer-bottom-bottom">
          <p className="h1-v2 amp-mask">{email}</p>
        </div>
      </div>
    </footer>
  )
}
