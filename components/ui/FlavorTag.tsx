"use client";
import { motion } from "framer-motion";
import { cn, flavorTagColors } from "@/lib/utils";
import { FlavorTag as FlavorTagType } from "@/types";

const DARK_TAG_COLORS: Record<FlavorTagType, { bg: string; text: string; emoji: string }> = {
  spicy: { bg: "bg-red-500/20", text: "text-red-300", emoji: "🌶️" },
  sweet: { bg: "bg-pink-500/20", text: "text-pink-300", emoji: "🍯" },
  smoky: { bg: "bg-white/10", text: "text-white/60", emoji: "🔥" },
  tangy: { bg: "bg-yellow-500/20", text: "text-yellow-300", emoji: "🍋" },
  creamy: { bg: "bg-amber-500/20", text: "text-amber-300", emoji: "🧈" },
  savory: { bg: "bg-orange-500/20", text: "text-orange-300", emoji: "🧂" },
  bitter: { bg: "bg-green-500/20", text: "text-green-300", emoji: "🍵" },
  umami: { bg: "bg-purple-500/20", text: "text-purple-300", emoji: "🍄" },
  fresh: { bg: "bg-teal-500/20", text: "text-teal-300", emoji: "🌿" },
  rich: { bg: "bg-orange-500/20", text: "text-orange-300", emoji: "🥩" },
};

interface FlavorTagProps {
  tag: FlavorTagType;
  size?: "sm" | "md";
  animated?: boolean;
  onClick?: () => void;
  selected?: boolean;
  dark?: boolean;
}

export function FlavorTag({ tag, size = "md", animated = false, onClick, selected, dark = false }: FlavorTagProps) {
  const colors = dark ? (DARK_TAG_COLORS[tag] || { bg: "bg-white/10", text: "text-white/60", emoji: "🍽️" }) : (flavorTagColors[tag] || { bg: "bg-gray-100", text: "text-gray-700", emoji: "🍽️" });
  const className = cn(
    "inline-flex items-center gap-1 rounded-full font-medium transition-all",
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3.5 py-1.5 text-xs",
    colors.bg, colors.text,
    selected && "ring-2 ring-offset-1 ring-current",
    onClick && "cursor-pointer hover:opacity-80"
  );

  if (animated) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={className}
      >
        <span>{colors.emoji}</span>
        <span className="capitalize">{tag}</span>
      </motion.button>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        <span>{colors.emoji}</span>
        <span className="capitalize">{tag}</span>
      </button>
    );
  }

  return (
    <span className={className}>
      <span>{colors.emoji}</span>
      <span className="capitalize">{tag}</span>
    </span>
  );
}

export function FlavorTagSelector({ selected, onChange, dark = false }: { selected: FlavorTagType[]; onChange: (tags: FlavorTagType[]) => void; dark?: boolean }) {
  const allTags: FlavorTagType[] = ["spicy","sweet","smoky","tangy","creamy","savory","bitter","umami","fresh","rich"];
  const toggle = (tag: FlavorTagType) => {
    if (selected.includes(tag)) onChange(selected.filter((t) => t !== tag));
    else onChange([...selected, tag]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <FlavorTag key={tag} tag={tag} animated onClick={() => toggle(tag)} selected={selected.includes(tag)} dark={dark} />
      ))}
    </div>
  );
}
