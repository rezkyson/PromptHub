import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { PromptCard } from "@/components/prompt-card";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser, getProfileByUsername } from "@/lib/data/auth";
import { getPublicPromptsByUserId } from "@/lib/data/prompts";
import { formatDate } from "@/lib/formatters";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const [user, prompts] = await Promise.all([
    getCurrentUser(),
    getPublicPromptsByUserId(profile.id, { limit: 12 }),
  ]);
  const displayName = profile.displayName || profile.username || "Pengguna PromptHub";

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="rounded-3xl bg-block-mint p-8 sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Public Profile
          </p>
          <h1 className="mt-8 max-w-3xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
            {displayName}
          </h1>
          {profile.bio ? (
            <p className="mt-6 max-w-2xl text-xl leading-8">{profile.bio}</p>
          ) : null}
          <p className="mt-6 text-sm">Bergabung {formatDate(profile.createdAt)}</p>
        </div>

        {prompts.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {prompts.map((prompt) => (
              <PromptCard
                authorName={displayName}
                isAuthenticated={Boolean(user)}
                key={prompt.id}
                prompt={prompt}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-8"
            description="User ini belum membagikan prompt public."
            title="Belum ada prompt public."
          />
        )}
      </section>
    </main>
  );
}
