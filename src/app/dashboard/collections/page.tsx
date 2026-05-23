import Link from "next/link";
import { FolderPlusIcon, LibraryIcon } from "lucide-react";

import { CollectionCard } from "@/components/collections/collection-card";
import { EmptyState } from "@/components/empty-state";
import { ToastMessage } from "@/components/toast-message";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/data/auth";
import { getUserCollections } from "@/lib/data/collections";

type CollectionsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const { error, message } = await searchParams;
  const user = await getCurrentUser();
  const collections = user ? await getUserCollections(user.id) : [];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <ToastMessage error={error} message={message} />

      <div className="rounded-3xl bg-block-mint p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          Collections
        </p>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-3xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
              Kelompokkan prompt sesuai workflow kamu.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8">
              Buat collection untuk project, client, kategori kerja, atau prompt
              yang sering kamu pakai.
            </p>
          </div>
          <Button asChild className="rounded-full">
            <Link href="/dashboard/collections/new">
              <FolderPlusIcon aria-hidden="true" />
              Buat collection
            </Link>
          </Button>
        </div>
      </div>

      {collections.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {collections.map((collection) => (
            <CollectionCard collection={collection} key={collection.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button asChild className="rounded-full">
              <Link href="/dashboard/collections/new">
                <FolderPlusIcon aria-hidden="true" />
                Buat collection pertama
              </Link>
            </Button>
          }
          className="mt-8"
          description="Mulai dari folder sederhana seperti Coding, Marketing, atau Client Work."
          icon={LibraryIcon}
          title="Belum ada collection."
        />
      )}
    </section>
  );
}
