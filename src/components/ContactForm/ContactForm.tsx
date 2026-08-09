'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export type ContactField = {
  name: string
  label?: string
  blockType: string
  required?: boolean
  width?: number
  options?: { label: string; value: string }[]
}

type Props = {
  /** ID of the Payload "Contact" form. Submissions POST here; omit and the form renders read-only. */
  formId?: number | string
  fields?: ContactField[]
  submitLabel?: string
  confirmationMessage?: string
}

// Mirrors the seeded "Contact" form so the section always renders, even with no DB.
const DEFAULT_FIELDS: ContactField[] = [
  { name: 'fullName', label: 'Full Name', blockType: 'text', required: true, width: 100 },
  { name: 'company', label: 'Company / Organisation', blockType: 'text', width: 100 },
  { name: 'email', label: 'Email Address', blockType: 'email', required: true, width: 50 },
  { name: 'phone', label: 'Phone Number', blockType: 'text', width: 50 },
  {
    name: 'services',
    label: 'What Services Are Required?',
    blockType: 'select',
    width: 100,
    options: [
      { label: 'Integrated Marketing & Creative Strategy', value: 'integrated-marketing' },
      { label: 'Editorial Storytelling', value: 'editorial-storytelling' },
      { label: 'Video & Multimedia Production', value: 'video-production' },
      { label: 'Youth & Social Impact Programme', value: 'social-impact' },
      { label: 'Research & Insights', value: 'research-insights' },
      { label: 'Social Media & Influencer Engagement', value: 'social-influencer' },
      { label: 'Digital Experiences', value: 'digital-experiences' },
      { label: 'Media Strategy & Buying', value: 'media-strategy' },
      { label: 'Other', value: 'other' },
    ],
  },
  { name: 'enquiry', label: 'Leave Your Project Enquiry', blockType: 'textarea', width: 100 },
]

const DEFAULT_CONFIRMATION = "THANKS — WE'VE GOT YOUR ENQUIRY. WE'LL BE IN TOUCH SHORTLY."

// Scroll-in reveal of the field grid (fields rise + fade in, staggered).
const REVEAL_DURATION = 0.8
const REVEAL_STAGGER = 0.1
const REVEAL_EASE = 'power3.out'
const REVEAL_Y = 30 // px each field rises from

export default function ContactForm({
  formId,
  fields,
  submitLabel = 'SUBMIT',
  confirmationMessage = DEFAULT_CONFIRMATION,
}: Props) {
  const FIELDS = fields?.length ? fields : DEFAULT_FIELDS
  const gridRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')

  // Reveal the fields as the grid scrolls into view. Hidden state is applied
  // from JS (not CSS) so the form still renders normally without it, and
  // clearProps removes every transient style once the reveal finishes.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const fieldEls = Array.from(grid.querySelectorAll<HTMLElement>('.contact-form__field'))
    if (!fieldEls.length) return

    gsap.set(fieldEls, { autoAlpha: 0, y: REVEAL_Y })

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        gsap.to(fieldEls, {
          autoAlpha: 1,
          y: 0,
          duration: REVEAL_DURATION,
          stagger: REVEAL_STAGGER,
          ease: REVEAL_EASE,
          clearProps: 'all',
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(grid)

    return () => {
      observer.disconnect()
      gsap.killTweensOf(fieldEls)
      gsap.set(fieldEls, { clearProps: 'all' })
    }
  }, [])

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!formId) {
      setError('FORM IS NOT CONNECTED YET. PLEASE TRY AGAIN LATER.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          submissionData: FIELDS.map((f) => ({ field: f.name, value: values[f.name] ?? '' })),
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setStatus('success')
    } catch {
      setError('SOMETHING WENT WRONG. PLEASE TRY AGAIN.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form contact-form--done">
        <p className="contact-form__confirmation">{confirmationMessage}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__grid" ref={gridRef}>
        {FIELDS.map((field) => {
          const half = field.width === 50
          const placeholder = (field.label ?? field.name).toUpperCase()
          const common = {
            id: `contact-${field.name}`,
            name: field.name,
            required: field.required,
            'aria-label': field.label ?? field.name,
            value: values[field.name] ?? '',
          }

          return (
            <div
              key={field.name}
              className={`contact-form__field${half ? ' contact-form__field--half' : ''}`}
            >
              {field.blockType === 'textarea' ? (
                <textarea
                  {...common}
                  className="contact-form__textarea"
                  placeholder={placeholder}
                  rows={4}
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
              ) : field.blockType === 'select' ? (
                <div className="contact-form__select-wrap">
                  <select
                    {...common}
                    className="contact-form__select"
                    onChange={(e) => setValue(field.name, e.target.value)}
                  >
                    <option value="">{placeholder}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="contact-form__chevron"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              ) : (
                <input
                  {...common}
                  className="contact-form__input"
                  type={field.blockType === 'email' ? 'email' : field.blockType === 'number' ? 'tel' : 'text'}
                  placeholder={placeholder}
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
              )}
            </div>
          )
        })}
      </div>

      {error && <p className="contact-form__error">{error}</p>}

      <button
        className="custom-button contact-form__submit"
        type="submit"
        disabled={status === 'submitting'}
      >
        <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="ring ring--outer" cx="12" cy="12" r="11" />
          <circle className="ring ring--middle" cx="12" cy="12" r="7" />
          <circle className="ring ring--inner" cx="12" cy="12" r="3" />
        </svg>
        <span>{status === 'submitting' ? 'SENDING…' : submitLabel.toUpperCase()}</span>
      </button>
    </form>
  )
}
