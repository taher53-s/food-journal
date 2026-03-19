"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackEmoji?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackEmoji = "🍽️",
  priority = false,
  style,
}: OptimizedImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src) {
    return (
      <div
        className={cn(
          "w-full h-full bg-gradient-to-br from-forest-900 via-forest-800 to-[#0A1A12] flex items-center justify-center",
          className
        )}
        style={style}
      >
        <span className="text-5xl opacity-20">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={style}
    >
      {/* Dark gradient bg — CSS grid stacking, no position:absolute issues */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-[#0A1A12] flex items-center justify-center z-0">
        <span className="text-5xl opacity-20">{fallbackEmoji}</span>
      </div>

      {/* Image — z-10 puts it above the gradient, w-full h-full fills the relative parent */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover relative z-10"
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
