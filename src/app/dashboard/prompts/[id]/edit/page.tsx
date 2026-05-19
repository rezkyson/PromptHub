import { notFound } from "next/navigation";

import { PromptForm } from "@/components/prompts/prompt-form";
import { getCurrentUser } from "@/lib/data/auth";
import { getPromptById } from "@/lib/data/prompts";

type EditPromptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPromptPage({ params }: EditPromptPageProps) {
  const { id } = await params;
  const [user, prompt] = await Promise.all([getCurrentUser(), getPromptById(id)]);

  if (!user || !prompt || prompt.userId !== user.id) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="mb-8 rounded-3xl bg-block-cream p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          Edit Prompt
        </p>
        <h1 className="mt-8 text-5xl font-normal leading-none tracking-tight sm:text-6xl">
          Edit prompt kamu.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8">
          Perbarui judul, kategori, tags, isi prompt, atau visibility.
        </p>
      </div>

      <PromptForm prompt={prompt} />
    </section>
  );
}
