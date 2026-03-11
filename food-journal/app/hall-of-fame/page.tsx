import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { FlavorTag } from "@/components/ui/FlavorTag";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="text-6xl mb-4 animate-float">🏆</div>
            <p className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-3">Rated 9 or above</p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-forest-950 mb-4">
              Hall of <span className="text-gradient-gold italic">Fame</span>
            </h1>
            <p className="text-forest-500 text-lg max-w-xl mx-auto font-light">
              The most exceptional dishes on this culinary journey. Perfection on a plate.
            </p>
          </div>
        </FadeIn>

        {all.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-forest-500">No dishes rated 9+ yet. Keep exploring!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {all.slice(0, 3).map((dish: any, i: number) => (
                <FadeIn key={dish.id} delay={i * 0.1}>
                  <Link href={`/restaurants/${dish.visit_id}`}
                    className="group relative block bg-white rounded-3xl overflow-hidden border border-forest-100/60 shadow-luxury hover:-translate-y-2 hover:shadow-glow-gold transition-all duration-300">
                    <div className="absolute top-4 left-4 z-10 text-3xl">{["🥇","🥈","🥉"][i]}</div>
                    <div className="relative h-56 overflow-hidden">
                      {dish.image_url ? (
                        <img 
                          src={dish.image_url} 
                          alt={dish.dish_name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            console.error('Image load failed:', dish.image_url);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                          <span className="text-6xl">🍽️</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 right-4">
                        <RatingBadge rating={dish.rating} size="md" animated={false} />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl font-semibold text-forest-900 mb-1">{dish.dish_name}</h3>
                      <p className="text-sm text-forest-500 mb-3">{dish.restaurant_visits?.restaurant_name} · {dish.restaurant_visits?.cuisine}</p>
                      {dish.notes && <p className="text-xs text-forest-600 italic line-clamp-2 mb-3 font-display">&ldquo;{dish.notes}&rdquo;</p>}
                      {dish.flavor_tags && dish.flavor_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dish.flavor_tags.slice(0, 3).map((tag: any) => <FlavorTag key={tag} tag={tag} size="sm" />)}
                        </div>
                      )}
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>

            {all.length > 3 && (
              <div>
                <FadeIn><h2 className="font-display text-3xl font-light text-forest-900 mb-6">Also Legendary</h2></FadeIn>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {all.slice(3).map((dish: any) => (
                    <StaggerItem key={dish.id}>
                      <Link href={`/restaurants/${dish.visit_id}`}
                        className="group flex items-center gap-4 bg-white rounded-2xl p-4 border border-forest-100/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          {dish.image_url
                            ? <img 
                                src={dish.image_url} 
                                alt={dish.dish_name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Image load failed:', dish.image_url);
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            : <div className="w-full h-full bg-forest-100 flex items-center justify-center text-xl">🍽️</div>}
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
