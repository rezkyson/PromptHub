import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getCurrentProfile, getCurrentUser } from "@/lib/data/auth";
import { formatDateTime } from "@/lib/formatters";

export default async function SettingsPage() {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  if (!user) {
    redirect("/login?error=Silakan login untuk membuka settings.");
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="rounded-3xl bg-block-cream p-8 sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Settings
          </p>
          <h1 className="mt-8 text-5xl font-normal leading-none tracking-tight sm:text-6xl">
            Akun PromptHub
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8">
            Pengaturan lanjutan seperti edit username dan avatar upload bisa
            ditambahkan setelah MVP core stabil.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border bg-card p-6 text-card-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Authenticated</Badge>
            {profile?.username ? <Badge>@{profile.username}</Badge> : null}
          </div>

          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em]">
                Email
              </dt>
              <dd className="mt-2 break-words">{user.email}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em]">
                Username
              </dt>
              <dd className="mt-2">{profile?.username || "-"}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em]">
                Display name
              </dt>
              <dd className="mt-2">{profile?.displayName || "-"}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em]">
                Dibuat
              </dt>
              <dd className="mt-2">
                {profile ? formatDateTime(profile.createdAt) : "-"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
