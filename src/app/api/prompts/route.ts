import { NextResponse, type NextRequest } from "next/server";

import { PROMPT_CATEGORIES } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPromptRow } from "@/lib/supabase/mappers";
import type { PromptCategory } from "@/types/prompt";

function toCategoryFilter(value: string | null) {
  if (PROMPT_CATEGORIES.includes(value as PromptCategory)) {
    return value as PromptCategory;
  }

  return "";
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get("mode") === "user" ? "user" : "public";
  const search = searchParams.get("search")?.trim();
  const category = toCategoryFilter(searchParams.get("category"));
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("prompts")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false })
    .limit(50);

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

  return NextResponse.json({ prompts: (data ?? []).map(mapPromptRow) });
}
