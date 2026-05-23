import { notFound } from "next/navigation";

import { CollectionForm } from "@/components/collections/collection-form";
import { ToastMessage } from "@/components/toast-message";
import { updateCollectionAction } from "@/lib/collections/actions";
import { getCurrentUser } from "@/lib/data/auth";
import { getCollectionById } from "@/lib/data/collections";

type EditCollectionPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function EditCollectionPage({
  params,
  searchParams,
}: EditCollectionPageProps) {
  const [{ id }, { error, message }, user] = await Promise.all([
    params,
    searchParams,
    getCurrentUser(),
  ]);
  const collection = user ? await getCollectionById(user.id, id) : null;

  if (!collection) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
      <ToastMessage error={error} message={message} />

      <div className="mb-8 rounded-3xl bg-block-cream p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          Edit Collection
        </p>
        <h1 className="mt-8 text-5xl font-normal leading-none tracking-tight sm:text-6xl">
          Edit collection.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8">
          Perbarui nama dan deskripsi agar collection tetap mudah dikenali.
        </p>
      </div>

      <CollectionForm
        action={updateCollectionAction}
        collection={collection}
      />
    </section>
  );
}
