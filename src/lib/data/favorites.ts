import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPromptRow } from "@/lib/supabase/mappers";
import type { ProfileRow, PromptFavoriteRow, PromptRow } from "@/types/database";
import type { Prompt, PromptCategory, PromptSort } from "@/types/prompt";

type FavoritePromptFilters = {
  category?: PromptCategory | "";
  limit?: number;
  offset?: number;
  search?: string;
  sort?: PromptSort;
};

type FavoriteRowWithPrompt = Pick<
  PromptFavoriteRow,
  "created_at" | "prompt_id"
> & {
  prompts?:
    | (PromptRow & {
        profiles?: ProfileRow | ProfileRow[] | null;
      })
    | null;
};

const DEFAULT_PAGE_SIZE = 12;
const MAX_FAVORITES_TO_SCAN = 500;

function normalizePagination({ limit, offset }: FavoritePromptFilters) {
  const safeLimit = Math.min(Math.max(limit ?? DEFAULT_PAGE_SIZE, 1), 50);
  const safeOffset = Math.max(offset ?? 0, 0);

  return {
    limit: safeLimit,
    offset: safeOffset,
  };
}

function matchesFavoriteFilters(prompt: Prompt, filters: FavoritePromptFilters) {
  const search = filters.search?.trim().toLowerCase();
  const matchesSearch = search
    ? [
        prompt.title,
        prompt.description ?? "",
        prompt.tags.join(" "),
      ].some((value) => value.toLowerCase().includes(search))
    : true;
  const matchesCategory = filters.category
    ? prompt.category === filters.category
    : true;

  return matchesSearch && matchesCategory;
}

function sortFavoritePrompts(prompts: Prompt[], sort: PromptSort = "newest") {
  return [...prompts].sort((firstPrompt, secondPrompt) => {
    if (sort === "most_copied") {
      return (
        secondPrompt.copyCount - firstPrompt.copyCount ||
        secondPrompt.createdAt.localeCompare(firstPrompt.createdAt)
      );
    }

    if (sort === "title_az") {
      return (
        firstPrompt.title.localeCompare(secondPrompt.title) ||
        secondPrompt.createdAt.localeCompare(firstPrompt.createdAt)
      );
    }

    return secondPrompt.createdAt.localeCompare(firstPrompt.createdAt);
  });
}

export async function attachFavoriteState(
  prompts: Prompt[],
  userId?: string | null
) {
  if (!userId || prompts.length === 0) {
    return prompts;
  }

  const promptIds = prompts.map((prompt) => prompt.id);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompt_favorites")
    .select("prompt_id")
    .eq("user_id", userId)
    .in("prompt_id", promptIds);

  if (error) {
    return prompts;
  }

  const favoriteIds = new Set((data ?? []).map((row) => row.prompt_id));

  return prompts.map((prompt) => ({
    ...prompt,
    isFavorited: favoriteIds.has(prompt.id),
  }));
}

export async function getFavoritePrompts(
  userId: string,
  filters: FavoritePromptFilters = {}
) {
  const { limit, offset } = normalizePagination(filters);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompt_favorites")
    .select(
      "prompt_id, created_at, prompts(*, profiles!prompts_user_id_fkey(*))"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(MAX_FAVORITES_TO_SCAN);

  if (error) {
    throw new Error(error.message);
  }

  const prompts = sortFavoritePrompts(
    ((data ?? []) as FavoriteRowWithPrompt[])
    .map((row) => (row.prompts ? mapPromptRow(row.prompts) : null))
    .filter((prompt): prompt is Prompt => Boolean(prompt))
      .filter((prompt) => matchesFavoriteFilters(prompt, filters)),
    filters.sort
  )
    .map((prompt) => ({
      ...prompt,
      isFavorited: true,
    }));
  const paginatedPrompts = prompts.slice(offset, offset + limit);

  return {
    hasMore: offset + limit < prompts.length,
    nextOffset: offset + paginatedPrompts.length,
    prompts: paginatedPrompts,
    total: prompts.length,
  };
}
