import { PromptForm } from "@/components/prompts/prompt-form";

export default function NewPromptPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
      <div className="mb-8 rounded-3xl bg-block-cream p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">
          Create Prompt
        </p>
        <h1 className="mt-8 text-5xl font-normal leading-none tracking-tight sm:text-6xl">
          Simpan prompt baru ke PromptHub.
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8">
          Prompt otomatis private sampai kamu memilih untuk membagikannya ke
          publik.
        </p>
      </div>

      <PromptForm />
    </section>
  );
}
