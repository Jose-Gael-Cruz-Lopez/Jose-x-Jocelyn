# Jose x Jocelyn · From Campus to Career

From Campus to Career is a collaborative initiative for first-generation and underrepresented students in tech and data: practical advice, transparent insights, and a visible path from first internship search to full-time role.

## About

- **Jose G. Cruz-Lopez** focuses on getting in: internships, applications, and recruiting insight as an actively recruiting student.
- **Jocelyn Vazquez** focuses on staying and growing: offers, negotiation, and early-career growth in tech and data.

## What's in the site

- **Home** — hero, about, gallery, services, editorial grid, contact form.
- **La Voz del Día** — long-form articles.
- **Coffee Chat Network** — opt-in directory of people open to 15–30 min chats, backed by Supabase with moderated submissions.
- **Opportunity Board** — curated and community-submitted internships, apprenticeships, and roles.
- **Career Templates** — outreach, resume, and follow-up scripts.
- **Bridge Year Hub** — resources for the year between offers.
- **Interview Prep**, **Partner Panels**, **Resume Reviews**, **LinkedIn Series** — supporting hubs.

## Tech stack

- **React 18** + **React Router** (`src/`)
- **Vite** dev server and bundler
- **Tailwind** + hand-rolled CSS (`style.css`, `article.css`)
- **Supabase** for Postgres, Row-Level Security, storage (avatars + resumes), and edge functions (`supabase/`)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
#    Then edit .env.local and fill in:
#      VITE_SUPABASE_URL
#      VITE_SUPABASE_ANON_KEY

# 3. Run the migration in Supabase
#    Open Supabase Studio > SQL Editor and run:
#      supabase/migrations/001_initial_schema.sql
#    The script is idempotent and safe to re-run.

# 4. Start the dev server
npm run dev
```

The site will be available at the URL printed by Vite (usually `http://localhost:5173`).

### Supabase setup

The migration creates the tables (`subscribers`, `opportunities`, `coffee_chat_profiles`, `resume_submissions`, etc.), enables Row-Level Security, and provisions two storage buckets:

- `avatars` (public read) — coffee chat profile photos
- `resumes` (private) — admin-only via `service_role`

Coffee chat submissions are inserted with `status = 'pending'`. To publish a profile, an admin runs:

```sql
update coffee_chat_profiles set status = 'approved' where id = '...';
```

The public client (anon key) cannot read the `email` column thanks to a column-level GRANT — it is reserved for moderation and admin contact.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |

## Design

UI/UX inspired by [kobykooba.com](https://kobykooba.com/), adapted for the Jose × Jocelyn / From Campus to Career brand.

## License

All rights reserved. © 2026 Jose × Jocelyn.
