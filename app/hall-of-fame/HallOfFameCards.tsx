"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { FlavorTag } from "@/components/ui/FlavorTag";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils";

export function HallOfFameTrophy() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-7xl mb-6 animate-float"
    >
      🏆
    </motion.div>
  );
}

interface TopCardProps {
  dish: any;
  index: number;
}

export function HallOfFameTopCard({ dish, index }: TopCardProps) {
  return (
    <Link href={`/restaurants/${dish.visit_id}`} className="group block">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-glow-gold transition-all duration-500"
      >
        {/* Gold gradient border on hover */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20"
          style={{
            padding: "1px",
            background: "linear-gradient(135deg, rgba(245,158,11,0.6), rgba(245,158,11,0.2), rgba(212,160,23,0.4))",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          } as any}
        />
        {/* Gold shimmer overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
          style={{ background: "linear-gradient(135deg, rgba(252,211,77,0.08) 0%, rgba(245,158,11,0.04) 50%, rgba(252,211,77,0.08) 100%)" }}
        />
        <div className="absolute top-4 left-4 z-10 text-3xl drop-shadow-lg">{["🥇", "🥈", "🥉"][index]}</div>

        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <OptimizedImage
            src={dish.image_url}
            alt={dish.dish_name}
            className="group-hover:scale-105 transition-transform duration-700"
            sizes="400px"
            fallbackEmoji="🍽️"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 right-4">
            <RatingBadge rating={dish.rating} size="md" animated dark />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-xl font-semibold text-white mb-1">{dish.dish_name}</h3>
          <p className="text-sm text-white/60 mb-3">{dish.restaurant_visits?.restaurant_name} · {dish.restaurant_visits?.cuisine}</p>
          {dish.notes && (
            <p className="text-xs text-white/50 italic line-clamp-2 mb-3 font-display">&ldquo;{dish.notes}&rdquo;</p>
          )}
          {dish.flavor_tags && dish.flavor_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dish.flavor_tags.slice(0, 3).map((tag: any) => (
                <FlavorTag key={tag} tag={tag} size="sm" dark />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
