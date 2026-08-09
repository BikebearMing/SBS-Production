'use client'

import { useEffect, useRef, useState } from 'react'

const FOLLOW_EASE = 0.18

export default function ImpactCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const section = cursor.closest('.impact-cta') as HTMLElement | null
    if (!section) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let primed = false
    let rafId = 0

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!primed) {
        currentX = targetX
        currentY = targetY
        primed = true
      }
      const overInteractive = !!(e.target as HTMLElement)?.closest('a, button')
      setActive(!overInteractive)
    }
    const handleEnter = (e: MouseEvent) => {
      const overInteractive = !!(e.target as HTMLElement)?.closest('a, button')
      setActive(!overInteractive)
    }
    const handleLeave = () => setActive(false)

    const tick = () => {
      currentX += (targetX - currentX) * FOLLOW_EASE
      currentY += (targetY - currentY) * FOLLOW_EASE
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    section.addEventListener('mousemove', handleMove)
    section.addEventListener('mouseenter', handleEnter)
    section.addEventListener('mouseleave', handleLeave)
    rafId = requestAnimationFrame(tick)

    return () => {
      section.removeEventListener('mousemove', handleMove)
      section.removeEventListener('mouseenter', handleEnter)
      section.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={cursorRef} className="impact-cursor" aria-hidden>
      <div className={`impact-cursor__inner${active ? ' is-active' : ''}`}>
        <span className="impact-cursor__label">MOVE</span>
      </div>
    </div>
  )
}
