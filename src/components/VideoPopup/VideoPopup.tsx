'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'

const DEFAULT_VIDEO_SRC = 'https://streamable.com/l/q9wy22/mp4.mp4'

type VideoPopupProps = { showreelUrl?: string; showreelThumbnail?: string }

export default function VideoPopup({ showreelUrl, showreelThumbnail }: VideoPopupProps = {}) {
  const videoSrc = showreelUrl || DEFAULT_VIDEO_SRC
  const thumbSrc = showreelThumbnail || videoSrc
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    const overlay = overlayRef.current
    if (overlay) {
      gsap.fromTo(
        overlay,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }
      )
    }

    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (video) video.pause()
    }
  }, [open])

  return (
    <>
      <div className="video-popup-wrapper">
        <video
          className="thumbnail"
          src={thumbSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <button
          type="button"
          className="custom-button"
          onClick={() => setOpen(true)}
        >
          <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="ring ring--outer" cx="12" cy="12" r="11" />
            <circle className="ring ring--middle" cx="12" cy="12" r="7" />
            <circle className="ring ring--inner" cx="12" cy="12" r="3" />
          </svg>
          <span>WATCH SHOWREEL</span>
        </button>
      </div>

      {open && mounted && createPortal(
        <div
          ref={overlayRef}
          className="video-popup-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <button
            type="button"
            className="video-popup-close"
            aria-label="Close video"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
          <video
            ref={videoRef}
            className="video-popup-player"
            src={videoSrc}
            controls
            playsInline
          />
        </div>,
        document.body
      )}
    </>
  )
}
