# Alfred K. Pone: Portfolio & Atoms and Bits

Multi-page portfolio for **Alfred K. Pone**: computer engineer (embedded systems, IoT, robotics & AI), PhD energy-policy researcher, Botswana's IAEA energy planning representative, and founder of **Atoms and Bits (Pty) Ltd**.

**Live site:** https://aahilali88.github.io/ALI_Portfolio/

Built with Next.js (App Router, static export), TypeScript, Tailwind CSS v4, Lucide React, and **Three.js** via React Three Fiber + drei for the interactive 3D scenes.

## Pages

| Route | What's there |
| --- | --- |
| `/` | 3D "atoms + bits" hero, Atoms and Bits spotlight, about bento, interactive 3D project lab |
| `/projects` | 3D project explorer + filterable case-study grid |
| `/projects/[slug]` | 8 case studies, each with its own interactive 3D model |
| `/research` | CLEWS nexus 3D model, NEUS 2022/23 data spotlight (3D bar chart), publications |
| `/experience` | Work profile timeline + interactive 3D globe (Gaborone → SADC, IAEA Vienna, UK) |
| `/education` | 3D degree stack linked to the degree list, dissertation, certifications |
| `/atoms-and-bits` | Company page for Atoms and Bits (Pty) Ltd |
| `/contact` | Copy-email, mailto, phone and LinkedIn |

Three themes (Technical Dark, Light Minimalist, High-Contrast Editorial) are switched in the navbar and saved in `localStorage`. The 3D scenes re-colour with the theme.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the static site and publishes it to the `gh-pages` branch. GitHub Pages serves that branch (Settings → Pages → Deploy from a branch → `gh-pages` / root).

**Custom domain:** to use a domain such as `alfredpone.com`:
1. Buy the domain and point its DNS at GitHub Pages (see GitHub's "Managing a custom domain" docs).
2. In the repo go to Settings → Pages → Custom domain and enter it.
3. In `deploy.yml` set `NEXT_PUBLIC_BASE_PATH: ""` and `NEXT_PUBLIC_SITE_URL: https://alfredpone.com`.

## Editing content

All text lives in `data/portfolioData.ts`: profile, projects and case studies, NEUS figures, publications, company, work profile and education.

**Project images:** drop files into `public/images/projects/<slug>/` named `prototype.(jpg|png|webp)` and `architecture.(jpg|png|webp|svg)`. They replace the placeholders on the next build.

**3D models** live in `components/three/`:
- `AtomsBitsCore.tsx`: hero and company scene
- `ProjectModels.tsx`: one procedural model per project, registered by slug
- `SadcGlobe.tsx`, `EducationStack.tsx`, `NeusEnergyBars.tsx`
- `SceneCanvas.tsx`: lazy-mounts each canvas, pauses it off-screen, and respects reduced-motion settings

## Before sharing widely

- Replace the LinkedIn placeholder (`profile.linkedin`).
- NEUS figures come from the **draft** main report (May 2024). Update them if the final published report changes any numbers.
