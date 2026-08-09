import type { CollectionAfterChangeHook, Field } from 'payload'

/**
 * Contact-form email notifications.
 *
 * Recipients are read from the `notificationEmails` field on the form document
 * (editable in the admin — paste one or more addresses, separated by commas,
 * semicolons or new lines). When a submission is created we render a styled
 * HTML email and send it to every recipient via `payload.sendEmail`.
 *
 * Sending only actually happens when an email adapter is configured in
 * payload.config.ts (Resend, gated behind RESEND_API_KEY). Without it Payload
 * falls back to a console mock, so local dev never breaks.
 */

const FROM =
  process.env.EMAIL_FROM ||
  (process.env.SMTP_USER
    ? `Star Brand Studio <${process.env.SMTP_USER}>`
    : 'Star Brand Studio <onboarding@resend.dev>')

// Brand palette (kept here because emails need inline styles, not CSS classes).
const BRAND_RED = '#D8232A'
const INK = '#1a1a1a'
const MUTED = '#6b7280'
const BORDER = '#e5e7eb'
const BG = '#f4f4f5'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Split a pasted string of addresses into a clean, validated, de-duped list. */
export function parseRecipients(raw: unknown): string[] {
  if (typeof raw !== 'string') return []
  const seen = new Set<string>()
  return raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => {
      const key = s.toLowerCase()
      if (!EMAIL_RE.test(s) || seen.has(key)) return false
      seen.add(key)
      return true
    })
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type Row = { label: string; value: string }

/**
 * The `notificationEmails` field added to the forms collection.
 * Exported so payload.config.ts can append it via formOverrides.
 */
export const notificationEmailsField: Field = {
  name: 'notificationEmails',
  type: 'textarea',
  label: 'Notification recipients',
  admin: {
    description:
      'Email address(es) that receive a notification for each submission. Separate multiple addresses with commas, semicolons or new lines. Leave blank to disable notifications.',
    placeholder: 'jane@example.com, team@example.com',
  },
}

/**
 * Resolve a submission entry to a human-readable label + value, using the
 * form's own field definitions (so select options show their label, not slug).
 */
function buildRows(
  submissionData: Array<{ field: string; value: unknown }>,
  formFields: Array<Record<string, unknown>>,
): Row[] {
  const byName = new Map<string, Record<string, unknown>>()
  for (const f of formFields) {
    if (f && typeof f.name === 'string') byName.set(f.name, f)
  }

  return submissionData
    .filter((entry) => entry && entry.field)
    .map((entry) => {
      const def = byName.get(entry.field)
      const label = (def?.label as string) || entry.field
      let value = entry.value

      // Map select option value -> label for nicer display.
      if (def?.blockType === 'select' && Array.isArray(def.options)) {
        const opt = (def.options as Array<{ label: string; value: string }>).find(
          (o) => o.value === value,
        )
        if (opt) value = opt.label
      }

      return {
        label,
        value: value === '' || value == null ? '—' : String(value),
      }
    })
}

function renderHtml(rows: Row[], formTitle: string, submittedAt: string): string {
  const rowsHtml = rows
    .map(
      (r, i) => `
        <tr>
          <td style="padding:14px 20px;border-top:1px solid ${BORDER};background:${
            i % 2 === 0 ? '#ffffff' : '#fafafa'
          };width:38%;vertical-align:top;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:${MUTED};font-family:Arial,Helvetica,sans-serif;">
            ${escapeHtml(r.label)}
          </td>
          <td style="padding:14px 20px;border-top:1px solid ${BORDER};background:${
            i % 2 === 0 ? '#ffffff' : '#fafafa'
          };vertical-align:top;font-size:15px;line-height:1.5;color:${INK};font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">
            ${escapeHtml(r.value)}
          </td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <title>New ${escapeHtml(formTitle)} enquiry</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">New ${escapeHtml(
    formTitle,
  )} enquiry via the website.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:${BRAND_RED};padding:28px 32px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.82);font-family:Arial,Helvetica,sans-serif;">
                Star Brand Studio
              </div>
              <div style="margin-top:6px;font-size:22px;font-weight:700;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                New ${escapeHtml(formTitle)} Enquiry
              </div>
            </td>
          </tr>
          <!-- Intro -->
          <tr>
            <td style="padding:24px 32px 4px;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:${INK};font-family:Arial,Helvetica,sans-serif;">
                A new enquiry just came in through the website. The details are below.
              </p>
            </td>
          </tr>
          <!-- Details table -->
          <tr>
            <td style="padding:20px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden;border-collapse:separate;">
                ${rowsHtml}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 28px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED};font-family:Arial,Helvetica,sans-serif;">
                Submitted ${escapeHtml(submittedAt)}.<br />
                This is an automated notification from the Star Brand Studio website.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function renderText(rows: Row[], formTitle: string, submittedAt: string): string {
  const lines = rows.map((r) => `${r.label}: ${r.value}`).join('\n')
  return `New ${formTitle} Enquiry\n\n${lines}\n\nSubmitted ${submittedAt}.\nAutomated notification from the Star Brand Studio website.`
}

export const sendContactNotification: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  try {
    const formId = typeof doc.form === 'object' && doc.form ? doc.form.id : doc.form
    if (!formId) return doc

    const form = await req.payload.findByID({
      collection: 'forms',
      id: formId,
      depth: 0,
    })

    const recipients = parseRecipients(form?.notificationEmails)
    if (recipients.length === 0) return doc

    const submissionData = Array.isArray(doc.submissionData) ? doc.submissionData : []
    const formFields = Array.isArray(form.fields)
      ? (form.fields as unknown as Array<Record<string, unknown>>)
      : []

    const rows = buildRows(submissionData, formFields)
    const formTitle = form.title ? String(form.title) : 'Contact'

    // Use the submitter's name in the subject when available.
    const nameRow = rows.find((r) => /name/i.test(r.label))
    const subject = nameRow && nameRow.value !== '—'
      ? `New ${formTitle} enquiry from ${nameRow.value}`
      : `New ${formTitle} enquiry`

    const submittedAt = new Date().toLocaleString('en-MY', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kuala_Lumpur',
    })

    // Reply directly to the submitter when they gave an email.
    const emailRow = submissionData.find((e) => /email/i.test(e.field))
    const replyTo =
      emailRow && typeof emailRow.value === 'string' && EMAIL_RE.test(emailRow.value)
        ? emailRow.value
        : undefined

    await req.payload.sendEmail({
      to: recipients,
      from: FROM,
      ...(replyTo ? { replyTo } : {}),
      subject,
      html: renderHtml(rows, formTitle, submittedAt),
      text: renderText(rows, formTitle, submittedAt),
    })

    req.payload.logger.info(
      `Contact notification sent to ${recipients.length} recipient(s) for form "${formTitle}".`,
    )
  } catch (err) {
    // Never let a notification failure break the submission itself.
    req.payload.logger.error({ err }, 'Failed to send contact form notification email.')
  }

  return doc
}
