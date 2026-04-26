# CLAUDE.md

This file provides guidance to Claude Code when working 
with code in this repository.

## Project Overview

Static multi-page portfolio website for Luisina Dorsi 
(UX/UI designer, Madrid). No build tools, no dependencies 
— plain HTML/CSS/JS opened directly in a browser.

## Aesthetic Direction
"Organic Editorial" — warm, alive, intelligent. 
A living botanical field guide meets a design publication. 
Not cold tech. Not loud startup. Emotionally resonant 
and unforgettable.

## File Structure

index.html                    ← Homepage
projects/
  moodmaps.html
  contigo.html
  ecogenie.html
  doctord-plus.html
  from-maps-to-memories.html
css/
  style.css                   ← @import manifest
  variables.css               ← All :root custom properties
  base.css                    ← Reset + body defaults
  utilities.css               ← .fade-in, .container
  components.css              ← nav, footer, blobs, tags
  homepage.css                ← hero, project grid, about
  project-page.css            ← case study page styles
js/
  main.js                     ← scroll observer + mobile nav
index-v1-inspiration.html     ← reference only, do not modify

## Design System

All tokens live in css/variables.css. 
NEVER hardcode values that exist as CSS custom properties.

## Color Palette
--bg: #f7ede8
--text: #2a2420
--heading: #2d6b5a
--rose: #e8869a
--terra: #d4643a
--card-bg: #fdf8f5
--blue: #a8c9de
--sage: #8fc4a0
--peach: #f0b89a

## Typography
- Headings: Cormorant Garamond (Google Fonts) — elegant, 
  editorial, emotional
- Body: DM Sans (Google Fonts) — modern, warm, readable
- NEVER use: Inter, Roboto, Arial, Space Grotesk, 
  Playfair Display

## Responsive Breakpoints
900px (tablet) and 600px (mobile)
Each CSS file owns its own media queries.

## Animations
All transitions: cubic-bezier(0.22, 1, 0.36, 1)
Blob drift keyframes in components.css (30s loop, 
blur 80px, opacity 0.25)
heroFadeIn keyframe in homepage.css

## Design Rules
- Cards: 16px border radius, soft shadow
- Organic blob shapes for background decoration
- Smooth scroll + fade-in on scroll for all sections
- Asymmetric project card layout — NOT a standard grid
- Grain texture overlay on entire page for warmth
- Diagonal clip-path section dividers
- Fully responsive: 1400px, 900px, 600px, 375px
- Accessibility: WCAG AA minimum, Lighthouse 90+

## Homepage Nav Links
Anchor links: #work, #about, mailto:

## Project Page Nav Links
Back to homepage: ../index.html#work, ../index.html#about
CSS/JS with ../ prefix: ../css/style.css, ../js/main.js

## Project Page Structure (in order)
1. header.project-hero — blobs + title + tagline + tags
2. section.project-meta — 4-col grid (Role, Timeline, 
   Tools, Team)
3. section.project-overview — intro paragraphs
4. section.project-process — .process-step blocks
5. section.project-gallery-full — horizontal scroll-snap
6. nav.project-nav-prevnext — circular prev/next links

## Prev/Next Cycle
MoodMaps → Contigo → EcoGenie → 
DoctorD+ → From Maps to Memories → MoodMaps

## Projects
1. MoodMaps — "What if your map knew how you felt?" 
   — EMOTION · GIS · NAVIGATION · UX RESEARCH
2. Contigo — "A calm companion for moments of panic." 
   — MENTAL HEALTH · ACCESSIBILITY · MOBILE
3. EcoGenie — "Your AI guide to a greener home." 
   — AI · SUSTAINABILITY · PRODUCT DESIGN
4. DoctorD+ — "Redesigning how patients access healthcare." 
   — HEALTH · MOBILE UX · UX RESEARCH
5. From Maps to Memories — "Where cartography meets 
   personal narrative." 
   — STORYTELLING · ARCGIS · DATA VISUALIZATION

## Image Placeholders
Replace div.img-placeholder with img tags when real 
images are ready. Parent container handles border-radius, 
shadow, aspect-ratio. img needs: 
width:100%; height:100%; object-fit:cover;

## Adding a New Project
1. Copy an existing project page
2. Add card to #work grid in index.html
3. Update prev/next links in adjacent pages
