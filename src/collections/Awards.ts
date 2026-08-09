import type { CollectionConfig } from 'payload'

/**
 * Awards — each award win is its own document (think WordPress custom post type),
 * editable on its own and reorderable by drag in the admin list view
 * (`orderable: true` stores order in a `_order` field; sort by it everywhere).
 *
 * The /awards route fetches these (sorted by `_order`) and groups them by `year`
 * into the hover list. Each row has two WYSIWYG columns: `middle` (award show
 * title + category bullets) and `right` (the campaign). <AwardsPage> keeps
 * hardcoded DEFAULT_GROUPS as a fallback, so the page still renders fully even
 * with an empty/unavailable CMS. The page heading/eyebrow stay on the small
 * `awardsPage` global (page chrome, kept separate from the awards list itself).
 */
export const Awards: CollectionConfig = {
  slug: 'awards',
  orderable: true,
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'year', 'updatedAt'],
    description: 'Awards shown on /awards. Drag rows to reorder; the page groups them by year.',
  },
  defaultSort: '_order',
  access: { read: () => true },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description:
          'Short label for the admin list only — not shown on the site, e.g. “WAN-IFRA 2023 — Native Advertising”.',
      },
    },
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. “2025”. Awards are grouped under this year on the page.',
        position: 'sidebar',
      },
    },
    {
      name: 'middle',
      label: 'Middle column',
      type: 'richText',
      admin: {
        description:
          'Award show title (bold) followed by the award categories as a bullet list, e.g. “Best Native Advertising/Sponsored Content Campaign - GOLD”.',
      },
    },
    {
      name: 'campaign',
      label: 'Right column',
      type: 'richText',
      admin: { description: 'Campaign / project the award was for.' },
    },
    {
      name: 'awardImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Trophy / award photo. Used on the home “Awards & Recognition” strip.' },
    },
    {
      name: 'groupPhoto',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Group / team photo. Shown in the media column when this row is hovered.' },
    },
  ],
}
