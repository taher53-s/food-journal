import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Calendar, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { RatingBadge, RatingBar } from "@/components/ui/RatingBadge";
import { DishCard } from "@/components/restaurant/DishCard";
import { FadeIn } from "@/components/animations/PageTransition";
import { formatDate, getCuisineEmoji, occasionLabel, occasionEmoji, priceRangeLabel, recommendationLabel, recommendationColor, cn } from "@/lib/utils";
import { DeleteVisitButton } from "@/components/admin/DeleteVisitButton";
import fs from "fs";
import path from "path";

const LOCAL_IMAGE_MAP: Record<string, string> = {
  "1441 Pizzeria": "/images/1441-pizzeria",
  "1441": "/images/1441-pizzeria",
};

function getLocalImages(restaurantName: string): string[] {
  const folderName = LOCAL_IMAGE_MAP[restaurantName];
  if (!folderName) return [];
  
  const publicDir = path.join(process.cwd(), 'public');
  const fullPath = path.join(publicDir, folderName);
  
  if (!fs.existsSync(fullPath)) return [];
  
  return fs.readdirSync(fullPath)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .map(f => `${folderName}/${f}`);
}

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: visit } = await supabase.from("restaurant_visits").select("*, dishes(*), photos(*)").eq("id", params.id).single();
  if (!visit) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;
  const sortedDishes = visit.dishes ? [...visit.dishes].sort((a: any, b: any) => b.rating - a.rating) : [];
  
  // Get local images for this restaurant
  const localImages = getLocalImages(visit.restaurant_name);
  
  // Map photos to local images if available
  const photosWithLocal = visit.photos?.map((photo: any, idx: number) => ({
    ...photo,
    localUrl: localImages[idx] || null
  })) || [];
  
  const coverPhoto = photosWithLocal.find((p: any) => p.type === "food") || photosWithLocal[0];
  const displayImageUrl = coverPhoto?.localUrl || coverPhoto?.image_url;

  return (
    <div className="min-h-screen pt-20">
      <div className="relative h-72 md:h-96 overflow-hidden">
        {displayImageUrl ? (
          <img 
            src={displayImageUrl} 
            alt={visit.restaurant_name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load failed:', displayImageUrl);
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${displayImageUrl ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-forest-200 to-forest-400 flex items-center justify-center`}>
          <span className="text-[120px] opacity-40">{getCuisineEmoji(visit.cuisine)}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-6 left-6">
          <Link href="/restaurants" className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-white/30 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
        {isAdmin && (
          <div className="absolute top-6 right-6 flex gap-2">
            <Link href={`/admin/edit/${visit.id}`} className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-white/30 transition-all">Edit</Link>
            <DeleteVisitButton visitId={visit.id} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3", recommendationColor[visit.recommendation_level as keyof typeof recommendationColor])}>
              {recommendationLabel[visit.recommendation_level as keyof typeof recommendationLabel]}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white mb-2">{visit.restaurant_name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {visit.location}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(visit.date_visited)}</span>
              <span>{getCuisineEmoji(visit.cuisine)} {visit.cuisine}</span>
              <span>{occasionEmoji[visit.occasion as keyof typeof occasionEmoji]} {occasionLabel[visit.occasion as keyof typeof occasionLabel]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {visit.experience_notes && (
              <FadeIn>
                <div className="bg-white rounded-3xl p-8 shadow-card border border-forest-100/60">
                  <h2 className="font-display text-2xl font-semibold text-forest-900 mb-4">The Experience</h2>
                  <p className="text-forest-700 leading-loose text-xl font-light italic font-display">&ldquo;{visit.experience_notes}&rdquo;</p>
                </div>
              </FadeIn>
            )}

            <FadeIn delay={0.1}>
              <div className="bg-white rounded-3xl p-8 shadow-card border border-forest-100/60">
                <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">Ratings Breakdown</h2>
                <div className="space-y-4">
                  <RatingBar label="Food" rating={visit.food_rating} delay={0.1} />
                  <RatingBar label="Service" rating={visit.service_rating} delay={0.2} />
                  <RatingBar label="Ambience" rating={visit.ambience_rating} delay={0.3} />
                  <RatingBar label="Value" rating={visit.value_rating} delay={0.4} />
                </div>
                <div className="mt-6 pt-6 border-t border-forest-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-forest-700 uppercase tracking-wider">Overall</span>
                  <RatingBadge rating={visit.overall_rating} size="lg" label="/ 10" />
                </div>
              </div>
            </FadeIn>

            {sortedDishes.length > 0 && (
              <FadeIn delay={0.2}>
                <div>
                  <h2 className="font-display text-3xl font-semibold text-forest-900 mb-6">Dishes Tried</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sortedDishes.map((dish: any, i: number) => (
                      <DishCard key={dish.id} dish={dish} rank={i < 3 ? i : undefined} isAdmin={isAdmin} index={i} />
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {photosWithLocal.length > 1 && (
              <FadeIn delay={0.3}>
                <div>
                  <h2 className="font-display text-3xl font-semibold text-forest-900 mb-6">Photos</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photosWithLocal.map((photo: any, i: number) => {
                      const imgSrc = photo.localUrl || photo.image_url;
                      return (
                        <div key={photo.id} className={cn("relative rounded-2xl overflow-hidden", i === 0 ? "col-span-2 h-64" : "h-32")}>
                          {imgSrc ? (
                            <>
                              <img 
                                src={imgSrc} 
                                alt={photo.caption || `Photo ${i + 1}`} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  console.error('Image load failed:', imgSrc);
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <div className="hidden w-full h-full bg-forest-100 flex items-center justify-center">
                                <span className="text-2xl">🖼️</span>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-forest-100 flex items-center justify-center">
                              <span className="text-2xl">🖼️</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          <div className="space-y-4">
            <FadeIn delay={0.15}>
              <div className="bg-white rounded-3xl p-6 shadow-card border border-forest-100/60 space-y-4">
                <h3 className="font-display text-xl font-semibold text-forest-900">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-forest-500">Price Range</span>
                    <span className="font-medium text-forest-800">{priceRangeLabel[visit.price_range as keyof typeof priceRangeLabel]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-forest-500">Occasion</span>
                    <span className="font-medium text-forest-800">{occasionEmoji[visit.occasion as keyof typeof occasionEmoji]} {occasionLabel[visit.occasion as keyof typeof occasionLabel]}</span>
                  </div>
                  {visit.companions && (
                    <div className="flex items-center justify-between">
                      <span className="text-forest-500">With</span>
                      <span className="font-medium text-forest-800 text-right max-w-[160px]">{visit.companions}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-forest-500">Would Return</span>
                    {visit.would_return ? <CheckCircle className="w-4 h-4 text-forest-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
                <div className="pt-4 border-t border-forest-100 text-center">
                  <RatingBadge rating={visit.overall_rating} size="xl" label="Overall Rating" />
                </div>
              </div>
            </FadeIn>

            {sortedDishes.length > 0 && (
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-3xl p-6 shadow-card border border-forest-100/60">
                  <h3 className="font-display text-xl font-semibold text-forest-900 mb-4">Dish Rankings</h3>
                  <div className="space-y-2">
                    {sortedDishes.map((dish: any, i: number) => (
                      <div key={dish.id} className="flex items-center gap-3">
                        <span className="text-base w-6 text-center">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}</span>
                        <span className="flex-1 text-xs font-medium text-forest-700 truncate">{dish.dish_name}</span>
                        <span className="text-xs font-bold text-forest-600 font-display">{dish.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
