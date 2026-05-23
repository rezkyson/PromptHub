import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  FileTextIcon,
  MailIcon,
  SaveIcon,
  UserRoundIcon,
} from "lucide-react";

import { SubmitButton } from "@/components/auth/submit-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ToastMessage } from "@/components/toast-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentProfile, getCurrentUser } from "@/lib/data/auth";
import { formatDateTime } from "@/lib/formatters";
import { updateProfileAction } from "@/lib/profile/actions";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

function getFallbackUsername(email?: string) {
  const baseUsername =
    email
      ?.split("@")[0]
      ?.toLowerCase()
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "") || "user";

  return baseUsername.length >= 3 ? baseUsername.slice(0, 40) : "user";
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  if (!user) {
    redirect("/login?error=Silakan login untuk membuka settings.");
  }

  const { error, message } = await searchParams;
  const username = profile?.username || getFallbackUsername(user.email);

  return (
    <DashboardShell>
      <section className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
        <ToastMessage error={error} message={message} />

        <div className="rounded-3xl bg-block-cream p-8 sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Settings
          </p>
          <h1 className="mt-8 text-5xl font-normal leading-none tracking-tight sm:text-6xl">
            Akun PromptHub
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8">
            Atur identitas publik yang muncul di profile dan prompt kamu.
          </p>
        </div>

        <form
          action={updateProfileAction}
          className="mt-8 space-y-6 rounded-3xl border bg-card p-6 text-card-foreground sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              <BadgeCheckIcon aria-hidden="true" />
              Akun aktif
            </Badge>
            {profile?.username ? <Badge>@{profile.username}</Badge> : null}
          </div>

          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em]">
                <MailIcon aria-hidden="true" className="mr-2 inline size-4" />
                Email
              </dt>
              <dd className="mt-2 break-words">{user.email}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em]">
                <CalendarDaysIcon aria-hidden="true" className="mr-2 inline size-4" />
                Dibuat
              </dt>
              <dd className="mt-2">
                {profile ? formatDateTime(profile.createdAt) : "-"}
              </dd>
            </div>
          </dl>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">
                <UserRoundIcon aria-hidden="true" />
                Username
              </Label>
              <Input
                autoComplete="username"
                defaultValue={username}
                id="username"
                maxLength={40}
                minLength={3}
                name="username"
                pattern="[a-z0-9_]+"
                required
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Huruf kecil, angka, dan underscore. Dipakai untuk URL profile.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">
                <UserRoundIcon aria-hidden="true" />
                Nama tampilan
              </Label>
              <Input
                defaultValue={profile?.displayName ?? ""}
                id="displayName"
                maxLength={80}
                name="displayName"
                placeholder="Nama yang tampil di prompt"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">
                <FileTextIcon aria-hidden="true" />
                Bio
              </Label>
              <Textarea
                className="min-h-28"
                defaultValue={profile?.bio ?? ""}
                id="bio"
                maxLength={300}
                name="bio"
                placeholder="Ceritakan singkat tentang kamu atau cara kamu memakai AI."
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Maksimal 300 karakter.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            {profile?.username ? (
              <Button asChild className="rounded-full" variant="secondary">
                <Link href={`/profile/${profile.username}`}>Lihat profile</Link>
              </Button>
            ) : (
              <span />
            )}
            <div className="sm:w-48">
              <SubmitButton pendingLabel="Menyimpan...">
                <SaveIcon aria-hidden="true" />
                Simpan
              </SubmitButton>
            </div>
          </div>
        </form>
      </section>
    </DashboardShell>
  );
}
