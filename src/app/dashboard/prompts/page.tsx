import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { MyPromptBrowser } from "@/components/prompts/prompt-browsers";
import { ToastMessage } from "@/components/toast-message";
import { Button } from "@/components/ui/button";
import { PROMPT_CATEGORIES } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { getUserPromptStats, getUserPrompts } from "@/lib/data/prompts";
import type { PromptCategory } from "@/types/prompt";

type MyPromptsPageProps = {
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

export default async function MyPromptsPage({
  searchParams,
}: MyPromptsPageProps) {
  const { category, error, message, search } = await searchParams;
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

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <ToastMessage error={error} message={message} />
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
          <Link href="/dashboard/prompts/new">
            <PlusIcon aria-hidden="true" />
            Buat prompt
          </Link>
        </Button>
      </div>

      <MyPromptBrowser
        initialCategory={categoryFilter}
        initialPrompts={prompts}
        initialSearch={search}
        mode="user"
        stats={stats}
        userId={user?.id}
      />
    </section>
  );
}
