"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/data/auth";
import {
  checkRateLimit,
  formatRetryMessage,
  getClientIp,
} from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FAVORITE_RATE_LIMIT = {
  limit: 60,
  windowMs: 60 * 1000,
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getSafeReturnPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

function withError(path: string, message: string) {
  const url = new URL(path, "http://localhost");

  url.searchParams.set("error", message);

  return `${url.pathname}${url.search}`;
}

export async function toggleFavoriteAction(formData: FormData) {
  const promptId = readFormValue(formData, "promptId");
  const returnTo = getSafeReturnPath(readFormValue(formData, "returnTo"));
  const isFavorited = readFormValue(formData, "isFavorited") === "true";
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=Silakan login untuk menyimpan favorite.");
  }

  if (!promptId) {
    redirect(withError(returnTo, "Prompt tidak ditemukan."));
  }

  const requestHeaders = await headers();
  const rateLimit = checkRateLimit({
    identifier: `favorite:toggle:${getClientIp(requestHeaders)}:${user.id}`,
    ...FAVORITE_RATE_LIMIT,
  });

  if (!rateLimit.allowed) {
    redirect(
      withError(
        returnTo,
        formatRetryMessage(rateLimit.retryAfterSeconds)
      )
    );
  }

  const supabase = await createSupabaseServerClient();

  if (isFavorited) {
    const { error } = await supabase
      .from("prompt_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("prompt_id", promptId);

    if (error) {
      redirect(withError(returnTo, "Favorite gagal dihapus."));
    }
  } else {
    const { error } = await supabase.from("prompt_favorites").upsert({
      prompt_id: promptId,
      user_id: user.id,
    });

    if (error) {
      redirect(withError(returnTo, "Prompt gagal disimpan ke favorite."));
    }
  }

  revalidatePath(returnTo);
  revalidatePath("/dashboard/favorites");
  revalidatePath(`/prompts/${promptId}`);
}
