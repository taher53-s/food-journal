import { createClient } from "@/lib/supabase/server";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { FadeIn } from "@/components/animations/PageTransition";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const supabase = createClient();
  const { data: visits } = await supabase
    .from("restaurant_visits")
    .select("*, dishes(*), photos(*)")
    .order("date_visited", { ascending: false });

  const all = visits || [];
  const recentVisits = all.slice(0, 6);
  const topVisits = [...all].sort((a, b) => b.overall_rating - a.overall_rating).slice(0, 3);
  const avgRating = all.length ? (all.reduce((a: number, v: any) => a + v.overall_rating, 0) / all.length).toFixed(1) : "0";

  return (
    <div className="min-h-screen">
      <section className="relative pt-28 md:pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-forest-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white border border-forest-200 rounded-full px-4 py-2 text-sm font-medium text-forest-700 mb-8 shadow-sm">
              <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
              <span>{all.length} restaurants explored</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-forest-950 leading-[0.95] tracking-tight mb-6">
              My Food{" "}<span className="text-gradient italic">Journal</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-forest-600 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
              A personal diary of restaurants visited, dishes devoured, and memories savoured. Exploring the world, one plate at a time.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/restaurants" className="btn-primary px-8 py-4 text-base">
                Browse Journal <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/hall-of-fame" className="btn-secondary px-8 py-4 text-base">
                🏆 Hall of Fame
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: "🍽️", label: "Restaurants", value: all.length },
                { icon: "⭐", label: "Avg Rating", value: avgRating },
                { icon: "🌍", label: "Cuisines", value: [...new Set(all.map((v: any) => v.cuisine))].length },
                { icon: "🥇", label: "Must-Tries", value: all.filter((v: any) => v.recommendation_level === "must_try").length },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/70 backdrop-blur border border-forest-100 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-display text-2xl font-semibold text-forest-900">{stat.value}</div>
                  <div className="text-xs text-forest-500 font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {topVisits.length > 0 && (
        <section className="px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-2">★ Featured</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light text-forest-950">Top Rated Picks</h2>
                </div>
                <Link href="/top-restaurants" className="hidden md:flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-forest-800 transition-colors">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topVisits.map((visit: any, i: number) => <RestaurantCard key={visit.id} visit={visit} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {recentVisits.length > 0 && (
        <section className="px-4 py-16 bg-gradient-to-b from-transparent to-forest-50/30">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-bold text-forest-600 uppercase tracking-widest mb-2">Recent</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light text-forest-950">Latest Adventures</h2>
                </div>
                <Link href="/restaurants" className="hidden md:flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-forest-800 transition-colors">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVisits.map((visit: any, i: number) => <RestaurantCard key={visit.id} visit={visit} index={i} />)}
            </div>
            <div className="text-center mt-10">
              <Link href="/restaurants" className="btn-secondary inline-flex">See all restaurants <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      )}

      {all.length === 0 && (
        <section className="px-4 py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-7xl mb-6">🍽️</div>
            <h2 className="font-display text-3xl font-light text-forest-900 mb-4">The journal is empty</h2>
            <p className="text-forest-500 mb-8">No restaurant visits yet. Log in as admin to add your first entry.</p>
            <Link href="/login" className="btn-primary">Admin Login</Link>
          </div>
        </section>
      )}

      <section className="px-4 py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="relative bg-forest-950 rounded-4xl p-12 md:p-16 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-forest-800/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
              <div className="relative z-10">
                <p className="font-display text-3xl md:text-5xl font-light text-white/90 italic leading-relaxed mb-6">
                  &ldquo;One cannot think well, love well, sleep well, if one has not dined well.&rdquo;
                </p>
                <p className="text-forest-400 text-sm font-medium tracking-widest uppercase">— Virginia Woolf</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
