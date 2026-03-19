"use client";
import { motion } from "framer-motion";
import { Dish } from "@/types";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { FlavorTag } from "@/components/ui/FlavorTag";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const rankEmoji = ["🥇", "🥈", "🥉"];
const rankColors = [
  "bg-gradient-to-br from-gold-100 to-gold-50 border-gold-200",
  "bg-gradient-to-br from-gray-100 to-gray-50 border-gray-200",
  "bg-gradient-to-br from-ember-100 to-ember-50 border-ember-200",
];

export function DishCard({ dish, rank, isAdmin, index = 0, dark = false }: { dish: Dish; rank?: number; isAdmin?: boolean; index?: number; dark?: boolean }) {
  const router = useRouter();
  const isTopThree = rank !== undefined && rank < 3;
  const cardBg = dark ? "bg-white/[0.04] backdrop-blur-md border border-white/[0.08]" : "bg-white border border-forest-100/60";
  const textTitle = dark ? "text-white/90" : "text-forest-900";
  const textPrice = dark ? "text-white/50" : "text-forest-400";
  const textNotes = dark ? "text-white/60" : "text-forest-600";

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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group relative rounded-3xl overflow-hidden transition-all duration-300",
        cardBg,
        isTopThree ? "shadow-card" : "shadow-card"
      )}
      style={isTopThree ? {
        borderImage: "linear-gradient(135deg, rgba(245,158,11,0.4), rgba(245,158,11,0.1), rgba(27,94,67,0.2)) 1",
        borderImageSlice: 1,
      } : {}}
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
        <OptimizedImage
          src={dish.image_url}
          alt={dish.dish_name}
          className="transition-transform duration-500 group-hover:scale-105"
          sizes="300px"
          fallbackEmoji="🍽️"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 right-3">
          <RatingBadge rating={dish.rating} size="sm" animated={false} />
        </div>
      </div>
      <div className="p-4">
        <h4 className={cn("font-display text-lg font-semibold leading-tight mb-1 group-hover:opacity-80 transition-colors duration-200", textTitle)}>{dish.dish_name}</h4>
        {dish.price && <p className={cn("text-xs font-medium mb-2", textPrice)}>₹{dish.price.toLocaleString("en-IN")}</p>}
        {dish.notes && <p className={cn("text-xs leading-relaxed mb-3 line-clamp-2 italic", textNotes)}>{dish.notes}</p>}
        {dish.flavor_tags && dish.flavor_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dish.flavor_tags.slice(0, 3).map((tag) => <FlavorTag key={tag} tag={tag as any} size="sm" dark={dark} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
