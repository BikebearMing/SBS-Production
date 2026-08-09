"use client"

import { useEffect, useRef, useState } from "react"
import TargetCursor from "@/components/TargetCursor/TargetCursor"
import WorksSlider, { type WorksSlide } from "@/components/WorksSlider/WorksSlider"
import { useScrollJoin } from "@/lib/useScrollJoin"

export type ProjectItem = {
    key: string
    title: string
    year: string
    thumbnail: string
    hoverVideoUrl?: string
    /** Background image used on hover when there is no hoverVideoUrl. */
    hoverImageUrl?: string
    copy: string
    tags: string[]
    link?: string
}

const DEFAULT_PROJECTS: ProjectItem[] = [
    {
        key: "gucci",
        title: "GUCCI WALK YOUR WAY",
        year: "2025",
        thumbnail: "/gucci.png",
        hoverVideoUrl: "https://streamable.com/l/ulxzt8/mp4.mp4",
        copy: "A FASHION-FORWARD CAMPAIGN CELEBRATING SELF-EXPRESSION THROUGH WALKING, BLENDING ICONIC HOUSE CODES WITH STREET CULTURE.",
        tags: ["FASHION", "BRAND FILM"],
    },
    {
        // 5th project — sits in the former empty middle slot of row 1.
        // Replace the thumbnail/content via Payload (Featured Projects block)
        // or edit this default directly.
        key: "newproject",
        title: "NEW PROJECT TITLE",
        year: "2025",
        thumbnail: "/works-bg.png",
        hoverImageUrl: "/works-bg.png",
        copy: "ADD A SHORT PROJECT OVERVIEW HERE — WHAT THE CAMPAIGN WAS AND WHY IT WORKED.",
        tags: ["CATEGORY", "DISCIPLINE"],
    },
    {
        key: "nike",
        title: "NIKE EVERYTHING IS POSSIBLE",
        year: "2025",
        thumbnail: "/nikethumb.png",
        hoverVideoUrl: "https://streamable.com/l/xx3sll/mp4-high.mp4",
        copy: "A BOLD MANIFESTO PROVING THAT NO LIMIT IS FIXED — TURNING ATHLETES' DOUBT INTO PROOF THROUGH UNFLINCHING STORYTELLING.",
        tags: ["SPORTS", "VIDEO PRODUCTION & MEDIA"],
    },
    {
        key: "snickers",
        title: "SNICKERS YOU'RE NOT YOU WHEN YOU'RE HUNGRY",
        year: "2025",
        thumbnail: "/snickers.png",
        hoverImageUrl: "/snickers.png",
        copy: "A WITTY INTEGRATED CAMPAIGN LEANING INTO THE INSIGHT THAT HUNGER CHANGES WHO YOU ARE — BUILT FOR SOCIAL AND OUT-OF-HOME.",
        tags: ["FMCG", "INTEGRATED CAMPAIGN"],
    },
    {
        key: "mcdonalds",
        title: "MCDONALD'S I'M LOVIN' IT",
        year: "2025",
        thumbnail: "/mcdonalds.png",
        hoverImageUrl: "/mcdonalds.png",
        copy: "AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.",
        tags: ["F&B", "DIGITAL & SOCIAL"],
    },
]

export type ProjectsProps = {
    headingBefore?: string
    headingHighlight?: string
    items?: ProjectItem[]
}

export default function Projects({
    headingBefore = "FEATURED",
    headingHighlight = "PROJECTS",
    items,
}: ProjectsProps = {}) {
    const projects = items?.length ? items : DEFAULT_PROJECTS
    const byKey: Record<string, ProjectItem> = Object.fromEntries(projects.map((p) => [p.key, p]))
    const sectionRef = useRef<HTMLElement>(null)
    const { headingRef, beforeRef, afterRef } = useScrollJoin<HTMLHeadingElement, HTMLSpanElement>()

    // Mobile swaps the hover grid for the works-page horizontal peek slider.
    // 'pre' (SSR / first paint) keeps the grid so desktop never flashes the
    // mobile slider — same matchMedia pattern as WorksShowcase.
    const [mode, setMode] = useState<'pre' | 'desktop' | 'mobile'>('pre')
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 769px)')
        const apply = () => setMode(mq.matches ? 'desktop' : 'mobile')
        apply()
        mq.addEventListener('change', apply)
        return () => mq.removeEventListener('change', apply)
    }, [])

    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [cursorActive, setCursorActive] = useState(false)
    const cursorStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const mousePosRef = useRef<{ x: number; y: number } | null>(null)
    const hideAllRef = useRef<() => void>(() => {})
    const showVideoRef = useRef<(id: string) => void>(() => {})

    // One background element per project: a <video> when it has a hover video,
    // otherwise an <img> when it has a hover image; refs collected by key.
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
    const imageRefs = useRef<Record<string, HTMLImageElement | null>>({})
    const videoProjects = projects.filter((p) => p.hoverVideoUrl)
    const imageProjects = projects.filter((p) => !p.hoverVideoUrl && p.hoverImageUrl)

    const showVideo = (id: string) => {
        setHoveredId(id)
        Object.entries(videoRefs.current).forEach(([key, vid]) => {
            if (!vid) return
            if (key === id) {
                vid.style.opacity = "1"
                vid.currentTime = 0
                vid.play().catch(() => {})
            } else {
                vid.style.opacity = "0"
                vid.pause()
            }
        })
        Object.entries(imageRefs.current).forEach(([key, img]) => {
            if (!img) return
            img.style.opacity = key === id ? "1" : "0"
        })
    }
    showVideoRef.current = showVideo

    const hideAll = () => {
        setHoveredId(null)
        Object.values(videoRefs.current).forEach((vid) => {
            if (!vid) return
            vid.style.opacity = "0"
            vid.pause()
        })
        Object.values(imageRefs.current).forEach((img) => {
            if (!img) return
            img.style.opacity = "0"
        })
    }
    hideAllRef.current = hideAll

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY }
        }

        let lastProject: Element | null = null

        const check = () => {
            const section = sectionRef.current
            const pos = mousePosRef.current
            if (!section || !pos) return
            const el = document.elementFromPoint(pos.x, pos.y)
            const inside = !!el && section.contains(el)
            setCursorActive((prev) => {
                if (inside && !prev) {
                    cursorStartRef.current = { x: pos.x, y: pos.y }
                    return true
                }
                if (!inside && prev) {
                    hideAllRef.current()
                    return false
                }
                return prev
            })

            const project = el?.closest(".project") as HTMLElement | null
            if (project !== lastProject) {
                lastProject = project
                if (project?.id) {
                    showVideoRef.current(project.id)
                } else {
                    hideAllRef.current()
                }
                if (el) {
                    el.dispatchEvent(
                        new MouseEvent("mouseover", {
                            bubbles: true,
                            clientX: pos.x,
                            clientY: pos.y,
                        })
                    )
                }
            }
        }

        window.addEventListener("mousemove", onMove, { passive: true })
        window.addEventListener("scroll", check, { passive: true })
        return () => {
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("scroll", check)
        }
    }, [])

    const videoStyle: React.CSSProperties = {
        opacity: 0,
        transition: "opacity 0.4s ease",
    }

    const imgStyle = (ownId: string): React.CSSProperties => ({
        opacity: hoveredId && hoveredId !== ownId ? 0 : 1,
        transition: "opacity 0.3s ease",
    })

    return (
        <section
            ref={sectionRef}
            className="projects"
            onMouseEnter={(e) => {
                cursorStartRef.current = { x: e.clientX, y: e.clientY }
                setCursorActive(true)
            }}
            onMouseLeave={() => {
                setCursorActive(false)
                hideAll()
            }}
        >
            {cursorActive && mode === 'desktop' && (
                <TargetCursor
                    spinDuration={5}
                    hideDefaultCursor
                    parallaxOn
                    hoverDuration={0.1}
                    initialX={cursorStartRef.current.x}
                    initialY={cursorStartRef.current.y}
                />
            )}
            <h2 ref={headingRef} className="h1 amplitude dark projects-heading">
                <span ref={beforeRef} className="projects-heading__word">{headingBefore}</span>{' '}
                <span ref={afterRef} className="projects-heading__word text-highlight">{headingHighlight}</span>
            </h2>
            {mode === 'mobile' ? (
                <MobileProjects projects={projects} />
            ) : (
            <div className="wrapper">
                <div className="video-bg">
                    <div className="video-wrapper">
                        {videoProjects.map((p) => (
                            <video
                                key={p.key}
                                ref={(el) => {
                                    videoRefs.current[p.key] = el
                                }}
                                loop
                                muted
                                playsInline
                                preload="auto"
                                style={videoStyle}
                                src={p.hoverVideoUrl}
                            ></video>
                        ))}
                        {imageProjects.map((p) => (
                            <img
                                key={p.key}
                                ref={(el) => {
                                    imageRefs.current[p.key] = el
                                }}
                                className="video-bg__image"
                                style={videoStyle}
                                src={p.hoverImageUrl}
                                alt=""
                            />
                        ))}
                    </div>
                </div>
                <div className="project-grid" onMouseLeave={hideAll}>
                    {projects.map((p) => (
                        <div
                            key={p.key}
                            id={p.key}
                            className="project"
                            onMouseEnter={() => showVideo(p.key)}
                        >
                            <div className="title-wrapper">
                                <p className="body dark">{p.title}</p>
                            </div>

                            <a
                                href={p.link || '/works'}
                                className="project-image cursor-target"
                                aria-label={p.title}
                            >
                                <img src={p.thumbnail} alt="" style={imgStyle(p.key)} />
                            </a>
                        </div>
                    ))}

                    <div className={`project-info${hoveredId ? ' is-visible' : ''}`} aria-hidden="true">
                        {hoveredId && byKey[hoveredId] && (
                            <>
                                <p className=" body project-info__label">PROJECT OVERVIEW</p>
                                <p className="body project-info__copy">
                                    {byKey[hoveredId].copy}
                                </p>
                                <ul className="project-info__tags">
                                    {byKey[hoveredId].tags.map((tag) => (
                                        <li key={tag} className="project-info__tag">{tag}</li>
                                    ))}
                                </ul>
                                <a
                                    href={byKey[hoveredId].link || '/works'}
                                    className="custom-button project-info__cta"
                                >
                                    <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                                        <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                                        <circle className="ring ring--inner" cx="12" cy="12" r="3" />
                                    </svg>
                                    <span>OUR WORK</span>
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
            )}
        </section>
    )
}

/** Mobile layout: the works-page horizontal peek slider, centered slide
 *  driving the title + tags below it — same markup/classes as MobileWorks
 *  in WorksShowcase so the two sections stay visually identical. */
function MobileProjects({ projects }: { projects: ProjectItem[] }) {
    const [active, setActive] = useState(0)
    const current = projects[active] ?? projects[0]

    const slides: WorksSlide[] = projects.map((p) => ({
        image: p.thumbnail,
        title: p.title,
        year: p.year,
        description: p.copy,
        tags: p.tags,
        href: p.link ?? '/works',
    }))

    return (
        <div className="projects-mobile">
            <p className="body dark works-showcase__title">{current.title}</p>
            <WorksSlider slides={slides} onActiveChange={setActive} />
            <div className="works-showcase__detail">
                <p className="body dark works-showcase__year">{current.year}</p>
                <div className="works-showcase__detail-body">
                    <div className="works-showcase__detail-text">
                        <h4 className="dark works-showcase__campaign">{current.title}</h4>
                        <p className="body dark works-showcase__description">{current.copy}</p>
                    </div>
                    <div className="works-showcase__tags">
                        {current.tags.map((tag) => (
                            <p className="body dark works-showcase__tag" key={tag}>
                                {tag}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* The per-slide overlay button is hidden on touch (globals.css);
                this CTA sits below the carousel and follows the centered work. */}
            <a className="custom-button works-showcase__cta" href={current.link ?? '/works'}>
                <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                    <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                    <circle className="ring ring--inner" cx="12" cy="12" r="3" />
                </svg>
                <span>VIEW PROJECT</span>
            </a>
        </div>
    )
}
