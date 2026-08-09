import type { CollectionConfig } from 'payload'
import { homeBlocks } from '../blocks/homeBlocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path, e.g. "about" or "work". Use "home" for the landing page.',
      },
    },
    {
      // Block-based body — each block is a homepage section. The order here is
      // the render order on the page. Reusable for future pages too.
      name: 'layout',
      type: 'blocks',
      blocks: homeBlocks,
    },
    {
      type: 'group',
      name: 'meta',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
