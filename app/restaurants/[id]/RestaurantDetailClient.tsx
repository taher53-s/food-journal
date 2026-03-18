"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DetailBadgeProps {
  label: string;
  className?: string;
}

export function DetailBadge({ label, className }: DetailBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={className}
    >
      {label}
    </motion.span>
  );
}

interface MetaRowProps {
  children: React.ReactNode;
}

export function MetaRow({ children }: MetaRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="flex flex-wrap items-center gap-4 text-white/60 text-sm"
    >
      {children}
    </motion.div>
  );
}

interface PhotoItemProps {
  children: React.ReactNode;
  index: number;
  isFirst: boolean;
}

export function PhotoItem({ children, index, isFirst }: PhotoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={cn(
        "relative rounded-2xl overflow-hidden",
        isFirst ? "col-span-2 h-64" : "h-40"
      )}
    >
      {children}
    </motion.div>
  );
}

interface SidebarRankItemProps {
  emoji: string;
  name: string;
  rating: number;
  index: number;
}

export function SidebarRankItem({ emoji, name, rating, index }: SidebarRankItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="flex items-center gap-3"
    >
      <span className="text-base w-6 text-center">{emoji}</span>
      <span className="flex-1 text-xs font-medium text-forest-700 truncate">{name}</span>
      <span className="text-xs font-bold text-forest-600 font-display">{rating}</span>
    </motion.div>
  );
}
