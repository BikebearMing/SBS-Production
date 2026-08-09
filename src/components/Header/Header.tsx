'use client'

import { useEffect, useState } from 'react'
import { scrollState } from '@/lib/scroll'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // While the mobile drawer is open, pause Lenis so the page behind doesn't
  // scroll, and allow Escape to close it.
  useEffect(() => {
    if (!menuOpen) return
    scrollState.lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      scrollState.lenis?.start()
    }
  }, [menuOpen])

  return (
    <header className={`site-header${menuOpen ? ' is-menu-open' : ''}`}>
      <div className="wrapper">
        <a href="/" className="site-header__logo" aria-label="Star Brand Studio">
          <img src="/Logo.svg" alt="Star Brand Studio" />
        </a>
        {/* Desktop nav — hidden on mobile, where the burger + drawer take over. */}
        <nav className="site-header__nav">
          <a href="/contact" className="custom-button">
            <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="ring ring--outer" cx="12" cy="12" r="11" />
              <circle className="ring ring--middle" cx="12" cy="12" r="7" />
              <circle className="ring ring--inner" cx="12" cy="12" r="3" />
            </svg>
            <span>LET&rsquo;S TALK</span>
          </a>
          <a href="/works" className="site-header__nav-link body">Works</a>
          <a href="/awards" className="site-header__nav-link body">Awards</a>
          <a href="/our-story" className="site-header__nav-link body">Our Story</a>
        </nav>

        {/* Mobile-only hamburger; toggles .is-menu-open on the header. */}
        <button
          type="button"
          className="site-header__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="site-header__burger-line" />
          <span className="site-header__burger-line" />
          <span className="site-header__burger-line" />
        </button>
      </div>

      {/* Right-side drawer. Clicking the scrim (outside the panel) closes it. */}
      <div
        className="site-menu"
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false)
        }}
      >
        <nav className="site-menu__panel" aria-label="Mobile menu">
          <ul className="site-menu__list">
            <li className="site-menu__item">
              <a href="/works" className="site-menu__link h2" onClick={() => setMenuOpen(false)}>Works</a>
            </li>
            <li className="site-menu__item">
              <a href="/awards" className="site-menu__link h2" onClick={() => setMenuOpen(false)}>Awards</a>
            </li>
            <li className="site-menu__item">
              <a href="/our-story" className="site-menu__link h2" onClick={() => setMenuOpen(false)}>Our Story</a>
            </li>
            <li className="site-menu__item">
              <a href="/contact" className="site-menu__link h2" onClick={() => setMenuOpen(false)}>Let&rsquo;s Talk</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
