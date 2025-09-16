# CodeVail Interview Platform

Secure, monitored coding interview & proctoring environment built with Next.js (App Router), Electron, Tailwind, and a Python grading backend.

## Features
- Dual-mode (web + desktop Electron) delivery
- Anti-cheat monitoring with warning vs termination states
- Real-time code execution panel & Monaco editor
- Interviewer / Candidate dashboards
- Results storage (local) with termination status integration
- Responsive large-screen scaling utilities
- Dark / light theme with custom design tokens

## Monorepo Layout (Key Folders)
```
app/                # Next.js App Router pages & routes
components/         # Shared React UI components (shadcn-derived and custom)
lib/                # Utilities (results-store, etc.)
electron/           # Electron main process & packaging
backend/            # Python grading / service layer
public/             # Static assets
```

## Getting Started (Dev)
```bash
# Install deps
npm install
# Run web (Next.js) only
npm run dev
# Run Electron + web concurrently
npm run electron:dev
# Full dev environment (backend + frontend if scripted)
python start_dev.py
```
> Ensure Python environment has dependencies from `requirements.txt`.

## Building Production Artifacts
```bash
# Build Next.js + package Electron installers
npm run electron:dist
```
Artifacts appear in `dist/` using pattern:
```
CodeVail-<version>-<os>-<arch>.exe   (NSIS installer)
CodeVail-<version>-<os>-<arch>.exe   (Portable build, same extension but different name details)
```

## Download Route
A convenience redirect for the landing page:
`/download/windows` -> latest GitHub release asset (update `app/download/windows/route.ts`).

## Environment Variables
All sensitive runtime config should live in `.env.local` (not committed). Copy `.env.example` to bootstrap.

## Anti-Cheat Pages
- `/anti-cheat-warning` – Soft violation (allows continuation)
- `/interview-terminated` – Hard stop, shows encoded violation payload

## Styling
Tailwind + custom adaptive utilities in `app/globals.css`. Stylelint configured to ignore Tailwind at-rules.

## Results Storage
`lib/results-store.ts` stores recent test outcomes (including TERMINATED) in `localStorage` for demo presentation pages.

## Packaging Notes
- Uses `electron-builder` with NSIS + Portable targets
- Customize icon: add `build/icons/icon.png` and set `"icon"` in `package.json` build block
- Future Auto-update: add `electron-updater`

## Recommended Scripts
```bash
npm run lint         # Next.js / ESLint
npm run lint:css     # Stylelint (Tailwind aware)
```

## Contributing / Cleanup Roadmap
- Migrate legacy `src/pages` views fully into `app/` (progress ongoing)
- Consolidate multiple results-related pages (`/results`, `/test-results`, legacy variants)
- Add automated tests for anti-cheat flows
- Integrate auto-update & code signing

## License
Proprietary – All rights reserved (update if you choose an OSS license later).

---
_Update `app/download/windows/route.ts` after publishing each GitHub Release._
