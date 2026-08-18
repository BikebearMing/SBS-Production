import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { notificationEmailsField, sendContactNotification } from './src/forms/contactNotification'
import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'
import { Works } from './src/collections/Works'
import { Awards } from './src/collections/Awards'
import { Footer } from './src/globals/Footer'
import { AwardsPage } from './src/globals/AwardsPage'
import { OurStoryPage } from './src/globals/OurStoryPage'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// SMTP delivery (Amazon SES). Unlike the old Google Workspace relay, SES does not
// allowlist by IP — every connection must authenticate with SES SMTP credentials,
// so SMTP_USER/SMTP_PASS are required wherever email is enabled.
const SMTP_HOST = process.env.SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com'
// 587 is SES's STARTTLS submission port; 465/2465 are implicit TLS and 25/2587 also
// work, but 25 is throttled by SES and blocked outbound by many hosts.
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
// SES only accepts a From that matches a verified identity in the same region.
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM || 'smgbrandstudio@thestar.com.my'
// Name announced in the SMTP EHLO/HELO greeting. Nodemailer defaults this to the
// machine hostname, which inside Docker is the random container ID — not a domain.
// SES tolerates that, but a real domain keeps the handshake clean and portable.
const SMTP_EHLO_NAME = process.env.SMTP_EHLO_NAME || 'thestar.com.my'

const emailEnabled = process.env.SMTP_DISABLED !== 'true'
if (emailEnabled && !(SMTP_USER && SMTP_PASS)) {
  // Not fatal — failing the config load would take the whole app down over email.
  console.warn(
    '[email] SMTP_USER/SMTP_PASS are not set. Amazon SES requires authentication; ' +
      'sends will fail with 530 until they are provided (or set SMTP_DISABLED=true).',
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Works, Awards],
  globals: [Footer, AwardsPage, OurStoryPage],
  editor: lexicalEditor(),
  // Required by Payload for image resizing (Media imageSizes) and admin thumbnails.
  sharp,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Migrations live here. In dev, Payload still auto-pushes schema changes
    // (fast iteration); in production push is off, so `payload migrate` applies
    // committed migrations to the prod DB instead. See src/migrations.
    migrationDir: path.resolve(dirname, 'src/migrations'),
  }),
  secret: process.env.PAYLOAD_SECRET || 'star-brand-studio-local-secret',
  // Email delivery — every form email (contact notifications and any emails
  // configured on a form in the admin) goes out over SMTP via nodemailer.
  // Set SMTP_DISABLED=true (see .env.local) to fall back to Payload's console
  // mock, which is what local dev wants when there are no SES credentials to hand
  // (and it stops dev runs from spending the real SES sending quota).
  ...(!emailEnabled
    ? {}
    : {
        email: nodemailerAdapter({
          defaultFromName: 'Star Brand Studio',
          // SES rejects any From that isn't a verified identity (this address or
          // its domain) in the SES region above, so this is not a free-form field.
          defaultFromAddress: EMAIL_FROM_ADDRESS,
          // The adapter otherwise opens a test connection when the config is
          // loaded, which stalls `next build` inside Docker (the build container
          // can't reach SES). Send failures are logged by the hook anyway.
          skipVerify: true,
          transportOptions: {
            host: SMTP_HOST,
            port: SMTP_PORT,
            name: SMTP_EHLO_NAME,
            // 465/2465 are implicit TLS; 25/587/2587 start plaintext and upgrade
            // via STARTTLS — require it so credentials and submissions are never
            // sent in the clear.
            secure: SMTP_PORT === 465 || SMTP_PORT === 2465,
            requireTLS: !(SMTP_PORT === 465 || SMTP_PORT === 2465),
            connectionTimeout: 10_000,
            // SES always requires auth; the warning above fires if these are unset.
            ...(SMTP_USER && SMTP_PASS ? { auth: { user: SMTP_USER, pass: SMTP_PASS } } : {}),
          },
        }),
      }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    // Adds `forms` + `form-submissions` collections to the admin.
    // Build a form in the admin, then render it / POST submissions from the site.
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      // Add a "Notification recipients" field to each form document so an admin
      // can paste the address(es) that should receive submission notifications.
      formOverrides: {
        fields: ({ defaultFields }) => [...defaultFields, notificationEmailsField],
      },
      // Send a styled HTML notification email whenever a submission is created.
      formSubmissionOverrides: {
        hooks: {
          afterChange: [sendContactNotification],
        },
      },
    }),
    // Only activates when BLOB_READ_WRITE_TOKEN is set (i.e. on Vercel).
    // Locally the token is absent, so Media falls back to disk (./media).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
