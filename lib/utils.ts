import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PriceRange, RecommendationLevel, Occasion, FlavorTag } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const priceRangeLabel: Record<PriceRange, string> = {
  budget: "$ Budget", moderate: "$$ Moderate", expensive: "$$$ Expensive", luxury: "$$$$ Luxury",
};

export const occasionLabel: Record<Occasion, string> = {
  date: "Romantic Date", friends: "Friends Night", family: "Family Dinner",
  solo: "Solo Adventure", business: "Business Meal", celebration: "Celebration",
};

export const occasionEmoji: Record<Occasion, string> = {
  date: "❤️", friends: "🥂", family: "👨‍👩‍👧", solo: "🧘", business: "💼", celebration: "🎉",
};

export const recommendationLabel: Record<RecommendationLevel, string> = {
  must_try: "Must Try", worth_it: "Worth It", decent: "Decent", skip: "Skip",
};

export const recommendationColor: Record<RecommendationLevel, string> = {
  must_try: "bg-forest-500 text-white",
  worth_it: "bg-gold-500 text-forest-900",
  decent: "bg-ember-300 text-white",
  skip: "bg-gray-400 text-white",
};

export const flavorTagColors: Record<FlavorTag, { bg: string; text: string; emoji: string }> = {
  spicy: { bg: "bg-red-100", text: "text-red-700", emoji: "🌶️" },
  sweet: { bg: "bg-pink-100", text: "text-pink-700", emoji: "🍯" },
  smoky: { bg: "bg-gray-200", text: "text-gray-700", emoji: "🔥" },
  tangy: { bg: "bg-yellow-100", text: "text-yellow-700", emoji: "🍋" },
  creamy: { bg: "bg-amber-100", text: "text-amber-700", emoji: "🧈" },
  savory: { bg: "bg-amber-100", text: "text-amber-800", emoji: "🧂" },
  bitter: { bg: "bg-green-100", text: "text-green-700", emoji: "🍵" },
  umami: { bg: "bg-purple-100", text: "text-purple-700", emoji: "🍄" },
  fresh: { bg: "bg-teal-100", text: "text-teal-700", emoji: "🌿" },
  rich: { bg: "bg-orange-100", text: "text-orange-700", emoji: "🥩" },
};

export function getRatingBg(rating: number): string {
  if (rating >= 9) return "bg-gold-100 text-gold-700 border-gold-200";
  if (rating >= 7) return "bg-forest-100 text-forest-700 border-forest-200";
  if (rating >= 5) return "bg-ember-100 text-ember-600 border-ember-200";
  return "bg-red-100 text-red-700 border-red-200";
}

export const cuisineEmojis: Record<string, string> = {
  italian: "🍝", japanese: "🍣", indian: "🍛", mexican: "🌮", french: "🥐",
  chinese: "🥟", thai: "🍜", mediterranean: "🫒", american: "🍔", korean: "🥢",
  spanish: "🥘", "new nordic": "🌿", "middle eastern": "🧆", vietnamese: "🍲",
  greek: "🫙", default: "🍽️",
};

export function getCuisineEmoji(cuisine: string): string {
  return cuisineEmojis[cuisine.toLowerCase()] || cuisineEmojis.default;
}
