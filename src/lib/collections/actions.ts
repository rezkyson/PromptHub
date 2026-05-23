"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/data/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CollectionUpdate } from "@/types/database";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function withMessage(path: string, type: "error" | "message", message: string) {
  const params = new URLSearchParams({ [type]: message });

  return `${path}?${params.toString()}`;
}

function validateCollection(values: { name: string; description: string }) {
  if (values.name.length < 2) {
    return "Nama collection minimal 2 karakter.";
  }

  if (values.name.length > 80) {
    return "Nama collection maksimal 80 karakter.";
  }

  if (values.description.length > 200) {
    return "Deskripsi collection maksimal 200 karakter.";
  }

  return null;
}

export async function createCollectionAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=Silakan login untuk membuat collection.");
  }

  const values = {
    name: readFormValue(formData, "name"),
    description: readFormValue(formData, "description"),
  };
  const validationError = validateCollection(values);

  if (validationError) {
    redirect(withMessage("/dashboard/collections/new", "error", validationError));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("collections").insert({
    description: values.description || null,
    name: values.name,
    user_id: user.id,
  });

  if (error) {
    redirect(
      withMessage(
        "/dashboard/collections/new",
        "error",
        "Collection gagal dibuat. Coba lagi sebentar."
      )
    );
  }

  revalidatePath("/dashboard/collections");
  revalidatePath("/dashboard/prompts/new");

  redirect(
    withMessage(
      "/dashboard/collections",
      "message",
      "Collection berhasil dibuat."
    )
  );
}

export async function updateCollectionAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=Silakan login untuk mengubah collection.");
  }

  const collectionId = readFormValue(formData, "id");
  const values = {
    name: readFormValue(formData, "name"),
    description: readFormValue(formData, "description"),
  };
  const validationError = validateCollection(values);

  if (!collectionId) {
    redirect("/dashboard/collections?error=Collection tidak ditemukan.");
  }

  if (validationError) {
    redirect(
      withMessage(
        `/dashboard/collections/${collectionId}/edit`,
        "error",
        validationError
      )
    );
  }

  const collectionUpdate: CollectionUpdate = {
    description: values.description || null,
    name: values.name,
  };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .update(collectionUpdate)
    .eq("id", collectionId)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      withMessage(
        `/dashboard/collections/${collectionId}/edit`,
        "error",
        "Collection gagal diperbarui atau kamu tidak punya akses."
      )
    );
  }

  revalidatePath("/dashboard/collections");
  revalidatePath(`/dashboard/collections/${collectionId}`);

  redirect(
    withMessage(
      `/dashboard/collections/${collectionId}`,
      "message",
      "Collection berhasil diperbarui."
    )
  );
}

export async function deleteCollectionAction(formData: FormData) {
  const user = await getCurrentUser();
  const collectionId = readFormValue(formData, "id");

  if (!user) {
    redirect("/login?error=Silakan login untuk menghapus collection.");
  }

  if (!collectionId) {
    redirect("/dashboard/collections?error=Collection tidak ditemukan.");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      "/dashboard/collections?error=Collection gagal dihapus atau kamu tidak punya akses."
    );
  }

  revalidatePath("/dashboard/collections");
  revalidatePath("/dashboard/prompts");

  redirect(
    withMessage(
      "/dashboard/collections",
      "message",
      "Collection berhasil dihapus."
    )
  );
}

export async function removePromptFromCollectionAction(formData: FormData) {
  const user = await getCurrentUser();
  const collectionId = readFormValue(formData, "collectionId");
  const promptId = readFormValue(formData, "promptId");

  if (!user) {
    redirect("/login?error=Silakan login untuk mengubah collection.");
  }

  if (!collectionId || !promptId) {
    redirect("/dashboard/collections?error=Prompt atau collection tidak ditemukan.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("id")
    .eq("id", collectionId)
    .eq("user_id", user.id)
    .single();

  if (!collection) {
    redirect("/dashboard/collections?error=Collection tidak ditemukan.");
  }

  const { error } = await supabase
    .from("collection_prompts")
    .delete()
    .eq("collection_id", collectionId)
    .eq("prompt_id", promptId);

  if (error) {
    redirect(
      withMessage(
        `/dashboard/collections/${collectionId}`,
        "error",
        "Prompt gagal dikeluarkan dari collection."
      )
    );
  }

  revalidatePath(`/dashboard/collections/${collectionId}`);

  redirect(
    withMessage(
      `/dashboard/collections/${collectionId}`,
      "message",
      "Prompt berhasil dikeluarkan dari collection."
    )
  );
}
