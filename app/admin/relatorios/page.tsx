"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Gestante } from "@/lib/types";

export default function RelatoriosPage() {
  const [registros, setRegistros] = useState<Gestante[] | null>(null);
  const [regiaoF, setRegiaoF] = useState("");
  const [statusF, setStatusF] = useState("");
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("gestantes").select("*");
      setRegistros((data as Gestante[]) || []);
    })();
  }, []);

  if (registros === null) {
    return <div className="text-center py-14 text-inksoft">Carregando dados...</div>;
  }

  const total = registros.length;
  const entregues = registros.filter((r) => r.kit_entregue).length;
  const regioes = [...new Set(registros.map((r) => r.regiao).filter(Boolean))].sort();

  function exportCSV() {
    const rows = registros!.filter((r) => {
      if (regiaoF && r.regiao !== regiaoF) return false;
      if (statusF === "entregue" && !r.kit_entregue) return false;
      if (statusF === "pendente" && r.kit_entregue) return false;
      return true;
    });

    const headers = [
      "Nome", "CPF", "RG", "Nascimento", "CEP", "Endereco", "Regiao", "Telefone1", "Telefone2", "Telefone3",
      "Email", "CartaoSUS", "Posto", "SemanasGestacao", "GestacaoRisco", "QuerKit",
      "KitEntregue", "DataEntrega", "CadastradoEm",
    ];
    const csvRows = [headers.join(";")];

    rows.forEach((r) => {
      const line = [
        r.nome, r.cpf, r.rg, r.nascimento, r.cep, r.endereco, r.regiao, r.tel1, r.tel2, r.tel3, r.email,
        r.sus, r.posto, r.semanas_gestacao, r.gestacao_risco, r.quer_kit ? "Sim" : "Nao",
        r.kit_entregue ? "Sim" : "Nao",
        r.kit_entregue_em ? new Date(r.kit_entregue_em).toLocaleDateString("pt-BR") : "",
        new Date(r.criado_em).toLocaleDateString("pt-BR"),
      ].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`);
      csvRows.push(line.join(";"));
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-maezinhas-do-coracao-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card p-6">
      <h4 className="text-base font-semibold mb-1.5">Exportar relatório para prestação de contas</h4>
      <p className="text-[13.5px] text-inksoft mb-5">
        {total} inscrições registradas · {entregues} kits entregues até o momento.
      </p>

      <div className="flex gap-3 flex-wrap mb-5">
        <select value={regiaoF} onChange={(e) => setRegiaoF(e.target.value)} className="input max-w-[220px]">
          <option value="">Todas as regiões</option>
          {regioes.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="input max-w-[220px]">
          <option value="">Todos os status</option>
          <option value="entregue">Somente entregues</option>
          <option value="pendente">Somente pendentes</option>
        </select>
      </div>

      <button onClick={exportCSV} className="btn btn-teal">
        Baixar relatório (CSV)
      </button>
    </div>
  );
}
