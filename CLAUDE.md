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
| Image optimization | Sharp (devDependency, PWA icon generation) |

---

## Architecture

```
app/
├── layout.tsx              — Root layout: Navbar, Footer, fonts, PWA metadata
├── page.tsx                — Homepage: HeroSection, Top Rated Picks, Latest Adventures, quote
├── template.tsx            — Page transition wrapper (AnimatePresence + gold shimmer bar)
├── not-found.tsx           — 404 page
├── globals.css             — Tailwind layers, custom CSS classes, card/button variants
├── admin/
│   ├── page.tsx            — Admin dashboard (stats, quick actions, recent visits)
│   ├── add-visit/page.tsx  — New visit form (auth-protected)
│   └── edit/[id]/page.tsx  — Edit existing visit (auth-protected)
├── analytics/page.tsx       — Analytics: server-computes stats, client chart component
├── hall-of-fame/
│   ├── page.tsx            — Dishes rated 9+ with confetti + gold gradient cards
│   └── HallOfFameCards.tsx — Client: HallOfFameTrophy, HallOfFameTopCard
├── gallery/
│   ├── page.tsx            — Masonry photo gallery with lightbox (server component)
│   └── GalleryClient.tsx   — Client: masonry grid, horizontal strip, lightbox trigger
├── login/page.tsx           — Supabase email/password login (glass card design)
├── restaurants/
│   ├── page.tsx            — Browse/filter all visits (client-side, sticky filters)
│   └── [id]/
│       ├── page.tsx        — Individual visit detail (server component + parallax hero)
│       ├── RestaurantHero.tsx — Client: parallax hero for restaurant detail
│       └── RestaurantDetailClient.tsx — Client: animated badge, meta row, photo items, sidebar ranks
├── top-restaurants/
│   ├── page.tsx            — Ranked list by overall rating (server component)
│   └── TopRestaurantsCards.tsx — Client: animated rank/cuisine/arrow elements
└── not-found.tsx

components/
├── layout/
│   ├── Navbar.tsx            — Fixed nav: scroll-hide/show, gold progress bar, glassmorphism
│   ├── Footer.tsx             — Dark forest footer, 4-column grid, back-to-top FAB
│   ├── HeroSection.tsx       — Client: parallax hero with floating photos, stat cards
│   └── ServiceWorkerRegistration.tsx — Registers /sw.js on mount
├── restaurant/
│   ├── RestaurantCard.tsx     — Card with local image map, ratings, top dish
│   └── DishCard.tsx          — Dish card with image, flavor tags, rank badge
├── admin/
│   ├── VisitForm.tsx          — Full visit + dishes form (client, HEIC conversion)
│   ├── DeleteVisitButton.tsx  — Delete visit with confirmation
│   └── AdminLogout.tsx       — Supabase signOut
├── animations/
│   └── PageTransition.tsx    — FadeIn, ClipReveal, SlideInLeft/Right, ScaleIn,
│                               StaggerContainer/Item, AnimatedDivider/VerticalLine, SectionHeading,
│                               + default Template (page transition shimmer bar)
├── analytics/
│   └── AnalyticsDashboard.tsx — 4 stat cards + 4 Recharts charts + top restaurants list
├── ui/
│   ├── OptimizedImage.tsx    — 4-layer fallback: Next.js Image → native img → gradient → emoji
│   ├── Lightbox.tsx          — Full-screen photo lightbox with keyboard nav + AnimatePresence
│   ├── ConfettiBlast.tsx     — React-confetti on hall of fame
│   ├── CopyButton.tsx        — Fixed share button (copy URL to clipboard)
│   ├── FlavorTag.tsx         — FlavorTag + FlavorTagSelector components
│   └── RatingBadge.tsx       — RatingBadge (animated spring) + RatingBar

lib/
├── supabase/
│   ├── client.ts             — Browser client (createBrowserClient)
│   └── server.ts             — Server client (createServerClient with cookie handling)
└── utils.ts                  — cn(), date formatters, label maps, emoji maps

types/
├── index.ts                  — TypeScript interfaces: RestaurantVisit, Dish, Photo, AnalyticsData
└── heic2any.d.ts             — Type declarations for heic2any

public/
├── manifest.json              — PWA manifest: name, theme, icons, shortcuts
├── sw.js                      — Service worker: install/activate/fetch handlers
├── icons/                     — 8 PWA icon PNGs (72–512px), generated with sharp
└── images/
    └── 1441-pizzeria/         — 16 pre-loaded .jpg images for local image display
```

---

## Design System

### Color Palettes (Tailwind)
- **cream**: 50–300 (warm off-white backgrounds)
- **forest**: 50–950 (primary brand, greens)
- **gold**: 100–800 (accent/highlight)
- **ember**: 100–600 (warm accent)

### Custom CSS Classes (`globals.css @layer components`)

| Class | Description |
|---|---|
| `.text-gradient` | Forest-to-gold gradient heading (`-webkit-text-fill-color: transparent`) |
| `.text-gradient-gold` | Ember-to-gold gradient |
| `.card-glass` | Glassmorphism: `bg-white/70`, `backdrop-blur-xl`, white border |
| `.card-premium` | White card, forest shadow, hover lift + deeper shadow |
| `.card-featured` | White card with CSS-mask gradient border on hover |
| `.input-premium` | Styled form input with forest focus ring |
| `.btn-primary` | Forest green filled, `active:scale-[0.97]` press feedback |
| `.btn-secondary` | Forest border-only, hover fills with forest tint |
| `.btn-ghost` | Transparent, hover gets forest background |
| `.btn-gold` | Gold gradient fill, forest text |

### Custom CSS Classes (`globals.css @layer utilities`)
- `.font-display` — Cormorant Garamond serif
- `.font-body` — Plus Jakarta Sans sans-serif
- `.no-scrollbar` — Hide scrollbar
- `.bg-warm` — Radial warm gradient background
- `.glass` — Glassmorphism utility
- `.divider-premium` — Forest-to-gold gradient divider line

### Tailwind Animations
- `float` — Gentle vertical float (6s ease-in-out infinite)
- `marquee` — Horizontal text marquee for emoji strip
- `shimmer` — Shimmer sweep for logo hover effect

### Shadow Tokens
- `shadow-card`, `shadow-card-hover`, `shadow-glow`, `shadow-glow-gold`, `shadow-luxury`

---

## Animations (Framer Motion)

### Available helpers in `components/animations/PageTransition.tsx`
- `FadeIn` — opacity + slide-up on viewport enter
- `ClipReveal` — clip-path curtain reveal
- `SlideInLeft` / `SlideInRight` — directional slide-in on viewport
- `ScaleIn` — scale 0.92 → 1 on viewport enter
- `StaggerContainer` / `StaggerItem` — staggered list animations (direction: up/down/left/right/scale)
- `AnimatedDivider` — horizontal line that draws itself (`scaleX: 0 → 1`)
- `AnimatedVerticalLine` — vertical gold line that draws itself
- `SectionHeading` — eyebrow + title + subtitle staggered reveal
- `Template` (default export) — page transition with gold shimmer bar

### Navbar (`Navbar.tsx`)
- **Scroll progress bar**: `useScroll` + `useSpring` → gold `h-[2px]` bar at top with gold glow
- **Hide on scroll down**: `hidden` state when `currentY > lastScrollY` and `currentY > 80`
- **Show on scroll up**: `hidden = false` when scrolling up
- **Glassmorphism on scroll**: `bg-white/80 backdrop-blur-2xl` when `scrolled > 20px`
- **Active link**: `layoutId="nav-indicator"` pill background with spring animation
- **Hover underline**: Gold gradient `scale-x-0 → scale-x-100` on non-active links
- **Logo**: `whileHover` rotate + scale + shimmer sweep
- **Mobile drawer**: `x: "100%" → 0` spring slide-in, backdrop blur overlay

### Footer (`Footer.tsx`)
- **Back-to-top FAB**: `motion.button` shows after 600px scroll, fades in with scale
- **Animated heart**: `scale [1, 1.3, 1]` loop
- **Dark forest background** with ambient gradient orbs

### Hero (`HeroSection.tsx`, client component)
- **Parallax layers**: `useScroll` + `useTransform` on multiple layers (content, image, overlay)
- **Floating photos**: `useInView` + `AnimatePresence` staggered reveals
- **Stat cards**: CSS-mask gradient border on hover, gold shimmer overlay
- **Buttons**: `active:scale-[0.97]` press feedback, warm gold hover fill on primary

### Restaurant Detail (`app/restaurants/[id]/RestaurantDetailClient.tsx`)
- `DetailBadge` — fade + scale entrance animation
- `MetaRow` — slide-up entrance for metadata
- `PhotoItem` — blur-to-sharp + scale reveal on scroll (`whileInView`)
- `SidebarRankItem` — `x: 16 → 0` stagger reveal on viewport enter

### Gallery (`app/gallery/GalleryClient.tsx`)
- **Masonry grid**: `columns-1 sm:columns-2 lg:columns-3`, varied heights for masonry effect
- **Photo entrance**: `opacity: 0, scale: 0.96, filter: blur(8px)` → `opacity: 1, scale: 1, blur: 0`
- **Hover**: scale 1.1 on image, overlay with caption + zoom icon
- **Horizontal strip**: infinite `x: ["0%", "-33.33%"]` marquee animation
- **Lightbox**: `AnimatePresence mode="wait"` with scale transition

### Hall of Fame (`app/hall-of-fame/HallOfFameCards.tsx`)
- `HallOfFameTrophy` — floating animation (`animate-float`)
- `HallOfFameTopCard` — `whileHover { y: -8, scale: 1.02 }` + CSS-mask gold border + shimmer

### Top Restaurants (`app/top-restaurants/TopRestaurantsCards.tsx`)
- `RankEmoji` — `whileHover { scale: 1.15 }`
- `CuisineEmoji` — `whileHover { scale: 1.1, backgroundColor }`
- `AnimatedArrow` — infinite `x: [0, 5, 0]` loop

### RatingBadge (`components/ui/RatingBadge.tsx`)
- Spring entrance: `rotate: -8 → 0`, `stiffness: 400, damping: 20`
- `whileHover { scale: 1.12, rotate: [0, -3, 3, 0] }`
- `whileTap { scale: 0.92 }`

### Lightbox (`components/ui/Lightbox.tsx`)
- `scale: 0.92 → 1` on open, `scale: 0.96` on exit
- Keyboard nav: Escape, ArrowLeft, ArrowRight
- Loading skeleton while image loads

---

## PWA Setup

### Files
- `public/manifest.json` — App name, short name, theme colors, background color, `display: standalone`, 8 icon sizes (72–512px), 3 shortcuts (Restaurants, Hall of Fame, Analytics)
- `public/sw.js` — Service worker with install/activate/fetch handlers
- `components/layout/ServiceWorkerRegistration.tsx` — Registers `/sw.js` on mount
- `app/layout.tsx` — PWA metadata: `manifest`, `appleWebApp`, `viewport.themeColor`, `other` meta tags

### Service Worker Strategy
- **Install**: Precache shell (pages, manifest, all 8 icon sizes)
- **Activate**: Delete all old caches except current `food-journal-v1`
- **Fetch**:
  - Network-first for HTML/navigation requests (fresh pages, falls back to cache then `/`)
  - Cache-first for static assets (JS, CSS, images, fonts)
  - Cross-origin requests pass through unchanged

### Icons
- 8 PNG sizes generated with `sharp` from SVG: 72, 96, 128, 144, 152, 192, 384, 512px
- Forest green circle with fork/plate motif and gold star accent

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

## Key Components (20 total)

1. **Navbar** (`layout/Navbar.tsx`) — Fixed nav with gold scroll progress bar, scroll-hide/show behavior, glassmorphism on scroll, `layoutId` active indicator, mobile slide-out drawer
2. **Footer** (`layout/Footer.tsx`) — Dark forest background with ambient gradient orbs, 4-column grid, animated heart, back-to-top FAB
3. **HeroSection** (`layout/HeroSection.tsx`) — Client component with parallax layers, floating photo reveals, stat cards with gradient border
4. **RestaurantCard** (`restaurant/RestaurantCard.tsx`) — Card with local image map fallback, recommendation badge, top dish preview, `whileHover` scale animation
5. **DishCard** (`restaurant/DishCard.tsx`) — Dish card with image, rating badge, flavor tags, delete button (admin only), top-3 gradient border
6. **VisitForm** (`admin/VisitForm.tsx`) — Full CRUD form with rating sliders, dish entries, HEIC-to-JPEG conversion via heic2any, Supabase Storage upload
7. **DeleteVisitButton** (`admin/DeleteVisitButton.tsx`) — Deletes visit from Supabase, redirects to /restaurants
8. **AdminLogout** (`admin/AdminLogout.tsx`) — Supabase signOut, redirects to homepage
9. **PageTransition** (`animations/PageTransition.tsx`) — FadeIn, ClipReveal, SlideInLeft/Right, ScaleIn, StaggerContainer/Item, AnimatedDivider, AnimatedVerticalLine, SectionHeading, Template
10. **AnalyticsDashboard** (`analytics/AnalyticsDashboard.tsx`) — 4 stat cards + 4 Recharts charts + top restaurants list
11. **ConfettiBlast** (`ui/ConfettiBlast.tsx`) — Fixed-position react-confetti burst on hall of fame page, auto-hides after 5s
12. **CopyButton** (`ui/CopyButton.tsx`) — Fixed FAB button (bottom-right) that copies URL to clipboard
13. **FlavorTag** (`ui/FlavorTag.tsx`) — Single tag + animated variant + `FlavorTagSelector` multi-select
14. **RatingBadge** (`ui/RatingBadge.tsx`) — Animated spring badge + `RatingBar` progress bars
15. **OptimizedImage** (`ui/OptimizedImage.tsx`) — 4-layer fallback: Next.js Image → native img → gradient placeholder → emoji
16. **Lightbox** (`ui/Lightbox.tsx`) — Full-screen photo viewer with keyboard navigation, `AnimatePresence`
17. **GalleryClient** (`gallery/GalleryClient.tsx`) — Masonry photo grid with infinite horizontal strip + lightbox
18. **RestaurantDetailClient** (`restaurants/[id]/RestaurantDetailClient.tsx`) — Animated badge, meta row, photo items, sidebar rank items
19. **HallOfFameCards** (`hall-of-fame/HallOfFameCards.tsx`) — Floating trophy + gold gradient top cards
20. **TopRestaurantsCards** (`top-restaurants/TopRestaurantsCards.tsx`) — Animated rank emojis, cuisine emojis, animated arrow

---

## Image Handling

### Upload Flow (VisitForm.tsx)
1. User selects image via file input (`accept="image/*,.heic,.heif"`)
2. If extension is `.heic` or `.heif`, `heic2any` converts to JPEG blob at 80% quality
3. File is uploaded to Supabase Storage bucket `food-photos` at path `${visitResult.id}/${Date.now()}.${ext}`
4. Public URL is retrieved via `getPublicUrl()` and stored as `image_url` in `dishes` table

### Display Flow
- **RestaurantCard** and **DishCard**: Check `LOCAL_IMAGE_MAP` for local static images, fall back to `image_url` from DB. Both use `OptimizedImage` component.
- **Restaurant detail page**: Maps DB `photos` to local images via `LOCAL_IMAGE_MAP`, uses `coverPhoto?.localUrl || coverPhoto?.image_url`
- **Gallery**: Uses `localSrc || image_url` for display
- **Hall of Fame**: Uses `dish.image_url` directly from `dishes` table

---

## Routes

| Route | Type | Description |
|---|---|---|
| `/` | Server (RSC) | HeroSection, Top Rated Picks (dark bg), Latest Adventures (dark bg), quote section |
| `/restaurants` | Client | Browse all visits with search + cuisine/price/rating filters, sticky filter bar |
| `/restaurants/[id]` | Server (RSC) | Individual visit: parallax hero, ratings breakdown, dishes, photos, sidebar ranks |
| `/admin` | Server (RSC) | Dashboard: stats, quick actions, recent visits (auth required) |
| `/admin/add-visit` | Server (RSC) | Add new visit form (auth required) |
| `/admin/edit/[id]` | Server (RSC) | Edit existing visit (auth required) |
| `/analytics` | Server (RSC) | Analytics: stat cards, cuisine breakdown, price distribution, monthly visits, top restaurants |
| `/hall-of-fame` | Server (RSC) | Top-3 gold cards + all dishes rated 9+ with confetti blast |
| `/gallery` | Server (RSC) | Masonry photo grid with horizontal strip + lightbox |
| `/top-restaurants` | Server (RSC) | Full ranked list sorted by overall_rating descending |
| `/login` | Client | Supabase email/password login with glass card design |
| `/*` (404) | Static | Custom 404 with food emoji and "Back to Journal" button |

---

## Known Issues

- **Back button navigation**: May not work correctly in some browser/OS combinations
- **Edit button**: Currently broken, does not navigate or open the edit form
- **Delete button**: Currently broken, does not delete entries from the database
- **Theme consistency**: Non-homepage pages (restaurants, analytics, hall of fame, gallery, top-restaurants, login) do not yet match the dark `#0A1A12` theme introduced on the homepage

---

## Rules

1. **Never modify `.env` or Supabase credentials.** Credentials are in `.env.local` (not committed). The `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are read by `lib/supabase/client.ts` and `lib/supabase/server.ts`.
2. **Always use existing Tailwind theme tokens.** Use `forest-*`, `gold-*`, `ember-*`, `cream-*` color classes. Do not introduce arbitrary hex values for colors that already exist in the theme.
3. **Use Framer Motion for all animations.** Available helpers in `components/animations/PageTransition.tsx`. For inline `whileHover`/`whileTap` animations, import `motion` from `framer-motion` directly.
4. **Keep Supabase queries in server components.** All database queries go through `lib/supabase/server.ts` in server components. Client components use `lib/supabase/client.ts`. This ensures proper cookie-based auth on the server.
5. **Run `npm run build` after changes to verify.** The build script is `NEXT_DISABLE_ESLINT=1 next build`. Build failures will prevent deployment.
6. **Use `OptimizedImage` for all images.** The component handles Next.js Image, native img fallback, gradient placeholder, and emoji fallback automatically.
7. **HEIC conversion is handled in `VisitForm.tsx`.** Do not reimplement — import `heic2any` and follow the existing pattern with `quality: 0.8`.
8. **Auth check pattern for admin routes.** Server components check `supabase.auth.getUser()` and call `redirect("/login")` if no user.
9. **Server components cannot use `motion` JSX.** Extract all animated elements to separate `"use client"` files and import them. Always verify with `npm run build`.
