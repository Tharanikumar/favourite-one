import { supabase, isSupabaseConfigured } from "./client";

export const MEMORIES_BUCKET = "memories-vault";

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Uploads a memory photo or video to Supabase Storage bucket 'memories-vault'.
 * If Supabase is not configured (local development), returns a local Object URL.
 */
export async function uploadMemoryMedia(
  file: File,
  folder: "photos" | "videos" = "photos"
): Promise<UploadResult> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${folder}/${timestamp}_${sanitizedName}`;

  if (!isSupabaseConfigured || !supabase) {
    // Graceful offline / local development fallback
    const localUrl = URL.createObjectURL(file);
    return {
      url: localUrl,
      path: filePath,
    };
  }

  try {
    const { data, error } = await supabase.storage
      .from(MEMORIES_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error.message);
      return {
        url: URL.createObjectURL(file),
        path: filePath,
        error: error.message,
      };
    }

    const { data: publicData } = supabase.storage
      .from(MEMORIES_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: publicData.publicUrl,
      path: data.path,
    };
  } catch (err: unknown) {
    console.error("Unexpected upload error:", err);
    return {
      url: URL.createObjectURL(file),
      path: filePath,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Deletes media from Supabase storage
 */
export async function deleteMemoryMedia(path: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase.storage.from(MEMORIES_BUCKET).remove([path]);
    return !error;
  } catch (err) {
    console.error("Delete media error:", err);
    return false;
  }
}
