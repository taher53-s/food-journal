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

export function RatingBadge({ rating, size = "md", animated = true, label, className }: RatingBadgeProps) {
  const colorClass = getRatingBg(rating);
  const display = rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);

  if (!animated) {
    return (
      <div className={cn("flex flex-col items-center gap-1", className)}>
        <div className={cn("inline-flex items-center justify-center rounded-2xl border-2 font-display font-semibold", sizeClasses[size], colorClass)}>
          {display}
        </div>
        {label && <span className="text-[10px] font-medium text-forest-500 uppercase tracking-widest">{label}</span>}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      whileHover={{ scale: 1.1 }}
      className={cn("flex flex-col items-center gap-1", className)}
    >
      <div className={cn("inline-flex items-center justify-center rounded-2xl border-2 font-display font-semibold", sizeClasses[size], colorClass)}>
        {display}
      </div>
      {label && <span className="text-[10px] font-medium text-forest-500 uppercase tracking-widest">{label}</span>}
    </motion.div>
  );
}

export function RatingBar({ label, rating, delay = 0 }: { label: string; rating: number; delay?: number }) {
  const pct = (rating / 10) * 100;
  const color = rating >= 9 ? "bg-gold-400" : rating >= 7 ? "bg-forest-500" : rating >= 5 ? "bg-ember-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-forest-500 w-20 text-right font-medium">{label}</span>
      <div className="flex-1 h-2 bg-forest-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: [0.22,1,0.36,1] }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
      <span className="text-xs font-semibold text-forest-700 w-8">{rating}</span>
    </div>
  );
}
