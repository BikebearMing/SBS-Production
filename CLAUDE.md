# StarBrandStudio — Project Conventions

## Buttons — always use the global `.custom-button`

Every button or button-styled link in the frontend MUST use the global `.custom-button`
component (defined in `src/app/(frontend)/globals.css`). Do not write one-off button styles.

Use this exact markup — the three-ring `.custom-button-icon` SVG plus a `<span>` label:

```tsx
{/* As a link */}
<a href="/contact" className="custom-button">
  <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="ring ring--outer" cx="12" cy="12" r="11" />
    <circle className="ring ring--middle" cx="12" cy="12" r="7" />
    <circle className="ring ring--inner" cx="12" cy="12" r="3" />
  </svg>
  <span>LET&rsquo;S WORK TOGETHER</span>
</a>

{/* As a real button (e.g. form submit) */}
<button className="custom-button" type="submit">
  <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="ring ring--outer" cx="12" cy="12" r="11" />
    <circle className="ring ring--middle" cx="12" cy="12" r="7" />
    <circle className="ring ring--inner" cx="12" cy="12" r="3" />
  </svg>
  <span>SUBMIT</span>
</button>
```

Notes:
- `.custom-button` owns all appearance (red fill, hover wipe-to-white, ring animation).
  Any extra class on the element should only add layout concerns (margin/spacing) or
  state (e.g. `:disabled` opacity) — never re-style the fill, padding, font, or icon.
- Label text goes in the `<span>`; keep it uppercase.
- It works on both `<a>` and `<button>` (has `appearance: none` + `border: unset`).

## Typography — never invent font styles

When building a new section (or restyling an existing one), NEVER write your own font
styling (font-family / font-size / font-weight / letter-spacing / line-height /
text-transform). Always use the global type classes defined in
`src/app/(frontend)/globals.css`:

- `.h1` — serif display heading (`.h1.amplitude` = bold Amplitude variant)
- `.h1-v2` — oversized condensed display heading
- `.h1-v3` — condensed display heading sized so a full-sentence line fits one row (hero headlines)
- `.h2-serif` — serif supporting line paired with `.h1-v3` (hero subheadings)
- `.h2` — condensed section heading
- `.h3` — condensed sub-heading
- `.body` — all body/UI copy (e.g. `<p className="body">`)

A section-specific class (e.g. `.awards-page__campaign`) may only add layout (grid
placement, spacing) or color/state — never typography. If a design truly needs a new
type style, add it as a new global class in globals.css next to the ones above, not
inline in a section.

## Tooling

- **Node 22 is required** for the Payload CLI / `tsx` (Node 24 breaks module resolution).
  Use `nvm use 22` before running `npm run generate:types`, `npm run seed`, builds, etc.
- `package.json` has `"type": "module"` — required for Payload's CLI import resolution.

## Security headers

- `next.config.ts` sets the response headers the site is graded on
  (securityheaders.com A+): CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy — plus `poweredByHeader: false`. Don't remove them.
- **Loading a new external origin means updating `cspDirectives` in the same file**, or the
  browser silently blocks it. Check where the origin actually redirects to: `picsum.photos`
  and `streamable.com` both 302 to CDN subdomains, and CSP re-checks the redirect target,
  which is why those entries are wildcards.

## CMS

- Content is served from Payload at request time (`src/app/(frontend)/page.tsx`).
  Components accept optional props and fall back to hardcoded `DEFAULT_*` constants, so the
  site never breaks with an empty/unavailable CMS. Preserve that fallback pattern.
- Re-seed with `npm run seed` (idempotent — media matched by filename, page/footer/form upserted).
- The contact form uses the Form Builder plugin (`forms` + `form-submissions` collections).
- All form email goes out over SMTP through `@payloadcms/email-nodemailer` — it is the
  only email adapter; don't add another. It's configured in `payload.config.ts` against the
  Google Workspace relay (`smtp-relay.gmail.com:25`, STARTTLS) sending as
  `smgbrandstudio@thestar.com.my`. The relay authorises the server by IP allowlist, so
  there are no SMTP credentials — deployments need no email env vars. Set
  `SMTP_DISABLED=true` (already in `.env.local`) for local dev: the relay rejects
  non-allowlisted IPs, so emails are logged to the console instead.
- The From address is owned by the adapter's `defaultFromAddress`; never pass a `from` in
  a `sendEmail` call — the relay rejects senders outside the domain.
