# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (runs Next.js compiler + type check)
npm run lint     # ESLint (config: eslint.config.mjs)
npx tsc --noEmit # type-check without emitting
```

No test suite is configured. Verify UI changes manually in the browser with `npm run dev`.

## Next.js Version Warning

This project uses **Next.js 16**, which has breaking changes from earlier versions. APIs, conventions, and file structure may differ from training data. When in doubt, check `node_modules/next/dist/docs/` before writing code.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 + custom CSS (`app/globals.css`)
- **Animation**: Framer Motion v12, GSAP v3
- **Physics**: matter-js (used in `components/ui/gravity.tsx`)
- **Deployment**: Vercel (Analytics already wired in `app/layout.tsx`)
- **Path alias**: `@/*` → project root (e.g. `@/components/Tag`)
- `images: { unoptimized: true }` is set in `next.config.ts` — Next.js image optimization is disabled

## Project Overview

Portfolio website for Luisina Dorsi — UX/UI designer based in Madrid, background in GIS and Architecture. The site showcases 5 case studies through a bento-grid homepage and individual project pages.

**Primary audience**: Recruiters and hiring managers at mission-driven companies (urban planning, sustainability, healthcare, civic tech). They open the portfolio from LinkedIn or a job application and are scanning fast. Success = "I need to reach out to this person."

**Anti-references** (never do this): neon-on-dark, cold minimal bootcamp templates, glassmorphism, gradient mesh, or the generic Cormorant + DM Sans editorial Webflow look (ironically, this exact font pair is a 2025 cliché — differentiate through composition and texture, not type substitution).

## Aesthetic Direction

"Organic Editorial" — warm, alive, intelligent. A living botanical field guide meets a design publication. Not cold tech. Not loud startup. Emotionally resonant and unforgettable. The grain texture overlay, organic blob circles, diagonal section dividers, and the GSAP clip-path hover on bento cards are core to this aesthetic.

## File Structure

```
app/
  layout.tsx                  ← Root layout: Nav, FooterSelector, GrainOverlay, Analytics
  page.tsx                    ← Homepage: hero + bento grid + about + contact
  globals.css                 ← Design tokens (@theme), keyframes, base styles
  projects/
    [slug]/page.tsx           ← Generic fallback (reads from content/projects.ts)
    moodmaps/page.tsx         ← Full custom case study page
    from-maps-to-memories/page.tsx ← ArcGIS StoryMap iframe embed
    contigo/page.tsx          ← ComingSoon component (case study not yet published)
    doctord-plus/page.tsx     ← ComingSoon component (case study not yet published)
    ecogenie/page.tsx         ← ComingSoon component (case study not yet published)

content/
  projects.ts                 ← Single source of truth for all project data
                                (slug, title, tagline, tags, accent, meta, overview,
                                 process, gallery). Add new projects here.

lib/
  projects.ts                 ← getAllProjects(), getProject(slug), getAdjacent(slug)
                                getAdjacent() is automatic — no hardcoded prev/next.

components/
  Nav.tsx                     ← Fixed top nav, hides on scroll down, pill-style desktop
  BentoCard.tsx               ← Project grid card: GSAP clip-path circle reveal on hover
  FadeIn.tsx                  ← Scroll-triggered fade-in (IntersectionObserver)
  Circle.tsx                  ← Decorative floating blob circles (circleFloat animation)
  GrainOverlay.tsx            ← Grain texture overlay (full page)
  ComingSoon.tsx              ← Placeholder for unpublished case studies
                                Props: projectTitle, behanceUrl
  Tag.tsx                     ← Pill tag component (variant: 'outline' | 'solid')
  PrevNext.tsx                ← Prev/Next project navigation (bottom of case study)
  ProjectImage.tsx            ← next/image wrapper with fallback bg color
  ProjectHero.tsx             ← Reusable hero section for project pages
  ProjectMeta.tsx             ← 4-col meta strip (Role, Timeline, etc.)
  ProjectGallery.tsx          ← Generic image gallery for project pages
  ProjectCard.tsx             ← Alternative card component (not used in bento grid)
  FooterSelector.tsx          ← Footer (selects between Footer and SimpleFooter)
  SimpleFooter.tsx            ← Minimal footer variant
  Blob.tsx                    ← Organic blob shape (decorative SVG)
  HeroGlow.tsx                ← Glow effect behind the homepage hero
  StatsCounter.tsx            ← Animated count-up stat
  Placeholder.tsx             ← Dev placeholder (not used in production)
  ui/
    gallery.tsx               ← PhotoGallery (fan polaroid interaction) + StatsRow
    contact-social-strip.tsx  ← Rose strip with LinkedIn/Medium/Behance links
    contact-sidebar.tsx       ← Sidebar "Find me here" with slide-out panel
    section-label.tsx         ← Small uppercase section label
    letter-swap.tsx           ← LetterSwapPingPong hero text animation
    nav-header.tsx            ← Desktop pill nav (used by Nav.tsx)
    focus-rail.tsx            ← FocusRail (used in MoodMaps for MVP steps)
    card-stack.tsx            ← Stacked card component
    spotlight-card.tsx        ← Spotlight/glow card effect
    gravity.tsx               ← matter-js physics component
    feature-carousel.tsx      ← Feature carousel component
    stacked-article-cards.tsx ← Stacked article card layout

public/
  projects/                   ← Bento card images (moodmaps.png, contigo.png, etc.)
  moodmaps/                   ← MoodMaps case study images (onboarding.png,
                                home.png, navigation.png, profile.png,
                                emotional-onboarding.png, experince-detail.png,
                                the-opportunity.png, user-agency.png,
                                four-features.png, Adaptive Routes.png,
                                Emotional Onboarding.png, GIS Map Interface.png,
                                Place recomendations.png)
```

## Design Tokens

All tokens live in `app/globals.css` inside the `@theme` block. Never hardcode palette values that exist as tokens.

```css
--color-bg:      #f7ede8   /* warm off-white page background */
--color-text:    #2a2420   /* near-black body text */
--color-heading: #2d6b5a   /* deep teal — headings and accents */
--color-rose:    #e8869a
--color-terra:   #d4643a   /* terracotta — CTAs, highlights */
--color-card:    #fdf8f5   /* warm white card backgrounds */
--color-blue:    #a8c9de
--color-sage:    #8fc4a0
--color-peach:   #f0b89a
--ease-organic:  cubic-bezier(0.22, 1, 0.36, 1)
--radius-card:   16px
```

Font variables (set by next/font in `app/layout.tsx`):
- `--font-display` → Cormorant Garamond (headings, editorial)
- `--font-sans` → DM Sans (body, labels, UI text)

## Bento Grid Layout (app/page.tsx)

The homepage work section uses a 3-column CSS grid with `gridAutoRows: 'minmax(320px, auto)'`. Cards are picked by index from `getAllProjects()`:

```
[ MoodMaps        ][ MoodMaps ][ Contigo ]   ← projects[0] col-span-2, projects[1] row-span-2
[ DoctorD+  ][ EcoGenie       ][ Contigo ]   ← projects[3], projects[2]
[ From Maps to Memories (full width, col-span-3) ]  ← projects[4]
```

**Important**: The bento grid manually references projects by array index (`projects[0]`, `projects[1]`, etc.), not by slug. When adding a new project to the grid, update `app/page.tsx` directly. The card image lives in `/public/projects/[slug].png` and is referenced via `ProjectImage`.

Each card uses `BentoCard` which handles:
- GSAP `clip-path: circle()` expand/collapse on hover — starts as a small circle at top-left (same position as the accent dot), expands to full card on hover
- The **overlay** (revealed on hover) shows: `project.tagline` (16px, DM Sans) + `project.title` (54px, Cormorant Garamond) at the bottom, on an `accent`-colored background
- Tags (`project.tags`) are always visible at the top of the card, above the accent dot
- `accent` color (from `project.accent`) drives both the dot color and the overlay background
- Optional props: `overlayTitleColor` (default `'#fdf8f5'`) and `overlayTaglineColor` (default warm white/80) — override when the accent color needs different text contrast

**The `children` prop is the base layer** (visible before hover). Each card in `app/page.tsx` defines its own children with:
1. `ProjectImage` — the card background image (`src="/projects/[slug].png"`, `fallbackBg` color if no image)
2. A colored dot `<div>` (31×31px circle, `backgroundColor` matching the accent hex)
3. An `<h3>` with the project title at the bottom (hidden on hover via `group-hover:opacity-0`)

This inner structure is defined per-card in `app/page.tsx`, not inside `BentoCard` itself.

## Project Pages

### Full custom case studies
- **MoodMaps** (`app/projects/moodmaps/page.tsx`) — Complete custom layout with:
  - `HeroCarousel` (local, at `app/projects/moodmaps/HeroCarousel.tsx`) — image carousel in the hero
  - Local `EditorialSection` component: two-column layout (text left, visual right), used for all major sections
  - Local `ScreenCard` component: image card with bg color, aspectRatio, border, padding, `next/image fill + object-contain`
  - Screen gallery (04 Screens): 6 real screenshots in a 2-row grid (full-width rows + 2-col rows)
  - `FocusRail` for the MVP steps (01–04)
  - `SectionLabel` for section numbers/headings
  - `PrevNext` at the bottom

- **From Maps to Memories** (`app/projects/from-maps-to-memories/page.tsx`) — Hero header + full-width ArcGIS StoryMap iframe embed (`minHeight: '100vh'`, no border). `PrevNext` at bottom.

- **Generic fallback** (`app/projects/[slug]/page.tsx`) — reads from `content/projects.ts` via `getProject(slug)`. Used only if no custom page exists for that slug.

### ComingSoon pages (case study not yet built in code)
These three projects exist as data in `content/projects.ts` but the detail page shows `ComingSoon`:
- **Contigo** — Behance: `https://www.behance.net/gallery/93631509/Contigo-App-Case-Study`
- **DoctorD+** — Behance: `https://www.behance.net/gallery/134337215/DoctorD-UXUI-Design-Case-Study`
- **EcoGenie** — Behance: `https://www.behance.net/gallery/222551799/EcoGenie-AI-Powered-Smart-Energy-Assistant`

When building a full case study for any of these: replace `ComingSoon` with the custom layout following the MoodMaps page structure.

## Adding a New Project

1. **Add data** to `content/projects.ts` — insert at the desired array position (order affects prev/next). Required fields: `slug`, `title`, `tagline`, `tags[]`, `accent` (one of: `'rose'|'sage'|'blue'|'peach'|'terra'`), `meta`, `overview[]`, `process[]`, `gallery[]`.

2. **Add bento card** in `app/page.tsx` — add a new `<FadeIn><BentoCard project={projects[N]}>` block. Adjust `className` for column/row span. Add card image at `/public/projects/[slug].png`.

3. **Create detail page** at `app/projects/[slug]/page.tsx`:
   - Start with `ComingSoon` if the case study isn't ready yet, or
   - Build the full layout following MoodMaps as the reference template.

4. **Prev/next is automatic** — `getAdjacent()` in `lib/projects.ts` uses the array index. No manual linking needed.

5. **Update this CLAUDE.md** — add the project to the Projects list below.

## Projects (current order in content/projects.ts)

| Index | Slug | Title | Accent | Page status |
|-------|------|-------|--------|-------------|
| 0 | `moodmaps` | MoodMaps | `sage` | Full custom page |
| 1 | `contigo` | Contigo | `blue` | ComingSoon |
| 2 | `ecogenie` | EcoGenie | `peach` | ComingSoon |
| 3 | `doctord-plus` | DoctorD+ | `rose` | ComingSoon |
| 4 | `from-maps-to-memories` | From Maps to Memories | `sage` | Full page (StoryMap iframe) |

Prev/next cycle (automatic, based on array order):
MoodMaps → Contigo → EcoGenie → DoctorD+ → From Maps to Memories → MoodMaps

## Animations & Motion

- All transitions use `--ease-organic: cubic-bezier(0.22, 1, 0.36, 1)`
- `FadeIn` component: IntersectionObserver, `delay` prop in ms, respects `prefers-reduced-motion`
- `heroFadeIn` CSS keyframe: used for hero elements via inline `animation` style
- `circleFloat` / `blobDrift` / `blobBreathe`: decorative circle animations in `globals.css`
- GSAP: used in `BentoCard` for clip-path circle reveal (not layout properties)
- Framer Motion: used in `Nav`, `ComingSoon`, `contact-sidebar`, `card-stack`

## Key Patterns

### Section header pattern (used on all project pages)
```tsx
<Link href="/#work" className="...">← All projects</Link>
<div className="flex flex-wrap gap-2 mb-8">
  {TAGS.map(tag => <Tag key={tag} variant="outline">{tag}</Tag>)}
</div>
<h1 style={{ fontFamily: 'var(--font-display)', ... }}>Title</h1>
```

### Meta strip (4-col, used on all project pages)
```tsx
<dl className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-14 border-b ...">
  {[{ label: 'Role', value: '...' }, ...].map(...)}
</dl>
```

### EditorialSection (MoodMaps — two-column editorial layout)
Local component defined in moodmaps/page.tsx. Props: `labelText`, `heading`, `subtitle`, `children` (left column), `right` (right column), `bordered`.

### ScreenCard (MoodMaps — screenshot display card)
Local component defined in moodmaps/page.tsx. Props: `bg`, `ratio` (aspectRatio string), `src`, `alt`. Uses `next/image fill + object-contain` with padding.

## Responsive Breakpoints (Tailwind v4 config in globals.css)

```
sm: 600px   (mobile)
md: 900px   (tablet)
xl: 1400px  (desktop wide)
```

## Accessibility

- Skip link in `app/layout.tsx` (`href="#main-content"`)
- `focus-visible:ring-2` on all interactive elements
- `aria-hidden="true"` on decorative overlays in BentoCard
- `aria-label` on BentoCard links and mobile hamburger
- `prefers-reduced-motion` respected in `FadeIn` component and `globals.css`
- Target: WCAG AA minimum
