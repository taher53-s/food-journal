"use client";
import { motion } from "framer-motion";
import { cn, getRatingBg } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10 text-lg",
  md: "w-12 h-12 text-xl",
  lg: "w-16 h-16 text-2xl",
  xl: "w-20 h-20 text-3xl",
};

export function RatingBadge({ rating, size = "md", animated = true, label, className, dark = false }: RatingBadgeProps & { dark?: boolean }) {
  const colorClass = getRatingBg(rating);
  const display = rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);
  const labelClass = dark ? "text-white/40" : "text-forest-500";

  if (!animated) {
    return (
      <div className={cn("flex flex-col items-center gap-1", className)}>
        <div className={cn("inline-flex items-center justify-center rounded-2xl border-2 font-display font-semibold shadow-sm", sizeClasses[size], colorClass)}>
          {display}
        </div>
        {label && <span className={`text-[10px] font-medium uppercase tracking-widest ${labelClass}`}>{label}</span>}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
      whileHover={{ scale: 1.12, rotate: [0, -3, 3, 0] }}
      whileTap={{ scale: 0.92 }}
      className={cn("flex flex-col items-center gap-1", className)}
    >
      <div className={cn("inline-flex items-center justify-center rounded-2xl border-2 font-display font-semibold shadow-sm", sizeClasses[size], colorClass)}>
        {display}
      </div>
      {label && <span className={`text-[10px] font-medium uppercase tracking-widest ${labelClass}`}>{label}</span>}
    </motion.div>
  );
}

export function RatingBar({ label, rating, delay = 0, dark = false }: { label: string; rating: number; delay?: number; dark?: boolean }) {
  const pct = (rating / 10) * 100;
  const color = rating >= 9 ? "bg-gold-400" : rating >= 7 ? "bg-forest-500" : rating >= 5 ? "bg-ember-400" : "bg-red-400";
  const labelClass = dark ? "text-white/40" : "text-forest-500";
  const valueClass = dark ? "text-white/70" : "text-forest-700";
  const trackClass = dark ? "bg-white/10" : "bg-forest-100";
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs w-20 text-right font-medium ${labelClass}`}>{label}</span>
      <div className={`flex-1 h-2 rounded-full overflow-hidden ${trackClass}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: [0.22,1,0.36,1] }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
      <span className={`text-xs font-semibold w-8 ${valueClass}`}>{rating}</span>
    </div>
  );
}
