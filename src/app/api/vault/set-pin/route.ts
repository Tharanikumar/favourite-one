import { NextResponse } from "next/server";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { generateSalt, hashVaultPin } from "@/lib/supabase/vault";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { newPin } = body;

    if (!newPin || typeof newPin !== "string" || newPin.length < 4) {
      return NextResponse.json(
        { error: "New PIN must be at least 4 digits" },
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
          { error: "Unauthorized. Authentication required." },
          { status: 401 }
        );
      }

      const salt = generateSalt();
      const hash = await hashVaultPin(newPin, salt);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("profiles") as any)
        .update({
          vault_pin_hash: hash,
          vault_pin_salt: salt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Vault passcode updated successfully" });
    }

    return NextResponse.json({
      success: true,
      message: "Vault passcode updated (Demo session)",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
