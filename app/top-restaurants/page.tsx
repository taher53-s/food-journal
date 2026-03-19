import { createClient } from "@/lib/supabase/server";
import { FadeIn, StaggerContainer, StaggerItem, SectionHeading, AnimatedDivider } from "@/components/animations/PageTransition";
import { RatingBadge } from "@/components/ui/RatingBadge";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn, getCuisineEmoji, priceRangeLabel, recommendationColor, recommendationLabel } from "@/lib/utils";
import { RankEmoji, CuisineEmoji, AnimatedArrow } from "./TopRestaurantsCards";

export const metadata = { title: "Top Restaurants" };

export default async function TopRestaurantsPage() {
  const supabase = createClient();
  const { data: visits } = await supabase
    .from("restaurant_visits")
    .select("*, dishes(*), photos(*)")
    .order("overall_rating", { ascending: false });

  const sorted = visits || [];

  return (
    <div className="min-h-screen bg-[#0A1A12]">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(27,94,67,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pt-32 pb-24">
        <FadeIn>
          <SectionHeading
            eyebrow="★ Ranked by Rating"
            title="Top Restaurants"
            subtitle="The definitive leaderboard of every place visited, ordered by overall experience."
            align="center"
            dark
          />
        </FadeIn>
        <AnimatedDivider className="mb-14" dark />

        {sorted.length === 0 ? (
          <FadeIn>
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] rounded-4xl p-20 max-w-lg mx-auto text-center">
              <div className="relative z-10">
                <div className="text-7xl mb-6">🏅</div>
                <h3 className="font-display text-2xl text-white/80 mb-2">No restaurants yet</h3>
                <p className="text-white/30 mb-6">Start logging your dining adventures.</p>
                <Link href="/admin/add-visit" className="btn-gold inline-flex">Log First Visit</Link>
              </div>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer staggerDelay={0.06} className="space-y-4">
            {sorted.map((visit: any, i: number) => (
              <StaggerItem key={visit.id}>
                <Link href={`/restaurants/${visit.id}`} className="group block">
                  <div className="flex items-center gap-4 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-5 hover:bg-white/[0.08] hover:border-white/[0.15] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.99]">
                    {/* Rank */}
                    <RankEmoji
                      emoji={i < 3 ? ["🥇","🥈","🥉"][i] : `${i + 1}`}
                      index={i}
                    />

                    {/* Cuisine emoji */}
                    <CuisineEmoji emoji={getCuisineEmoji(visit.cuisine)} dark />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl font-semibold text-white/90 group-hover:text-white transition-colors leading-tight">
                        {visit.restaurant_name}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-white/40"><MapPin className="w-3 h-3" /> {visit.location}</span>
                        <span className="text-xs text-white/30">{visit.cuisine}</span>
                        <span className="text-xs text-white/30">{priceRangeLabel[visit.price_range as keyof typeof priceRangeLabel]}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                          recommendationColor[visit.recommendation_level as keyof typeof recommendationColor])}>
                          {recommendationLabel[visit.recommendation_level as keyof typeof recommendationLabel]}
                        </span>
                        {visit.would_return && <span className="text-xs text-white/40 font-medium">Would return</span>}
                      </div>
                    </div>

                    {/* Rating + arrow */}
                    <div className="flex items-center gap-3 shrink-0">
                      <RatingBadge rating={visit.overall_rating} size="md" animated dark />
                      <AnimatedArrow className="text-white/20 group-hover:text-gold-500/60 transition-colors" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
