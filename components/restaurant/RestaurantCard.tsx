"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { RestaurantVisit } from "@/types";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn, formatDateShort, getCuisineEmoji, occasionEmoji, priceRangeLabel, recommendationLabel, recommendationColor } from "@/lib/utils";

const LOCAL_IMAGE_MAP: Record<string, string[]> = {
  "1441 Pizzeria": [
    "/images/1441-pizzeria/IMG_5638.jpg",
    "/images/1441-pizzeria/IMG_5641.jpg",
    "/images/1441-pizzeria/IMG_5642.jpg",
    "/images/1441-pizzeria/IMG_5643.jpg",
    "/images/1441-pizzeria/IMG_5645.jpg",
    "/images/1441-pizzeria/IMG_5647.jpg",
    "/images/1441-pizzeria/IMG_5648.jpg",
    "/images/1441-pizzeria/IMG_5649.jpg",
    "/images/1441-pizzeria/IMG_5651.jpg",
    "/images/1441-pizzeria/IMG_5656.jpg",
    "/images/1441-pizzeria/IMG_5658.jpg",
    "/images/1441-pizzeria/IMG_5662.jpg",
    "/images/1441-pizzeria/IMG_5663.jpg",
    "/images/1441-pizzeria/IMG_5664.jpg",
    "/images/1441-pizzeria/IMG_5666.jpg",
    "/images/1441-pizzeria/IMG_5668.JPEG",
  ],
  "1441": [
    "/images/1441-pizzeria/IMG_5638.jpg",
    "/images/1441-pizzeria/IMG_5641.jpg",
    "/images/1441-pizzeria/IMG_5642.jpg",
    "/images/1441-pizzeria/IMG_5643.jpg",
    "/images/1441-pizzeria/IMG_5645.jpg",
    "/images/1441-pizzeria/IMG_5647.jpg",
    "/images/1441-pizzeria/IMG_5648.jpg",
    "/images/1441-pizzeria/IMG_5649.jpg",
    "/images/1441-pizzeria/IMG_5651.jpg",
    "/images/1441-pizzeria/IMG_5656.jpg",
    "/images/1441-pizzeria/IMG_5658.jpg",
    "/images/1441-pizzeria/IMG_5662.jpg",
    "/images/1441-pizzeria/IMG_5663.jpg",
    "/images/1441-pizzeria/IMG_5664.jpg",
    "/images/1441-pizzeria/IMG_5666.jpg",
    "/images/1441-pizzeria/IMG_5668.JPEG",
  ],
};

export function RestaurantCard({ visit, index = 0 }: { visit: RestaurantVisit; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const topDish = visit.dishes?.sort((a, b) => b.rating - a.rating)[0];

  const localImages = LOCAL_IMAGE_MAP[visit.restaurant_name] || [];
  const localImage = localImages[index % localImages.length] || null;
  const coverPhoto = visit.photos?.find((p) => p.type === "food") || visit.photos?.[0];
  const displayImage = localImage || coverPhoto?.image_url;

  // Mouse tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 });
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group"
    >
      <Link href={`/restaurants/${visit.id}`} className="block">
        {/* Glow spotlight follows mouse */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) =>
                `radial-gradient(ellipse 60% 50% at ${gx} ${gy}, rgba(245,158,11,0.07) 0%, transparent 70%)`
            ),
          }}
        />

        <div
          className={cn(
            "relative bg-white rounded-3xl overflow-hidden transition-all duration-300 z-10",
            visit.recommendation_level === "must_try"
              ? "border-l-4 border-l-forest-500 shadow-card"
              : visit.recommendation_level === "worth_it"
              ? "border-l-4 border-l-gold-400 shadow-card"
              : "border border-forest-100/60 shadow-card hover:shadow-card-hover"
          )}
        >
          {/* Image container */}
          <div className="relative h-64 overflow-hidden">
            <OptimizedImage
              src={displayImage}
              alt={visit.restaurant_name}
              className="transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width:768px) 100vw, 50vw"
              fallbackEmoji={getCuisineEmoji(visit.cuisine)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="absolute top-4 left-4"
            >
              <span className={cn("inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider", recommendationColor[visit.recommendation_level])}>
                {recommendationLabel[visit.recommendation_level]}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="absolute top-4 right-4"
            >
              <RatingBadge rating={visit.overall_rating} size="sm" animated />
            </motion.div>

            {/* Bottom info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="text-white text-xs font-semibold bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {getCuisineEmoji(visit.cuisine)} {visit.cuisine}
              </span>
              <span className="text-lg">{occasionEmoji[visit.occasion]}</span>
            </div>
          </div>

          {/* Card body */}
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
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-2 p-3 bg-forest-50 rounded-2xl mb-4"
              >
                <span className="text-xl">🥇</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-forest-500 font-medium uppercase tracking-wider">Top Dish</p>
                  <p className="text-sm font-semibold text-forest-800 truncate">{topDish.dish_name}</p>
                </div>
                <span className={cn("text-sm font-bold font-display px-2 py-0.5 rounded-lg", topDish.rating >= 9 ? "text-gold-600 bg-gold-50" : "text-forest-700 bg-forest-100")}>
                  {topDish.rating}
                </span>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-forest-400 text-xs">
                {visit.dishes && visit.dishes.length > 0 && <span>{visit.dishes.length} dish{visit.dishes.length !== 1 ? "es" : ""}</span>}
                {visit.would_return && <span className="ml-1 text-forest-500 font-medium">· Would return ✓</span>}
              </div>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-1 text-forest-600 text-xs font-semibold"
              >
                <span>View</span><ArrowRight className="w-3 h-3" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
