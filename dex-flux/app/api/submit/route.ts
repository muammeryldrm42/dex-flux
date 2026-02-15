import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isValidSolanaAddress } from "@/lib/solana/validate";
import { SubmitSchema } from "@/lib/validators/submit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = SubmitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { mint, website_url, twitter_url, telegram_url, discord_url } = parsed.data;

  if (!isValidSolanaAddress(mint)) {
    return NextResponse.json({ error: "Invalid mint address" }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("token_metadata")
    .upsert(
      {
        mint_address: mint,
        website_url: website_url ?? null,
        twitter_url: twitter_url ?? null,
        telegram_url: telegram_url ?? null,
        discord_url: discord_url ?? null,
      },
      { onConflict: "mint_address" }
    )
    .select("mint_address, website_url, twitter_url, telegram_url, discord_url, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "DB error", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, row: data });
}
