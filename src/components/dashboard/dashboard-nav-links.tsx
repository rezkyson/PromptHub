"use client";

import {
  CompassIcon,
  FolderIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type DashboardNavLinksProps = {
  variant?: "mobile" | "sidebar";
};

type DashboardNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  matcher: (pathname: string) => boolean;
};

const navItems: DashboardNavItem[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
    matcher: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/dashboard/prompts",
    icon: LibraryIcon,
    label: "Prompt saya",
    matcher: (pathname) => pathname.startsWith("/dashboard/prompts"),
  },
  {
    href: "/dashboard/collections",
    icon: FolderIcon,
    label: "Collections",
    matcher: (pathname) => pathname.startsWith("/dashboard/collections"),
  },
  {
    href: "/dashboard/favorites",
    icon: HeartIcon,
    label: "Favorite",
    matcher: (pathname) => pathname.startsWith("/dashboard/favorites"),
  },
  {
    href: "/settings",
    icon: SettingsIcon,
    label: "Settings",
    matcher: (pathname) => pathname.startsWith("/settings"),
  },
  {
    href: "/prompts",
    icon: CompassIcon,
    label: "Jelajahi",
    matcher: (pathname) => pathname.startsWith("/prompts"),
  },
];

export function DashboardNavLinks({
  variant = "sidebar",
}: DashboardNavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard navigation"
      className={cn(
        variant === "sidebar"
          ? "space-y-1"
          : "flex gap-2 overflow-x-auto pb-1"
      )}
    >
      {navItems.map((item) => {
        const isActive = item.matcher(pathname);
        const Icon = item.icon;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium transition-colors",
              variant === "sidebar"
                ? "w-full rounded-2xl px-4 py-3"
                : "h-9 shrink-0 rounded-full px-4",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            href={item.href}
            key={item.href}
          >
            <Icon aria-hidden="true" className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
