"use client";

import Link from "next/link";
import { RotateCcwIcon, UserPlusIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { PromptCard } from "@/components/prompt-card";
import { MyPromptCard } from "@/components/prompts/my-prompt-card";
import { PromptFilterControls } from "@/components/prompts/prompt-filter-controls";
import { Button } from "@/components/ui/button";
import type { Prompt, PromptCategory } from "@/types/prompt";

type PromptBrowserMode = "public" | "user";

type PromptBrowserProps = {
  initialCategory: PromptCategory | "";
  initialPrompts: Prompt[];
  initialSearch?: string;
  mode: PromptBrowserMode;
  stats?: {
    private: number;
    public: number;
    total: number;
  };
  userId?: string;
};

function getFilterUrl(search: string, category: PromptCategory | "") {
  const params = new URLSearchParams(window.location.search);
  const trimmedSearch = search.trim();

  params.delete("error");
  params.delete("message");

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  } else {
    params.delete("search");
  }

  if (category) {
    params.set("category", category);
  } else {
    params.delete("category");
  }

  const query = params.toString();

  return query ? `${window.location.pathname}?${query}` : window.location.pathname;
}

function filterCachedPrompts(
  prompts: Prompt[],
  search: string,
  category: PromptCategory | "",
) {
  const normalizedSearch = search.trim().toLowerCase();

  return prompts.filter((prompt) => {
    const matchesSearch = normalizedSearch
      ? prompt.title.toLowerCase().includes(normalizedSearch)
      : true;
    const matchesCategory = category ? prompt.category === category : true;

    return matchesSearch && matchesCategory;
  });
}

function usePromptBrowser({
  initialCategory,
  initialPrompts,
  initialSearch,
  mode,
}: PromptBrowserProps) {
  const requestId = useRef(0);
  const [search, setSearch] = useState(initialSearch ?? "");
  const [category, setCategory] = useState(initialCategory);
  const [cachedPrompts, setCachedPrompts] = useState(initialPrompts);
  const [prompts, setPrompts] = useState(initialPrompts);
  const [error, setError] = useState<string | null>(null);

  function updateSearch(nextSearch: string) {
    setSearch(nextSearch);
    setPrompts(filterCachedPrompts(cachedPrompts, nextSearch, category));
  }

  function updateCategory(nextCategory: PromptCategory | "") {
    setCategory(nextCategory);
    setPrompts(filterCachedPrompts(cachedPrompts, search, nextCategory));
  }

  useEffect(() => {
    const nextUrl = getFilterUrl(search, category);

    window.history.replaceState(null, "", nextUrl);
  }, [category, search]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      const currentRequest = requestId.current + 1;
      const params = new URLSearchParams({ mode });

      requestId.current = currentRequest;

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category) {
        params.set("category", category);
      }

      try {
        const response = await fetch(`/api/prompts?${params.toString()}`);

        if (!response.ok) {
          setError("Gagal memuat prompt. Coba lagi sebentar.");
          return;
        }

        const data = (await response.json()) as { prompts?: Prompt[] };

        if (requestId.current !== currentRequest) {
          return;
        }

        setError(null);
        setCachedPrompts(data.prompts ?? []);
        setPrompts(data.prompts ?? []);
      } catch {
        if (requestId.current === currentRequest) {
          setError("Gagal memuat prompt. Coba lagi sebentar.");
        }
      }
    }, search.trim() ? 120 : 0);

    return () => window.clearTimeout(timeout);
  }, [category, mode, search]);

  return {
    category,
    error,
    isFiltering: Boolean(search.trim() || category),
    prompts,
    search,
    setCategory: updateCategory,
    setSearch: updateSearch,
  };
}

export function PublicPromptBrowser(props: PromptBrowserProps) {
  const {
    category,
    error,
    isFiltering,
    prompts,
    search,
    setCategory,
    setSearch,
  } = usePromptBrowser(props);

  return (
    <>
      <PromptFilterControls
        category={category}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
        search={search}
        searchPlaceholder="Cari prompt berdasarkan judul"
      />

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {prompts.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            isFiltering ? (
              <Button asChild className="rounded-full" variant="secondary">
                <Link href="/prompts">
                  <RotateCcwIcon aria-hidden="true" />
                  Reset filter
                </Link>
              </Button>
            ) : (
              <Button asChild className="rounded-full">
                <Link href="/register">
                  <UserPlusIcon aria-hidden="true" />
                  Register
                </Link>
              </Button>
            )
          }
          className="mt-8"
          description={
            isFiltering
              ? "Coba ubah kata kunci atau kategori."
              : "Jadilah yang pertama membagikan prompt."
          }
          title={
            isFiltering
              ? "Tidak ada prompt yang cocok dengan pencarianmu."
              : "Belum ada prompt publik."
          }
        />
      )}
    </>
  );
}

export function MyPromptBrowser(props: PromptBrowserProps) {
  const {
    category,
    error,
    isFiltering,
    prompts,
    search,
    setCategory,
    setSearch,
  } = usePromptBrowser(props);

  return (
    <>
      <PromptFilterControls
        category={category}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
        search={search}
        searchPlaceholder="Cari berdasarkan judul"
      />

      {props.stats ? (
        <div className="mt-5 text-sm">
          Total {props.stats.total} prompt, {props.stats.public} public,{" "}
          {props.stats.private} private.
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {prompts.length > 0 ? (
        <div className="mt-5 space-y-4">
          {prompts.map((prompt) => (
            <MyPromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            isFiltering ? (
              <Button asChild className="rounded-full" variant="secondary">
                <Link href="/dashboard/prompts">
                  <RotateCcwIcon aria-hidden="true" />
                  Reset filter
                </Link>
              </Button>
            ) : (
              <Button asChild className="rounded-full">
                <Link href="/dashboard/prompts/new">
                  <PlusIcon aria-hidden="true" />
                  Buat prompt pertama
                </Link>
              </Button>
            )
          }
          className="mt-5"
          description={
            isFiltering
              ? "Coba ubah kata kunci atau kategori."
              : "Buat prompt pertamamu sekarang."
          }
          title={
            isFiltering
              ? "Tidak ada prompt yang cocok dengan pencarianmu."
              : "Kamu belum menyimpan prompt."
          }
        />
      )}
    </>
  );
}
