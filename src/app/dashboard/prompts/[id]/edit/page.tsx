type EditPromptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPromptPage({ params }: EditPromptPageProps) {
  const { id } = await params;

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="rounded-3xl bg-block-cream p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          Edit Prompt
        </p>
        <h1 className="mt-8 text-5xl font-normal leading-none tracking-tight">
          Form edit untuk prompt {id} akan dibuat di phase CRUD.
        </h1>
      </div>
    </section>
  );
}
