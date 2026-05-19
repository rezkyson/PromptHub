"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/auth/submit-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PROMPT_CATEGORIES } from "@/lib/constants/prompts";
import { initialPromptActionState } from "@/lib/prompts/form-state";
import {
  createPromptAction,
  updatePromptAction,
} from "@/lib/prompts/actions";
import type { Prompt } from "@/types/prompt";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

type PromptFormProps = {
  prompt?: Prompt;
};

export function PromptForm({ prompt }: PromptFormProps) {
  const isEditMode = Boolean(prompt);
  const [state, formAction] = useActionState(
    isEditMode ? updatePromptAction : createPromptAction,
    initialPromptActionState
  );
  const defaultValues = {
    title: state.values?.title ?? prompt?.title,
    description: state.values?.description ?? prompt?.description ?? "",
    category: state.values?.category ?? prompt?.category ?? "",
    tags: state.values?.tags ?? prompt?.tags.join(", ") ?? "",
    content: state.values?.content ?? prompt?.content,
    visibility: state.values?.visibility ?? prompt?.visibility ?? "private",
  };

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border bg-card p-6 text-card-foreground sm:p-8"
    >
      {prompt ? <input name="id" type="hidden" value={prompt.id} /> : null}

      {state.message ? (
        <div className="rounded-2xl bg-block-coral px-4 py-3 text-sm" role="alert">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            defaultValue={defaultValues.title}
            id="title"
            maxLength={100}
            minLength={3}
            name="title"
            placeholder="Contoh: Prompt audit kode React"
            required
          />
          <FieldError message={state.errors?.title} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            defaultValue={defaultValues.description}
            id="description"
            maxLength={300}
            name="description"
            placeholder="Ringkasan singkat agar prompt mudah dikenali."
          />
          <FieldError message={state.errors?.description} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <select
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue={defaultValues.category}
            id="category"
            name="category"
            required
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {PROMPT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <FieldError message={state.errors?.category} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <select
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue={defaultValues.visibility}
            id="visibility"
            name="visibility"
            required
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <FieldError message={state.errors?.visibility} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            defaultValue={defaultValues.tags}
            id="tags"
            name="tags"
            placeholder="coding, review, react"
          />
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Pisahkan dengan koma</Badge>
            <Badge variant="outline">Maksimal 5 tags</Badge>
            <Badge variant="outline">30 karakter per tag</Badge>
          </div>
          <FieldError message={state.errors?.tags} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="content">Isi prompt</Label>
          <Textarea
            className="min-h-56 font-mono text-sm"
            defaultValue={defaultValues.content}
            id="content"
            maxLength={10000}
            minLength={10}
            name="content"
            placeholder="Tulis atau paste prompt lengkap di sini."
            required
          />
          <FieldError message={state.errors?.content} />
        </div>
      </div>

      <SubmitButton pendingLabel="Menyimpan...">
        {isEditMode ? "Simpan perubahan" : "Simpan prompt"}
      </SubmitButton>
    </form>
  );
}
