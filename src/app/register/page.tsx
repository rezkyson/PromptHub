import Link from "next/link";
import { LockKeyholeIcon, MailIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/data/auth";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const { error, message } = await searchParams;

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link className="text-xl font-medium tracking-tight" href="/">
          PromptHub
        </Link>
        <ThemeToggle />
      </nav>

      <section className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl bg-block-lilac p-8 sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Register
          </p>
          <h1 className="mt-8 max-w-xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
            Buat akun dan simpan prompt pertamamu.
          </h1>
        </div>

        <form
          action={registerAction}
          className="space-y-5 rounded-3xl border bg-card p-6 text-card-foreground sm:p-8"
        >
          <AuthMessage error={error} message={message} />

          <div className="space-y-2">
            <Label htmlFor="email">
              <MailIcon aria-hidden="true" />
              Email
            </Label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              placeholder="nama@email.com"
              required
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              <LockKeyholeIcon aria-hidden="true" />
              Password
            </Label>
            <Input
              autoComplete="new-password"
              id="password"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </div>

          <SubmitButton pendingLabel="Membuat akun...">Register</SubmitButton>

          <p className="text-sm">
            Sudah punya akun?{" "}
            <Link className="font-medium underline underline-offset-4" href="/login">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
