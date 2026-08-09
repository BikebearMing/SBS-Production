import type { Block, CollectionConfig, FieldHook } from 'payload'

/**
 * Works — each project is its own document (think WordPress custom post type),
 * editable on its own and reorderable by drag in the admin list view
 * (`orderable: true` stores order in a `_order` field; sort by it everywhere).
 *
 * The /works list renders these as the vertical slider; /works/[slug] renders a
 * single document's inner page. Both <WorksSlider> / the detail route keep
 * hardcoded fallbacks, so the site still renders with an empty/unavailable CMS.
 */

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Auto-fill the slug from the title when left blank, so editors can just type a
// title. An explicit slug is still respected (and is what the URL uses).
const fillSlug: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.trim()) return slugify(value)
  if (data?.title) return slugify(data.title)
  return value
}

/**
 * Inner-page content blocks. The `content` field below is a Payload `blocks`
 * field, so editors can drag these to reorder how they appear on /works/[slug].
 * Every field is optional and the detail page skips empty blocks, preserving the
 * graceful "renders with an empty CMS" pattern.
 */
const textSection: Block = {
  slug: 'textSection',
  labels: { singular: 'Text Section', plural: 'Text Sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Section heading, e.g. “Project Brief”.' },
    },
    {
      name: 'bodyRich',
      label: 'Body',
      type: 'richText',
      admin: {
        description:
          'Section paragraph — supports bold, italic, links, lists. Block is skipped if empty.',
      },
    },
    {
      name: 'bodyRichRight',
      label: 'Body — Right Column',
      type: 'richText',
      admin: {
        description:
          'Optional. When filled, the section becomes two manual columns: Body on the left, this on the right — you control exactly which lines sit in each. When empty, a “Big Idea” section auto-flows into two columns as before.',
      },
    },
    {
      // Legacy plain-text body, superseded by `bodyRich` (WYSIWYG). Kept (hidden)
      // so pre-migration content survives; the 20260721 migration copies it into
      // bodyRich, and the detail page still falls back to it when bodyRich is empty.
      name: 'body',
      type: 'textarea',
      admin: { hidden: true },
    },
  ],
}

const twoImages: Block = {
  slug: 'twoImages',
  labels: { singular: 'Two Images', plural: 'Two Images' },
  fields: [
    { name: 'left', type: 'upload', relationTo: 'media', admin: { description: 'Left image.' } },
    { name: 'right', type: 'upload', relationTo: 'media', admin: { description: 'Right image.' } },
  ],
}

const gallery: Block = {
  slug: 'gallery',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    {
      name: 'images',
      type: 'array',
      labels: { singular: 'Image', plural: 'Images' },
      admin: { description: 'Add any number of images — shown 4 per row, wrapping down.' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}

const oneImage: Block = {
  slug: 'oneImage',
  labels: { singular: 'One Image', plural: 'One Images' },
  fields: [{ name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Full-width image.' } }],
}

const video: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    {
      name: 'url',
      type: 'text',
      admin: {
        description:
          'Video URL — a YouTube link (watch/share/shorts) or a direct mp4/streamable link. Block is skipped if empty.',
      },
    },
  ],
}

export const Works: CollectionConfig = {
  slug: 'works',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'year', 'updatedAt'],
    description: 'Projects shown on /works. Drag rows to reorder how they appear.',
  },
  defaultSort: '_order',
  access: { read: () => true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Campaign title (shown above and beside the slider).' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'URL segment, e.g. "gucci" → /works/gucci. Auto-filled from the title if left blank.',
        position: 'sidebar',
      },
      hooks: { beforeValidate: [fillSlug] },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Slide image / thumbnail (517 × 260).' },
    },
    {
      name: 'year',
      type: 'text',
      admin: { description: 'Campaign year, e.g. 2025.' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Short campaign description.' },
    },
    {
      name: 'tags',
      type: 'array',
      labels: { singular: 'Tag', plural: 'Tags' },
      admin: { description: 'Category tags, e.g. FASHION.' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'Inner Page Content',
      blocks: [textSection, twoImages, gallery, oneImage, video],
      admin: {
        description:
          'Inner page (/works/[slug]) content. Drag blocks to reorder how they appear.',
      },
      // Requested default layout: Project Brief → gallery → The Solution →
      // Impact & Results → 1 image. Editors drag to reorder per project.
      defaultValue: [
        { blockType: 'textSection', heading: 'Project Brief' },
        { blockType: 'gallery' },
        { blockType: 'textSection', heading: 'The Solution' },
        { blockType: 'textSection', heading: 'Impact & Results' },
        { blockType: 'oneImage' },
      ],
    },
    {
      name: 'awards',
      type: 'array',
      labels: { singular: 'Award', plural: 'Awards' },
      admin: {
        description:
          'Awards this campaign won — shown under an “AWARDS” subhead at the bottom of the inner page.',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text', admin: { description: 'Award name shown under the image.' } },
      ],
    },
  ],
}
