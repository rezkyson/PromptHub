import { CollectionForm } from "@/components/collections/collection-form";
import { ToastMessage } from "@/components/toast-message";
import { createCollectionAction } from "@/lib/collections/actions";

type NewCollectionPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function NewCollectionPage({
  searchParams,
}: NewCollectionPageProps) {
  const { error, message } = await searchParams;

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
      <ToastMessage error={error} message={message} />

      <div className="mb-8 rounded-3xl bg-block-cream p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          New Collection
        </p>
        <h1 className="mt-8 text-5xl font-normal leading-none tracking-tight sm:text-6xl">
          Buat collection baru.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8">
          Collection membantu kamu menyimpan prompt berdasarkan project,
          workflow, atau kebutuhan harian.
        </p>
      </div>

      <CollectionForm action={createCollectionAction} />
    </section>
  );
}
