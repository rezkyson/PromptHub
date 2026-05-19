import { readFileSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const protectedPaths = ["/dashboard", "/dashboard/prompts", "/settings"];

function readEnvFile(path) {
  try {
    return Object.fromEntries(
      readFileSync(path, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const index = line.indexOf("=");
          return [
            line.slice(0, index),
            line.slice(index + 1).replace(/^['"]|['"]$/g, ""),
          ];
        }),
    );
  } catch {
    return {};
  }
}

function printResult(name, passed, detail = "") {
  const status = passed ? "PASS" : "FAIL";
  console.log(`${status} ${name}${detail ? ` (${detail})` : ""}`);
}

async function checkRouteRedirects(baseUrl) {
  const results = [];

  for (const path of protectedPaths) {
    const response = await fetch(new URL(path, baseUrl), {
      method: "HEAD",
      redirect: "manual",
    });
    const location = response.headers.get("location") ?? "";
    results.push({
      name: `guest ${path} redirects to login`,
      passed: response.status === 307 && location.startsWith("/login"),
      detail: `${response.status} ${location}`,
    });
  }

  const loginResponse = await fetch(new URL("/login", baseUrl), {
    method: "HEAD",
    redirect: "manual",
  });
  results.push({
    name: "guest can open login",
    passed: loginResponse.status === 200,
    detail: String(loginResponse.status),
  });

  return results;
}

async function checkSupabaseRls(url, anonKey) {
  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false },
  });

  const publicPrompts = await supabase
    .from("prompts")
    .select("id")
    .eq("visibility", "public")
    .limit(1);
  const profiles = await supabase.from("profiles").select("id").limit(1);
  const insert = await supabase.from("prompts").insert({
    user_id: "00000000-0000-0000-0000-000000000000",
    title: "Anon Block Test",
    category: "Other",
    content: "This insert should be blocked by RLS.",
    visibility: "public",
  });
  const update = await supabase
    .from("prompts")
    .update({ title: "Anon Update Test" })
    .eq("id", "00000000-0000-0000-0000-000000000000")
    .select("id");
  const deleted = await supabase
    .from("prompts")
    .delete()
    .eq("id", "00000000-0000-0000-0000-000000000000")
    .select("id");

  return [
    {
      name: "anon can read public prompts",
      passed: !publicPrompts.error,
      detail: publicPrompts.error?.code ?? "ok",
    },
    {
      name: "anon can read profiles",
      passed: !profiles.error,
      detail: profiles.error?.code ?? "ok",
    },
    {
      name: "anon prompt insert is blocked",
      passed: insert.error?.code === "42501",
      detail: insert.error?.code ?? "unexpected ok",
    },
    {
      name: "anon prompt update is blocked or returns no rows",
      passed: Boolean(update.error) || update.data?.length === 0,
      detail: update.error?.code ?? `rows:${update.data?.length ?? "unknown"}`,
    },
    {
      name: "anon prompt delete is blocked or returns no rows",
      passed: Boolean(deleted.error) || deleted.data?.length === 0,
      detail:
        deleted.error?.code ?? `rows:${deleted.data?.length ?? "unknown"}`,
    },
  ];
}

async function main() {
  const envFile = readEnvFile(".env.local");
  const env = { ...envFile, ...process.env };
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? DEFAULT_BASE_URL;
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceRole =
    "SUPABASE_SERVICE_ROLE_KEY" in env ||
    "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY" in env;

  const results = [
    {
      name: "Supabase public URL is configured",
      passed: Boolean(supabaseUrl),
    },
    {
      name: "Supabase anon key is configured",
      passed: Boolean(supabaseAnonKey),
    },
    {
      name: "service role key is not exposed in local env",
      passed: !hasServiceRole,
    },
  ];

  results.push(...(await checkRouteRedirects(baseUrl)));

  if (supabaseUrl && supabaseAnonKey) {
    results.push(...(await checkSupabaseRls(supabaseUrl, supabaseAnonKey)));
  }

  let failed = false;
  for (const result of results) {
    printResult(result.name, result.passed, result.detail);
    failed ||= !result.passed;
  }

  if (failed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
