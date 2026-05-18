"use server";

import { redirect } from "next/navigation";

import { DEFAULT_PROMPT_VISIBILITY } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { toPromptInsert } from "@/lib/data/prompts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validatePromptForm } from "@/lib/validators/prompt";
import type { PromptCategory, PromptVisibility } from "@/types/prompt";

export type CreatePromptState = {
  status: "idle" | "error";
  message?: string;
  errors?: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string;
    content?: string;
    visibility?: string;
  };
  values?: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string;
    content?: string;
    visibility?: string;
  };
};

export const initialCreatePromptState: CreatePromptState = {
  status: "idle",
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function createPromptAction(
  _state: CreatePromptState,
  formData: FormData
): Promise<CreatePromptState> {
  const values = {
    title: readFormValue(formData, "title"),
    description: readFormValue(formData, "description"),
    category: readFormValue(formData, "category") as PromptCategory | "",
    tags: readFormValue(formData, "tags"),
    content: readFormValue(formData, "content"),
    visibility:
      (readFormValue(formData, "visibility") as PromptVisibility) ||
      DEFAULT_PROMPT_VISIBILITY,
  };
  const validation = validatePromptForm(values);

  if (!validation.isValid) {
    return {
      status: "error",
      message: "Periksa lagi field yang belum sesuai.",
      errors: validation.errors,
      values,
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=Silakan login untuk membuat prompt.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("prompts").insert(toPromptInsert(user.id, values));

  if (error) {
    return {
      status: "error",
      message: "Prompt gagal disimpan. Coba lagi sebentar.",
      values,
    };
  }

  redirect("/dashboard/prompts?message=Prompt berhasil dibuat.");
}
