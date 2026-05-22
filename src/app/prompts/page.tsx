import { PublicPromptBrowser } from "@/components/prompts/prompt-browsers";
import { SiteHeader } from "@/components/site-header";
import { PROMPT_CATEGORIES } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { getPublicPrompts } from "@/lib/data/prompts";
import type { PromptCategory } from "@/types/prompt";

export const dynamic = "force-dynamic";

type PromptsPageProps = {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
};

function toCategoryFilter(value: string | undefined) {
  if (PROMPT_CATEGORIES.includes(value as PromptCategory)) {
    return value as PromptCategory;
  }

  return "";
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const { category, search } = await searchParams;
  const categoryFilter = toCategoryFilter(category);
  const [user, prompts] = await Promise.all([
    getCurrentUser(),
    getPublicPrompts({
      category: categoryFilter,
      limit: 12,
      search,
    }),
  ]);

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="rounded-3xl bg-block-lilac p-8 sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Jelajahi Prompt
          </p>
          <h1 className="mt-8 max-w-3xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
            Temukan prompt publik dari pengguna PromptHub.
          </h1>
        </div>

        <PublicPromptBrowser
          initialCategory={categoryFilter}
          initialPrompts={prompts}
          initialSearch={search}
          isAuthenticated={Boolean(user)}
          mode="public"
        />
      </section>
    </main>
  );
}
