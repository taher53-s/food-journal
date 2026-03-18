# FoodLog — Personal Food Journal

## Project Overview

FoodLog is a personal restaurant and food journal app for documenting dining experiences. It tracks restaurant visits with ratings (food, service, ambience, value), individual dish entries with photos and flavor tags, and provides analytics on dining habits. The app is publicly readable; only the owner/admin can add, edit, or delete entries via Supabase authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.35 (App Router) |
| UI | React 18 |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (`food-photos` bucket) |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion 12 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Fonts | Cormorant Garamond (display), Plus Jakarta Sans (body) |
| Auth | Supabase Auth (email/password) |

---

## Architecture

```
app/
├── layout.tsx              — Root layout: Navbar, Footer, fonts, metadata
├── page.tsx                — Homepage: hero, stats, top picks, recent visits
├── not-found.tsx           — 404 page
├── template.tsx            — Page transition wrapper (AnimatePresence)
├── globals.css             — Tailwind layers, custom CSS classes
├── admin/
│   ├── page.tsx            — Admin dashboard (stats, quick actions, recent visits)
│   ├── add-visit/page.tsx  — New visit form (auth-protected)
│   └── edit/[id]/page.tsx  — Edit existing visit (auth-protected)
├── analytics/page.tsx       — Analytics page: server-computes stats, passes to client chart
├── hall-of-fame/page.tsx    — Dishes rated 9+ with confetti
├── login/page.tsx           — Supabase email/password login
├── restaurants/
│   ├── page.tsx            — Browse/filter all visits (client-side)
│   └── [id]/page.tsx       — Individual visit detail page (server component)
└── top-restaurants/page.tsx — Ranked list by overall rating

components/
├── admin/
│   ├── VisitForm.tsx        — Full visit + dishes form (client, handles HEIC conversion)
│   ├── DeleteVisitButton.tsx — Delete visit with confirmation
│   └── AdminLogout.tsx       — Supabase signOut
├── animations/
│   └── PageTransition.tsx    — FadeIn, StaggerContainer, StaggerItem (Framer Motion)
├── analytics/
│   └── AnalyticsDashboard.tsx — Recharts: BarChart, PieChart, LineChart, rankings
├── layout/
│   ├── Navbar.tsx            — Fixed nav with scroll progress, mobile drawer, admin state
│   └── Footer.tsx            — Static footer with links
├── restaurant/
│   ├── RestaurantCard.tsx   — Card with local image map, ratings, top dish
│   └── DishCard.tsx          — Dish card with image, flavor tags, rank badge
└── ui/
    ├── ConfettiBlast.tsx     — React-confetti on hall of fame
    ├── CopyButton.tsx         — Fixed share button (copy URL to clipboard)
    ├── FlavorTag.tsx          — FlavorTag + FlavorTagSelector components
    └── RatingBadge.tsx       — RatingBadge (animated) + RatingBar (animated bars)

lib/
├── supabase/
│   ├── client.ts             — Browser client (createBrowserClient)
│   └── server.ts             — Server client (createServerClient with cookie handling)
└── utils.ts                  — cn(), date formatters, label maps, emoji maps

types/
├── index.ts                  — TypeScript interfaces: RestaurantVisit, Dish, Photo, AnalyticsData
└── heic2any.d.ts             — Type declarations for heic2any

supabase/
└── schema.sql                — Full schema: tables, RLS policies, storage bucket

public/
└── images/
    └── 1441-pizzeria/        — 16 pre-loaded .jpg images for local image display
```

---

## Database Schema

All three tables use `uuid-ossp` for UUID primary keys and have Row Level Security enabled.

### `restaurant_visits`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto-generated |
| user_id | UUID | FK to `auth.users`, owner for RLS |
| restaurant_name | TEXT | Required |
| location | TEXT | Required |
| cuisine | TEXT | Required |
| date_visited | DATE | Required |
| occasion | TEXT | CHECK IN ('date','friends','family','solo','business','celebration') |
| companions | TEXT | Optional |
| price_range | TEXT | CHECK IN ('budget','moderate','expensive','luxury') |
| ambience_rating | DECIMAL(3,1) | 0–10 |
| service_rating | DECIMAL(3,1) | 0–10 |
| food_rating | DECIMAL(3,1) | 0–10 |
| value_rating | DECIMAL(3,1) | 0–10 |
| overall_rating | DECIMAL(3,1) | 0–10 |
| experience_notes | TEXT | Optional |
| would_return | BOOLEAN | Default true |
| recommendation_level | TEXT | CHECK IN ('must_try','worth_it','decent','skip') |
| created_at | TIMESTAMPTZ | Default NOW() |

### `dishes`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| visit_id | UUID | FK to `restaurant_visits` ON DELETE CASCADE |
| dish_name | TEXT | Required |
| price | DECIMAL(10,2) | Optional |
| rating | DECIMAL(3,1) | 0–10 |
| notes | TEXT | Optional |
| flavor_tags | TEXT[] | Default `{}` |
| image_url | TEXT | Optional, Supabase Storage public URL |
| created_at | TIMESTAMPTZ | Default NOW() |

### `photos`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| visit_id | UUID | FK to `restaurant_visits` ON DELETE CASCADE |
| image_url | TEXT | Required |
| type | TEXT | CHECK IN ('food','interior','menu','exterior') |
| caption | TEXT | Optional |
| created_at | TIMESTAMPTZ | Default NOW() |

### RLS Policies
- All three tables: public SELECT (anyone can read)
- All three tables: INSERT/UPDATE/DELETE restricted to the `user_id` owner
- Storage bucket `food-photos`: public SELECT, authenticated INSERT/DELETE

---

## Key Components (13 total)

1. **Navbar** (`layout/Navbar.tsx`) — Fixed nav bar with scroll progress indicator, scroll-triggered background blur, active link indicator via Framer Motion `layoutId`, mobile slide-out drawer with Framer AnimatePresence
2. **Footer** (`layout/Footer.tsx`) — Static three-column footer with navigation links and branding
3. **RestaurantCard** (`restaurant/RestaurantCard.tsx`) — Visit card with local image map fallback, recommendation badge, top dish preview, cuisine emoji. Uses `whileHover` scale animation
4. **DishCard** (`restaurant/DishCard.tsx`) — Dish card with image, rating badge, flavor tags, delete button (admin only), rank emoji for top 3
5. **VisitForm** (`admin/VisitForm.tsx`) — Full CRUD form with rating sliders, dish entries, HEIC-to-JPEG conversion via heic2any, Supabase Storage upload, Framer Motion dish entry animations
6. **DeleteVisitButton** (`admin/DeleteVisitButton.tsx`) — Deletes visit from Supabase, redirects to /restaurants
7. **AdminLogout** (`admin/AdminLogout.tsx`) — Supabase signOut, redirects to homepage
8. **PageTransition** (`animations/PageTransition.tsx`) — `FadeIn` (viewport-triggered opacity/y), `StaggerContainer` + `StaggerItem` for staggered list animations
9. **AnalyticsDashboard** (`analytics/AnalyticsDashboard.tsx`) — 4 stat cards + 4 Recharts charts (horizontal BarChart, PieChart, LineChart, BarChart) + top restaurants list
10. **ConfettiBlast** (`ui/ConfettiBlast.tsx`) — Fixed-position react-confetti burst on hall of fame page, auto-hides after 5s
11. **CopyButton** (`ui/CopyButton.tsx`) — Fixed FAB button (bottom-right) that copies URL to clipboard with animated "Link copied!" tooltip
12. **FlavorTag** (`ui/FlavorTag.tsx`) — Single tag + animated variant + `FlavorTagSelector` multi-select for dish entries
13. **RatingBadge** (`ui/RatingBadge.tsx`) — Animated spring badge + animated `RatingBar` progress bars with Framer Motion

---

## Image Handling

### Upload Flow (VisitForm.tsx)
1. User selects image via file input in the dish entry section (`accept="image/*,.heic,.heif"`)
2. If extension is `.heic` or `.heif`, `heic2any` converts to JPEG blob at 80% quality
3. File is uploaded to Supabase Storage bucket `food-photos` at path `${visitResult.id}/${Date.now()}.${ext}` with `contentType` set
4. Public URL is retrieved via `getPublicUrl()` and stored as `image_url` in the `dishes` table
5. The storage bucket is public, so the URL is directly accessible

### Display Flow
- **RestaurantCard** and **DishCard**: First check `LOCAL_IMAGE_MAP` for a local static image (currently hardcoded for "1441 Pizzeria" / "1441" restaurants), falling back to the `image_url` from the DB. Both use Next.js `<Image>` with a native `<img>` fallback for robustness (the fallback has `zIndex: -1` so it only shows if the Image component fails)
- **Restaurant detail page**: Maps DB `photos` to local images via `LOCAL_IMAGE_MAP`, uses `coverPhoto?.localUrl || coverPhoto?.image_url`
- **Hall of Fame**: Uses `dish.image_url` directly from the `dishes` table

---

## Styling

### Tailwind Color Palettes
- **cream**: 50–300 (warm off-white backgrounds)
- **forest**: 50–950 (primary brand color, greens)
- **gold**: 100–800 (accent/highlight)
- **ember**: 100–600 (warm accent for warnings/mediocre ratings)

### Custom CSS Classes (globals.css @layer components)
- `.text-gradient` — Forest-to-gold gradient for heading text (`-webkit-text-fill-color: transparent`)
- `.text-gradient-gold` — Ember-to-gold gradient
- `.card-premium` — White card with forest shadow, hover lift + deeper shadow
- `.input-premium` — Styled form input with forest focus ring
- `.btn-primary` — Forest green filled button with shadow
- `.btn-secondary` — Forest border-only button

### Custom CSS Classes (globals.css @layer utilities)
- `.font-display` — Cormorant Garamond serif
- `.font-body` — Plus Jakarta Sans sans-serif
- `.no-scrollbar` — Hide scrollbar utility

### Tailwind Animations
- `float` — Gentle vertical float (6s ease-in-out infinite)
- `marquee` — Horizontal text marquee for emoji strip
- `shimmer` — Shimmer sweep for logo hover effect

### Shadow Tokens
- `shadow-card`, `shadow-card-hover`, `shadow-glow`, `shadow-glow-gold`, `shadow-luxury`

---

## Routes

| Route | Type | Description |
|---|---|---|
| `/` | Server (RSC) | Homepage: hero, stats, top 3 picks, 6 recent visits, quote section |
| `/restaurants` | Client | Browse all visits with search + cuisine/price/rating filters |
| `/restaurants/[id]` | Server (RSC) | Individual visit detail: ratings breakdown, dishes, photos, admin actions |
| `/admin` | Server (RSC) | Dashboard with stats, quick actions, recent visits (auth required) |
| `/admin/add-visit` | Server (RSC) | Add new visit form (auth required) |
| `/admin/edit/[id]` | Server (RSC) | Edit existing visit (auth required) |
| `/analytics` | Server (RSC) | Analytics: cuisine breakdown, price distribution, monthly visits, top restaurants |
| `/hall-of-fame` | Server (RSC) | All dishes rated 9+ with confetti blast and gold gradient cards |
| `/top-restaurants` | Server (RSC) | Full ranked list sorted by overall_rating descending |
| `/login` | Client | Supabase email/password login form |
| `/*` (404) | Static | Custom 404 with food emoji and "Back to Journal" button |

---

## Rules

1. **Never modify `.env` or Supabase credentials.** All credentials are in `.env.local` (not committed). The `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are read by `lib/supabase/client.ts` and `lib/supabase/server.ts`.
2. **Always use existing Tailwind theme tokens.** Use `forest-*`, `gold-*`, `ember-*`, `cream-*` color classes. Do not introduce arbitrary hex values for colors that already exist in the theme.
3. **Use Framer Motion for all animations.** Available helpers in `components/animations/PageTransition.tsx`: `FadeIn`, `StaggerContainer`, `StaggerItem`. For inline `whileHover`/`whileTap` animations, import `motion` from `framer-motion` directly.
4. **Keep Supabase queries in server components.** All database queries (SELECT, INSERT, UPDATE, DELETE) go through `lib/supabase/server.ts` in server components (RSC). Client components use `lib/supabase/client.ts`. This ensures proper cookie-based auth on the server.
5. **Run `npm run build` after changes to verify.** The build script is `NEXT_DISABLE_ESLINT=1 next build`. Build failures will prevent deployment.
6. **Use the LOCAL_IMAGE_MAP for static images.** `RestaurantCard` and the restaurant detail page check `LOCAL_IMAGE_MAP` first before falling back to Supabase `image_url`. If adding new local images, update this map in both components.
7. **HEIC conversion is handled in `VisitForm.tsx`.** Do not reimplement — import `heic2any` and follow the existing pattern with try/catch and quality 0.8.
8. **Auth check pattern for admin routes.** Server components check `supabase.auth.getUser()` and call `redirect("/login")` if no user is returned.
