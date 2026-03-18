# FoodLog — Personal Food Journal

A beautifully crafted personal restaurant and food diary for documenting dining experiences. Track restaurant visits, rate individual dishes, explore analytics, and celebrate culinary adventures.

> Built with Next.js, Supabase, Framer Motion, and Tailwind CSS.

---

## Features

### Core Journal
- **Restaurant Visits** — Log visits with full ratings (food, service, ambience, value), occasion, companions, price range, and personal notes
- **Dish Tracking** — Add individual dishes per visit with ratings, flavor tags, photos, and tasting notes
- **Photo Gallery** — Masonry grid of all dish photos with lightbox viewer and blur-to-sharp reveal animations
- **Hall of Fame** — Auto-curated showcase of dishes rated 9+ with gold shimmer and confetti celebrations

### Analytics & Discovery
- **Analytics Dashboard** — Cuisine breakdown, price distribution, monthly visit trends, and dining occasion patterns
- **Top Restaurants** — Ranked leaderboard sorted by overall experience rating
- **Browse & Filter** — Search and filter all visits by cuisine, price range, and minimum rating

### Design System
- **Premium Typography** — Cormorant Garamond (display) + Plus Jakarta Sans (body)
- **Glassmorphism** — Frosted glass cards with backdrop blur and subtle white borders
- **Gold Accents** — Warm gold gradients on featured elements, dividers, and scroll progress
- **Framer Motion Animations** — Scroll-triggered reveals, mouse-tilt parallax cards, spring-based counters, staggered list entrances
- **Responsive Design** — Mobile-first with touch-friendly 44px+ tap targets, smooth page transitions

### Pages

| Route | Description |
|---|---|
| `/` | Homepage with animated hero, stats counters, top picks, and recent adventures |
| `/restaurants` | Browseable collection with live search + filter |
| `/restaurants/[id]` | Individual visit: parallax hero, ratings breakdown, dish cards, photo gallery |
| `/gallery` | Masonry photo grid with lightbox |
| `/hall-of-fame` | All 9+ rated dishes with podium layout |
| `/top-restaurants` | Ranked list by overall rating |
| `/analytics` | Recharts-powered insights dashboard |
| `/admin` | Protected dashboard (auth required) |
| `/admin/add-visit` | Full visit + dish entry form with HEIC support |
| `/login` | Supabase email/password authentication |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.35 (App Router) |
| UI | React 18 + Tailwind CSS 3.4 |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (`food-photos` bucket) |
| Auth | Supabase Auth (email/password) |
| Animations | Framer Motion 12 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Fonts | Cormorant Garamond + Plus Jakarta Sans |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the schema in `supabase/schema.sql` against your Supabase project. It creates:
- `restaurant_visits` table with RLS policies
- `dishes` table with cascade delete
- `photos` table
- `food-photos` storage bucket

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

---

## Architecture

```
app/
├── page.tsx                    — Homepage (server component)
├── layout.tsx                  — Root layout with Navbar + Footer
├── globals.css                  — Tailwind + premium design classes
├── admin/                      — Auth-protected admin routes
├── analytics/                  — Server-computed analytics
├── gallery/                    — Photo gallery
├── hall-of-fame/              — Top-rated dishes
├── restaurants/               — Browse + detail pages
└── top-restaurants/           — Ranked leaderboard

components/
├── layout/     Navbar, Footer, HeroSection
├── restaurant/ RestaurantCard, DishCard
├── admin/      VisitForm, DeleteVisitButton
├── analytics/ AnalyticsDashboard (Recharts)
├── animations/ PageTransition helpers
└── ui/         RatingBadge, OptimizedImage, Lightbox, FlavorTag, CopyButton, ConfettiBlast

lib/
├── supabase/  client.ts, server.ts
└── utils.ts   helpers, formatters, label maps
```

---

## Design Tokens

### Colors
- **Forest** `forest-*` — Primary brand: forest greens (#1B5E43 → #FAF7F0)
- **Gold** `gold-*` — Accent: warm gold (#D97706 → #FCD34D)
- **Ember** `ember-*` — Warm accents for mediocre ratings
- **Cream** `cream-*` — Background: warm off-white (#FAF7F0 base)

### Custom CSS Classes
- `.card-glass` — Frosted glass with backdrop blur
- `.card-premium` — White card with refined hover shadow lift
- `.card-featured` — Gradient border on hover
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-gold` — Consistent action buttons
- `.bg-warm` — Subtle warm body gradient
- `.font-display`, `.font-body` — Font family utilities

### Animations
- `whileInView` scroll-triggered entrances with staggered delays
- `useSpring` + `useTransform` for mouse-tilt parallax
- `useScroll` + `useTransform` for parallax image layers
- `AnimatePresence` for page transitions and lightbox
- `staggerChildren` for cascading list reveals
