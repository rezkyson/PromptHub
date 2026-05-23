import Link from "next/link";
import { FolderPlusIcon, PencilIcon, PlusIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { DeleteCollectionDialog } from "@/components/collections/delete-collection-dialog";
import { RemovePromptFromCollectionButton } from "@/components/collections/remove-prompt-from-collection-button";
import { EmptyState } from "@/components/empty-state";
import { MyPromptCard } from "@/components/prompts/my-prompt-card";
import { ToastMessage } from "@/components/toast-message";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/data/auth";
import { getCollectionWithPrompts } from "@/lib/data/collections";
import { formatDateTime } from "@/lib/formatters";

type CollectionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function CollectionDetailPage({
  params,
  searchParams,
}: CollectionDetailPageProps) {
  const [{ id }, { error, message }, user] = await Promise.all([
    params,
    searchParams,
    getCurrentUser(),
  ]);
  const collection = user ? await getCollectionWithPrompts(user.id, id) : null;

  if (!collection) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <ToastMessage error={error} message={message} />

      <div className="rounded-3xl bg-block-lilac p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          Collection
        </p>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-3xl text-5xl font-normal leading-none tracking-tight sm:text-6xl">
              {collection.name}
            </h1>
            {collection.description ? (
              <p className="mt-6 max-w-2xl text-xl leading-8">
                {collection.description}
              </p>
            ) : null}
            <p className="mt-6 text-sm">
              {collection.promptCount} prompt. Diperbarui{" "}
              {formatDateTime(collection.updatedAt)}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full" variant="secondary">
              <Link href={`/dashboard/collections/${collection.id}/edit`}>
                <PencilIcon aria-hidden="true" />
                Edit
              </Link>
            </Button>
            <DeleteCollectionDialog collectionId={collection.id} />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.16em]">
            Prompt
          </p>
          <h2 className="mt-2 text-3xl font-normal tracking-tight">
            Isi collection
          </h2>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard/prompts/new">
            <PlusIcon aria-hidden="true" />
            Buat prompt
          </Link>
        </Button>
      </div>

      {collection.prompts.length > 0 ? (
        <div className="mt-5 space-y-4">
          {collection.prompts.map((prompt) => (
            <div className="space-y-3" key={prompt.id}>
              <MyPromptCard prompt={prompt} />
              <div className="flex justify-end">
                <RemovePromptFromCollectionButton
                  collectionId={collection.id}
                  promptId={prompt.id}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button asChild className="rounded-full">
              <Link href="/dashboard/prompts/new">
                <FolderPlusIcon aria-hidden="true" />
                Buat prompt untuk collection ini
              </Link>
            </Button>
          }
          className="mt-5"
          description="Tambahkan prompt lewat form create/edit prompt dengan memilih collection ini."
          title="Collection ini belum punya prompt."
        />
      )}
    </section>
  );
}
