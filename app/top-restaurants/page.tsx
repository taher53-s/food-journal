import { createClient } from "@/lib/supabase/server";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { RatingBadge } from "@/components/ui/RatingBadge";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { cn, getCuisineEmoji, priceRangeLabel, recommendationColor, recommendationLabel } from "@/lib/utils";

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
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-3">Ranked by Rating</p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-forest-950 mb-4">
              Top <span className="text-gradient italic">Restaurants</span>
            </h1>
            <p className="text-forest-500 text-lg max-w-xl mx-auto font-light">
              The definitive leaderboard of every place visited, ordered by overall experience.
            </p>
          </div>
        </FadeIn>

        {sorted.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏅</div>
            <p className="text-forest-500">No restaurants logged yet.</p>
          </div>
        ) : (
          <StaggerContainer className="space-y-4">
            {sorted.map((visit: any, i: number) => (
              <StaggerItem key={visit.id}>
                <Link href={`/restaurants/${visit.id}`} className="group block">
                  <div className="flex items-center gap-4 bg-white rounded-3xl p-5 border border-forest-100/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                    <div className={cn("text-2xl font-display font-bold w-10 text-center shrink-0",
                      i === 0 ? "text-gold-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-ember-400" : "text-forest-300")}>
                      {i < 3 ? ["🥇","🥈","🥉"][i] : `${i + 1}`}
                    </div>
                    <div className="w-12 h-12 bg-forest-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                      {getCuisineEmoji(visit.cuisine)}
                    </div>
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
                    <div className="flex items-center gap-3 shrink-0">
                      <RatingBadge rating={visit.overall_rating} size="md" animated={false} />
                      <ArrowRight className="w-4 h-4 text-forest-400 group-hover:translate-x-1 transition-transform" />
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
