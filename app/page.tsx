import { createClient } from "@/lib/supabase/server";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { FadeIn, AnimatedDivider, SectionHeading, SlideInRight } from "@/components/animations/PageTransition";
import { HeroSection } from "@/components/layout/HeroSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();

  // Fetch all visits with dishes and photos
  const { data: visits } = await supabase
    .from("restaurant_visits")
    .select("*, dishes(*), photos(*)")
    .order("date_visited", { ascending: false });

  const all = visits || [];

  // Compute stats for the hero
  const avgRating = all.length
    ? Math.round((all.reduce((a: number, v: any) => a + v.overall_rating, 0) / all.length) * 10) / 10
    : 0;
  const cuisineCount = Array.from(new Set(all.map((v: any) => v.cuisine))).length;
  const mustTryCount = all.filter((v: any) => v.recommendation_level === "must_try").length;

  // Gather all photo URLs for the hero floating images + photo strip
  // Pull from: photos table, dish images (image_url), and local static images
  const photoUrls: string[] = [];

  // Add photos from the photos table
  const photoRows = all.flatMap((v: any) =>
    (v.photos || []).map((p: any) => p.image_url).filter(Boolean)
  );
  photoUrls.push(...photoRows);

  // Add dish images
  const dishImages = all.flatMap((v: any) =>
    (v.dishes || []).map((d: any) => d.image_url).filter(Boolean)
  );
  photoUrls.push(...dishImages);

  // Shuffle so we get a variety
  const shuffled = photoUrls.sort(() => Math.random() - 0.5);
  // Deduplicate while preserving order
  const seen = new Set<string>();
  const uniquePhotos = shuffled.filter((url) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });

  // Use local images as supplemental if we don't have enough real photos
  const localImages = [
    "/images/1441-pizzeria/IMG_5638.jpg",
    "/images/1441-pizzeria/IMG_5641.jpg",
    "/images/1441-pizzeria/IMG_5642.jpg",
    "/images/1441-pizzeria/IMG_5645.jpg",
    "/images/1441-pizzeria/IMG_5647.jpg",
    "/images/1441-pizzeria/IMG_5648.jpg",
    "/images/1441-pizzeria/IMG_5649.jpg",
    "/images/1441-pizzeria/IMG_5651.jpg",
    "/images/1441-pizzeria/IMG_5656.jpg",
    "/images/1441-pizzeria/IMG_5658.jpg",
    "/images/1441-pizzeria/IMG_5662.jpg",
    "/images/1441-pizzeria/IMG_5663.jpg",
    "/images/1441-pizzeria/IMG_5664.jpg",
    "/images/1441-pizzeria/IMG_5666.jpg",
    "/images/1441-pizzeria/IMG_5668.JPEG",
  ];

  const heroPhotos = uniquePhotos.length >= 6
    ? uniquePhotos.slice(0, 6)
    : [...uniquePhotos, ...localImages.filter((l) => !uniquePhotos.includes(l))].slice(0, 6);

  const recentVisits = all.slice(0, 6);
  const topVisits = [...all].sort((a, b) => (b as any).overall_rating - (a as any).overall_rating).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section — client component with all the jaw-dropping animations */}
      <HeroSection
        stats={{
          restaurants: all.length,
          avgRating,
          cuisines: cuisineCount,
          mustTries: mustTryCount,
        }}
        photoUrls={heroPhotos}
      />

      {/* Top Rated Picks */}
      {topVisits.length > 0 && (
        <section className="px-4 py-20 bg-[#0A1A12]">
          <div className="max-w-7xl mx-auto">
            <AnimatedDivider className="mb-12" />
            <div className="flex items-end justify-between mb-10">
              <div>
                <FadeIn>
                  <p className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">★ Featured</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light text-white">Top Rated Picks</h2>
                </FadeIn>
              </div>
              <SlideInRight>
                <Link
                  href="/top-restaurants"
                  className="hidden md:flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white/70 transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </SlideInRight>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topVisits.map((visit: any, i: number) => (
                <RestaurantCard key={visit.id} visit={visit} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Adventures */}
      {recentVisits.length > 0 && (
        <section className="px-4 py-20 bg-[#0A1A12]">
          <div className="max-w-7xl mx-auto">
            <AnimatedDivider className="mb-12" />
            <div className="flex items-end justify-between mb-10">
              <div>
                <FadeIn>
                  <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Recent</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light text-white">Latest Adventures</h2>
                </FadeIn>
              </div>
              <SlideInRight>
                <Link
                  href="/restaurants"
                  className="hidden md:flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white/70 transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </SlideInRight>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVisits.map((visit: any, i: number) => (
                <RestaurantCard key={visit.id} visit={visit} index={i} />
              ))}
            </div>
            <FadeIn>
              <div className="text-center mt-12">
                <Link href="/restaurants" className="btn-secondary border-white/20 text-white/70 hover:bg-white/5 hover:border-white/40 hover:text-white">
                  See all restaurants <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Empty state */}
      {all.length === 0 && (
        <section className="px-4 py-32 text-center bg-[#0A1A12]">
          <div className="max-w-md mx-auto">
            <div className="text-7xl mb-6">🍽️</div>
            <h2 className="font-display text-3xl font-light text-white/80 mb-4">The journal is empty</h2>
            <p className="text-white/30 mb-8">No restaurant visits yet. Log in as admin to add your first entry.</p>
            <Link href="/login" className="btn-primary">Admin Login</Link>
          </div>
        </section>
      )}

      {/* Quote section */}
      <section className="px-4 py-28 bg-[#0A1A12] overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div
              className="relative bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] rounded-4xl p-12 md:p-16 overflow-hidden"
            >
              {/* Decorative orb */}
              <div
                className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  transform: "translate(30%, -30%)",
                }}
              />
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-8 opacity-20">✦</div>
                <p className="font-display text-2xl md:text-4xl font-light text-white/75 italic leading-relaxed mb-8">
                  &ldquo;One cannot think well, love well, sleep well, if one has not dined well.&rdquo;
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-500/60">— Virginia Woolf</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
