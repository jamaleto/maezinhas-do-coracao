"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Gestante } from "@/lib/types";

function RankRow({ nome, count, max, color }: { nome: string; count: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-2.5 text-[13.5px]">
      <div className="w-36 shrink-0 text-inksoft truncate">{nome}</div>
      <div className="flex-1 bg-rose-tint rounded h-2.5 overflow-hidden">
        <div className="h-full rounded" style={{ width: `${(count / max) * 100}%`, background: color }} />
      </div>
      <div className="w-8 text-right font-semibold">{count}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [registros, setRegistros] = useState<Gestante[] | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("gestantes").select("*");
      setRegistros((data as Gestante[]) || []);
    })();
  }, []);

  if (registros === null) {
    return <div className="text-center py-14 text-inksoft">Carregando dados...</div>;
  }

  const total = registros.length;
  const entregues = registros.filter((r) => r.kit_entregue).length;
  const pendentes = total - entregues;
  const pct = total ? Math.round((entregues / total) * 100) : 0;

  const byRegiao: Record<string, number> = {};
  registros.forEach((r) => {
    if (r.kit_entregue) {
      const k = r.regiao || "Não informado";
      byRegiao[k] = (byRegiao[k] || 0) + 1;
    }
  });
  const regRank = Object.entries(byRegiao).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxReg = regRank.length ? regRank[0][1] : 1;

  const byPosto: Record<string, number> = {};
  registros.forEach((r) => {
    const k = r.posto || "Não informado";
    byPosto[k] = (byPosto[k] || 0) + 1;
  });
  const postoRank = Object.entries(byPosto).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxPosto = postoRank.length ? postoRank[0][1] : 1;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          [total, "Inscritas no total"],
          [entregues, "Kits entregues"],
          [pendentes, "Kits pendentes"],
          [`${pct}%`, "Taxa de entrega"],
        ].map(([num, label]) => (
          <div key={label as string} className="card p-5">
            <div className="font-display text-3xl font-semibold text-teal-dark">{num}</div>
            <div className="text-[13px] text-inksoft mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="card p-6 mb-6">
        <h4 className="text-base font-semibold mb-4">Regiões com maior retirada de kit</h4>
        {regRank.length ? (
          regRank.map(([nome, count]) => (
            <RankRow key={nome} nome={nome} count={count} max={maxReg} color="#C6707A" />
          ))
        ) : (
          <div className="text-center py-8 text-inksoft">Nenhum kit entregue ainda.</div>
        )}
      </div>

      <div className="card p-6">
        <h4 className="text-base font-semibold mb-4">Inscrições por posto de saúde</h4>
        {postoRank.length ? (
          postoRank.map(([nome, count]) => (
            <RankRow key={nome} nome={nome} count={count} max={maxPosto} color="#2F6F62" />
          ))
        ) : (
          <div className="text-center py-8 text-inksoft">Nenhuma inscrição ainda.</div>
        )}
      </div>
    </div>
  );
}
