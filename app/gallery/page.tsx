import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
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
  
  const publicDir = path.join(process.cwd(), 'public');
  const fullPath = path.join(publicDir, folderName);
  
  if (!fs.existsSync(fullPath)) return [];
  
  return fs.readdirSync(fullPath)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .map(f => `${folderName}/${f}`);
}

export default async function GalleryPage() {
  const supabase = createClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("*, restaurant_visits(restaurant_name, cuisine)")
    .order("created_at", { ascending: false });

  const all = photos || [];

  const restaurantNames = [...new Set(all.map((p: any) => p.restaurant_visits?.restaurant_name).filter(Boolean))];
  const restaurantImages: Record<string, string[]> = {};
  
  for (const name of restaurantNames) {
    restaurantImages[name] = getLocalImages(name);
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-forest-500 uppercase tracking-widest mb-3">Visual Stories</p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-forest-950 mb-4">
              Food <span className="text-gradient italic">Gallery</span>
            </h1>
            <p className="text-forest-500 text-lg max-w-xl mx-auto font-light">
              {all.length} photos from {new Set(all.map((p: any) => p.visit_id)).size} restaurant visits
            </p>
          </div>
        </FadeIn>

        {all.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📸</div>
            <p className="text-forest-500">No photos yet. Start adding restaurant visits with photos!</p>
          </div>
        ) : (
          <StaggerContainer className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {all.map((photo: any, idx: number) => {
              const restaurantName = photo.restaurant_visits?.restaurant_name;
              const localImages = restaurantImages[restaurantName] || [];
              const localImage = localImages[idx % localImages.length];
              const imageSrc = localImage || photo.image_url;
              
              return (
                <StaggerItem key={photo.id}>
                  <Link href={`/restaurants/${photo.visit_id}`}>
                    <div className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer mb-4">
                      {imageSrc ? (
                        <img 
                          src={imageSrc} 
                          alt={photo.caption || "Food photo"} 
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            console.error('Image load failed:', imageSrc);
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${imageSrc ? 'hidden' : ''} w-full h-48 bg-forest-100 flex items-center justify-center`}>
                        <span className="text-4xl">🍽️</span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-xs font-semibold truncate">{restaurantName}</p>
                        {photo.caption && <p className="text-white/70 text-xs truncate">{photo.caption}</p>}
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
