import { createClient } from "@/lib/supabase/server";
import { FadeIn, SectionHeading, AnimatedDivider } from "@/components/animations/PageTransition";
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

  // Build restaurant image lookup
  const restaurantNames = Array.from(new Set(all.map((p: any) => p.restaurant_visits?.restaurant_name).filter(Boolean)));
  const restaurantImages: Record<string, string[]> = {};
  for (let i = 0; i < restaurantNames.length; i++) {
    const name = restaurantNames[i];
    restaurantImages[name] = getLocalImages(name);
  }

  // Attach local images to photos
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
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionHeading
            eyebrow="Visual Stories"
            title="Food Gallery"
            subtitle={`${all.length} photos from ${visitCount} restaurant visits`}
            align="center"
          />
        </FadeIn>

        <AnimatedDivider className="mb-16" />

        <GalleryClient photos={enrichedPhotos} />
      </div>
    </div>
  );
}
