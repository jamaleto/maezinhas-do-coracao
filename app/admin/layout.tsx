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
        <div className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 27C16 27 4 20.2 4 12.4C4 8.3 7.2 5 11.1 5C13.2 5 15.1 6 16 7.6C16.9 6 18.8 5 20.9 5C24.8 5 28 8.3 28 12.4C28 20.2 16 27 16 27Z"
              fill="#C6707A"
            />
          </svg>
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

      <div className="flex gap-1.5 border-b border-line mb-7">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4.5 py-3 text-sm font-semibold border-b-2 ${
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
