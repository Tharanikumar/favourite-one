export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Client-side media upload handler for static site.
 * Creates an object URL or base64 representation for uploaded files.
 */
export async function uploadMemoryMedia(
  file: File,
  folder: "photos" | "videos" = "photos"
): Promise<UploadResult> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${folder}/${timestamp}_${sanitizedName}`;

  try {
    const localUrl = URL.createObjectURL(file);
    return {
      url: localUrl,
      path: filePath,
    };
  } catch (err: unknown) {
    console.error("Local media processing error:", err);
    return {
      url: "",
      path: filePath,
      error: err instanceof Error ? err.message : "Failed to load file",
    };
  }
}

/**
 * Deletes media reference
 */
export async function deleteMemoryMedia(_path: string): Promise<boolean> {
  return true;
}
