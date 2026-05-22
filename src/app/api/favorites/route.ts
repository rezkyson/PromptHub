import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/data/auth";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FAVORITE_RATE_LIMIT = {
  limit: 60,
  windowMs: 60 * 1000,
};

type FavoriteRequestBody = {
  isFavorited?: boolean;
  promptId?: string;
};

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Silakan login untuk menyimpan favorite." },
      { status: 401 }
    );
  }

  const rateLimit = checkRateLimit({
    identifier: `favorite:api:${getClientIp(request.headers)}:${user.id}`,
    ...FAVORITE_RATE_LIMIT,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak request. Coba lagi sebentar." },
      {
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
        status: 429,
      }
    );
  }

  let body: FavoriteRequestBody;

  try {
    body = (await request.json()) as FavoriteRequestBody;
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }

  if (!body.promptId) {
    return NextResponse.json(
      { error: "Prompt tidak ditemukan." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  if (body.isFavorited) {
    const { error } = await supabase.from("prompt_favorites").upsert({
      prompt_id: body.promptId,
      user_id: user.id,
    });

    if (error) {
      return NextResponse.json(
        { error: "Prompt gagal disimpan ke favorite." },
        { status: 500 }
      );
    }

    return NextResponse.json({ isFavorited: true });
  }

  const { error } = await supabase
    .from("prompt_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("prompt_id", body.promptId);

  if (error) {
    return NextResponse.json(
      { error: "Favorite gagal dihapus." },
      { status: 500 }
    );
  }

  return NextResponse.json({ isFavorited: false });
}
