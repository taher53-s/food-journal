import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";
import { RatingBadge, RatingBar } from "@/components/ui/RatingBadge";
import { DishCard } from "@/components/restaurant/DishCard";
import { FadeIn, StaggerContainer, StaggerItem, SectionHeading, AnimatedDivider } from "@/components/animations/PageTransition";
import { CopyButton } from "@/components/ui/CopyButton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RestaurantHero } from "./RestaurantHero";
import { DetailBadge, MetaRow, PhotoItem, SidebarRankItem } from "./RestaurantDetailClient";
import { formatDate, getCuisineEmoji, occasionLabel, occasionEmoji, priceRangeLabel, recommendationLabel, recommendationColor, cn } from "@/lib/utils";

const LOCAL_IMAGE_MAP: Record<string, string[]> = {
  "1441 Pizzeria": [
    "/images/1441-pizzeria/IMG_5638.jpg","/images/1441-pizzeria/IMG_5641.jpg","/images/1441-pizzeria/IMG_5642.jpg",
    "/images/1441-pizzeria/IMG_5643.jpg","/images/1441-pizzeria/IMG_5645.jpg","/images/1441-pizzeria/IMG_5647.jpg",
    "/images/1441-pizzeria/IMG_5648.jpg","/images/1441-pizzeria/IMG_5649.jpg","/images/1441-pizzeria/IMG_5651.jpg",
    "/images/1441-pizzeria/IMG_5656.jpg","/images/1441-pizzeria/IMG_5658.jpg","/images/1441-pizzeria/IMG_5662.jpg",
    "/images/1441-pizzeria/IMG_5663.jpg","/images/1441-pizzeria/IMG_5664.jpg","/images/1441-pizzeria/IMG_5666.jpg",
    "/images/1441-pizzeria/IMG_5668.JPEG",
  ],
  "1441": [
    "/images/1441-pizzeria/IMG_5638.jpg","/images/1441-pizzeria/IMG_5641.jpg","/images/1441-pizzeria/IMG_5642.jpg",
    "/images/1441-pizzeria/IMG_5643.jpg","/images/1441-pizzeria/IMG_5645.jpg","/images/1441-pizzeria/IMG_5647.jpg",
    "/images/1441-pizzeria/IMG_5648.jpg","/images/1441-pizzeria/IMG_5649.jpg","/images/1441-pizzeria/IMG_5651.jpg",
    "/images/1441-pizzeria/IMG_5656.jpg","/images/1441-pizzeria/IMG_5658.jpg","/images/1441-pizzeria/IMG_5662.jpg",
    "/images/1441-pizzeria/IMG_5663.jpg","/images/1441-pizzeria/IMG_5664.jpg","/images/1441-pizzeria/IMG_5666.jpg",
    "/images/1441-pizzeria/IMG_5668.JPEG",
  ],
};

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: visit } = await supabase.from("restaurant_visits").select("*, dishes(*), photos(*)").eq("id", params.id).single();
  if (!visit) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;
  const sortedDishes = visit.dishes ? [...visit.dishes].sort((a: any, b: any) => b.rating - a.rating) : [];

  const localImages = LOCAL_IMAGE_MAP[visit.restaurant_name] || [];
  const photosWithLocal = (visit.photos || []).map((photo: any, idx: number) => ({
    ...photo,
    localUrl: localImages[idx] || null,
  }));
  const coverPhoto = photosWithLocal.find((p: any) => p.type === "food") || photosWithLocal[0];
  const displayImageUrl = coverPhoto?.localUrl || coverPhoto?.image_url;

  return (
    <div className="min-h-screen">
      {/* Parallax hero */}
      <RestaurantHero
        displayImageUrl={displayImageUrl}
        restaurantName={visit.restaurant_name}
        cuisine={visit.cuisine}
        isAdmin={isAdmin}
        visitId={visit.id}
      />

      {/* Hero bottom meta — sits below the image */}
      <div className="bg-[#0A1A12] -mt-2">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-2">
          {/* Recommendation badge */}
          <DetailBadge
            label={recommendationLabel[visit.recommendation_level as keyof typeof recommendationLabel]}
            className={cn("inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3", recommendationColor[visit.recommendation_level as keyof typeof recommendationColor])}
          />

          {/* Meta row */}
          <MetaRow>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {visit.location}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(visit.date_visited)}</span>
            <span>{getCuisineEmoji(visit.cuisine)} {visit.cuisine}</span>
            <span>{occasionEmoji[visit.occasion as keyof typeof occasionEmoji]} {occasionLabel[visit.occasion as keyof typeof occasionEmoji]}</span>
          </MetaRow>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 bg-[#0A1A12]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">

            {/* Experience notes */}
            {visit.experience_notes && (
              <FadeIn>
                <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-8">
                  <SectionHeading title="The Experience" />
                  <p className="text-white/60 leading-loose text-xl font-light italic font-display">
                    &ldquo;{visit.experience_notes}&rdquo;
                  </p>
                </div>
              </FadeIn>
            )}

            {/* Ratings breakdown */}
            <FadeIn delay={0.05}>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-8">
                <SectionHeading title="Ratings Breakdown" />
                <div className="space-y-4">
                  <RatingBar label="Food" rating={visit.food_rating} delay={0.1} dark />
                  <RatingBar label="Service" rating={visit.service_rating} delay={0.18} dark />
                  <RatingBar label="Ambience" rating={visit.ambience_rating} delay={0.26} dark />
                  <RatingBar label="Value" rating={visit.value_rating} delay={0.34} dark />
                </div>
                <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">Overall</span>
                  <RatingBadge rating={visit.overall_rating} size="lg" label="/ 10" />
                </div>
              </div>
            </FadeIn>

            {/* Dishes — cascade animation */}
            {sortedDishes.length > 0 && (
              <div>
                <FadeIn><SectionHeading title="Dishes Tried" /></FadeIn>
                <AnimatedDivider className="mb-8" />
                <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sortedDishes.map((dish: any, i: number) => (
                    <StaggerItem key={dish.id}>
                      <DishCard dish={dish} rank={i < 3 ? i : undefined} isAdmin={isAdmin} index={i} dark />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* Photo gallery */}
            {photosWithLocal.length > 1 && (
              <FadeIn delay={0.1}>
                <div>
                  <SectionHeading title="Photos" />
                  <AnimatedDivider className="mb-6" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photosWithLocal.map((photo: any, i: number) => {
                      const imgSrc = photo.localUrl || photo.image_url;
                      return (
                        <PhotoItem key={photo.id} index={i} isFirst={i === 0}>
                          <OptimizedImage
                            src={imgSrc}
                            alt={photo.caption || `Photo ${i + 1}`}
                            fallbackEmoji="🖼️"
                          />
                        </PhotoItem>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <FadeIn delay={0.1}>
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6 space-y-4 sticky top-24">
                <SectionHeading title="Details" />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Price Range</span>
                    <span className="font-medium text-white/70">{priceRangeLabel[visit.price_range as keyof typeof priceRangeLabel]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Occasion</span>
                    <span className="font-medium text-white/70">{occasionEmoji[visit.occasion as keyof typeof occasionEmoji]} {occasionLabel[visit.occasion as keyof typeof occasionEmoji]}</span>
                  </div>
                  {visit.companions && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/40">With</span>
                      <span className="font-medium text-white/70 text-right max-w-[160px]">{visit.companions}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Would Return</span>
                    {visit.would_return
                      ? <CheckCircle className="w-4 h-4 text-white/40" />
                      : <XCircle className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-center">
                  <RatingBadge rating={visit.overall_rating} size="xl" label="Overall Rating" dark />
                </div>
              </div>
            </FadeIn>

            {/* Dish rankings sidebar */}
            {sortedDishes.length > 0 && (
              <FadeIn delay={0.15}>
                <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6">
                  <SectionHeading title="Dish Rankings" />
                  <div className="space-y-2">
                    {sortedDishes.map((dish: any, i: number) => (
                      <SidebarRankItem
                        key={dish.id}
                        emoji={i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                        name={dish.dish_name}
                        rating={dish.rating}
                        index={i}
                        dark
                      />
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>

      <CopyButton />
    </div>
  );
}
