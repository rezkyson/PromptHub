"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  checkRateLimit,
  formatRetryMessage,
  getClientIp,
} from "@/lib/security/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MIN_PASSWORD_LENGTH = 8;
const LOGIN_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
};
const REGISTER_RATE_LIMIT = {
  limit: 3,
  windowMs: 60 * 60 * 1000,
};

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

async function getRateLimitIdentifier(action: string, email: string) {
  const requestHeaders = await headers();
  const clientIp = getClientIp(requestHeaders);
  const normalizedEmail = email.toLowerCase();

  return `${action}:${clientIp}:${normalizedEmail}`;
}

export async function loginAction(formData: FormData) {
  const email = getRequiredFormValue(formData, "email");
  const password = getRequiredFormValue(formData, "password");

  if (!email || !password) {
    redirect(withMessage("/login", "error", "Email dan password wajib diisi."));
  }

  const rateLimit = checkRateLimit({
    identifier: await getRateLimitIdentifier("login", email),
    ...LOGIN_RATE_LIMIT,
  });

  if (!rateLimit.allowed) {
    redirect(
      withMessage(
        "/login",
        "error",
        formatRetryMessage(rateLimit.retryAfterSeconds)
      )
    );
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

  if (password.length < MIN_PASSWORD_LENGTH) {
    redirect(
      withMessage(
        "/register",
        "error",
        `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`
      )
    );
  }

  const rateLimit = checkRateLimit({
    identifier: await getRateLimitIdentifier("register", email),
    ...REGISTER_RATE_LIMIT,
  });

  if (!rateLimit.allowed) {
    redirect(
      withMessage(
        "/register",
        "error",
        formatRetryMessage(rateLimit.retryAfterSeconds)
      )
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
