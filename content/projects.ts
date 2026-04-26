export type Accent = 'rose' | 'sage' | 'blue' | 'peach' | 'terra';

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  meta: { role: string; timeline: string; tools: string; team: string };
  overview: string[];
  process: { heading: string; body: string }[];
  gallery: { src?: string; alt: string; aspect?: '16/9' | '4/3' | '1/1' }[];
  accent: Accent;
};

export const projects: Project[] = [
  {
    slug: 'moodmaps',
    title: 'MoodMaps',
    tagline: 'What if your map knew how you felt?',
    tags: ['EMOTION', 'GIS', 'NAVIGATION', 'UX RESEARCH'],
    accent: 'sage',
    meta: {
      role: 'Lead UX Designer',
      timeline: '3 months — Spring 2024',
      tools: 'Figma, ArcGIS, Miro, Maze',
      team: 'Solo project',
    },
    overview: [
      'Navigation apps tell us the fastest route. But what if they could also guide us toward the route that makes us feel best? MoodMaps is an emotion-aware navigation concept that layers affective data onto geographic space.',
      'By combining GIS data with user-reported emotional responses and urban sentiment analysis, MoodMaps suggests routes based on the mood you want to feel — calm, energised, or inspired — not just the time you want to save.',
      'This project explored the intersection of cartography, emotional intelligence, and human-centred design, challenging assumptions about what navigation can be.',
    ],
    process: [
      {
        heading: 'Research & Discovery',
        body: 'Conducted 18 contextual interviews with daily commuters about how their routes affected their mood. Mapped emotional data points across a city grid to identify patterns — parks, market streets, and quiet side-lanes consistently scored higher for calm.',
      },
      {
        heading: 'Defining the Opportunity',
        body: 'Framed the core question: can a navigation app prioritise psychological wellbeing over efficiency? Identified three emotional modes — Calm, Energised, Inspired — as the MVP framework, validated through card-sorting sessions.',
      },
      {
        heading: 'Prototyping',
        body: 'Built mid-fidelity prototypes in Figma exploring different approaches to mood input: slider, quick-tap, and ambient sensing. Tested with 12 participants across two rounds, iterating on the onboarding flow and route preview.',
      },
      {
        heading: 'Design System',
        body: 'Developed a visual language rooted in natural gradients — dawn, dusk, canopy. Colour temperature shifts with selected mood, giving the interface an emotional texture that mirrors the expected experience of the route.',
      },
    ],
    gallery: [
      { alt: 'MoodMaps onboarding flow', aspect: '16/9' },
      { alt: 'Mood selection screen', aspect: '4/3' },
      { alt: 'Route comparison view', aspect: '16/9' },
      { alt: 'Emotional heatmap overlay', aspect: '4/3' },
    ],
  },
  {
    slug: 'contigo',
    title: 'Contigo',
    tagline: 'A calm companion for moments of panic.',
    tags: ['MENTAL HEALTH', 'ACCESSIBILITY', 'MOBILE'],
    accent: 'blue',
    meta: {
      role: 'UX/UI Designer',
      timeline: '4 months — Autumn 2023',
      tools: 'Figma, Principle, Notion',
      team: '2 designers, 1 researcher',
    },
    overview: [
      'Contigo is a mobile companion designed for people living with anxiety disorders. When a panic attack begins, most apps demand too much — too many taps, too much text, too many choices. Contigo does the opposite.',
      'The interface is radically minimal: one breathing guide, one grounding exercise, one calm voice. Designed with and for people who have experienced panic, the entire app was co-designed with a community of 30 participants over four months.',
      'Accessibility was not an afterthought — it was the starting point. High contrast, large touch targets, reduced motion, and screen-reader-first design shaped every decision.',
    ],
    process: [
      {
        heading: 'Co-design Sessions',
        body: 'Ran eight co-design workshops with 30 people who experience anxiety and panic attacks. Used participatory design methods — journey maps, storyboarding, and "worst nightmare" scenario exercises — to surface real pain points with existing apps.',
      },
      {
        heading: 'Accessibility-First Framework',
        body: 'Developed an accessibility matrix before any visual design. Every component was evaluated against WCAG 2.1 AA, cognitive load guidelines, and motor accessibility standards. Built a component library with these constraints baked in.',
      },
      {
        heading: 'Interaction Design',
        body: 'Designed the breathing guide as a haptic-first experience — the app guides through vibration and sound, with visual as a secondary layer. Reduced cognitive load by limiting each screen to a single decision.',
      },
      {
        heading: 'Usability Testing',
        body: 'Tested with 15 participants across three rounds of usability testing, including two sessions conducted during simulated high-stress conditions. Task completion improved from 62% to 94% over iterations.',
      },
    ],
    gallery: [
      { alt: 'Contigo home screen', aspect: '4/3' },
      { alt: 'Breathing guide in action', aspect: '1/1' },
      { alt: 'Grounding exercise screen', aspect: '4/3' },
      { alt: 'Settings and accessibility options', aspect: '16/9' },
    ],
  },
  {
    slug: 'ecogenie',
    title: 'EcoGenie',
    tagline: 'Your AI guide to a greener home.',
    tags: ['AI', 'SUSTAINABILITY', 'PRODUCT DESIGN'],
    accent: 'peach',
    meta: {
      role: 'Product Designer',
      timeline: '3 months — Winter 2023',
      tools: 'Figma, FigJam, Framer, ChatGPT API',
      team: '1 designer, 2 engineers',
    },
    overview: [
      'EcoGenie is an AI-powered assistant that helps households reduce their environmental impact through personalised, achievable recommendations — not overwhelming guilt.',
      'Most sustainability tools show you how bad things are. EcoGenie focuses on what is possible: small, meaningful changes tailored to your actual home, budget, and lifestyle, delivered through a conversational interface that feels warm rather than preachy.',
      'The project explored how AI can serve as an empowering coach rather than an intrusive monitor, and how product design can make sustainable living feel desirable rather than sacrificial.',
    ],
    process: [
      {
        heading: 'Desk Research & Competitive Analysis',
        body: 'Analysed 14 existing sustainability apps, identifying a consistent failure mode: guilt-driven design. Benchmarked conversational AI patterns from leading consumer apps to identify best practices for warmth and trust.',
      },
      {
        heading: 'Conversational Design',
        body: 'Designed the AI personality before designing the interface. Defined tone-of-voice principles — encouraging, specific, non-judgmental — and created a library of 80+ conversation flows covering common household scenarios.',
      },
      {
        heading: 'Visual Design',
        body: 'Built a visual language around growth and warmth: organic shapes, earthy tones, plant-inspired illustrations. Designed an icon system that communicates eco-actions at a glance without text dependency.',
      },
      {
        heading: 'Prototype & Iteration',
        body: 'Built an interactive prototype in Framer connected to the ChatGPT API for live testing. Ran three rounds of concept testing with 20 households, iterating on the onboarding survey, recommendation format, and progress visualisation.',
      },
    ],
    gallery: [
      { alt: 'EcoGenie onboarding', aspect: '16/9' },
      { alt: 'Home dashboard with recommendations', aspect: '4/3' },
      { alt: 'AI conversation interface', aspect: '4/3' },
      { alt: 'Progress and impact tracking', aspect: '16/9' },
    ],
  },
  {
    slug: 'doctord-plus',
    title: 'DoctorD+',
    tagline: 'Redesigning how patients access healthcare.',
    tags: ['HEALTH', 'MOBILE UX', 'UX RESEARCH'],
    accent: 'rose',
    meta: {
      role: 'Senior UX Designer',
      timeline: '5 months — 2023',
      tools: 'Figma, Lookback, Dovetail, Maze',
      team: '2 UX designers, 1 product manager, 3 engineers',
    },
    overview: [
      'DoctorD+ is a healthcare access platform redesign for a leading Spanish digital health provider. The existing app had a 34% abandonment rate at appointment booking — patients were dropping out before confirming a slot.',
      'Through a deep research programme spanning 200+ user interviews and contextual observations in clinic waiting rooms, we identified the core issue: the information architecture mirrored hospital bureaucracy, not patient mental models.',
      'The redesign restructured the app around three patient needs — Find a Doctor, Manage My Health, and Get Help Now — reducing booking abandonment to 11% in the first month post-launch.',
    ],
    process: [
      {
        heading: 'Research Programme',
        body: 'Led a 6-week research programme including 200 user interviews, 8 contextual observation sessions in clinic waiting rooms, and analysis of 3 years of support tickets. Synthesised findings into five distinct patient archetypes.',
      },
      {
        heading: 'Information Architecture',
        body: 'Ran three card sorting studies (open, closed, and hybrid) with 45 participants to rebuild the navigation model from scratch. Developed a tree-test protocol to validate the new IA before any visual design began.',
      },
      {
        heading: 'Design & Prototyping',
        body: 'Designed a comprehensive component library aligned with WCAG AA and the company design system. Delivered 140 screens across iOS and Android, covering appointment booking, teleconsultation, prescription management, and test results.',
      },
      {
        heading: 'Validation & Handoff',
        body: 'Ran moderated usability testing with 30 participants including elderly users and those with low digital literacy. Booking task completion improved from 66% to 89%. Created a detailed design spec with annotations, state documentation, and edge case coverage.',
      },
    ],
    gallery: [
      { alt: 'DoctorD+ new home screen', aspect: '4/3' },
      { alt: 'Doctor search and filter', aspect: '16/9' },
      { alt: 'Appointment booking flow', aspect: '4/3' },
      { alt: 'Health record and test results view', aspect: '16/9' },
    ],
  },
  {
    slug: 'from-maps-to-memories',
    title: 'From Maps to Memories',
    tagline: 'Where cartography meets personal narrative.',
    tags: ['STORYTELLING', 'ARCGIS', 'DATA VISUALIZATION'],
    accent: 'sage',
    meta: {
      role: 'Designer & Researcher',
      timeline: '6 months — 2022–2023',
      tools: 'ArcGIS StoryMaps, Figma, R, Illustrator',
      team: 'Solo project',
    },
    overview: [
      'From Maps to Memories is a personal cartography project exploring how geographic data can carry human stories. It began with a question: what does my grandmother\'s migration from rural Galicia to Buenos Aires look like as a map?',
      'Using ArcGIS StoryMaps as both a tool and a canvas, I built an interactive narrative that weaves together historical migration data, family photographs, hand-written letters, and satellite imagery into a living document of memory.',
      'The project became an investigation into the ethics and aesthetics of personal data visualisation — how cartography can honour rather than flatten human experience, and how design choices carry emotional weight.',
    ],
    process: [
      {
        heading: 'Archival Research',
        body: 'Spent three months cataloguing family archives: 400+ photographs, 60 letters in Galician and Spanish, ship manifests, and census records. Cross-referenced with historical migration data from the Spanish National Archive.',
      },
      {
        heading: 'Spatial Analysis',
        body: 'Built a geographic dataset mapping migration routes, settlement patterns, and points of memory across two continents. Used R to process and clean the data before importing into ArcGIS for spatial analysis.',
      },
      {
        heading: 'Narrative Design',
        body: 'Developed a scrollytelling structure that moves between intimate scale (a kitchen in Pontevedra) and continental scale (the Atlantic crossing). Designed a visual language that blends vintage cartographic aesthetics with contemporary data visualisation.',
      },
      {
        heading: 'Reflection & Ethics',
        body: 'Wrote a 4,000-word accompanying essay on the ethics of personal data visualisation — who has the right to map family history, how privacy and memory interact, and what gets lost when human stories become data points.',
      },
    ],
    gallery: [
      { alt: 'Migration route visualisation', aspect: '16/9' },
      { alt: 'Archival photographs and map overlay', aspect: '4/3' },
      { alt: 'Settlement timeline view', aspect: '16/9' },
      { alt: 'Intimate scale — neighbourhood map', aspect: '4/3' },
    ],
  },
];
