"use server";

import { redirect } from "next/navigation";

import { DEFAULT_PROMPT_VISIBILITY } from "@/lib/constants/prompts";
import { getCurrentUser } from "@/lib/data/auth";
import { toPromptInsert, toPromptUpdate } from "@/lib/data/prompts";
import type { PromptActionState } from "@/lib/prompts/form-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validatePromptForm } from "@/lib/validators/prompt";
import type { PromptCategory, PromptVisibility } from "@/types/prompt";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function createPromptAction(
  _state: PromptActionState,
  formData: FormData
): Promise<PromptActionState> {
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

export async function updatePromptAction(
  _state: PromptActionState,
  formData: FormData
): Promise<PromptActionState> {
  const promptId = readFormValue(formData, "id");
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

  if (!promptId) {
    return {
      status: "error",
      message: "Prompt tidak ditemukan.",
      values,
    };
  }

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
    redirect("/login?error=Silakan login untuk mengedit prompt.");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .update(toPromptUpdate(values))
    .eq("id", promptId)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error || !data) {
    return {
      status: "error",
      message: "Prompt gagal diperbarui atau kamu tidak punya akses.",
      values,
    };
  }

  redirect("/dashboard/prompts?message=Prompt berhasil diperbarui.");
}

export async function deletePromptAction(formData: FormData) {
  const promptId = readFormValue(formData, "id");

  if (!promptId) {
    redirect("/dashboard/prompts?error=Prompt tidak ditemukan.");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=Silakan login untuk menghapus prompt.");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompts")
    .delete()
    .eq("id", promptId)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      "/dashboard/prompts?error=Prompt gagal dihapus atau kamu tidak punya akses."
    );
  }

  redirect("/dashboard/prompts?message=Prompt berhasil dihapus.");
}
