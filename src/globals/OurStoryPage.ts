import type { GlobalConfig } from 'payload'

/**
 * Our Story page (route: /our-story). A singleton for the three bespoke
 * sections — the hero, the intro (section 1) and the "what makes us different"
 * cards (section 2). The bottom CTA + contact form are cloned from the home
 * page and keep reading their own CMS sources, so they're not modelled here.
 *
 * Every <StoryHero> / <OurStory> / <OurDifference> keeps hardcoded defaults as
 * a fallback, so the page still renders fully with an empty/unavailable CMS.
 */
export const OurStoryPage: GlobalConfig = {
  slug: 'ourStoryPage',
  label: 'Our Story Page',
  access: { read: () => true },
  fields: [
    {
      type: 'group',
      name: 'hero',
      label: 'Hero',
      fields: [
        { name: 'line1', type: 'text', defaultValue: 'WE TELL STORIES' },
        { name: 'line2', type: 'text', defaultValue: 'FOR A LIVING.' },
        {
          name: 'highlight',
          type: 'text',
          defaultValue: 'THIS ONE’S OURS.',
          admin: { description: 'Shown in the white highlight box on its own line.' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Full-width image that scales into place on scroll.' },
        },
      ],
    },
    {
      type: 'group',
      name: 'intro',
      label: 'Intro (Section 1)',
      fields: [
        {
          name: 'title',
          type: 'textarea',
          defaultValue:
            'SMG BRAND STUDIO — THE FULL-SERVICE MARKETING ARM OF STAR MEDIA GROUP.',
        },
        {
          name: 'copy1',
          type: 'textarea',
          label: 'Body copy (left)',
          defaultValue:
            'WE HELP ORGANISATIONS NAVIGATE COMPLEX ISSUES AND CONNECT WITH THE AUDIENCES THAT MATTER — COMBINING THE CREDIBILITY OF JOURNALISM, THE RIGOUR OF DATA, AND THE REACH OF AN INTEGRATED MEDIA GROUP.',
        },
        {
          name: 'copy2',
          type: 'textarea',
          label: 'Body copy (right)',
          defaultValue:
            'INSTEAD OF STARTING WITH A CREATIVE CONCEPT, WE START WITH EVIDENCE AND WITH PEOPLE. WHAT THEY READ, WHAT THEY CARE ABOUT, AND THE FORCES DRIVING THE CONVERSATIONS AROUND THEM. FROM THERE, WE BUILD AND ACTIVATE NARRATIVES THAT EARN ATTENTION RATHER THAN CHASE IT.',
        },
        {
          name: 'marquee',
          type: 'array',
          label: 'Marquee Images',
          labels: { singular: 'Image', plural: 'Images' },
          admin: { description: 'Angled scrolling strip under the intro copy.' },
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
        },
      ],
    },
    {
      type: 'group',
      name: 'difference',
      label: 'What Makes Us Different (Section 2)',
      fields: [
        { name: 'titlePre', type: 'text', defaultValue: 'WHAT MAKES US' },
        {
          name: 'titleHighlight',
          type: 'text',
          defaultValue: 'DIFFERENT',
          admin: { description: 'Shown in the inverted highlight box.' },
        },
        {
          name: 'cards',
          type: 'array',
          labels: { singular: 'Card', plural: 'Cards' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
          defaultValue: [
            {
              title: 'BACKED BY JOURNALISTS AND MEDIA',
              body: 'OUR TEAM INCLUDES EXPERIENCED JOURNALISTS, AND WE WORK ACROSS THE WIDER MEDIA LANDSCAPE — STAR MEDIA GROUP’S OWN ECOSYSTEM AND PARTNERS BEYOND IT. THAT GIVES OUR WORK EDITORIAL CREDIBILITY AND GENUINE REACH: THE ABILITY TO SHAPE A STORY AND PUT IT IN FRONT OF THE RIGHT AUDIENCE, NOT JUST PRODUCE CONTENT AND HOPE IT LANDS.',
            },
            {
              title: 'DATA-CENTRIC BY DEFAULT',
              body: 'EVERY ENGAGEMENT STARTS WITH EVIDENCE, NOT ASSUMPTIONS. WE DRAW ON DATA ANALYTICS — AUDIENCE INSIGHTS, MEDIA DATA, AND RESEARCH — TO READ WHAT’S RESONATING AND HOW PERCEPTIONS ARE SHIFTING, SO DECISIONS ARE GROUNDED IN REAL INTELLIGENCE, NOT GUESSWORK.',
            },
            {
              title: 'SUBJECT-MATTER EXPERTISE',
              body: 'WE GO DEEP ON THE ISSUES DEFINING BUSINESS AND SOCIETY — FROM SUSTAINABILITY AND ESG TO NATION-BUILDING, YOUTH ENGAGEMENT, EDUCATION, INNOVATION, AND ECONOMIC DEVELOPMENT. THIS LETS ORGANISATIONS TAKE A CREDIBLE POSITION IN IMPORTANT DEBATES, RATHER THAN COMMENT FROM THE SIDELINES.',
            },
            {
              title: 'ONE TEAM, END TO END',
              body: 'THE SAME TEAM TAKES A PROJECT FROM INSIGHT TO EXECUTION — RESEARCH, STRATEGY, CONTENT AND VIDEO PRODUCTION, MEDIA AMPLIFICATION, YOUTH & SOCIAL IMPACT PROGRAMMES, AND EXPERIENTIAL ACTIVATION, ALL UNDER ONE STRATEGY. STORYTELLING AND DELIVERY STAY CONNECTED FROM START TO FINISH, WITH ONE ACCOUNTABLE TEAM BEHIND EVERY STAGE.',
            },
          ],
        },
      ],
    },
  ],
}
