"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentProfile, getCurrentUser } from "@/lib/data/auth";
import {
  checkRateLimit,
  formatRetryMessage,
  getClientIp,
} from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileUpdate } from "@/types/database";

const PROFILE_RATE_LIMIT = {
  limit: 20,
  windowMs: 60 * 60 * 1000,
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function withMessage(path: string, type: "error" | "message", message: string) {
  const params = new URLSearchParams({ [type]: message });

  return `${path}?${params.toString()}`;
}

function validateUsername(username: string) {
  if (username.length < 3) {
    return "Username minimal 3 karakter.";
  }

  if (username.length > 40) {
    return "Username maksimal 40 karakter.";
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return "Username hanya boleh huruf kecil, angka, dan underscore.";
  }

  return null;
}

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=Silakan login untuk mengubah profile.");
  }

  const requestHeaders = await headers();
  const rateLimit = checkRateLimit({
    identifier: `profile:update:${getClientIp(requestHeaders)}:${user.id}`,
    ...PROFILE_RATE_LIMIT,
  });

  if (!rateLimit.allowed) {
    redirect(
      withMessage(
        "/settings",
        "error",
        formatRetryMessage(rateLimit.retryAfterSeconds)
      )
    );
  }

  const currentProfile = await getCurrentProfile();
  const username = readFormValue(formData, "username").toLowerCase();
  const displayName = readFormValue(formData, "displayName");
  const bio = readFormValue(formData, "bio");
  const usernameError = validateUsername(username);

  if (usernameError) {
    redirect(withMessage("/settings", "error", usernameError));
  }

  if (displayName.length > 80) {
    redirect(
      withMessage("/settings", "error", "Nama tampilan maksimal 80 karakter.")
    );
  }

  if (bio.length > 300) {
    redirect(withMessage("/settings", "error", "Bio maksimal 300 karakter."));
  }

  const profileUpdate: ProfileUpdate = {
    bio: bio || null,
    display_name: displayName || null,
    username,
  };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        ...profileUpdate,
      },
      { onConflict: "id" }
    );

  if (error?.code === "23505") {
    redirect(
      withMessage("/settings", "error", "Username sudah dipakai pengguna lain.")
    );
  }

  if (error) {
    redirect(
      withMessage(
        "/settings",
        "error",
        "Profile gagal diperbarui. Coba lagi sebentar."
      )
    );
  }

  revalidatePath("/settings");

  if (currentProfile?.username) {
    revalidatePath(`/profile/${currentProfile.username}`);
  }

  revalidatePath(`/profile/${username}`);

  redirect(withMessage("/settings", "message", "Profile berhasil diperbarui."));
}
