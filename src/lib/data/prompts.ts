import { DEFAULT_PROMPT_VISIBILITY } from "@/lib/constants/prompts";
import { normalizeTags } from "@/lib/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPromptRow } from "@/lib/supabase/mappers";
import type { PromptCategory, PromptFormValues } from "@/types/prompt";

type PromptListFilters = {
  search?: string;
  category?: PromptCategory | "";
  limit?: number;
  offset?: number;
};

const DEFAULT_PAGE_SIZE = 12;

function normalizePagination({ limit, offset }: PromptListFilters) {
  const safeLimit = Math.min(Math.max(limit ?? DEFAULT_PAGE_SIZE, 1), 50);
  const safeOffset = Math.max(offset ?? 0, 0);

  return {
    from: safeOffset,
    to: safeOffset + safeLimit - 1,
  };
}

export async function getPublicPrompts(filters: PromptListFilters = {}) {
  const supabase = await createSupabaseServerClient();
  const { from, to } = normalizePagination(filters);
  let query = supabase
    .from("prompts")
    .select("*, profiles(*)")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.search?.trim()) {
    query = query.ilike("title", `%${filters.search.trim()}%`);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapPromptRow);
}

export async function getPublicPromptsByUserId(
  userId: string,
  filters: PromptListFilters = {}
) {
  const supabase = await createSupabaseServerClient();
  const { from, to } = normalizePagination(filters);
  let query = supabase
    .from("prompts")
    .select("*, profiles(*)")
    .eq("user_id", userId)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.search?.trim()) {
    query = query.ilike("title", `%${filters.search.trim()}%`);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapPromptRow);
}

export async function getPromptById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapPromptRow(data);
}

export async function getUserPrompts(
  userId: string,
  filters: PromptListFilters = {}
) {
  const supabase = await createSupabaseServerClient();
  const { from, to } = normalizePagination(filters);
  let query = supabase
    .from("prompts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.search?.trim()) {
    query = query.ilike("title", `%${filters.search.trim()}%`);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapPromptRow);
}

async function countUserPromptsByVisibility(
  userId: string,
  visibility?: "public" | "private"
) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("prompts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (visibility) {
    query = query.eq("visibility", visibility);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getUserPromptStats(userId: string) {
  const [total, publicCount, privateCount, recentPrompts] = await Promise.all([
    countUserPromptsByVisibility(userId),
    countUserPromptsByVisibility(userId, "public"),
    countUserPromptsByVisibility(userId, "private"),
    getUserPrompts(userId, { limit: 3 }),
  ]);

  return {
    total,
    public: publicCount,
    private: privateCount,
    recentPrompts,
  };
}

export function toPromptInsert(userId: string, values: PromptFormValues) {
  return {
    user_id: userId,
    title: values.title.trim(),
    description: values.description?.trim() || null,
    category: values.category,
    tags: normalizeTags(values.tags),
    content: values.content.trim(),
    visibility: values.visibility || DEFAULT_PROMPT_VISIBILITY,
  };
}

export function toPromptUpdate(values: PromptFormValues) {
  return {
    title: values.title.trim(),
    description: values.description?.trim() || null,
    category: values.category,
    tags: normalizeTags(values.tags),
    content: values.content.trim(),
    visibility: values.visibility || DEFAULT_PROMPT_VISIBILITY,
  };
}
