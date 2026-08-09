import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Anyone can read media (so the public site can display it)
    read: () => true,
  },
  upload: {
    // Locally, files are written to ./media. On Vercel, the Vercel Blob
    // storage plugin (see payload.config.ts) intercepts this and uploads
    // to Blob instead — so this staticDir is only used in local dev.
    staticDir: 'media',
    // Auto-generate a few sensible sizes. Add/remove as your design needs.
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 768, height: undefined, position: 'centre' },
      { name: 'large', width: 1920, height: undefined, position: 'centre' },
    ],
    mimeTypes: ['image/*', 'video/*', 'application/json', 'image/svg+xml'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
      admin: {
        description: 'Describe the image for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
