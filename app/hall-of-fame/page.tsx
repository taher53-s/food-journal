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
    <div className="min-h-screen bg-[#0A1A12] relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(212,160,23,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <ConfettiBlast />
      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-24">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <HallOfFameTrophy />
            <SectionHeading
              eyebrow="★ Rated 9 or above"
              title="Hall of Fame"
              subtitle="The most exceptional dishes on this culinary journey. Perfection on a plate."
              align="center"
              dark
            />
          </div>
        </FadeIn>
        <AnimatedDivider className="mb-14" dark />

        {all.length === 0 ? (
          <FadeIn>
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] rounded-4xl p-20 max-w-lg mx-auto text-center">
              <div className="relative z-10">
                <div className="text-7xl mb-6">🍽️</div>
                <h3 className="font-display text-2xl text-white/80 mb-2">No dishes yet</h3>
                <p className="text-white/30 mb-6">Keep exploring — legendary dishes await.</p>
                <Link href="/restaurants" className="btn-gold inline-flex">Start Exploring</Link>
              </div>
            </div>
          </FadeIn>
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
                  <SectionHeading title="Also Legendary" dark />
                </FadeIn>
                <AnimatedDivider className="mb-8" dark />
                <StaggerContainer staggerDelay={0.07} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {all.slice(3).map((dish: any) => (
                    <StaggerItem key={dish.id}>
                      <Link href={`/restaurants/${dish.visit_id}`} className="group flex items-center gap-4 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.08] hover:border-gold-500/20 hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <OptimizedImage
                            src={dish.image_url}
                            alt={dish.dish_name}
                            sizes="64px"
                            fallbackEmoji="🍽️"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white/90 text-sm truncate">{dish.dish_name}</p>
                          <p className="text-xs text-white/40 truncate">{dish.restaurant_visits?.restaurant_name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-gold-500 text-xs font-bold font-display">{dish.rating}</span>
                            <span className="text-gold-400/60 text-xs">/10</span>
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
