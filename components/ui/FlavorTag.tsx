"use client";
import { motion } from "framer-motion";
import { cn, flavorTagColors } from "@/lib/utils";
import { FlavorTag as FlavorTagType } from "@/types";

interface FlavorTagProps {
  tag: FlavorTagType;
  size?: "sm" | "md";
  animated?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export function FlavorTag({ tag, size = "md", animated = false, onClick, selected }: FlavorTagProps) {
  const colors = flavorTagColors[tag] || { bg: "bg-gray-100", text: "text-gray-700", emoji: "🍽️" };
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

export function FlavorTagSelector({ selected, onChange }: { selected: FlavorTagType[]; onChange: (tags: FlavorTagType[]) => void }) {
  const allTags: FlavorTagType[] = ["spicy","sweet","smoky","tangy","creamy","savory","bitter","umami","fresh","rich"];
  const toggle = (tag: FlavorTagType) => {
    if (selected.includes(tag)) onChange(selected.filter((t) => t !== tag));
    else onChange([...selected, tag]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <FlavorTag key={tag} tag={tag} animated onClick={() => toggle(tag)} selected={selected.includes(tag)} />
      ))}
    </div>
  );
}
