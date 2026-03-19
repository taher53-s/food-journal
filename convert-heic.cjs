/**
 * Converts all HEIC images to JPEG so they display on desktop browsers.
 * Run: node convert-heic.cjs
 *
 * Downloads HEIC files from Supabase Storage, converts to JPEG using macOS `sips`
 * (native HEIC support on macOS), re-uploads as JPEG, updates database URLs.
 */
const { createClient } = require("@supabase/supabase-js");
const { execSync } = require("child_process");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

require("dotenv").config({ path: ".env" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "heic-convert-"));

async function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const chunks = [];
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadBuffer(response.headers.location).then(resolve).catch(reject);
      }
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    }).on("error", reject);
  });
}

function convertHeicToJpeg(inputPath, outputPath) {
  // sips is macOS native and handles HEIC natively
  execSync(`sips -s format jpeg -s formatOptions 85 "${inputPath}" --out "${outputPath}"`, { stdio: "pipe" });
}

async function main() {
  console.log("Scanning database for HEIC images...\n");

  const { data: dishes } = await supabase
    .from("dishes")
    .select("id, image_url")
    .not("image_url", "is", null);

  const { data: photos } = await supabase
    .from("photos")
    .select("id, image_url")
    .not("image_url", "is", null);

  const heicItems = [
    ...(dishes || [])
      .filter((d) => d.image_url && /\.heic$/i.test(d.image_url))
      .map((d) => ({ table: "dishes", id: d.id, url: d.image_url })),
    ...(photos || [])
      .filter((p) => p.image_url && /\.heic$/i.test(p.image_url))
      .map((p) => ({ table: "photos", id: p.id, url: p.image_url })),
  ];

  console.log(`Found ${heicItems.length} HEIC image(s)\n`);

  if (heicItems.length === 0) {
    console.log("No HEIC images found. Nothing to do.");
    fs.rmSync(TMP, { recursive: true, force: true });
    return;
  }

  let converted = 0;
  let failed = 0;

  for (const item of heicItems) {
    const inputPath = path.join(TMP, `input-${Date.now()}.heic`);
    const outputPath = path.join(TMP, `output-${Date.now()}.jpg`);

    try {
      const storagePath = item.url
        .replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/food-photos/`, "")
        .replace(/^\/+/, "");

      console.log(`Converting [${item.table}]: ${path.basename(item.url)}`);

      // 1. Download HEIC bytes
      const heicBuffer = await downloadBuffer(item.url);
      console.log(`  Downloaded ${(heicBuffer.length / 1024 / 1024).toFixed(2)} MB`);

      // 2. Write to temp file
      fs.writeFileSync(inputPath, heicBuffer);

      // 3. Convert HEIC → JPEG using macOS sips
      convertHeicToJpeg(inputPath, outputPath);

      const jpegBuffer = fs.readFileSync(outputPath);
      console.log(`  Converted to JPEG: ${(jpegBuffer.length / 1024 / 1024).toFixed(2)} MB`);

      // 4. Upload JPEG to Supabase Storage
      const newStoragePath = storagePath.replace(/\.heic$/i, ".jpg");
      const { error: uploadErr } = await supabase.storage
        .from("food-photos")
        .upload(newStoragePath, jpegBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadErr) throw new Error(`Upload: ${uploadErr.message}`);

      // 5. Get public URL
      const { data: urlData } = supabase.storage.from("food-photos").getPublicUrl(newStoragePath);
      const newUrl = urlData.publicUrl;
      console.log(`  Uploaded: ${path.basename(newUrl)}`);

      // 6. Update database
      const { error: updateErr } = await supabase
        .from(item.table)
        .update({ image_url: newUrl })
        .eq("image_url", item.url);

      if (updateErr) throw new Error(`DB update: ${updateErr.message}`);
      console.log(`  DB updated!`);

      // 7. Delete old HEIC file from storage
      const { error: deleteErr } = await supabase.storage
        .from("food-photos")
        .remove([storagePath]);

      if (deleteErr) {
        console.log(`  Warning: could not delete old HEIC: ${deleteErr.message}`);
      } else {
        console.log(`  Old HEIC deleted`);
      }

      console.log(`  Done!\n`);
      converted++;
    } catch (err) {
      console.log(`  Failed: ${err.message}\n`);
      failed++;
    } finally {
      try { fs.unlinkSync(inputPath); } catch (_) {}
      try { fs.unlinkSync(outputPath); } catch (_) {}
    }
  }

  fs.rmSync(TMP, { recursive: true, force: true });

  console.log(`========================================`);
  console.log(`Done! ${converted} converted, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\nFatal error:", err.message);
  try { fs.rmSync(TMP, { recursive: true, force: true }); } catch (_) {}
  process.exit(1);
});
