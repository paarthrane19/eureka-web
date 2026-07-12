# Eureka — Web

The social platform for science. A Next.js 14 (App Router) app with a public
landing page and the full Eureka product behind authentication, talking to the
existing FastAPI + MongoDB backend.

## Design system

A "Laboratory Minimal" aesthetic that matches the mobile app exactly: pure
white base, true-black text, a single acid-green accent (`#00E676`), 0.5px
hairline dividers instead of card shadows, and a pure-black OLED dark mode.
Space Grotesk for headlines, Inter for body, JetBrains Mono for data/labels.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with CSS-variable design tokens (light / OLED dark via `.dark`)
- `@tanstack/react-query` for data fetching + optimistic updates
- `framer-motion` for scroll and canvas-driven motion
- JWT auth against the FastAPI backend (token stored in `localStorage`)

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# edit NEXT_PUBLIC_API_URL if your backend isn't on http://localhost:8000

# 3. Make sure the backend is running (from ../backend)
#    uvicorn app.main:app --reload --port 8000

# 4. Start the dev server
npm run dev
# open http://localhost:3000
```

### Scripts

| Script              | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start the dev server             |
| `npm run build`     | Production build                 |
| `npm run start`     | Serve the production build       |
| `npm run lint`      | ESLint                           |
| `npm run typecheck` | `tsc --noEmit`                   |

## Routes

- `/` — public landing page (hero + interactive curiosity constellation,
  the problem, three differentiators, waitlist CTA, footer)
- `/login`, `/signup` — JWT auth
- `/app` — feed with three-level depth navigation and keyboard shortcuts
  (`j`/`k` to move between posts, `←`/`→` to change depth)
- `/app/explore` — daily discovery, curated collections, open questions
- `/app/chat` — topic rooms with live message threads
- `/app/profile` — your discoveries, saved posts, editable bio
- `/app/post/[id]` — post detail with credibility, sources, and comments
- `/app/compose` — publish a new discovery
- `/og` — dynamically generated Open Graph image

## Environment variables

| Variable               | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Base URL of the FastAPI backend                |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site (used for SEO/OG tags) |

## Deploy to Vercel

1. Push this `web/` directory to a Git repository.
2. In Vercel, import the project and set the **Root Directory** to `web`.
3. Add the environment variables above (point `NEXT_PUBLIC_API_URL` at your
   deployed backend, and `NEXT_PUBLIC_SITE_URL` at the Vercel domain).
4. Deploy — Vercel auto-detects Next.js; no extra build config needed.

> The backend must allow CORS from the deployed origin. It currently sets
> `allow_origins=["*"]`, so cross-origin Bearer-token requests work out of the box.
