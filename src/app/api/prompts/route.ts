import { NextResponse, type NextRequest } from "next/server";

import { PROMPT_CATEGORIES } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { attachFavoriteState, getFavoritePrompts } from "@/lib/data/favorites";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPromptRow } from "@/lib/supabase/mappers";
import type { PromptCategory } from "@/types/prompt";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;
const API_RATE_LIMIT = {
  limit: 120,
  windowMs: 60 * 1000,
};

function toCategoryFilter(value: string | null) {
  if (PROMPT_CATEGORIES.includes(value as PromptCategory)) {
    return value as PromptCategory;
  }

  return "";
}

function toPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const requestedMode = searchParams.get("mode");
  const mode =
    requestedMode === "user" || requestedMode === "favorites"
      ? requestedMode
      : "public";
  const rateLimit = checkRateLimit({
    identifier: `api:prompts:${mode}:${getClientIp(request.headers)}`,
    ...API_RATE_LIMIT,
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

  const search = searchParams.get("search")?.trim();
  const category = toCategoryFilter(searchParams.get("category"));
  const limit = Math.min(
    Math.max(toPositiveInteger(searchParams.get("limit"), DEFAULT_PAGE_SIZE), 1),
    MAX_PAGE_SIZE
  );
  const offset = toPositiveInteger(searchParams.get("offset"), 0);

  if (mode === "favorites") {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ prompts: [] }, { status: 401 });
    }

    const result = await getFavoritePrompts(user.id, {
      category,
      limit,
      offset,
      search,
    });

    return NextResponse.json(result);
  }

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("prompts")
    .select("*, profiles!prompts_user_id_fkey(*)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (mode === "public") {
    query = query.eq("visibility", "public");
  }

  if (mode === "user") {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ prompts: [] }, { status: 401 });
    }

    query = query.eq("user_id", user.id);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat prompt." },
      { status: 500 },
    );
  }

  const currentUser = await getCurrentUser();
  const prompts = await attachFavoriteState(
    (data ?? []).map(mapPromptRow),
    currentUser?.id
  );

  return NextResponse.json({
    hasMore: prompts.length === limit,
    nextOffset: offset + prompts.length,
    prompts,
  });
}
