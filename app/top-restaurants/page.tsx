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
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <SectionHeading
            eyebrow="Ranked by Rating"
            title="Top Restaurants"
            subtitle="The definitive leaderboard of every place visited, ordered by overall experience."
            align="center"
          />
        </FadeIn>
        <AnimatedDivider className="mb-14" />

        {sorted.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏅</div>
            <p className="text-forest-500">No restaurants logged yet.</p>
          </div>
        ) : (
          <StaggerContainer staggerDelay={0.06} className="space-y-4">
            {sorted.map((visit: any, i: number) => (
              <StaggerItem key={visit.id}>
                <Link href={`/restaurants/${visit.id}`} className="group block">
                  <div className="flex items-center gap-4 bg-white rounded-3xl p-5 border border-forest-100/60 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.99]">
                    {/* Rank */}
                    <RankEmoji
                      emoji={i < 3 ? ["🥇","🥈","🥉"][i] : `${i + 1}`}
                      index={i}
                    />

                    {/* Cuisine emoji */}
                    <CuisineEmoji emoji={getCuisineEmoji(visit.cuisine)} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl font-semibold text-forest-900 group-hover:text-forest-700 transition-colors leading-tight">
                        {visit.restaurant_name}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-forest-500"><MapPin className="w-3 h-3" /> {visit.location}</span>
                        <span className="text-xs text-forest-400">{visit.cuisine}</span>
                        <span className="text-xs text-forest-400">{priceRangeLabel[visit.price_range as keyof typeof priceRangeLabel]}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                          recommendationColor[visit.recommendation_level as keyof typeof recommendationColor])}>
                          {recommendationLabel[visit.recommendation_level as keyof typeof recommendationLabel]}
                        </span>
                        {visit.would_return && <span className="text-xs text-forest-500 font-medium">Would return ✓</span>}
                      </div>
                    </div>

                    {/* Rating + arrow */}
                    <div className="flex items-center gap-3 shrink-0">
                      <RatingBadge rating={visit.overall_rating} size="md" animated />
                      <AnimatedArrow className="text-forest-300 group-hover:text-forest-500 transition-colors" />
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
