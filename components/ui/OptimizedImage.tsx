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
    <div className={cn("relative w-full h-full overflow-hidden", className)} style={style}>
      {/* Dark bg gradient — visible when img fails */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-[#0A1A12] flex items-center justify-center">
        <span className="text-5xl opacity-20">{fallbackEmoji}</span>
      </div>

      {/* Native img: always rendered, no opacity tricks, no React state dependencies */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        // Don't suppress errors — if onError fires, show the dark bg behind
      />
    </div>
  );
}
