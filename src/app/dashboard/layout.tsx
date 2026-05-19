import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/data/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=Silakan login untuk membuka halaman ini.");
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      {children}
    </main>
  );
}
