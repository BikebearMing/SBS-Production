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

// SMTP delivery (Google Workspace relay). The relay authorises our server by IP
// allowlist, so there are normally no credentials — SMTP_USER/SMTP_PASS are
// applied only if they're set, e.g. if the relay is switched to authenticated
// mode or a plain Gmail mailbox is used instead.
const SMTP_HOST = process.env.SMTP_HOST || 'smtp-relay.gmail.com'
const SMTP_PORT = Number(process.env.SMTP_PORT || 25)
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM || 'smgbrandstudio@thestar.com.my'

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
  // mock, which is what local dev wants: the relay only accepts allowlisted
  // server IPs, and outbound port 25 is usually blocked on dev machines.
  ...(process.env.SMTP_DISABLED === 'true'
    ? {}
    : {
        email: nodemailerAdapter({
          defaultFromName: 'Star Brand Studio',
          // The relay only accepts a From within the thestar.com.my domain —
          // anything else is rejected, so this is not a free-form field.
          defaultFromAddress: EMAIL_FROM_ADDRESS,
          // The adapter otherwise opens a test connection when the config is
          // loaded, which stalls `next build` inside Docker (the build container
          // can't reach the relay). Send failures are logged by the hook anyway.
          skipVerify: true,
          transportOptions: {
            host: SMTP_HOST,
            port: SMTP_PORT,
            // 465 is implicit TLS; 25/587 start plaintext and upgrade via
            // STARTTLS, which the Google relay supports — require it so
            // submissions are never sent in the clear.
            secure: SMTP_PORT === 465,
            requireTLS: SMTP_PORT !== 465,
            connectionTimeout: 10_000,
            ...(process.env.SMTP_USER && process.env.SMTP_PASS
              ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
              : {}),
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
