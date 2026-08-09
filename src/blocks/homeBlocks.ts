import type { Block } from 'payload'

/**
 * Home-page section blocks. Each block maps 1:1 to a section component in
 * src/components. Field names mirror the data each component needs; the
 * components keep their original hardcoded values as fallbacks, so an empty
 * block still renders the original design.
 */

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    {
      name: 'messages',
      type: 'array',
      labels: { singular: 'Message', plural: 'Messages' },
      admin: {
        description:
          'Headline + serif line pairs the hero cycles through (headline mask-reveals, serif line typewrites).',
      },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'subheading', type: 'text', required: true },
      ],
    },
    {
      name: 'carousel',
      type: 'array',
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: { description: 'Rotating 3D carousel images and their labels.' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'brand', type: 'text', required: true },
        { name: 'copy', type: 'text' },
      ],
    },
  ],
}

export const WhatWeDoBlock: Block = {
  slug: 'whatWeDo',
  labels: { singular: 'What We Do', plural: 'What We Do' },
  fields: [
    { name: 'label', type: 'text', defaultValue: 'WHAT WE DO' },
    {
      name: 'headingBefore',
      type: 'textarea',
      admin: { description: 'Heading text before the inline logo.' },
      defaultValue:
        'Across every platform—digital, radio, on-ground, print and social—we bring brand',
    },
    {
      name: 'inlineLogo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Small animated logo shown inline in the heading.' },
    },
    {
      name: 'headingAfter',
      type: 'textarea',
      defaultValue:
        'ideas to life, creating moments that spark connection and inspire action.',
    },
    {
      name: 'showreelUrl',
      type: 'text',
      admin: { description: 'Showreel video URL (mp4 or streamable).' },
    },
    {
      name: 'showreelThumbnail',
      type: 'text',
      admin: { description: 'Looping thumbnail video URL shown in the panel.' },
    },
  ],
}

export const PillarsBlock: Block = {
  slug: 'pillars',
  labels: { singular: 'Pillars', plural: 'Pillars' },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'ROOTED IN AUDIENCE INSIGHTS AND CREDIBLE JOURNALISM, WE DELIVER :',
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Pillar', plural: 'Pillars' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Use a line break for two-line labels.' },
        },
        { name: 'copy', type: 'textarea', required: true },
      ],
    },
  ],
}

export const LogosBlock: Block = {
  slug: 'logos',
  labels: { singular: 'Client Logos', plural: 'Client Logos' },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Logo', plural: 'Logos' },
      fields: [{ name: 'logo', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}

export const AwardsBlock: Block = {
  slug: 'awards',
  labels: { singular: 'Awards', plural: 'Awards' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'AWARDS' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'VIEW ALL AWARDS' },
    {
      name: 'caption',
      type: 'textarea',
      defaultValue: 'AWARD-WINNING IDEAS GROUNDED IN GOOD STORYTELLING',
    },
    { name: 'recognitions', type: 'text', defaultValue: '& RECOGNITIONS' },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Award', plural: 'Awards' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'name',
          type: 'text',
          admin: { description: 'Award name shown when hovering the strip image.' },
        },
        { name: 'alt', type: 'text' },
      ],
    },
  ],
}

export const ProjectsBlock: Block = {
  slug: 'projects',
  labels: { singular: 'Featured Projects', plural: 'Featured Projects' },
  fields: [
    { name: 'headingBefore', type: 'text', defaultValue: 'FEATURED' },
    { name: 'headingHighlight', type: 'text', defaultValue: 'PROJECTS' },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Project', plural: 'Projects' },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          admin: { description: 'Unique id, e.g. "gucci" (lowercase, no spaces).' },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'year', type: 'text', defaultValue: '2025' },
        { name: 'thumbnail', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'hoverVideoUrl',
          type: 'text',
          admin: { description: 'Optional video URL shown on hover.' },
        },
        {
          name: 'hoverImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional background image shown on hover when there is no video — rendered black & white under the dark radial fade.',
          },
        },
        { name: 'copy', type: 'textarea' },
        {
          name: 'link',
          type: 'text',
          admin: {
            description:
              'Path the project image and "OUR WORK" button go to, e.g. /works or /works/gucci. Defaults to /works.',
          },
        },
        {
          name: 'tags',
          type: 'array',
          labels: { singular: 'Tag', plural: 'Tags' },
          fields: [{ name: 'tag', type: 'text', required: true }],
        },
      ],
    },
  ],
}

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Services', plural: 'Services' },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Service', plural: 'Services' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'copy', type: 'textarea', required: true },
      ],
    },
  ],
}

export const ImpactCTABlock: Block = {
  slug: 'impactCTA',
  labels: { singular: 'Impact CTA', plural: 'Impact CTA' },
  fields: [
    { name: 'headingTop', type: 'text', defaultValue: 'LET’S', admin: { description: 'Top heading word.' } },
    {
      name: 'copy',
      type: 'textarea',
      defaultValue: 'TOGETHER, WE’LL BUILD SOMETHING\nWORTH TALKING ABOUT.',
      admin: { description: 'Supporting line; use a line break for two lines.' },
    },
    { name: 'impactWord', type: 'text', defaultValue: 'CONNECT', admin: { description: 'Large word shown at the bottom.' } },
    {
      name: 'trailImages',
      type: 'array',
      labels: { singular: 'Trail Image', plural: 'Trail Images' },
      admin: { description: 'Images that trail the cursor across this section. Leave empty to use the built-in defaults.' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}

export const homeBlocks: Block[] = [
  HeroBlock,
  WhatWeDoBlock,
  PillarsBlock,
  LogosBlock,
  AwardsBlock,
  ProjectsBlock,
  ServicesBlock,
  ImpactCTABlock,
]
