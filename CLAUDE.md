# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pichasafio is a Spanish-language intimate health and wellness web app built with React + TypeScript + Vite. It uses Supabase as backend (auth, database) and deploys to Vercel.

## Commands

- **Install:** `pnpm install` (pnpm is required)
- **Dev server:** `pnpm dev` (port 5173, development mode)
- **Dev with prod env:** `pnpm dev:prod` (port 3000)
- **Build:** `pnpm build` (runs `tsc -b && vite build`)
- **Build dev:** `pnpm build:dev` (outputs to `dist-dev/` with sourcemaps)
- **Lint:** `pnpm lint` (ESLint with typescript-eslint)
- **Preview:** `pnpm preview`
- **DB migrations:** `pnpm migrate:dev` / `pnpm migrate:prod`

## Architecture

### Stack
- React 19, TypeScript, Vite (with SWC plugin), Tailwind CSS 3, shadcn/ui (new-york style, stone base color)
- Supabase for auth (PKCE flow) and database
- Cloudinary for media
- Framer Motion for animations
- React Router v6 for client-side routing
- Deployed on Vercel with SPA rewrites

### Path Alias
`@/` maps to `./src/` (configured in tsconfig.json and vite.config.ts)

### Key Directories
- `src/components/` — Feature components, each in its own folder (e.g., `Login/`, `UserProfile/`, `SpinWheel/`)
- `src/components/ui/` — shadcn/ui primitives (button, card, badge, label, select, tabs)
- `src/components/common/` — Shared components like `ProtectedRoute`
- `src/context/AuthProvider.tsx` — Auth context wrapping the app, exposes `useAuth()` hook
- `src/lib/` — Services and utilities:
  - `supabaseClient.tsx` — Singleton Supabase client
  - `config.ts` — Environment-aware config (reads `VITE_*` env vars)
  - `challengeService.ts`, `dailyLoginService.ts`, `rewardsService.ts`, `profileService.ts` — Business logic services
  - `cloudinaryService.ts` — Media upload/retrieval
- `src/types/` — TypeScript type definitions
- `scripts/` — Node.js scripts for DB migrations, data seeding, and debugging
- `sql/` — SQL migration files

### App Structure
- `main.tsx` — Entry point: BrowserRouter → SessionContextProvider (Supabase) → App
- `App.tsx` — Age verification gate → DonationBanner + Navbar + lazy-loaded routes
- `page.tsx` — Landing/home page
- Routes use React.lazy() with Suspense for code splitting
- Some routes are wrapped in `ProtectedRoute` (requires auth)

### Environment Configuration
- `.env.development` and `.env.production` (not committed; see `.env.example`)
- Required vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Optional: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_AD_ECPM_USD`, `VITE_SITE_URL`
- Vite mode determines environment; `config.ts` validates required vars at startup

### UI Patterns
- Chakra UI v3 and Radix UI primitives are both available alongside shadcn/ui
- Styling uses Tailwind utility classes; dark theme with gray-900 backgrounds
- lucide-react for icons
