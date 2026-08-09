/**
 * Seeds the homepage content into Payload so the site renders from the CMS
 * identically to the original hardcoded design.
 *
 * Run:  npm run seed
 * Safe to re-run — media is matched by filename, the home page + footer are upserted.
 */
import path from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })

  const uploaded = new Map<string, number>()
  async function img(rel: string, alt = ''): Promise<number> {
    if (uploaded.has(rel)) return uploaded.get(rel)!
    const filename = path.basename(rel)
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })
    let id: number
    if (existing.docs[0]) {
      id = existing.docs[0].id as number
    } else {
      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        filePath: path.resolve(process.cwd(), 'public', rel),
      })
      id = doc.id as number
      console.log(`  ↑ uploaded ${filename}`)
    }
    uploaded.set(rel, id)
    return id
  }

  console.log('Uploading media…')

  const carousel = [
    { rel: 'carousel/01-busan.jpg', brand: 'Train To Busan', copy: 'Resorts World Genting' },
    { rel: 'carousel/02-eq.png', brand: 'The Launch of EQ', copy: 'Mercedes-Benz' },
    { rel: 'carousel/03-mpoc.jpg', brand: 'The Sustainable Palm Oil Revolution', copy: 'Malaysian Palm Oil Council' },
    { rel: 'carousel/04-patek.jpg', brand: 'Timepiece of tradition', copy: "The origins of Patek Philippe's Calatrava wristwatch" },
    { rel: 'carousel/05-auchentoshan.jpg', brand: 'Auchentoshan', copy: 'The single malt whisky with a love for three' },
    { rel: 'carousel/06-jomsapot.jpg', brand: '#JomSapot BeliLokal Integrated Marketing Campaign' },
    { rel: 'carousel/07-elmina.jpg', brand: 'Elmina Rainforest Knowledge Centre Sustainability Campaign' },
    { rel: 'carousel/08-gamuda.png', brand: 'Gamuda Technology Website' },
  ]
  const logos = ['thestar.png', 'mstar.png', 'star-property.png', 'rage.png', 'kuntum.png', 'suria.png', '988.png']
  const awards = ['award1.png', 'award2.png', 'award3.png', 'award4.png', 'award5.png']

  const carouselBlocks = []
  for (const c of carousel) {
    carouselBlocks.push({ image: await img(c.rel, c.brand), brand: c.brand, copy: c.copy })
  }
  const logoBlocks = []
  for (const l of logos) logoBlocks.push({ logo: await img(`logos/${l}`) })
  const awardBlocks = []
  for (const a of awards) awardBlocks.push({ image: await img(a) })

  const inlineLogo = await img('SMG_Logo-Loop-Animation.gif', 'SMG')
  const gucciThumb = await img('gucci.png', 'Gucci')
  const nikeThumb = await img('nikethumb.png', 'Nike')
  const snickersThumb = await img('snickers.png', 'Snickers')
  const mcdThumb = await img('mcdonalds.png', "McDonald's")
  const worksBg = await img('works-bg.png', 'Works')
  // Imagery for the works collection (see the seeding block below). Client-supplied
  // case-study photos live in public/works/. Campaigns without a dedicated asset
  // (Kimball, The Star ESG, A Shared Home) reuse `worksBg` as a placeholder.
  const elminaImg = await img('carousel/07-elmina.jpg', 'Elmina Rainforest Knowledge Centre')
  const elminaMasthead = await img('works/elmina-masthead.gif', 'Elmina Rainforest Knowledge Centre campaign masthead')
  const jomsapotImg = await img('works/rhb-jomsapot.jpg', 'RHB #JomSapot BeliLokal')
  const rhbMasthead = await img('works/rhb-masthead.jpg', 'RHB #JomSapot BeliLokal masthead')
  const rhbCta = await img('works/rhb-cta.jpg', 'RHB #JomSapot BeliLokal')
  const tnb1 = await img('works/tnb-1.jpg', 'TNB Powering The Future')
  const tnb2 = await img('works/tnb-2.jpg', 'TNB Powering The Future')
  const tnb3 = await img('works/tnb-3.jpg', 'TNB Powering The Future')
  const tnb4 = await img('works/tnb-4.jpg', 'TNB Powering The Future')
  const sngei1 = await img('works/sngei-1.jpg', 'Star Next Gen Eco Innovators')
  const sngei2 = await img('works/sngei-2.jpg', 'Star Next Gen Eco Innovators')
  const sngei3 = await img('works/sngei-3.jpg', 'Star Next Gen Eco Innovators')
  const sngei4 = await img('works/sngei-4.jpg', 'Star Next Gen Eco Innovators')
  const mpocImg = await img('works/mpoc-1.jpg', 'The Sustainable Palm Oil Revolution')
  const mpocImg2 = await img('works/mpoc-2.jpg', 'The Sustainable Palm Oil Revolution')
  const mpocImg3 = await img('works/mpoc-3.jpg', 'The Sustainable Palm Oil Revolution')
  const esgImg = await img('4433@712817_PULLOUT_SP03_NAT_27-02-2025_p01.jpg', 'The Star ESG')
  const brandLogo = await img('footer/smg-brand-studio.png', 'SMG Brand Studio')
  const fbIcon = await img('footer/facebook.svg', 'Facebook')
  const igIcon = await img('footer/instagram.svg', 'Instagram')

  console.log('Building home layout…')

  const layout = [
    {
      blockType: 'hero',
      messages: [
        {
          heading: 'THE CREDIBILITY OF JOURNALISM',
          subheading: 'LENDS YOUR BRAND THE CREDIBILITY AUDIENCES ALREADY BELIEVE.',
        },
        {
          heading: 'THE EXPERTISE BEHIND THE STORIES',
          subheading: 'POSITIONS YOUR BRAND AS AN AUTHORITATIVE VOICE.',
        },
        {
          heading: 'DATA-LED AUDIENCE INTELLIGENCE',
          subheading: 'TURNS AUDIENCE BEHAVIOUR INTO MARKETING ADVANTAGE.',
        },
        {
          heading: 'AN INTEGRATED ECOSYSTEM',
          subheading: 'DELIVERS STRATEGY TO EXECUTION AS ONE SEAMLESS SOLUTION.',
        },
      ],
      carousel: carouselBlocks,
    },
    {
      blockType: 'whatWeDo',
      label: 'WHAT WE DO',
      headingBefore:
        'Across every platform—digital, radio, on-ground, print and social—we bring brand',
      inlineLogo,
      headingAfter: 'ideas to life, creating moments that spark connection and inspire action.',
      showreelUrl: 'https://streamable.com/l/q9wy22/mp4.mp4',
      showreelThumbnail: 'https://streamable.com/l/q9wy22/mp4.mp4',
    },
    {
      blockType: 'pillars',
      heading: 'ROOTED IN AUDIENCE INSIGHTS AND \nCREDIBLE JOURNALISM, WE DELIVER :',
      items: [
        { label: 'CREDIBILITY', copy: 'We bring editorial authority to your brand, built on decades of trusted journalism. Our newsroom experience shapes how we research, question, and craft stories with clarity and integrity.' },
        { label: 'TRUSTED IMPACT', copy: 'Where credibility meets creativity. We don’t just tell stories—we deliver content that informs, engages, and moves audiences to action.' },
        { label: 'AUDIENCE-CENTRIC\nCREATIVITY', copy: 'Creativity grounded in data, culture, and human insight. We combine audience understanding with multimedia storytelling to produce content that captures attention and builds trust.' },
      ],
    },
    { blockType: 'logos', items: logoBlocks },
    {
      blockType: 'awards',
      title: 'AWARDS',
      buttonLabel: 'VIEW ALL AWARDS',
      caption: 'AWARD-WINNING IDEAS \nGROUNDED IN GOOD\nSTORYTELLING',
      recognitions: '& RECOGNITIONS',
      items: awardBlocks,
    },
    {
      blockType: 'projects',
      headingBefore: 'FEATURED',
      headingHighlight: 'PROJECTS',
      items: [
        { key: 'gucci', title: 'GUCCI WALK YOUR WAY', year: '2025', thumbnail: gucciThumb, hoverVideoUrl: 'https://streamable.com/l/ulxzt8/mp4.mp4', copy: 'A FASHION-FORWARD CAMPAIGN CELEBRATING SELF-EXPRESSION THROUGH WALKING, BLENDING ICONIC HOUSE CODES WITH STREET CULTURE.', tags: [{ tag: 'FASHION' }, { tag: 'BRAND FILM' }] },
        { key: 'newproject', title: 'NEW PROJECT TITLE', year: '2025', thumbnail: worksBg, copy: 'ADD A SHORT PROJECT OVERVIEW HERE — WHAT THE CAMPAIGN WAS AND WHY IT WORKED.', tags: [{ tag: 'CATEGORY' }, { tag: 'DISCIPLINE' }] },
        { key: 'nike', title: 'NIKE EVERYTHING IS POSSIBLE', year: '2025', thumbnail: nikeThumb, hoverVideoUrl: 'https://streamable.com/l/xx3sll/mp4-high.mp4', copy: "A BOLD MANIFESTO PROVING THAT NO LIMIT IS FIXED — TURNING ATHLETES' DOUBT INTO PROOF THROUGH UNFLINCHING STORYTELLING.", tags: [{ tag: 'SPORTS' }, { tag: 'VIDEO PRODUCTION & MEDIA' }] },
        { key: 'snickers', title: "SNICKERS YOU'RE NOT YOU WHEN YOU'RE HUNGRY", year: '2025', thumbnail: snickersThumb, copy: 'A WITTY INTEGRATED CAMPAIGN LEANING INTO THE INSIGHT THAT HUNGER CHANGES WHO YOU ARE — BUILT FOR SOCIAL AND OUT-OF-HOME.', tags: [{ tag: 'FMCG' }, { tag: 'INTEGRATED CAMPAIGN' }] },
        { key: 'mcdonalds', title: "MCDONALD'S I'M LOVIN' IT", year: '2025', thumbnail: mcdThumb, copy: 'AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.', tags: [{ tag: 'F&B' }, { tag: 'DIGITAL & SOCIAL' }] },
      ],
    },
    {
      blockType: 'services',
      items: [
        { title: 'INTEGRATED MARKETING & CREATIVE STRATEGY', copy: 'By connecting strategy, storytelling, and media across platforms, we create campaigns that reach the right audiences and deliver results for your brand.' },
        { title: 'EDITORIAL STORYTELLING', copy: 'We craft narratives with the discipline of journalism and the impact of great creative.' },
        { title: 'YOUTH & SOCIAL IMPACT PROGRAMME', copy: 'We design programmes that engage young audiences around causes that matter through meaningful partnerships.' },
        { title: 'SOCIAL MEDIA & INFLUENCER ENGAGEMENT', copy: 'We manage always-on presence and hand-picked creator partnerships as a single integrated system — brand voice, community, and earned attention in lockstep.' },
        { title: 'DIGITAL EXPERIENCES', copy: 'Websites, apps, interactive campaigns. We design and build digital products that carry the same narrative discipline as editorial work.' },
        { title: 'MEDIA STRATEGY & BUYING', copy: 'Data-led planning across paid, owned and earned — designed to put the right message in front of the right people at the moment it matters.' },
      ],
    },
    {
      blockType: 'impactCTA',
      headingTop: 'LET’S',
      copy: 'TOGETHER, WE’LL BUILD SOMETHING\nWORTH TALKING ABOUT.',
      impactWord: 'CONNECT',
      // Upload your own trail images in the admin; empty falls back to the
      // component's built-in defaults.
      trailImages: [],
    },
  ]

  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  if (existingHome.docs[0]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: 'pages', id: existingHome.docs[0].id, data: { title: 'Home', layout: layout as any } })
    console.log('Updated existing home page.')
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'pages', data: { title: 'Home', slug: 'home', layout: layout as any } })
    console.log('Created home page.')
  }

  console.log('Setting footer global…')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      address:
        'Menara Star, 15, Jalan 16/11, Seksyen 16, 46350 Petaling Jaya, Selangor Darul Ehsan, Malaysia',
      phones: [{ number: '+603 7967 1388' }, { number: '+60126429027' }],
      directory: [
        { label: 'HOME', href: '/' },
        { label: 'WORKS', href: '/works' },
        { label: 'AWARDS', href: '/awards' },
      ],
      updatesLabel: 'GET THE LATEST UPDATES',
      socials: [
        { label: 'Facebook', href: '#', icon: fbIcon },
        { label: 'Instagram', href: '#', icon: igIcon },
      ],
      brandLogo,
      copyright: 'Copyrights © of Star Media Group 2026',
      email: 'SMGBRANDSTUDIO@THESTAR.COM.MY',
    },
  })

  console.log('Setting awards page global…')
  // Page chrome only — the award entries live in the `awards` collection below.
  await payload.updateGlobal({
    slug: 'awardsPage',
    data: {
      eyebrow: 'AWARDS',
      heading: 'Award-winning ideas,\ngrounded in the craft of storytelling.',
    },
  })

  // Build minimal Lexical rich-text values for the awards `middle` / `right`
  // WYSIWYG columns. Editors edit these with the admin WYSIWYG afterwards.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const rtText = (text: string, bold = false): any => ({
    type: 'text',
    text,
    format: bold ? 1 : 0,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1,
  })
  const rtPara = (children: any[]): any => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    textFormat: 0,
    children,
  })
  const rtRoot = (children: any[]): any => ({
    root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
  })
  // Middle column: bold show title followed by the award categories as bullets.
  const middleRT = (title: string, categories: string[]) =>
    rtRoot([
      rtPara([rtText(title, true)]),
      {
        type: 'list',
        listType: 'bullet',
        tag: 'ul',
        start: 1,
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: categories.map((t, i) => ({
          type: 'listitem',
          value: i + 1,
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [rtText(t)],
        })),
      },
    ])
  // Right column: a single paragraph (the campaign).
  const rightRT = (text: string) => rtRoot([rtPara([rtText(text)])])
  /* eslint-enable @typescript-eslint/no-explicit-any */

  console.log('Seeding awards collection…')
  // Each award win is its own document in the `awards` collection (a custom-post-
  // type style, like `works`). They render in the order created here, grouped by
  // year on /awards; editors can drag to reorder in the admin (the collection is
  // `orderable`). Idempotent — matched by year + award text.
  const JOMSAPOT = 'Campaign: #JomSapot BeliLokal Gen AI- Led Integrated Marketing Campaign'
  const awardEntries = [
    {
      year: '2026',
      label: 'WAN-IFRA 2026 — Best Marketing Campaign for a News Brand',
      middle: middleRT('Wan-Ifra Digital Media Awards Asia 2026', [
        'Best Marketing Campaign for a News Brand - SILVER',
      ]),
      campaign: rightRT('Campaign: Powering The Future in partnership with Tenaga Nasional Berhad'),
      awardImage: await img('awards/2026-best-marketing-trophy.webp'),
      groupPhoto: await img('awards/2026-best-marketing-group.jpg'),
    },
    {
      year: '2025',
      label: 'MDA d-Awards 2025 — Digital Publisher of the Year',
      middle: middleRT('MDA d-Awards 2025', ['Digital Publisher Of The Year - SILVER']),
      campaign: rightRT('The Star ESG: Bridging ESG Knowledge Into Action'),
      awardImage: await img('awards/2025-digital-publisher-trophy.webp'),
      groupPhoto: await img('awards/2025-digital-publisher-group.jpg'),
    },
    {
      year: '2025',
      label: 'WMAM 2025 — Green Journalism Award',
      middle: middleRT('Waste Management Association of Malaysia (WMAM)', [
        'Green Journalism Award',
      ]),
      campaign: rightRT('The Star ESG Publication'),
      awardImage: await img('awards/2025-green-journalism-trophy.webp'),
      groupPhoto: await img('awards/2025-green-journalism-group.jpg'),
    },
    {
      year: '2024',
      label: 'WAN-IFRA 2024 — Best Use of AI in Revenue Strategy',
      middle: middleRT('Wan-Ifra Digital Media Awards Asia 2024', [
        'Best Use of AI in Revenue Strategy - SILVER',
      ]),
      campaign: rightRT(JOMSAPOT),
      awardImage: await img('awards/2024-ai-revenue-trophy.webp'),
      groupPhoto: await img('awards/2024-ai-revenue-group.jpg'),
    },
    {
      year: '2024',
      label: 'MDA d-Awards 2024 — B2B & Digital Marketing Innovation',
      middle: middleRT('MDA d-Awards 2024', [
        'Best B2B Marketing Campaign - SILVER',
        'Best Use of Digital Marketing Innovation - SILVER',
      ]),
      campaign: rightRT(JOMSAPOT),
      awardImage: await img('awards/2024-b2b-trophy.webp'),
      groupPhoto: await img('awards/2024-mda-group.jpg'),
    },
    {
      year: '2024',
      label: 'PMAA Dragons of Asia 2024 — Best Digital Campaign (Bronze)',
      middle: middleRT('PMAA Dragons of Asia 2024', ['Best Digital Campaign 2024 - BRONZE']),
      campaign: rightRT(JOMSAPOT),
      awardImage: await img('awards/2024-dragons-bronze-trophy.webp'),
      groupPhoto: await img('awards/2024-dragons-bronze-group.jpg'),
    },
    {
      year: '2024',
      label: 'PMAA Dragons of Malaysia 2024 — Best Digital Campaign (Gold)',
      middle: middleRT('PMAA Dragons of Malaysia 2024', ['Best Digital Campaign 2024 - GOLD']),
      campaign: rightRT(JOMSAPOT),
      awardImage: await img('awards/2024-dragons-gold-trophy.webp'),
      groupPhoto: await img('awards/2024-dragons-gold-group.jpg'),
    },
    {
      year: '2023',
      label: 'WAN-IFRA 2023 — Best Native Advertising/Sponsored Content',
      middle: middleRT('WAN-IFRA Digital Media Awards Asia 2023', [
        'Best Native Advertising/Sponsored Content Campaign - GOLD',
      ]),
      campaign: rightRT(
        'Campaign: Sime Darby Property – Elmina Rainforest Knowledge Centre (ERKC) Sustainability Campaign',
      ),
      awardImage: await img('awards/2023-native-content-trophy.webp'),
      groupPhoto: await img('awards/2023-native-content-group.jpg'),
    },
  ]

  for (const entry of awardEntries) {
    const existing = await payload.find({
      collection: 'awards',
      where: { and: [{ year: { equals: entry.year } }, { label: { equals: entry.label } }] },
      limit: 1,
    })
    if (existing.docs[0]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.update({ collection: 'awards', id: existing.docs[0].id, data: entry as any })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection: 'awards', data: entry as any })
    }
    console.log(`  ✓ ${entry.year} — ${entry.label}`)
  }

  // Remove any awards no longer in the seed set, so re-seeding stays authoritative.
  const keepAwardKeys = new Set(awardEntries.map((e) => `${e.year}|||${e.label}`))
  const staleAwards = await payload.find({ collection: 'awards', limit: 200 })
  for (const doc of staleAwards.docs) {
    if (!keepAwardKeys.has(`${doc.year}|||${doc.label}`)) {
      await payload.delete({ collection: 'awards', id: doc.id })
      console.log(`  ✗ removed ${doc.year} — ${doc.label}`)
    }
  }

  console.log('Seeding works collection…')
  // Each project is its own document in the `works` collection (a custom-post-type
  // style). They render in the order created here; editors can drag to reorder in
  // the admin (the collection is `orderable`). Idempotent — matched by slug.
  const works = [
    {
      slug: 'elmina-rainforest-knowledge-centre',
      image: elminaImg,
      title: 'ELMINA RAINFOREST KNOWLEDGE CENTRE SUSTAINABILITY CAMPAIGN',
      year: '2023',
      description:
        'A thought-leadership sustainability campaign for Sime Darby Property that reframed biodiversity conservation as an emotionally engaging human story.',
      tags: [{ label: 'SUSTAINABILITY' }, { label: 'CONTENT CAMPAIGN' }],
      content: [
        { blockType: 'textSection', heading: 'Client', body: `Sime Darby Property` },
        {
          blockType: 'textSection',
          heading: 'The Background',
          body: `Sime Darby Property wanted to position the Elmina Rainforest Knowledge Centre (ERKC) as more than a sustainability initiative — establishing the brand as a credible advocate for biodiversity conservation and future-ready communities where people and nature coexist. The challenge was to cut through sustainability clutter and greenwashing with authentic, educational storytelling that could build trust, simplify complex environmental topics, and make biodiversity relevant to everyday audiences.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Big Idea',
          body: `"Imagine a World Without Biodiversity." Instead of leading with corporate sustainability messaging, we reframed conservation as a human story — inviting audiences to imagine a world where nature disappears from everyday life. Built on a thought-leadership content strategy and developed with the Tropical Rainforest Conservation & Research Centre (TRCRC), the campaign turned complex environmental issues into accessible, emotionally engaging narratives — positioning ERKC as both an educational platform and a symbol of sustainable urban living.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Execution',
          body: `At its heart was a co-branded multimedia microsite housed within The Star Online, giving audiences a dedicated, distraction-free space to explore ERKC's biodiversity initiatives. To sustain engagement across six months, the campaign rolled out in three phases, each introducing one clear message at a time.\n\nPhase 1 — Imagine a World Without Biodiversity: An emotionally driven opening built on documentary-style storytelling, impactful visuals, interactive quizzes, and simplified educational content, inviting audiences to picture — and reflect on — a future without biodiversity.\n\nPhase 2 — A Force for Good: A shift to Sime Darby Property's conservation and reforestation efforts through ERKC, reinforcing its role as a credible sustainability advocate rather than simply a developer.\n\nPhase 3 — Rewilding the Future of Urban Living: Stories on rewilding, urban forests, and city–nature coexistence, framing sustainable living as a practical vision for future communities.\n\nDelivered through long-form editorial, rich media, documentary video, infographics, and interactive experiences, the campaign turned a complex sustainability topic into an accessible public conversation.`,
        },
        {
          blockType: 'textSection',
          heading: 'Awards',
          body: `WAN-IFRA Asian Digital Media Awards — Best Native Advertising / Sponsored Content Campaign (Gold)`,
        },
        { blockType: 'oneImage', image: elminaMasthead },
      ],
    },
    {
      slug: 'rhb-jomsapot-belilokal',
      image: jomsapotImg,
      title: 'RHB #JOMSAPOT BELILOKAL',
      year: '2024',
      description:
        'A scalable SME empowerment platform for RHB Bank, combining AI-driven personalisation, celebrity influence, and hyperlocal discovery.',
      tags: [{ label: 'INTEGRATED CAMPAIGN' }, { label: 'AI INNOVATION' }],
      content: [
        { blockType: 'textSection', heading: 'Client', body: `RHB Bank` },
        {
          blockType: 'textSection',
          heading: 'The Background',
          body: `RHB Bank and Star Media Group came together to support Malaysian SMEs facing declining visibility and rising marketing costs in the post-pandemic economy. SMEs form the backbone of the economy, yet many lack the resources to compete in an increasingly digital, crowded marketplace. The initiative set out to give local businesses accessible marketing support — and to encourage Malaysians to rediscover and back their neighbourhood merchants.`,
        },
        { blockType: 'gallery', images: [{ image: rhbMasthead }, { image: rhbCta }] },
        {
          blockType: 'textSection',
          heading: 'The Big Idea',
          body: `Turning every local business into a discoverable brand. Rather than another awareness campaign, we built #JomSapot BeliLokal into a scalable SME empowerment platform — combining AI-driven personalisation, celebrity influence, and hyperlocal discovery to help small businesses market themselves like major brands. At its centre was The BeliLokal Guide, an ecosystem that made local businesses easier to discover while giving SMEs promotional assets normally beyond their budgets. Using AI-powered facial and voice recognition, merchants could instantly generate personalized video ads featuring Sazzy Falak as their virtual brand ambassador — at no cost.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Execution',
          body: `The campaign paired AI-generated branded content with location-based targeting to drive both awareness and real-world discovery. SMEs were onboarded onto a co-branded ecosystem spanning the RHB #JomSapot platform and SMG's BeliLokal network, gaining exposure across digital, print, radio, and social. Consumers discovered nearby merchants through QR-enabled journeys and geo-targeted recommendations powered by The BeliLokal Guide. By merging technology, media reach, and community-driven commerce, the campaign turned SME support from a corporate initiative into an interactive nationwide movement.`,
        },
        {
          blockType: 'textSection',
          heading: 'Awards',
          body: `WAN-IFRA Digital Media Awards Asia — Best Use of AI in Revenue Strategy (Silver)\nMDA d-Awards — Best B2B Marketing Campaign (Silver)\nMDA d-Awards — Best Use of Digital Marketing Innovation (Silver)\nPMAA Dragons of Malaysia — Best Digital Campaign (Gold)\nPMAA Dragons of Asia — Best Digital Campaign (Bronze)`,
        },
      ],
    },
    {
      slug: 'tnb-powering-the-future',
      image: tnb1,
      title: 'TNB POWERING THE FUTURE',
      description:
        'A youth-focused energy-literacy programme for Tenaga Nasional Berhad, turning national sustainability goals into lived, experiential learning.',
      tags: [{ label: 'ENERGY' }, { label: 'YOUTH PROGRAMME' }],
      content: [
        {
          blockType: 'textSection',
          heading: 'Client',
          body: `Tenaga Nasional Berhad (Malaysia Energy Literacy Programme)`,
        },
        {
          blockType: 'textSection',
          heading: 'The Background',
          body: `Malaysia faces a growing energy trilemma — balancing security, affordability, and sustainability — amid accelerating climate pressures. Awareness of climate change is rising, but a persistent "say–do gap" remains: stated intentions to be energy-efficient rarely translate into action, held back by comfort-first habits, scepticism over individual impact, and reluctance to invest in change. As Malaysia pursues its Net Zero 2050 ambition, behavioural adoption remains the missing link. Through the Malaysia Energy Literacy Programme (MELP), Tenaga Nasional Berhad partnered with Star Media Group to translate national sustainability goals into a youth-focused education initiative — building understanding of energy transition, renewable energy, and ESG through lived experience rather than passive learning. The premise: if energy behaviour is to change, it must begin early.`,
        },
        { blockType: 'gallery', images: [{ image: tnb2 }, { image: tnb3 }] },
        {
          blockType: 'textSection',
          heading: 'The Big Idea',
          body: `"Start young to change the energy future." (Small actions today, big impact tomorrow.) Rather than treating energy education as information delivery, the programme reframed it as early behaviour formation — challenging the misconception that climate impact comes only from large-scale policy or corporate action, and positioning students as active contributors whose everyday habits, multiplied across millions, become a force for systemic change.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Execution',
          body: `Powering The Future was designed as an experiential learning programme that moves energy education from theory into lived experience. Rather than classroom learning, students were placed in real-world energy decision scenarios through interactive workshops, energy-saving challenges, and practical simulations — making abstract concepts tangible and personally relevant. First piloted across 10 schools, the programme was scaled to 60 schools and has since expanded across multiple states, refining its engagement design with each rollout. It continues today as a sustained national initiative, with a long-term mission to embed energy-conscious behaviour early and cultivate a generation of Malaysians who actively contribute to a more sustainable energy future.`,
        },
        { blockType: 'oneImage', image: tnb4 },
        {
          blockType: 'textSection',
          heading: 'Awards',
          body: `WAN-IFRA Digital Media Awards Asia — Best Marketing Campaign for a News Brand (Silver)`,
        },
      ],
    },
    {
      slug: 'star-next-gen-eco-innovators',
      image: sngei1,
      title: 'STAR NEXT GEN ECO INNOVATORS',
      description:
        'A youth-led innovation platform for The Coca-Cola Company that reframed plastic waste from pollution to potential.',
      tags: [{ label: 'SUSTAINABILITY' }, { label: 'YOUTH PROGRAMME' }],
      content: [
        { blockType: 'textSection', heading: 'Client', body: `The Coca-Cola Company (Malaysia)` },
        {
          blockType: 'textSection',
          heading: 'The Background',
          body: `Plastic waste is one of Malaysia's most complex environmental challenges — driven by high consumption, limited recycling efficiency, and systemic leakage into natural ecosystems. The plastic manufacturing sector contributes significantly to national growth (annual sales exceeding RM61 billion, 4–5% of GDP), yet Malaysia is also among ASEAN's highest per-capita consumers of plastic packaging, generating over a million tonnes of plastic waste a year — only around 24% of which is recycled. Plastic, in other words, is not just an environmental issue but a systems problem spanning consumption behaviour, waste infrastructure, and circular-economy readiness.\n\nFor The Coca-Cola Company in Malaysia, this carried added reputational complexity. As a major user of plastic packaging, the brand sits at the centre of public scrutiny on waste — while investing in global circular-economy commitments and sustainable-packaging goals. A clear trust gap remained, particularly among Gen Z: highly eco-conscious, yet deeply sceptical of corporate sustainability messaging. In response, Coca-Cola backed a youth-led innovation platform built to move beyond awareness into hands-on circular-economy experimentation — positioning students as co-creators of solutions rather than passive recipients of messaging.`,
        },
        { blockType: 'gallery', images: [{ image: sngei2 }, { image: sngei3 }] },
        {
          blockType: 'textSection',
          heading: 'The Big Idea',
          body: `"Flip plastic from pollution to potential." Instead of framing plastic as a burden, the programme reframed it as a designable material system — something the next generation could reimagine, repurpose, and re-engineer. This shifted youth from observers of the climate crisis to active system designers, building real-world solutions through innovation, collaboration, and circular thinking.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Execution',
          body: `Next Gen Eco Innovators launched as a national, university-based innovation platform focused on plastic circularity and sustainable design thinking. Five universities took part in a structured programme of education, ideation, and rapid prototyping: students were grounded in circular-economy principles, then challenged to apply them in a high-intensity 24-hour innovation sprint tackling Malaysia's plastic-waste and circularity gaps. Standout teams were shortlisted to represent their university at a grand finale at Menara Star, where ideas were judged by industry and sustainability experts on feasibility, innovation, and impact potential.`,
        },
        { blockType: 'oneImage', image: sngei4 },
      ],
    },
    {
      slug: 'resipi-jadi-rezeki',
      image: worksBg,
      title: 'RESIPI JADI REZEKI WITH KIMBALL MALAYSIA',
      description:
        'A four-phase entrepreneurial transformation journey for Kimball Malaysia, turning everyday cooking into a sustainable livelihood.',
      tags: [{ label: 'SOCIAL IMPACT' }, { label: 'INTEGRATED CAMPAIGN' }],
      content: [
        { blockType: 'textSection', heading: 'Client', body: `Kimball Malaysia` },
        {
          blockType: 'textSection',
          heading: 'The Background',
          body: `Despite Malaysia's growing emphasis on SME empowerment and food entrepreneurship, many B40 and PPR home cooks remain trapped in informal, low-income cooking with no clear path to professionalisation. Three barriers persist: capital risk (high upfront costs to start a food business), an infrastructure gap (limited access to hygienic, MOH-compliant kitchens for scaling), and market marginalisation (limited branding, pricing power, and digital literacy). Many already have strong culinary skills — what they lack is the system, support, and structure to turn cooking into a sustainable livelihood. Kimball, long known as a kitchen-staple brand, saw an opportunity to evolve beyond product utility and become an enabler of income generation and community upliftment.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Big Idea',
          body: `"Resipi Jadi Rezeki — turning everyday cooking into sustainable livelihood." Rather than focusing on product usage, the campaign positioned Kimball as an enabling system that unlocks income-generating potential within everyday cooking. The belief at its core: with the right system and support, even a single recipe can become a sustainable source of income. By pairing Kimball's cost-efficient base sauces with structured entrepreneurial training, participants could adopt a "high-volume, low-margin" model — selling quality meals at an accessible RM5 "Menu Rahmah" price point while staying profitable. Food, empowerment, and economic inclusion came together in a scalable ecosystem for everyday livelihood creation.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Execution',
          body: `The campaign was built as a four-phase entrepreneurial transformation journey, taking participants from home cooks to validated micro-entrepreneurs.\n\nPhase 1 — Recruitment: A talent-discovery phase identified high-potential home cooks from B40 and PPR communities through Suria FM outreach and grassroots networks, balancing national reach with hyperlocal authenticity.\n\nPhase 2 — Training & Development: Hands-on workshops equipped participants with digital marketing, food storytelling, content creation, and commercial cooking skills, and guided them to develop their RM5 "Menu Rahmah" offerings.\n\nPhase 3 — Live Market Rally: A real-world bazaar "stress test," where participants operated as independent vendors under time pressure — managing sales, cooking, and public engagement.\n\nPhase 4 — Expanding Community Impact: The journey extended beyond participants, channeling RM10,000 of Kimball products to five welfare homes, reinforcing that entrepreneurial success should benefit the wider community.`,
        },
      ],
    },
    {
      slug: 'sustainable-palm-oil-revolution',
      image: mpocImg,
      title: 'THE SUSTAINABLE PALM OIL REVOLUTION',
      description:
        'An impact-journalism platform for MPOC that reframed palm oil through verified facts and evidence-led storytelling.',
      tags: [{ label: 'SUSTAINABILITY' }, { label: 'EDITORIAL STORYTELLING' }],
      content: [
        { blockType: 'textSection', heading: 'Client', body: `Malaysia Palm Oil Council (MPOC)` },
        {
          blockType: 'textSection',
          heading: 'The Background',
          body: `Oil palm is one of the world's most efficient oil-producing crops, needing far less land than other vegetable oils for the same yield — which, with its affordability and versatility, has made palm oil one of the most widely used ingredients in global food and consumer supply chains. It is also one of the most contested commodities. Rising demand has raised legitimate concerns around deforestation, biodiversity loss, land-use change, labour practices, and sustainability governance — concerns that have hardened into a simplified global narrative casting palm oil as inherently harmful, with little distinction between conventional and certified sustainable production. As one of the world's largest producers and exporters, Malaysia sits at the centre of this debate. Working with the Malaysia Palm Oil Council (MPOC), the challenge was to ensure sustainably sourced palm oil is understood accurately — in relation to its environmental safeguards, certification systems, and role in more efficient land use and conservation.`,
        },
        { blockType: 'gallery', images: [{ image: mpocImg2 }, { image: mpocImg3 }] },
        {
          blockType: 'textSection',
          heading: 'The Big Idea',
          body: `Reframing palm oil through verified facts. Rather than defending the industry or reacting to criticism, the campaign reframed the challenge as an information-gap problem, not a perception battle — moving global audiences away from simplified assumptions toward evidence-based understanding, where palm oil is assessed through verified data, credible science, and differentiated sustainability practices.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Execution',
          body: `The campaign took an impact-journalism approach, countering misinformation through structured storytelling rather than persuasion. Built as a guided discovery experience, it rested on three principles:\n\nReframing through context and data: Fact-led comparisons highlighted palm oil's land-use efficiency and productivity, and the importance of distinguishing conventional from certified sustainable production.\n\nCredibility through independent validation: Key insights were anchored in trusted external sources — including WWF, Conservation International, and Wild Asia — so the narrative rested on independent expertise, not industry-only positioning.\n\nComplexity made simple: A dedicated interactive platform, The Sustainable Palm Oil Revolution, turned complex sustainability data into an immersive editorial experience through long-form storytelling, data visualisation, and explainer videos — letting audiences navigate claims, context, and evidence in an accessible format.\n\nBy replacing defensive rhetoric with evidence-led storytelling, the initiative gave international audiences a more informed, data-grounded lens on Malaysia's role in advancing sustainable agriculture.`,
        },
      ],
    },
    {
      slug: 'the-star-esg',
      image: esgImg,
      title: 'THE STAR ESG',
      description:
        'A monthly editorial pull-out by Star Media Group that makes complex ESG topics clear, credible, and accessible to Malaysians.',
      tags: [{ label: 'EDITORIAL PLATFORM' }, { label: 'ESG' }],
      content: [
        { blockType: 'textSection', heading: 'Client', body: `Star Media Group — an owned editorial platform` },
        {
          blockType: 'textSection',
          heading: 'The Background',
          body: `In Malaysia, ESG has moved from a reputational nice-to-have to a business reality: sustainability reporting is now mandatory for Bursa Malaysia's larger listed companies and is being phased in across the rest of the market, with expectations increasingly cascading to the SMEs in their supply chains. Yet for most Malaysians — businesses, SMEs, policymakers, and consumers alike — the landscape remains abstract, jargon-heavy, and clouded by greenwashing, with no sustained, credible, easy-to-follow platform making it relevant to a broad local audience.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Big Idea',
          body: `Expert-led ESG, made accessible to all. A dedicated monthly editorial pull-out that pairs journalistic credibility with subject-matter expertise — turning complex ESG topics into clear, relevant narratives, and giving Malaysians a trusted ongoing guide rather than scattered, one-off coverage.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Execution',
          body: `StarESG breaks down emerging trends, regulatory developments, and the real-world challenges organisations face — combining our editorial expertise with the perspectives of policymakers, industry leaders, and businesses to give a balanced, authoritative view that surfaces both the risks and the opportunities of a changing ESG landscape. It's built around a consistent set of editorial pillars:\n\nCover stories — topical features with expert and policymaker insight across environmental, social, and governance themes.\n\nSME focus — accessible content that helps SMEs understand and adopt ESG.\n\nESG news — timely updates on the policies, regulations, and trends shaping the landscape.\n\nBrand stories — corporate initiatives, commitments, and challenges.\n\n"Small Act, Big Impact" — community-driven narratives that inspire collective action.\n\nPublished monthly, StarESG has grown into a sustained platform for more informed, responsible decision-making.`,
        },
      ],
    },
    {
      slug: 'a-shared-home-carey-island',
      image: worksBg,
      title: 'A SHARED HOME — CAREY ISLAND',
      year: '2026',
      description:
        'A multi-dimensional storytelling ecosystem for SD Guthrie that turned an abstract ESG narrative into a place audiences could see and connect with.',
      tags: [{ label: 'SUSTAINABILITY' }, { label: 'MULTIMEDIA STORYTELLING' }],
      content: [
        { blockType: 'textSection', heading: 'Client', body: `SD Guthrie Berhad` },
        {
          blockType: 'textSection',
          heading: 'The Background',
          body: `SD Guthrie is more than a palm oil producer. With a heritage spanning nearly two centuries, it has continually evolved to lead the industry in sustainable production, biodiversity conservation and community development. Through its "Beyond Zero" sustainability framework, the company has committed not only to reducing its environmental footprint but also to restoring ecosystems and transforming lives and livelihoods through three strategic pillars: Zero, Restore and Transform.\n\nYet despite these commitments, SD Guthrie operates within an industry often viewed through a lens of scepticism. Palm oil continues to carry significant reputational challenges, where genuine progress is frequently overshadowed by concerns around environmental impact and accusations of corporate greenwashing. This created three fundamental barriers: a perception gap (an industry often judged before its actions are understood), a credibility gap (sustainability commitments audiences may dismiss without tangible proof), and an abstraction gap (meaningful initiatives documented in reports but rarely experienced by the public). The challenge was not a lack of substance. It was making real impact visible, relatable and believable.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Big Idea',
          body: `"A Shared Home: A Legacy, Keepers of the Future." Instead of asking audiences to trust another sustainability claim, the campaign invited them to experience one. It repositioned Carey Island as the narrative centrepiece of SD Guthrie's sustainability journey — a living landscape where certified sustainable palm oil production exists alongside biodiversity conservation, ecological restoration, heritage preservation and thriving local communities. Rather than serving as a backdrop, the island became the campaign's proof point: a place where sustainability could be seen, explored and understood. Grounded in the "Beyond Zero" pillars of Zero, Restore and Transform, the campaign translated corporate commitments into tangible human stories and real places — shifting the narrative from defending sustainability claims to demonstrating stewardship through lived experience.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Execution',
          body: `The campaign was designed as a multi-dimensional storytelling ecosystem, with each format playing a distinct role and reinforcing the others.\n\nDocumentary — the emotional centrepiece that brought Carey Island to life through immersive storytelling, showcasing SD Guthrie's stewardship in practice and translating sustainability from concept into lived reality through people, place and progress.\n\nLong-form Editorial Feature — the credibility anchor. An in-depth article providing narrative depth around SD Guthrie's legacy, the "Beyond Zero" framework, and Carey Island as a real-world demonstration of integrated sustainability across biodiversity conservation, heritage preservation and community development.\n\nSocial Media Amplification — the distribution engine. Social platforms drove awareness, traffic and engagement, directing audiences toward the documentary and long-form editorial content and ensuring the story reached both broad public and news- and business-oriented communities.\n\nIntegrated Audience Journey — each touchpoint worked in sequence: social amplification sparked discovery, the documentary delivered emotional engagement, and the editorial feature provided context, credibility and depth — turning awareness into understanding.`,
        },
        {
          blockType: 'textSection',
          heading: 'The Outcome',
          body: `By turning an abstract ESG narrative into a place people could see and connect with, "A Shared Home" reframed SD Guthrie's sustainability story. Instead of asking audiences to accept corporate claims at face value, it invited them to witness a living example where certified sustainable palm oil production, biodiversity conservation, heritage and community coexist within a shared landscape. In doing so, the campaign repositioned SD Guthrie not simply as a palm oil producer, but as a long-term steward of people, nature and place — demonstrating that the strongest sustainability stories are those that can be experienced as well as told.`,
        },
      ],
    },
  ]

  for (const work of works) {
    const existing = await payload.find({
      collection: 'works',
      where: { slug: { equals: work.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.update({ collection: 'works', id: existing.docs[0].id, data: work as any })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection: 'works', data: work as any })
    }
    console.log(`  ✓ ${work.slug}`)
  }

  // Remove any works no longer in the seed set (e.g. the earlier placeholder
  // projects), so "use these instead" stays true on every re-seed.
  const keepSlugs = works.map((w) => w.slug)
  const staleWorks = await payload.find({
    collection: 'works',
    where: { slug: { not_in: keepSlugs } },
    limit: 100,
  })
  for (const doc of staleWorks.docs) {
    await payload.delete({ collection: 'works', id: doc.id })
    console.log(`  ✗ removed ${doc.slug}`)
  }

  console.log('Setting up contact form…')

  // Minimal Lexical rich-text value for the confirmation message.
  const lexical = (text: string) => ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
          ],
        },
      ],
    },
  })

  const contactFormData = {
    title: 'Contact',
    submitButtonLabel: 'Submit',
    confirmationType: 'message' as const,
    confirmationMessage: lexical("Thanks — we've got your enquiry. We'll be in touch shortly."),
    // Notification emails are handled by a custom afterChange hook (see
    // src/forms/contactNotification.ts), driven by the form's "Notification
    // recipients" field — set that in the admin, not here. The Form Builder's
    // own `emails` array is left empty on purpose. Re-seeding preserves any
    // recipients already entered (partial update doesn't touch notificationEmails).
    emails: [],
    fields: [
      { blockType: 'text', name: 'fullName', label: 'Full Name', required: true, width: 100 },
      { blockType: 'text', name: 'company', label: 'Company / Organisation', required: false, width: 100 },
      { blockType: 'email', name: 'email', label: 'Email Address', required: true, width: 50 },
      { blockType: 'text', name: 'phone', label: 'Phone Number', required: false, width: 50 },
      {
        blockType: 'select',
        name: 'services',
        label: 'What Services Are Required?',
        required: false,
        width: 100,
        options: [
          { label: 'Integrated Marketing & Creative Strategy', value: 'integrated-marketing' },
          { label: 'Editorial Storytelling', value: 'editorial-storytelling' },
          { label: 'Video & Multimedia Production', value: 'video-production' },
          { label: 'Youth & Social Impact Programme', value: 'social-impact' },
          { label: 'Research & Insights', value: 'research-insights' },
          { label: 'Social Media & Influencer Engagement', value: 'social-influencer' },
          { label: 'Digital Experiences', value: 'digital-experiences' },
          { label: 'Media Strategy & Buying', value: 'media-strategy' },
          { label: 'Other', value: 'other' },
        ],
      },
      { blockType: 'textarea', name: 'enquiry', label: 'Leave Your Project Enquiry', required: false, width: 100 },
    ],
  }

  const existingForm = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact' } },
    limit: 1,
  })
  if (existingForm.docs[0]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: 'forms', id: existingForm.docs[0].id, data: contactFormData as any })
    console.log('Updated existing contact form.')
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'forms', data: contactFormData as any })
    console.log('Created contact form.')
  }

  console.log('✅ Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
