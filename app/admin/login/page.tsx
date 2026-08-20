"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// E-mail fixo usado internamente para o login do painel — quem opera só digita a senha.
// Troque aqui se quiser usar outro e-mail (precisa ser o mesmo cadastrado no Supabase).
const ADMIN_EMAIL = "admin@maezinhasdocoracao.org";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Senha incorreta. Tente novamente.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card p-9 max-w-sm w-full text-center shadow-[0_8px_30px_rgba(58,42,51,0.08)]">
        <svg width="36" height="36" viewBox="0 0 32 32" fill="none" className="mx-auto mb-3">
          <path
            d="M16 27C16 27 4 20.2 4 12.4C4 8.3 7.2 5 11.1 5C13.2 5 15.1 6 16 7.6C16.9 6 18.8 5 20.9 5C24.8 5 28 8.3 28 12.4C28 20.2 16 27 16 27Z"
            fill="#2F6F62"
          />
        </svg>
        <h3 className="text-xl mb-1">Painel administrativo</h3>
        <p className="text-inksoft text-[13.5px] mb-5">Digite a senha para entrar.</p>

        {error && (
          <div className="p-3 rounded-lg bg-[#FBE4E4] text-[#A03A3A] text-sm mb-4 text-left">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5 text-left">
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">Senha</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input text-lg tracking-wide"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-teal w-full disabled:opacity-60 !text-base !py-3">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
