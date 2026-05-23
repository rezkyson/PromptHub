import Link from "next/link";
import { LogOutIcon, PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardNavLinks } from "@/components/dashboard/dashboard-nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import { getCurrentProfile, getCurrentUser } from "@/lib/data/auth";

type DashboardShellProps = {
  children: React.ReactNode;
};

function getDisplayName({
  email,
  profile,
}: {
  email?: string;
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
}) {
  return profile?.displayName || profile?.username || email || "PromptHub user";
}

export async function DashboardShell({ children }: DashboardShellProps) {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  if (!user) {
    redirect("/login?error=Silakan login untuk membuka halaman ini.");
  }

  const displayName = getDisplayName({ email: user.email, profile });

  return (
    <main className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden border-r bg-background/95 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="border-b px-6 py-6">
          <Link className="text-xl font-medium tracking-tight" href="/">
            PromptHub
          </Link>
          <p className="mt-2 truncate text-sm text-muted-foreground">
            {displayName}
          </p>
        </div>

        <div className="flex-1 px-4 py-5">
          <DashboardNavLinks />
        </div>

        <div className="space-y-4 border-t p-4">
          <Button asChild className="w-full rounded-full">
            <Link href="/dashboard/prompts/new">
              <PlusIcon aria-hidden="true" />
              Buat prompt
            </Link>
          </Button>
          <div className="flex items-center justify-between gap-2">
            <ThemeToggle />
            <form action={logoutAction}>
              <Button className="rounded-full" type="submit" variant="secondary">
                <LogOutIcon aria-hidden="true" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b bg-background/95 lg:hidden">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <Link className="text-xl font-medium tracking-tight" href="/">
                PromptHub
              </Link>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {displayName}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button asChild className="rounded-full" size="icon-lg">
                <Link aria-label="Buat prompt" href="/dashboard/prompts/new">
                  <PlusIcon aria-hidden="true" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
          <div className="px-6 pb-4">
            <DashboardNavLinks variant="mobile" />
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
