import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, SectionHeading, AnimatedDivider } from "@/components/animations/PageTransition";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { FlavorTag } from "@/components/ui/FlavorTag";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ConfettiBlast } from "@/components/ui/ConfettiBlast";
import { HallOfFameTrophy, HallOfFameTopCard } from "./HallOfFameCards";

export const metadata = { title: "Hall of Fame" };

export default async function HallOfFamePage() {
  const supabase = createClient();
  const { data: dishes } = await supabase
    .from("dishes")
    .select("*, restaurant_visits(restaurant_name, cuisine, location, date_visited)")
    .gte("rating", 9)
    .order("rating", { ascending: false });

  const all = dishes || [];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      <ConfettiBlast />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <HallOfFameTrophy />
            <SectionHeading
              eyebrow="Rated 9 or above"
              title="Hall of Fame"
              subtitle="The most exceptional dishes on this culinary journey. Perfection on a plate."
              align="center"
            />
          </div>
        </FadeIn>
        <AnimatedDivider className="mb-14" />

        {all.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-forest-500">No dishes rated 9+ yet. Keep exploring!</p>
          </div>
        ) : (
          <>
            {/* Top 3 — gold podium */}
            <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {all.slice(0, 3).map((dish: any, i: number) => (
                <StaggerItem key={dish.id}>
                  <HallOfFameTopCard dish={dish} index={i} />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Also Legendary */}
            {all.length > 3 && (
              <div>
                <FadeIn>
                  <SectionHeading title="Also Legendary" />
                </FadeIn>
                <AnimatedDivider className="mb-8" />
                <StaggerContainer staggerDelay={0.07} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {all.slice(3).map((dish: any) => (
                    <StaggerItem key={dish.id}>
                      <Link href={`/restaurants/${dish.visit_id}`} className="group flex items-center gap-4 bg-white rounded-2xl p-4 border border-forest-100/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <OptimizedImage
                            src={dish.image_url}
                            alt={dish.dish_name}
                            sizes="64px"
                            fallbackEmoji="🍽️"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-forest-900 text-sm truncate">{dish.dish_name}</p>
                          <p className="text-xs text-forest-500 truncate">{dish.restaurant_visits?.restaurant_name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-gold-500 text-xs font-bold font-display">{dish.rating}</span>
                            <span className="text-gold-400 text-xs">/10</span>
                          </div>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
