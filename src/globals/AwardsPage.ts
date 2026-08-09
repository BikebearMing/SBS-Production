import type { GlobalConfig } from 'payload'

/**
 * Awards page chrome (route: /awards) — just the eyebrow + heading shown above
 * the list. The awards themselves live in the `awards` collection (a custom post
 * type, one document per award win); the /awards route fetches those and groups
 * them by year. This singleton stays small on purpose so editors manage the page
 * title here and the award entries in the collection.
 *
 * The <AwardsPage> component keeps hardcoded defaults as a fallback, so the page
 * still renders fully even with an empty/unavailable CMS.
 */
export const AwardsPage: GlobalConfig = {
  slug: 'awardsPage',
  label: 'Awards Page',
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'AWARDS' },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'Award-winning ideas,\ngrounded in the craft of storytelling.',
      admin: { description: 'Page heading. Use line breaks for stacked lines.' },
    },
  ],
}
