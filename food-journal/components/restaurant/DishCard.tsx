"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Dish } from "@/types";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { FlavorTag } from "@/components/ui/FlavorTag";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const rankEmoji = ["🥇","🥈","🥉"];
const rankColors = [
  "bg-gradient-to-br from-gold-100 to-gold-50 border-gold-200",
  "bg-gradient-to-br from-gray-100 to-gray-50 border-gray-200",
  "bg-gradient-to-br from-ember-100 to-ember-50 border-ember-200",
];

export function DishCard({ dish, rank, isAdmin, index = 0 }: { dish: Dish; rank?: number; isAdmin?: boolean; index?: number }) {
  const router = useRouter();
  const isTopThree = rank !== undefined && rank < 3;

  const handleDelete = async () => {
    if (!confirm("Delete this dish?")) return;
    const supabase = createClient();
    await supabase.from("dishes").delete().eq("id", dish.id);
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300",
        isTopThree ? cn("border", rankColors[rank]) : "border-forest-100/60",
        "shadow-card hover:shadow-card-hover hover:-translate-y-1"
      )}
    >
      {isTopThree && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.2 + index * 0.06 }}
          className="absolute top-3 left-3 z-10 text-2xl"
        >
          {rankEmoji[rank]}
        </motion.div>
      )}
      {isAdmin && (
        <button onClick={handleDelete}
          className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="relative h-44 overflow-hidden">
        {dish.image_url ? (
          <Image 
            src={dish.image_url} 
            alt={dish.dish_name} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
            sizes="300px"
            unoptimized={true}
            onError={(e) => {
              console.error('Image load failed:', dish.image_url);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest-50 to-cream-200 flex items-center justify-center">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 right-3">
          <RatingBadge rating={dish.rating} size="sm" animated={false} />
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-display text-lg font-semibold text-forest-900 leading-tight mb-1">{dish.dish_name}</h4>
        {dish.price && <p className="text-xs text-forest-400 font-medium mb-2">₹{dish.price.toLocaleString("en-IN")}</p>}
        {dish.notes && <p className="text-xs text-forest-600 leading-relaxed mb-3 line-clamp-2 italic">{dish.notes}</p>}
        {dish.flavor_tags && dish.flavor_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dish.flavor_tags.slice(0, 3).map((tag) => <FlavorTag key={tag} tag={tag as any} size="sm" />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
