import { NextResponse } from "next/server";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json(
        { error: "Media path is required" },
        { status: 400 }
      );
    }

    if (isServerSupabaseConfigured) {
      const supabase = createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: "Unauthorized access to private vault media" },
          { status: 401 }
        );
      }

      // Generate a temporary 60-minute signed URL from private bucket 'vault-media'
      const { data, error } = await supabase.storage
        .from("vault-media")
        .createSignedUrl(path, 3600);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ signedUrl: data.signedUrl });
    }

    // Offline / Demo fallback: if path is already a full URL, return it directly
    return NextResponse.json({ signedUrl: path });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
