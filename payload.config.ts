import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { resendAdapter } from '@payloadcms/email-resend'
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
  // Email delivery — Gmail SMTP when SMTP_USER/SMTP_PASS are set, else Resend
  // when RESEND_API_KEY is set. Without either, Payload falls back to a console
  // mock so local dev still works.
  ...(process.env.SMTP_USER && process.env.SMTP_PASS
    ? {
        email: nodemailerAdapter({
          defaultFromName: 'Star Brand Studio',
          // Gmail only honors a From matching the authenticated account (or a
          // configured "Send mail as" alias) — anything else gets rewritten.
          defaultFromAddress: process.env.EMAIL_FROM || process.env.SMTP_USER,
          transportOptions: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT || 465),
            secure: Number(process.env.SMTP_PORT || 465) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }),
      }
    : process.env.RESEND_API_KEY
      ? {
          email: resendAdapter({
            defaultFromName: 'Star Brand Studio',
            defaultFromAddress:
              process.env.EMAIL_FROM || 'onboarding@resend.dev',
            apiKey: process.env.RESEND_API_KEY,
          }),
        }
      : {}),
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
