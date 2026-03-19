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

  // Fetch photos from photos table
  const { data: photos } = await supabase
    .from("photos")
    .select("*, restaurant_visits(restaurant_name, cuisine)")
    .order("created_at", { ascending: false });

  // Fetch dish photos too
  const { data: dishPhotos } = await supabase
    .from("dishes")
    .select("id, image_url, dish_name, restaurant_visits!inner(restaurant_name, cuisine)")
    .not("image_url", "is", null)
    .order("created_at", { ascending: false });

  // Union: mark photo entries and dish entries
  const allPhotos = [
    ...(photos || []).map((p: any) => ({
      id: `photo-${p.id}`,
      image_url: p.image_url,
      caption: p.caption || p.restaurant_visits?.restaurant_name || "",
      restaurant_name: p.restaurant_visits?.restaurant_name || "",
      type: "photo",
      is_dish: false,
    })),
    ...(dishPhotos || []).map((d: any) => ({
      id: `dish-${d.id}`,
      image_url: d.image_url,
      caption: d.dish_name || "",
      restaurant_name: d.restaurant_visits?.restaurant_name || "",
      type: "dish",
      is_dish: true,
    })),
  ].sort((a, b) => 0); // Keep as-is since both are already newest-first

  const all = allPhotos;
  const restaurantNames = Array.from(new Set(all.map((p: any) => p.restaurant_name).filter(Boolean)));
  const restaurantImages: Record<string, string[]> = {};
  for (let i = 0; i < restaurantNames.length; i++) {
    const name = restaurantNames[i];
    restaurantImages[name] = getLocalImages(name);
  }

  const enrichedPhotos = all.map((photo: any, idx: number) => {
    const localImages = restaurantImages[photo.restaurant_name] || [];
    const localSrc = localImages[idx % localImages.length] ?? undefined;
    return {
      id: photo.id,
      image_url: photo.image_url,
      caption: photo.caption,
      restaurant_name: photo.restaurant_name,
      localSrc,
    };
  });

  const visitCount = new Set([
    ...(photos || []).map((p: any) => p.visit_id).filter(Boolean),
    ...(dishPhotos || []).map((d: any) => (d.restaurant_visits as any)?.id).filter(Boolean),
  ]).size;

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

        {all.length === 0 ? (
          <FadeIn>
            <div className="relative overflow-hidden bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-4xl p-20 max-w-lg mx-auto text-center">
              <div className="relative z-10">
                <div className="text-7xl mb-6">📷</div>
                <h3 className="font-display text-2xl text-white/80 mb-2">No photos yet</h3>
                <p className="text-white/40 mb-6">Start adding photos to your restaurant visits.</p>
                <a href="/admin/add-visit" className="btn-gold inline-flex">Add a Visit</a>
              </div>
            </div>
          </FadeIn>
        ) : (
          <GalleryClient photos={enrichedPhotos} />
        )}
      </div>
    </div>
  );
}
