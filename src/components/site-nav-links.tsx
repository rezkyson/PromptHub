"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type SiteNavLinksProps = {
  isAuthenticated: boolean;
};

type NavKey =
  | "home"
  | "prompts"
  | "dashboard"
  | "my-prompts"
  | "settings"
  | "login";

function getActiveKey(pathname: string): NavKey | null {
  if (pathname === "/") {
    return "home";
  }

  if (pathname.startsWith("/dashboard/prompts")) {
    return "my-prompts";
  }

  if (pathname === "/dashboard") {
    return "dashboard";
  }

  if (pathname.startsWith("/settings")) {
    return "settings";
  }

  if (pathname.startsWith("/prompts")) {
    return "prompts";
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return "login";
  }

  return null;
}

function NavButton({
  activeKey,
  href,
  label,
  navKey,
}: {
  activeKey: NavKey | null;
  href: string;
  label: string;
  navKey: NavKey;
}) {
  const isActive = activeKey === navKey;

  return (
    <Button
      asChild
      className="rounded-full"
      variant={isActive ? "default" : "ghost"}
    >
      <Link aria-current={isActive ? "page" : undefined} href={href}>
        {label}
      </Link>
    </Button>
  );
}

export function SiteNavLinks({ isAuthenticated }: SiteNavLinksProps) {
  const pathname = usePathname();
  const activeKey = getActiveKey(pathname);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <NavButton
        activeKey={activeKey}
        href="/"
        label="Beranda"
        navKey="home"
      />
      <NavButton
        activeKey={activeKey}
        href="/prompts"
        label="Jelajahi Prompt"
        navKey="prompts"
      />
      {isAuthenticated ? (
        <>
          <NavButton
            activeKey={activeKey}
            href="/dashboard"
            label="Dashboard"
            navKey="dashboard"
          />
          <NavButton
            activeKey={activeKey}
            href="/dashboard/prompts"
            label="Prompt saya"
            navKey="my-prompts"
          />
          <NavButton
            activeKey={activeKey}
            href="/settings"
            label="Settings"
            navKey="settings"
          />
        </>
      ) : (
        <NavButton
          activeKey={activeKey}
          href="/login"
          label="Login"
          navKey="login"
        />
      )}
    </div>
  );
}
