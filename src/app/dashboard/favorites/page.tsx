import { HeartIcon } from "lucide-react";

import { FavoritePromptBrowser } from "@/components/prompts/prompt-browsers";
import { ToastMessage } from "@/components/toast-message";
import { PROMPT_CATEGORIES } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { getFavoritePrompts } from "@/lib/data/favorites";
import type { PromptCategory } from "@/types/prompt";

type FavoritesPageProps = {
  searchParams: Promise<{
    category?: string;
    error?: string;
    message?: string;
    search?: string;
  }>;
};

function toCategoryFilter(value: string | undefined) {
  if (PROMPT_CATEGORIES.includes(value as PromptCategory)) {
    return value as PromptCategory;
  }

  return "";
}

export default async function FavoritesPage({
  searchParams,
}: FavoritesPageProps) {
  const { category, error, message, search } = await searchParams;
  const user = await getCurrentUser();
  const categoryFilter = toCategoryFilter(category);
  const favorites = user
    ? await getFavoritePrompts(user.id, {
        category: categoryFilter,
        limit: 12,
        search,
      })
    : { hasMore: false, nextOffset: 0, prompts: [], total: 0 };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <ToastMessage error={error} message={message} />

      <div className="rounded-3xl bg-block-pink p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          Favorite
        </p>
        <h1 className="mt-8 max-w-3xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
          Prompt yang kamu simpan.
        </h1>
        <p className="mt-6 inline-flex items-center gap-2 text-xl leading-8">
          <HeartIcon aria-hidden="true" className="size-5" />
          {favorites.total} prompt tersimpan.
        </p>
      </div>

      <FavoritePromptBrowser
        initialCategory={categoryFilter}
        initialPrompts={favorites.prompts}
        initialSearch={search}
        isAuthenticated={Boolean(user)}
        mode="favorites"
      />
    </section>
  );
}
