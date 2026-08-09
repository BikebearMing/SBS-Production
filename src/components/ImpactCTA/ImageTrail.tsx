'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

type Props = {
  items: string[]
  variant?: 1
  /** minimum cursor travel (px) before a new image is spawned */
  threshold?: number
}

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect) {
  let clientX = 0
  let clientY = 0
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if ('clientX' in e) {
    clientX = (e as MouseEvent).clientX
    clientY = (e as MouseEvent).clientY
  }
  return { x: clientX - rect.left, y: clientY - rect.top }
}

export default function ImageTrail({ items, variant = 1, threshold = 80 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || items.length === 0) return

    const imageEls = Array.from(
      container.querySelectorAll<HTMLDivElement>('.content__img'),
    )
    if (imageEls.length === 0) return

    const rects = new Map<HTMLDivElement, DOMRect>()
    const recalcRects = () => {
      imageEls.forEach((el) => {
        gsap.set(el, { x: 0, y: 0, opacity: 0, scale: 1 })
        rects.set(el, el.getBoundingClientRect())
      })
    }
    recalcRects()
    window.addEventListener('resize', recalcRects)

    let mousePos = { x: 0, y: 0 }
    let lastMousePos = { x: 0, y: 0 }
    let cacheMousePos = { x: 0, y: 0 }
    let imgPosition = 0
    let zIndexVal = 1
    let activeImagesCount = 0
    let isIdle = true
    let started = false
    let rafId: number | undefined

    const showNextImage = () => {
      ++zIndexVal
      imgPosition = imgPosition < imageEls.length - 1 ? imgPosition + 1 : 0
      const el = imageEls[imgPosition]
      const r = rects.get(el)
      const w = r?.width ?? 0
      const h = r?.height ?? 0

      gsap.killTweensOf(el)
      gsap
        .timeline({
          onStart: () => {
            activeImagesCount++
            isIdle = false
          },
          onComplete: () => {
            activeImagesCount--
            if (activeImagesCount === 0) isIdle = true
          },
        })
        .fromTo(
          el,
          {
            opacity: 1,
            scale: 1,
            zIndex: zIndexVal,
            x: cacheMousePos.x - w / 2,
            y: cacheMousePos.y - h / 2,
          },
          {
            duration: 0.4,
            ease: 'power1',
            x: mousePos.x - w / 2,
            y: mousePos.y - h / 2,
          },
          0,
        )
        .to(
          el,
          {
            duration: 0.4,
            ease: 'power3',
            opacity: 0,
            scale: 0.2,
          },
          0.4,
        )
    }

    const render = () => {
      const dx = mousePos.x - lastMousePos.x
      const dy = mousePos.y - lastMousePos.y
      const dist = Math.hypot(dx, dy)

      cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, 0.1)
      cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, 0.1)

      if (dist > threshold) {
        showNextImage()
        lastMousePos = { ...mousePos }
      }
      if (isIdle && zIndexVal !== 1) zIndexVal = 1

      rafId = requestAnimationFrame(render)
    }

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect()
      mousePos = getLocalPointerPos(ev, rect)
      if (!started) {
        cacheMousePos = { ...mousePos }
        lastMousePos = { ...mousePos }
        started = true
        rafId = requestAnimationFrame(render)
      }
    }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('touchmove', onMove)

    return () => {
      window.removeEventListener('resize', recalcRects)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('touchmove', onMove)
      if (rafId !== undefined) cancelAnimationFrame(rafId)
      imageEls.forEach((el) => gsap.killTweensOf(el))
    }
  }, [items, variant, threshold])

  return (
    <div ref={containerRef} className="image-trail" aria-hidden="true">
      {items.map((url, i) => (
        <div className="content__img" key={i}>
          <div
            className="content__img-inner"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  )
}
