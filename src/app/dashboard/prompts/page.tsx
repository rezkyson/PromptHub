import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { MyPromptCard } from "@/components/prompts/my-prompt-card";
import { ToastMessage } from "@/components/toast-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROMPT_CATEGORIES } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { getUserPromptStats, getUserPrompts } from "@/lib/data/prompts";
import type { PromptCategory } from "@/types/prompt";

type MyPromptsPageProps = {
  searchParams: Promise<{
    category?: string;
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

export default async function MyPromptsPage({
  searchParams,
}: MyPromptsPageProps) {
  const { category, message, search } = await searchParams;
  const user = await getCurrentUser();
  const categoryFilter = toCategoryFilter(category);
  const [stats, prompts] = user
    ? await Promise.all([
        getUserPromptStats(user.id),
        getUserPrompts(user.id, {
          category: categoryFilter,
          limit: 12,
          search,
        }),
      ])
    : [
        { total: 0, public: 0, private: 0, recentPrompts: [] },
        [],
      ];
  const isFiltering = Boolean(search?.trim() || categoryFilter);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <ToastMessage message={message} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            My Prompts
          </p>
          <h1 className="mt-3 text-4xl font-normal tracking-tight">
            Prompt saya
          </h1>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard/prompts/new">Buat prompt</Link>
        </Button>
      </div>

      <form className="mt-8 grid gap-3 rounded-3xl bg-block-cream p-4 sm:grid-cols-[1fr_220px_auto]">
        <Input
          defaultValue={search}
          name="search"
          placeholder="Cari berdasarkan judul"
        />
        <select
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          defaultValue={categoryFilter}
          name="category"
        >
          <option value="">Semua kategori</option>
          {PROMPT_CATEGORIES.map((promptCategory) => (
            <option key={promptCategory} value={promptCategory}>
              {promptCategory}
            </option>
          ))}
        </select>
        <Button className="rounded-full" type="submit">
          Filter
        </Button>
      </form>

      <div className="mt-5 text-sm">
        Total {stats.total} prompt, {stats.public} public, {stats.private}{" "}
        private.
      </div>

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
                <Link href="/dashboard/prompts">Reset filter</Link>
              </Button>
            ) : (
              <Button asChild className="rounded-full">
                <Link href="/dashboard/prompts/new">Buat prompt pertama</Link>
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
    </section>
  );
}
