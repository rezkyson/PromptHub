"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function getRequiredFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function withMessage(path: string, type: "error" | "message", message: string) {
  const params = new URLSearchParams({ [type]: message });

  return `${path}?${params.toString()}`;
}

export async function loginAction(formData: FormData) {
  const email = getRequiredFormValue(formData, "email");
  const password = getRequiredFormValue(formData, "password");

  if (!email || !password) {
    redirect(withMessage("/login", "error", "Email dan password wajib diisi."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      withMessage("/login", "error", "Email atau password tidak valid.")
    );
  }

  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const email = getRequiredFormValue(formData, "email");
  const password = getRequiredFormValue(formData, "password");

  if (!email || !password) {
    redirect(
      withMessage("/register", "error", "Email dan password wajib diisi.")
    );
  }

  if (password.length < 6) {
    redirect(
      withMessage("/register", "error", "Password minimal 6 karakter.")
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(
      withMessage(
        "/register",
        "error",
        "Register gagal. Cek email/password atau coba lagi."
      )
    );
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect(
    withMessage(
      "/login",
      "message",
      "Akun berhasil dibuat. Jika email confirmation aktif, cek inbox sebelum login."
    )
  );
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect("/login");
}
