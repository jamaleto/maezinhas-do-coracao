"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TABS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inscricoes", label: "Inscrições" },
  { href: "/admin/relatorios", label: "Relatórios" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/logo-maezinhas.jpg" alt="Mãezinhas do Coração" className="w-10 h-10 rounded-full object-cover" />
          <h1 className="text-lg font-semibold">Mãezinhas do Coração — Admin</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/" className="btn btn-ghost">
            Ver landing page
          </Link>
          <button onClick={handleLogout} className="btn btn-ghost">
            Sair
          </button>
        </div>
      </div>

      <div className="flex gap-8 border-b border-line mb-8">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-2 py-4 text-lg font-semibold border-b-[3px] ${
              pathname === t.href
                ? "text-rose-dark border-rose"
                : "text-inksoft border-transparent hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
