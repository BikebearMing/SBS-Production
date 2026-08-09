'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { scrollState } from '@/lib/scroll'
import { onPreloaderDone } from '@/components/Preloader/Preloader'

export type CarouselSlide = { url: string; brand: string; copy?: string }

// ─── CONTROLS ────────────────────────────────────────────────────────────────
const DEFAULT_IMAGES = [
  '/carousel/01-busan.jpg',
  '/carousel/02-eq.png',
  '/carousel/03-mpoc.jpg',
  '/carousel/04-patek.jpg',
  '/carousel/05-auchentoshan.jpg',
  '/carousel/06-jomsapot.jpg',
  '/carousel/07-elmina.jpg',
  '/carousel/08-gamuda.png',
]

const DEFAULT_LABELS: { brand: string; copy?: string }[] = [
  { brand: 'Train To Busan',                      copy: 'Resorts World Genting' },
  { brand: 'The Launch of EQ',                    copy: 'Mercedes-Benz' },
  { brand: 'The Sustainable Palm Oil Revolution', copy: 'Malaysian Palm Oil Council' },
  { brand: 'Timepiece of tradition',              copy: "The origins of Patek Philippe's Calatrava wristwatch" },
  { brand: 'Auchentoshan',                        copy: 'The single malt whisky with a love for three' },
  { brand: '#JomSapot BeliLokal Integrated Marketing Campaign' },
  { brand: 'Elmina Rainforest Knowledge Centre Sustainability Campaign' },
  { brand: 'Gamuda Technology Website' },
]

const LABEL_OFFSET_X = 18
const LABEL_OFFSET_Y = 18
const LABEL_FOLLOW_EASE = 0.18

const RADIUS        = 4   // cylinder size — smaller = tighter curve
const IMG_WIDTH     = 2.9   // arc length per image (~333px wide at 1440 viewport)
const IMG_HEIGHT    = 1.34   // image height (~253px tall at 1440 viewport)
const CURVE_SEGMENTS = 20   // smoothness of the bend (higher = smoother)
const TILT_X        = 0.25 // tilt toward viewer (negative = top leans forward)
const TILT_Z        = 0.05   // left/right lean
const ROTATION_Y    = 0.0   // starting Y rotation offset
const SPIN_SPEED    = 0.25  // auto-rotate speed (0 to stop)
const SCROLL_SPIN   = 0.08  // how much scroll velocity nudges the spin (higher = more reactive)
const SCROLL_DAMP   = 0.08  // eased scroll velocity follow (lower = lazier)
const POP_DISTANCE  = 0.25   // how far hovered image pops out
const CAMERA_X      = 0     // camera left/right
const CAMERA_Y      = 0.3   // camera height
const CAMERA_Z      = 6.5   // camera distance (further = zoom out)
const CAMERA_FOV    = 65    // field of view (wider = more images visible)
const CYLINDER_Y    = 0.65  // vertical offset of the cylinder (positive = up)

// Intro animation
const INTRO_DURATION    = 3.5  // seconds
const INTRO_START_SCALE = 2.8  // starting scale (cylinder expanded — bigger circle + gap)
const INTRO_SPIN_MULT   = 30   // spin speed multiplier at start (more rotations before settling)
const INTRO_ARC_MULT    = 0.45 // image arc width at intro start (0.45 = 45% of final, bigger gap)

// Mouse parallax (after intro)
const PARALLAX_X = 0.08 // tilt strength on X axis (vertical mouse movement)
const PARALLAX_Y = 0.32 // tilt strength on Y axis (horizontal mouse movement)
const PARALLAX_EASE = 0.05 // smoothing (lower = lazier follow)
// ─────────────────────────────────────────────────────────────────────────────

const IMG_ARC = IMG_WIDTH / RADIUS   // angular span each image occupies on the cylinder

type IntroState = { scale: number; spinMult: number; arcMult: number }

type ImageProps = {
  texture: THREE.Texture
  angle: number
  isHovered: boolean
  isGreyed: boolean
  intro: React.RefObject<IntroState>
  onPointerOver: () => void
  onPointerOut: () => void
}

function CarouselImage({ texture, angle, isHovered, isGreyed, intro, onPointerOver, onPointerOut }: ImageProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offsetRef = useRef(0)
  const lastArcRef = useRef(-1)

  useFrame(() => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshBasicMaterial

    const targetOffset = isHovered ? POP_DISTANCE : 0
    offsetRef.current = THREE.MathUtils.lerp(offsetRef.current, targetOffset, 0.09)

    // Pop out along radial direction (cylinder segment is anchored at origin)
    meshRef.current.position.x = Math.sin(angle) * offsetRef.current
    meshRef.current.position.z = Math.cos(angle) * offsetRef.current

    // Dynamic arc: narrower at intro start (bigger gaps), grows to full width
    const dynamicArc = IMG_ARC * intro.current.arcMult
    if (Math.abs(dynamicArc - lastArcRef.current) > 0.002) {
      meshRef.current.geometry.dispose()
      meshRef.current.geometry = new THREE.CylinderGeometry(
        RADIUS, RADIUS, IMG_HEIGHT, CURVE_SEGMENTS, 1, true,
        angle - dynamicArc / 2, dynamicArc
      )
      lastArcRef.current = dynamicArc
    }

    const targetGrey = isGreyed ? 0.25 : 1.0
    mat.color.r = THREE.MathUtils.lerp(mat.color.r, targetGrey, 0.09)
    mat.color.g = THREE.MathUtils.lerp(mat.color.g, targetGrey, 0.09)
    mat.color.b = THREE.MathUtils.lerp(mat.color.b, targetGrey, 0.09)
    mat.opacity  = THREE.MathUtils.lerp(mat.opacity, isGreyed ? 0.85 : 1.0, 0.09)
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); onPointerOver() }}
      onPointerOut={onPointerOut}
    >
      <cylinderGeometry args={[RADIUS, RADIUS, IMG_HEIGHT, CURVE_SEGMENTS, 1, true, angle - IMG_ARC / 2, IMG_ARC]} />
      <meshBasicMaterial map={texture} color="#ffffff" transparent opacity={1} side={THREE.DoubleSide} />
    </mesh>
  )
}

type CarouselProps = {
  images: string[]
  onHoverChange?: (hovered: boolean) => void
  onHoverIndexChange?: (index: number | null) => void
}

function Carousel({ images, onHoverChange, onHoverIndexChange }: CarouselProps) {
  const COUNT = images.length
  const groupRef = useRef<THREE.Group>(null)
  const outerRef = useRef<THREE.Group>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const textures = useTexture(images)
  const unhoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intro = useRef<IntroState>({ scale: INTRO_START_SCALE, spinMult: INTRO_SPIN_MULT, arcMult: INTRO_ARC_MULT })
  const parallax = useRef({ x: 0, y: 0 })
  const scrollBoost = useRef(0)

  useEffect(() => {
    let tween: gsap.core.Tween | null = null
    const start = (instant: boolean) => {
      if (instant) {
        // Client-side navigation: the expanding-spin intro belongs to the
        // first load — land already settled.
        intro.current.scale = 1
        intro.current.spinMult = 1
        intro.current.arcMult = 1
        return
      }
      tween = gsap.to(intro.current, {
        scale: 1,
        spinMult: 1,
        arcMult: 1,
        duration: INTRO_DURATION,
        ease: 'power3.out',
      })
    }
    const unsubscribe = onPreloaderDone(start)
    return () => {
      unsubscribe()
      tween?.kill()
    }
  }, [])

  useEffect(() => {
    onHoverChange?.(hoveredIndex !== null)
    onHoverIndexChange?.(hoveredIndex)
  }, [hoveredIndex, onHoverChange, onHoverIndexChange])

  const handleOver = (i: number) => {
    if (unhoverTimer.current) clearTimeout(unhoverTimer.current)
    setHoveredIndex(i)
  }

  const handleOut = () => {
    unhoverTimer.current = setTimeout(() => setHoveredIndex(null), 120)
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.scale.setScalar(intro.current.scale)

    const targetBoost = Math.abs(scrollState.velocity) * SCROLL_SPIN
    scrollBoost.current = THREE.MathUtils.lerp(scrollBoost.current, targetBoost, SCROLL_DAMP)

    const baseSpin = hoveredIndex !== null ? 0 : SPIN_SPEED
    groupRef.current.rotation.y += delta * (baseSpin + scrollBoost.current) * intro.current.spinMult

    // Mouse parallax — translates the whole thing, tilt stays fixed
    if (outerRef.current) {
      const introDone = intro.current.arcMult > 0.95
      const targetX = introDone ? state.pointer.x * PARALLAX_Y : 0
      const targetY = introDone ? state.pointer.y * PARALLAX_X : 0
      parallax.current.x = THREE.MathUtils.lerp(parallax.current.x, targetX, PARALLAX_EASE)
      parallax.current.y = THREE.MathUtils.lerp(parallax.current.y, targetY, PARALLAX_EASE)
      outerRef.current.position.x = parallax.current.x
      outerRef.current.position.y = CYLINDER_Y + parallax.current.y
    }
  })

  return (
    // Outer group: fixed tilt + mouse parallax
    <group ref={outerRef} rotation={[TILT_X, 0, TILT_Z]}>
      {/* Inner group: only the spin happens here */}
      <group ref={groupRef} rotation={[0, ROTATION_Y, 0]}>
        {images.map((_, i) => {
          const angle = (i / COUNT) * Math.PI * 2
          const texture = Array.isArray(textures) ? textures[i] : textures
          return (
            <CarouselImage
              key={i}
              texture={texture}
              angle={angle}
              intro={intro}
              isHovered={hoveredIndex === i}
              isGreyed={hoveredIndex !== null && hoveredIndex !== i}
              onPointerOver={() => handleOver(i)}
              onPointerOut={handleOut}
            />
          )
        })}
      </group>
    </group>
  )
}

export default function CylinderCarousel({
  onHoverChange,
  slides,
}: {
  onHoverChange?: (hovered: boolean) => void
  slides?: CarouselSlide[]
}) {
  // Memoized so their identity is stable across renders — the stickyLabel
  // effect below depends on `labels`, and a fresh array every render would
  // re-trigger it (and setState) in an infinite loop.
  const images = useMemo(() => (slides?.length ? slides.map((s) => s.url) : DEFAULT_IMAGES), [slides])
  const labels = useMemo(
    () => (slides?.length ? slides.map((s) => ({ brand: s.brand, copy: s.copy })) : DEFAULT_LABELS),
    [slides],
  )

  const wrapperRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [stickyLabel, setStickyLabel] = useState(labels[0])

  useEffect(() => {
    if (hoveredIndex !== null && labels[hoveredIndex]) {
      setStickyLabel(labels[hoveredIndex])
    }
  }, [hoveredIndex, labels])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const label = labelRef.current
    if (!wrapper || !label) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let primed = false
    let rafId = 0

    const handleMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      targetX = e.clientX - rect.left + LABEL_OFFSET_X
      targetY = e.clientY - rect.top + LABEL_OFFSET_Y
      if (!primed) {
        currentX = targetX
        currentY = targetY
        primed = true
      }
    }

    const tick = () => {
      currentX += (targetX - currentX) * LABEL_FOLLOW_EASE
      currentY += (targetY - currentY) * LABEL_FOLLOW_EASE
      label.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove)
    rafId = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="cylinder-stage"
      style={{ position: 'relative', width: '100%', height: '100vh', zIndex: 10 }}
    >
      <Canvas
        camera={{ position: [CAMERA_X, CAMERA_Y, CAMERA_Z], fov: CAMERA_FOV }}
        style={{ background: 'transparent' }}
        // preserveDrawingBuffer lets the page transition snapshot the WebGL
        // canvas (toDataURL) when leaving the homepage.
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
        dpr={[1, 1.5]}
      >
        <Carousel images={images} onHoverChange={onHoverChange} onHoverIndexChange={setHoveredIndex} />
      </Canvas>
      <div
        ref={labelRef}
        className={`cylinder-hover-label${hoveredIndex !== null ? ' is-visible' : ''}`}
      >
        <span className="body cylinder-hover-label__brand"><span>{stickyLabel.brand}</span></span>
        {stickyLabel.copy && (
          <span className="body cylinder-hover-label__copy"><span>{stickyLabel.copy}</span></span>
        )}
      </div>
    </div>
  )
}
