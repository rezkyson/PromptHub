"use client";

import {
  CompassIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogInIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type SiteNavLinksProps = {
  isAuthenticated: boolean;
};

type NavKey = "home" | "prompts" | "dashboard" | "login";

function getActiveKey(pathname: string): NavKey | null {
  if (pathname === "/") {
    return "home";
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/settings")) {
    return "dashboard";
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
  icon: Icon,
  label,
  navKey,
}: {
  activeKey: NavKey | null;
  href: string;
  icon: LucideIcon;
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
        <Icon aria-hidden="true" />
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
        icon={HomeIcon}
        label="Beranda"
        navKey="home"
      />
      <NavButton
        activeKey={activeKey}
        href="/prompts"
        icon={CompassIcon}
        label="Jelajahi Prompt"
        navKey="prompts"
      />
      {isAuthenticated ? (
        <NavButton
          activeKey={activeKey}
          href="/dashboard"
          icon={LayoutDashboardIcon}
          label="Dashboard"
          navKey="dashboard"
        />
      ) : (
        <NavButton
          activeKey={activeKey}
          href="/login"
          icon={LogInIcon}
          label="Login"
          navKey="login"
        />
      )}
    </div>
  );
}
