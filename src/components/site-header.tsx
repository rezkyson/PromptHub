import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/data/auth";

type SiteHeaderProps = {
  variant?: "public" | "dashboard";
};

export async function SiteHeader({ variant = "public" }: SiteHeaderProps) {
  const user = await getCurrentUser();

  return (
    <header className="border-b bg-background/95">
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link className="text-xl font-medium tracking-tight" href="/">
            PromptHub
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <form action={logoutAction}>
                <Button className="rounded-full" type="submit">
                  Logout
                </Button>
              </form>
            ) : (
              <Button asChild className="rounded-full">
                <Link href="/register">Register</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild className="rounded-full" variant="ghost">
            <Link href="/">Beranda</Link>
          </Button>
          <Button asChild className="rounded-full" variant="ghost">
            <Link href="/prompts">Jelajahi Prompt</Link>
          </Button>
          {user ? (
            <>
              <Button
                asChild
                className="rounded-full"
                variant={variant === "dashboard" ? "default" : "secondary"}
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild className="rounded-full" variant="secondary">
                <Link href="/dashboard/prompts">Prompt saya</Link>
              </Button>
            </>
          ) : (
            <Button asChild className="rounded-full" variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
