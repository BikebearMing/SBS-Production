'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

type Props = {
  src: string
  alt?: string
  className?: string
  style?: CSSProperties
  /** Vertical travel range as a fraction of the wrapper height. Default 0.15 = ±15%. */
  amount?: number
}

export default function ParallaxImage({
  src,
  alt = '',
  className,
  style,
  amount = 0.15,
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const wrapper = img.parentElement
    if (!wrapper) return

    let rafId = 0
    let visible = true

    const tick = () => {
      if (visible) {
        const rect = wrapper.getBoundingClientRect()
        const vh = window.innerHeight
        const progress = (rect.top + rect.height / 2 - vh / 2) / (vh + rect.height)
        const translate = -progress * amount * 100
        img.style.transform = `translate3d(0, ${translate}%, 0)`
      }
      rafId = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting
        })
      },
      { rootMargin: '200px' },
    )
    io.observe(wrapper)

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      io.disconnect()
    }
  }, [amount])

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`parallax-img${className ? ` ${className}` : ''}`}
      style={style}
    />
  )
}
