import { createBrowserClient } from "@supabase/ssr";

// Valores padrão do projeto Supabase do Mãezinhas do Coração.
// Podem ser sobrescritos por variáveis de ambiente, se preferir configurá-las na Vercel.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lmwjvfmkveesqubulrae.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtd2p2Zm1rdmVlc3F1YnVscmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTgxNTQsImV4cCI6MjEwMjgzNDE1NH0.ttiiyLBuCrkROy2CXUo9KtM2e8JKSbYza9LZT3fDcTc";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
