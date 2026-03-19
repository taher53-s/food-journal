"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { Lightbox } from "@/components/ui/Lightbox";

interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  restaurant_name?: string;
  localSrc?: string;
}

interface GalleryClientProps {
  photos: Photo[];
}

function GalleryPhotoItem({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // Vary heights for masonry effect
  const heights = [200, 260, 320, 240, 280];
  const height = heights[index % heights.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer mb-4 break-inside-avoid"
      style={{ height }}
      onClick={onClick}
    >
      {/* Skeleton */}
      <div className="absolute inset-0 bg-forest-100 animate-pulse" />

      {/* Image */}
      <img
        src={photo.localSrc || photo.image_url}
        alt={photo.caption || "Food photo"}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
        onLoad={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "1";
          (e.currentTarget as HTMLImageElement).previousElementSibling?.classList.add("hidden");
        }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {photo.restaurant_name && (
            <p className="text-white text-sm font-semibold">{photo.restaurant_name}</p>
          )}
          {photo.caption && (
            <p className="text-white/60 text-xs mt-0.5 truncate">{photo.caption}</p>
          )}
        </div>
        {/* Zoom icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HorizontalPhotoStrip({ photos }: { photos: Photo[] }) {
  const duplicated = [...photos, ...photos, ...photos];
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0A1A12] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0A1A12] to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-3 py-3"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {duplicated.map((photo, i) => (
          <div
            key={i}
            className="relative shrink-0 rounded-xl overflow-hidden cursor-pointer"
            style={{ width: 180, height: 120 }}
            onClick={() => {}}
          >
            <img
              src={photo.localSrc || photo.image_url}
              alt={photo.caption || "Food"}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function GalleryClient({ photos }: GalleryClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxImages = photos.map((p) => ({
    src: p.localSrc || p.image_url,
    alt: p.caption || "Food photo",
    caption: p.caption || p.restaurant_name,
  }));

  return (
    <>
      {/* Horizontal scroll strip at top */}
      {photos.length > 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-12"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold mb-3 ml-1"
          >
            Scroll to explore
          </motion.p>
          <HorizontalPhotoStrip photos={photos} />
        </motion.div>
      )}

      {/* Masonry grid */}
      {photos.length > 0 ? (
        <>
          {/* Mobile: single column, Desktop: masonry columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((photo, i) => (
              <GalleryPhotoItem
                key={photo.id}
                photo={photo}
                index={i}
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] rounded-4xl p-16 max-w-lg mx-auto text-center">
          <div className="relative z-10">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="font-display text-2xl text-white/80 mb-2">No photos yet</h3>
            <p className="text-white/30 mb-6">Start adding restaurant visits with photos!</p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
