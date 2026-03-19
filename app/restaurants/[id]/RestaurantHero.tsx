"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { DeleteVisitButton } from "@/components/admin/DeleteVisitButton";

interface RestaurantHeroProps {
  displayImageUrl: string | null;
  restaurantName: string;
  cuisine: string;
  isAdmin: boolean;
  visitId: string;
}

export function RestaurantHero({ displayImageUrl, restaurantName, cuisine, isAdmin, visitId }: RestaurantHeroProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax: image moves slower than content
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.7, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div ref={ref} className="relative h-96 md:h-[520px] overflow-hidden">
      {/* Parallax image layer */}
      <motion.div style={{ y: imageY, scale }} className="absolute inset-0">
        <OptimizedImage
          src={displayImageUrl}
          alt={restaurantName}
          priority
          fallbackEmoji={""}
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-white/25 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </motion.div>

      {/* Admin controls */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="absolute top-6 right-6 flex gap-2"
        >
          <Link
            href={`/admin/edit/${visitId}`}
            className="bg-white/15 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-white/25 transition-all"
          >
            Edit
          </Link>
          <DeleteVisitButton visitId={visitId} />
        </motion.div>
      )}

      {/* Bottom info */}
      <motion.div
        style={{ y: contentY }}
        className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-3"
          >
            {/* Recommendation badge fades in separately */}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl md:text-6xl font-semibold text-white mb-2"
          >
            {restaurantName}
          </motion.h1>
        </div>
      </motion.div>
    </div>
  );
}
