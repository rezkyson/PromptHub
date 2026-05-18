type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function readEnv(name: string) {
  return process.env[name]?.trim();
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL belum diisi.");
  }

  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi.");
  }

  return { url, anonKey };
}
