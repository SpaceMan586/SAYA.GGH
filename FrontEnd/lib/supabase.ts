import { createClient } from "@supabase/supabase-js";

const requireEnv = (name: string, value: string | undefined) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Use direct property access so Next.js can inline NEXT_PUBLIC_* values in client bundles.
const supabaseUrl = requireEnv(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);
const supabaseKey = requireEnv(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const supabase = createClient(supabaseUrl, supabaseKey);
