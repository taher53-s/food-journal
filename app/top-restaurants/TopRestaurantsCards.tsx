"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankEmojiProps {
  emoji: string;
  index: number;
}

export function RankEmoji({ emoji, index }: RankEmojiProps) {
  return (
    <motion.span
      className={cn(
        "inline-block text-2xl font-display font-bold w-12 text-center shrink-0 transition-transform duration-300",
        "hover:scale-110"
      )}
      whileHover={{ scale: 1.15 }}
    >
      {emoji}
    </motion.span>
  );
}

interface CuisineEmojiProps {
  emoji: string;
}

export function CuisineEmoji({ emoji }: CuisineEmojiProps) {
  return (
    <motion.div
      className="w-12 h-12 bg-forest-50 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all duration-300"
      whileHover={{ scale: 1.1, backgroundColor: "rgb(220,240,228)" }}
    >
      {emoji}
    </motion.div>
  );
}

interface AnimatedArrowProps {
  className?: string;
}

export function AnimatedArrow({ className }: AnimatedArrowProps) {
  return (
    <motion.div
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <ArrowRight className="w-4 h-4" />
    </motion.div>
  );
}
