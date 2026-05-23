import Link from "next/link";
import {
  CopyIcon,
  FileTextIcon,
  Globe2Icon,
  LockKeyholeIcon,
  PlusIcon,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/empty-state";
import { MyPromptCard } from "@/components/prompts/my-prompt-card";
import { Button } from "@/components/ui/button";
import { getCurrentProfile, getCurrentUser } from "@/lib/data/auth";
import { getUserPromptStats } from "@/lib/data/prompts";

export default async function DashboardPage() {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ]);
  const stats = user
    ? await getUserPromptStats(user.id)
    : { copyCount: 0, total: 0, public: 0, private: 0, recentPrompts: [] };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="rounded-3xl bg-block-mint p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          Dashboard
        </p>
        <h1 className="mt-8 max-w-3xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
          Halo, {profile?.displayName || profile?.username || user?.email}.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8">
          Pantau prompt pribadi, prompt public, dan prompt private dari satu
          tempat.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          description="Semua prompt yang kamu simpan."
          icon={FileTextIcon}
          label="Total prompt"
          value={stats.total}
        />
        <StatCard
          description="Prompt yang terlihat di public feed."
          icon={Globe2Icon}
          label="Public"
          value={stats.public}
        />
        <StatCard
          description="Prompt yang hanya bisa kamu lihat."
          icon={LockKeyholeIcon}
          label="Private"
          value={stats.private}
        />
        <StatCard
          description="Total akun unik yang pernah menyalin prompt kamu."
          icon={CopyIcon}
          label="Salinan"
          value={stats.copyCount}
        />
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Terbaru
          </p>
          <h2 className="mt-2 text-3xl font-normal tracking-tight">
            Prompt terakhir
          </h2>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard/prompts/new">
            <PlusIcon aria-hidden="true" />
            Buat prompt
          </Link>
        </Button>
      </div>

      {stats.recentPrompts.length > 0 ? (
        <div className="mt-5 space-y-4">
          {stats.recentPrompts.map((prompt) => (
            <MyPromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button asChild className="rounded-full">
              <Link href="/dashboard/prompts/new">
                <PlusIcon aria-hidden="true" />
                Buat prompt pertama
              </Link>
            </Button>
          }
          className="mt-5"
          description="Buat prompt pertamamu sekarang."
          title="Kamu belum menyimpan prompt."
        />
      )}
    </section>
  );
}
