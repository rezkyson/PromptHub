import { DEFAULT_PROMPT_VISIBILITY } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { attachFavoriteState } from "@/lib/data/favorites";
import { normalizeTags } from "@/lib/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPromptRow } from "@/lib/supabase/mappers";
import type { PromptCategory, PromptFormValues, PromptSort } from "@/types/prompt";

type PromptListFilters = {
  search?: string;
  category?: PromptCategory | "";
  limit?: number;
  offset?: number;
  sort?: PromptSort;
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

function getSearchFilter(search?: string) {
  const sanitizedSearch = search
    ?.trim()
    .replace(/[,%()]/g, " ")
    .replace(/\s+/g, " ");

  if (!sanitizedSearch) {
    return null;
  }

  return [
    `title.ilike.%${sanitizedSearch}%`,
    `description.ilike.%${sanitizedSearch}%`,
    `content.ilike.%${sanitizedSearch}%`,
  ].join(",");
}

function orderPromptQuery<
  TQuery extends {
    order: (column: string, options: { ascending: boolean }) => TQuery;
  },
>(
  query: TQuery,
  sort: PromptSort = "newest"
) {
  if (sort === "most_copied") {
    return query
      .order("copy_count", { ascending: false })
      .order("created_at", { ascending: false });
  }

  if (sort === "title_az") {
    return query
      .order("title", { ascending: true })
      .order("created_at", { ascending: false });
  }

  return query.order("created_at", { ascending: false });
}

export async function getPublicPrompts(filters: PromptListFilters = {}) {
  const supabase = await createSupabaseServerClient();
  const { from, to } = normalizePagination(filters);
  let query = orderPromptQuery(
    supabase
    .from("prompts")
    .select("*, profiles!prompts_user_id_fkey(*)")
      .eq("visibility", "public"),
    filters.sort
  )
    .range(from, to);

  const searchFilter = getSearchFilter(filters.search);

  if (searchFilter) {
    query = query.or(searchFilter);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const user = await getCurrentUser();

  return attachFavoriteState(data.map(mapPromptRow), user?.id);
}

export async function getPublicPromptsByUserId(
  userId: string,
  filters: PromptListFilters = {}
) {
  const supabase = await createSupabaseServerClient();
  const { from, to } = normalizePagination(filters);
  let query = orderPromptQuery(
    supabase
    .from("prompts")
    .select("*, profiles!prompts_user_id_fkey(*)")
    .eq("user_id", userId)
      .eq("visibility", "public"),
    filters.sort
  )
    .range(from, to);

  const searchFilter = getSearchFilter(filters.search);

  if (searchFilter) {
    query = query.or(searchFilter);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const user = await getCurrentUser();

  return attachFavoriteState(data.map(mapPromptRow), user?.id);
}

export async function getPromptById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*, profiles!prompts_user_id_fkey(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const user = await getCurrentUser();
  const [prompt] = await attachFavoriteState([mapPromptRow(data)], user?.id);

  return prompt;
}

export async function getUserPrompts(
  userId: string,
  filters: PromptListFilters = {}
) {
  const supabase = await createSupabaseServerClient();
  const { from, to } = normalizePagination(filters);
  let query = orderPromptQuery(
    supabase
    .from("prompts")
    .select("*")
      .eq("user_id", userId),
    filters.sort
  )
    .range(from, to);

  const searchFilter = getSearchFilter(filters.search);

  if (searchFilter) {
    query = query.or(searchFilter);
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

async function countUserPromptCopies(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("copy_count")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).reduce((total, prompt) => total + prompt.copy_count, 0);
}

export async function getUserPromptStats(userId: string) {
  const [total, publicCount, privateCount, copyCount, recentPrompts] =
    await Promise.all([
    countUserPromptsByVisibility(userId),
    countUserPromptsByVisibility(userId, "public"),
    countUserPromptsByVisibility(userId, "private"),
    countUserPromptCopies(userId),
    getUserPrompts(userId, { limit: 3 }),
  ]);

  return {
    copyCount,
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
