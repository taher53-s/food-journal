"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { RestaurantVisit } from "@/types";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { cn, formatDateShort, getCuisineEmoji, occasionEmoji, priceRangeLabel, recommendationLabel, recommendationColor } from "@/lib/utils";

export function RestaurantCard({ visit, index = 0 }: { visit: RestaurantVisit; index?: number }) {
  const coverPhoto = visit.photos?.find((p) => p.type === "food") || visit.photos?.[0];
  const topDish = visit.dishes?.sort((a, b) => b.rating - a.rating)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={cn("group relative bg-white rounded-3xl overflow-hidden border border-forest-100/60 shadow-card hover:shadow-card-hover transition-all duration-300",
        visit.recommendation_level === "must_try" ? "border-l-4 border-l-forest-500" : visit.recommendation_level === "worth_it" ? "border-l-4 border-l-gold-500" : ""
      )}
    >
      <Link href={`/restaurants/${visit.id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          {coverPhoto ? (
            <>
              <Image src={coverPhoto.image_url} alt={visit.restaurant_name} fill unoptimized={true} onError={(e) => { console.error("Image failed:", e.currentTarget.src); e.currentTarget.style.display = "none"; }} className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width:768px) 100vw, 50vw" />
              <img src={coverPhoto.image_url} alt={visit.restaurant_name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ zIndex: -1 }} onError={(e) => console.error("Fallback img failed:", coverPhoto.image_url)} />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-forest-100 to-forest-200 flex items-center justify-center">
              <span className="text-6xl">{getCuisineEmoji(visit.cuisine)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className={cn("inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider", recommendationColor[visit.recommendation_level])}>
              {recommendationLabel[visit.recommendation_level]}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <RatingBadge rating={visit.overall_rating} size="sm" animated={false} />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-white text-xs font-semibold bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {getCuisineEmoji(visit.cuisine)} {visit.cuisine}
            </span>
            <span className="text-lg">{occasionEmoji[visit.occasion]}</span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-display text-xl font-semibold text-forest-900 group-hover:text-forest-700 transition-colors leading-tight">
                {visit.restaurant_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-forest-500 text-xs">
                <MapPin className="w-3 h-3" /><span>{visit.location}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-forest-400 bg-forest-50 px-2 py-1 rounded-lg shrink-0">
              {priceRangeLabel[visit.price_range].split(" ")[0]}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-forest-400 mb-4">
            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{formatDateShort(visit.date_visited)}</span></div>
            {visit.companions && <div className="flex items-center gap-1"><Users className="w-3 h-3" /><span className="truncate max-w-[120px]">{visit.companions}</span></div>}
          </div>

          {visit.experience_notes && (
            <p className="text-sm text-forest-600 leading-relaxed mb-4 line-clamp-2 italic font-display">
              &ldquo;{visit.experience_notes}&rdquo;
            </p>
          )}

          {topDish && (
            <div className="flex items-center gap-2 p-3 bg-forest-50 rounded-2xl mb-4">
              <span className="text-xl">🥇</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-forest-500 font-medium uppercase tracking-wider">Top Dish</p>
                <p className="text-sm font-semibold text-forest-800 truncate">{topDish.dish_name}</p>
              </div>
              <span className={cn("text-sm font-bold font-display px-2 py-0.5 rounded-lg", topDish.rating >= 9 ? "text-gold-600 bg-gold-50" : "text-forest-700 bg-forest-100")}>
                {topDish.rating}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-forest-400 text-xs">
              {visit.dishes && visit.dishes.length > 0 && <span>{visit.dishes.length} dish{visit.dishes.length !== 1 ? "es" : ""}</span>}
              {visit.would_return && <span className="ml-1 text-forest-500 font-medium">· Would return ✓</span>}
            </div>
            <div className="flex items-center gap-1 text-forest-600 text-xs font-semibold group-hover:gap-2 transition-all">
              <span>View</span><ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
