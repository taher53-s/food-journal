import { createClient } from "@/lib/supabase/server";
import { FadeIn, StaggerContainer, StaggerItem, SectionHeading, AnimatedDivider } from "@/components/animations/PageTransition";
import { GalleryClient } from "./GalleryClient";
import fs from "fs";
import path from "path";

export const metadata = { title: "Gallery" };

const LOCAL_IMAGE_MAP: Record<string, string> = {
  "1441 Pizzeria": "/images/1441-pizzeria",
  "1441": "/images/1441-pizzeria",
};

function getLocalImages(restaurantName: string): string[] {
  const folderName = LOCAL_IMAGE_MAP[restaurantName];
  if (!folderName) return [];
  const publicDir = path.join(process.cwd(), "public");
  const fullPath = path.join(publicDir, folderName);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
    .map((f) => `${folderName}/${f}`);
}

export default async function GalleryPage() {
  const supabase = createClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("*, restaurant_visits(restaurant_name, cuisine)")
    .order("created_at", { ascending: false });

  const all = photos || [];

  const restaurantNames = Array.from(new Set(all.map((p: any) => p.restaurant_visits?.restaurant_name).filter(Boolean)));
  const restaurantImages: Record<string, string[]> = {};
  for (let i = 0; i < restaurantNames.length; i++) {
    const name = restaurantNames[i];
    restaurantImages[name] = getLocalImages(name);
  }

  const enrichedPhotos = all.map((photo: any, idx: number) => {
    const restaurantName = photo.restaurant_visits?.restaurant_name;
    const localImages = restaurantImages[restaurantName] || [];
    const localSrc = localImages[idx % localImages.length] ?? undefined;
    return {
      id: photo.id,
      image_url: photo.image_url,
      caption: photo.caption,
      restaurant_name: restaurantName,
      localSrc,
    };
  });

  const visitCount = Array.from(new Set(all.map((p: any) => p.visit_id))).length;

  return (
    <div className="min-h-screen bg-[#0A1A12]">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(27,94,67,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-24">
        <FadeIn>
          <SectionHeading
            eyebrow="✦ Visual Stories"
            title="Food Gallery"
            subtitle={`${all.length} photos from ${visitCount} restaurant visits`}
            align="center"
            dark
          />
        </FadeIn>

        <AnimatedDivider className="mb-16" dark />

        <GalleryClient photos={enrichedPhotos} />
      </div>
    </div>
  );
}
