"use client";
import { useState, useRef, useEffect } from "react";
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
  const [phase, setPhase] = useState<"loading" | "loaded" | "error">("loading");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset when src changes
    setPhase("loading");
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
      // Force re-evaluate
      if (imgRef.current.complete) {
        if (imgRef.current.naturalWidth > 0) {
          setPhase("loaded");
        } else {
          setPhase("error");
        }
      }
    }
  }, [src]);

  if (!src) {
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
      {/* Loading skeleton */}
      {phase === "loading" && (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800/40 to-forest-900/20 animate-pulse" />
      )}

      {/* Native img — works reliably on all devices/browsers */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          phase === "loaded" ? "opacity-100" : "opacity-0"
        )}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth > 0) setPhase("loaded");
          else setPhase("error");
        }}
        onError={() => setPhase("error")}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />

      {/* Error placeholder: gradient + emoji */}
      {phase === "error" && (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800/60 to-forest-900/40 flex items-center justify-center">
          <span className="text-5xl opacity-30">{fallbackEmoji}</span>
        </div>
      )}
    </div>
  );
}
