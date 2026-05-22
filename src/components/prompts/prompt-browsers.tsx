"use client";

import Link from "next/link";
import {
  HeartIcon,
  LoaderCircleIcon,
  PlusIcon,
  RotateCcwIcon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { PromptCard } from "@/components/prompt-card";
import { MyPromptCard } from "@/components/prompts/my-prompt-card";
import { PromptFilterControls } from "@/components/prompts/prompt-filter-controls";
import { Button } from "@/components/ui/button";
import type { Prompt, PromptCategory } from "@/types/prompt";

type PromptBrowserMode = "favorites" | "public" | "user";

const PAGE_SIZE = 12;

type PromptBrowserProps = {
  initialCategory: PromptCategory | "";
  initialPrompts: Prompt[];
  initialSearch?: string;
  isAuthenticated?: boolean;
  mode: PromptBrowserMode;
  stats?: {
    private: number;
    public: number;
    total: number;
  };
  userId?: string;
};

type PromptListResponse = {
  hasMore?: boolean;
  nextOffset?: number;
  prompts?: Prompt[];
};

function getPromptRequestParams({
  category,
  mode,
  offset = 0,
  search,
}: {
  category: PromptCategory | "";
  mode: PromptBrowserMode;
  offset?: number;
  search: string;
}) {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    mode,
    offset: String(offset),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (category) {
    params.set("category", category);
  }

  return params;
}

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
  const [hasMore, setHasMore] = useState(initialPrompts.length === PAGE_SIZE);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  function updateSearch(nextSearch: string) {
    setSearch(nextSearch);
    setPrompts(filterCachedPrompts(cachedPrompts, nextSearch, category));
    setHasMore(false);
  }

  function updateCategory(nextCategory: PromptCategory | "") {
    setCategory(nextCategory);
    setPrompts(filterCachedPrompts(cachedPrompts, search, nextCategory));
    setHasMore(false);
  }

  useEffect(() => {
    const nextUrl = getFilterUrl(search, category);

    window.history.replaceState(null, "", nextUrl);
  }, [category, search]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      const currentRequest = requestId.current + 1;
      const params = getPromptRequestParams({ category, mode, search });

      requestId.current = currentRequest;
      setIsFetching(true);

      try {
        const response = await fetch(`/api/prompts?${params.toString()}`);

        if (!response.ok) {
          setError("Gagal memuat prompt. Coba lagi sebentar.");
          return;
        }

        const data = (await response.json()) as PromptListResponse;
        const nextPrompts = data.prompts ?? [];

        if (requestId.current !== currentRequest) {
          return;
        }

        setError(null);
        setCachedPrompts(nextPrompts);
        setHasMore(data.hasMore ?? nextPrompts.length === PAGE_SIZE);
        setPrompts(nextPrompts);
      } catch {
        if (requestId.current === currentRequest) {
          setError("Gagal memuat prompt. Coba lagi sebentar.");
        }
      } finally {
        if (requestId.current === currentRequest) {
          setIsFetching(false);
        }
      }
    }, search.trim() ? 120 : 0);

    return () => window.clearTimeout(timeout);
  }, [category, mode, search]);

  async function loadMore() {
    if (isLoadingMore || !hasMore) {
      return;
    }

    const currentRequest = requestId.current + 1;
    const offset = prompts.length;
    const params = getPromptRequestParams({ category, mode, offset, search });

    requestId.current = currentRequest;
    setIsLoadingMore(true);

    try {
      const response = await fetch(`/api/prompts?${params.toString()}`);

      if (!response.ok) {
        setError("Gagal memuat prompt berikutnya. Coba lagi sebentar.");
        return;
      }

      const data = (await response.json()) as PromptListResponse;
      const nextPrompts = data.prompts ?? [];

      if (requestId.current !== currentRequest) {
        return;
      }

      setError(null);
      setCachedPrompts((currentPrompts) => [...currentPrompts, ...nextPrompts]);
      setHasMore(data.hasMore ?? nextPrompts.length === PAGE_SIZE);
      setPrompts((currentPrompts) => [...currentPrompts, ...nextPrompts]);
    } catch {
      if (requestId.current === currentRequest) {
        setError("Gagal memuat prompt berikutnya. Coba lagi sebentar.");
      }
    } finally {
      if (requestId.current === currentRequest) {
        setIsLoadingMore(false);
      }
    }
  }

  return {
    category,
    error,
    hasMore,
    isFiltering: Boolean(search.trim() || category),
    isFetching,
    isLoadingMore,
    loadMore,
    prompts,
    search,
    setCategory: updateCategory,
    setSearch: updateSearch,
  };
}

function LoadMoreButton({
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="mt-8 flex justify-center">
      <Button
        className="rounded-full px-5"
        disabled={isLoadingMore}
        onClick={onLoadMore}
        type="button"
        variant="secondary"
      >
        {isLoadingMore ? (
          <LoaderCircleIcon aria-hidden="true" className="animate-spin" />
        ) : (
          <PlusIcon aria-hidden="true" />
        )}
        {isLoadingMore ? "Memuat..." : "Muat lagi"}
      </Button>
    </div>
  );
}

export function PublicPromptBrowser(props: PromptBrowserProps) {
  const {
    category,
    error,
    hasMore,
    isFiltering,
    isFetching,
    isLoadingMore,
    loadMore,
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
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard
                isAuthenticated={props.isAuthenticated}
                key={prompt.id}
                prompt={prompt}
              />
            ))}
          </div>
          <LoadMoreButton
            hasMore={hasMore && !isFetching}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
          />
        </>
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
    hasMore,
    isFiltering,
    isFetching,
    isLoadingMore,
    loadMore,
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
        <>
          <div className="mt-5 space-y-4">
            {prompts.map((prompt) => (
              <MyPromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
          <LoadMoreButton
            hasMore={hasMore && !isFetching}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
          />
        </>
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

export function FavoritePromptBrowser(props: PromptBrowserProps) {
  const {
    category,
    error,
    hasMore,
    isFetching,
    isFiltering,
    isLoadingMore,
    loadMore,
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
        searchPlaceholder="Cari favorite berdasarkan judul, deskripsi, atau tag"
      />

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {prompts.length > 0 ? (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard
                isAuthenticated={props.isAuthenticated}
                key={prompt.id}
                prompt={prompt}
              />
            ))}
          </div>
          <LoadMoreButton
            hasMore={hasMore && !isFetching}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
          />
        </>
      ) : (
        <EmptyState
          action={
            isFiltering ? (
              <Button asChild className="rounded-full" variant="secondary">
                <Link href="/dashboard/favorites">
                  <RotateCcwIcon aria-hidden="true" />
                  Reset filter
                </Link>
              </Button>
            ) : (
              <Button asChild className="rounded-full">
                <Link href="/prompts">
                  <HeartIcon aria-hidden="true" />
                  Jelajahi prompt
                </Link>
              </Button>
            )
          }
          className="mt-8"
          description={
            isFiltering
              ? "Coba ubah kata kunci atau kategori."
              : "Simpan prompt publik dari halaman jelajah agar muncul di sini."
          }
          title={
            isFiltering
              ? "Tidak ada favorite yang cocok."
              : "Belum ada prompt favorite."
          }
        />
      )}
    </>
  );
}
