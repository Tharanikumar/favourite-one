import { NextResponse } from "next/server";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a", "audio/webm", "audio/aac"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "memories-vault";
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = file.type;
    const size = file.size;

    // Validate type and size
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);
    const isAudio = ALLOWED_AUDIO_TYPES.includes(mimeType);

    if (!isImage && !isVideo && !isAudio) {
      return NextResponse.json(
        { error: `Unsupported file type (${mimeType}). Please upload a valid photo, video, or audio file.` },
        { status: 400 }
      );
    }

    if (isImage && size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ error: "Image file exceeds 20MB limit" }, { status: 400 });
    }
    if (isVideo && size > MAX_VIDEO_SIZE_BYTES) {
      return NextResponse.json({ error: "Video file exceeds 100MB limit" }, { status: 400 });
    }
    if (isAudio && size > MAX_AUDIO_SIZE_BYTES) {
      return NextResponse.json({ error: "Audio file exceeds 25MB limit" }, { status: 400 });
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${folder}/${timestamp}_${sanitizedName}`;

    if (isServerSupabaseConfigured) {
      const supabase = createServerSupabaseClient();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (bucket === "memories-vault") {
        const { data: publicData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        return NextResponse.json({
          url: publicData.publicUrl,
          path: data.path,
          size,
          mimeType,
        });
      } else {
        // For private vault-media bucket, return the path
        return NextResponse.json({
          url: data.path,
          path: data.path,
          isPrivate: true,
          size,
          mimeType,
        });
      }
    }

    // Demo/offline mode: return simulated success
    return NextResponse.json({
      url: URL.createObjectURL(file),
      path: filePath,
      size,
      mimeType,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
