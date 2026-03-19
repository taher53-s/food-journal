"use client";
import { useState } from "react";
import Image from "next/image";
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
  sizes,
  style,
}: OptimizedImageProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const handleImageError = () => {
    setImgError(true);
    setShowFallback(true);
  };

  const handleFallbackError = () => {
    setShowFallback(true);
  };

  if (!src || imgError) {
    return (
      <div
        className={cn(
          "w-full h-full bg-gradient-to-br from-forest-800/60 to-forest-900/40 flex items-center justify-center",
          className
        )}
        style={style}
      >
        <span className="text-5xl opacity-30">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)} style={style}>
      {/* Next.js Image — primary renderer */}
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={true}
        priority={priority}
        sizes={sizes}
        onError={handleImageError}
        onLoad={() => setImgLoaded(true)}
        className={cn(
          "object-cover transition-all duration-500",
          !imgLoaded && "opacity-0",
          imgLoaded && "opacity-100"
        )}
      />

      {/* Fallback native img — shows when Next.js Image fails */}
      {showFallback && !imgLoaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleFallbackError}
        />
      )}

      {/* Skeleton while loading */}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800/40 to-forest-900/20 animate-pulse" />
      )}

      {/* Emoji placeholder overlay if both image and fallback fail */}
      {showFallback && !imgLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800/60 to-forest-900/40 flex items-center justify-center">
          <span className="text-4xl opacity-30">{fallbackEmoji}</span>
        </div>
      )}
    </div>
  );
}
