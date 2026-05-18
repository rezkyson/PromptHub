import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/data/auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
        <div className="rounded-3xl bg-block-lime p-8 sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Login
          </p>
          <h1 className="mt-8 max-w-xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
            Masuk dan lanjutkan mengelola prompt kamu.
          </h1>
        </div>

        <form
          action={loginAction}
          className="space-y-5 rounded-3xl border bg-card p-6 text-card-foreground sm:p-8"
        >
          <AuthMessage error={error} message={message} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Password</Label>
            <Input
              autoComplete="current-password"
              id="password"
              name="password"
              required
              type="password"
            />
          </div>

          <SubmitButton pendingLabel="Masuk...">Login</SubmitButton>

          <p className="text-sm">
            Belum punya akun?{" "}
            <Link className="font-medium underline underline-offset-4" href="/register">
              Register
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
