import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [
    {
      name: 'address',
      type: 'textarea',
      defaultValue:
        'Menara Star, 15, Jalan 16/11, Seksyen 16, 46350 Petaling Jaya, Selangor Darul Ehsan, Malaysia',
    },
    {
      name: 'phones',
      type: 'array',
      labels: { singular: 'Phone', plural: 'Phones' },
      fields: [{ name: 'number', type: 'text', required: true }],
    },
    {
      name: 'directory',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'updatesLabel', type: 'text', defaultValue: 'GET THE LATEST UPDATES' },
    {
      name: 'showSocials',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Show the social-media block ("GET THE LATEST UPDATES" + icons) in the footer. Untick to hide it site-wide.',
      },
    },
    {
      name: 'socials',
      type: 'array',
      labels: { singular: 'Social', plural: 'Socials' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Social icon (svg/png).' },
        },
      ],
    },
    {
      name: 'brandLogo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Footer brand logo (SMG Brand Studio).' },
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: 'Copyrights © of Star Media Group 2026',
    },
    { name: 'email', type: 'text', defaultValue: 'SMGBRANDSTUDIO@THESTAR.COM.MY' },
  ],
}
