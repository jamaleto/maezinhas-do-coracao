"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Gestante } from "@/lib/types";

export default function InscricoesPage() {
  const [registros, setRegistros] = useState<Gestante[] | null>(null);
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  async function carregar() {
    const { data } = await supabase.from("gestantes").select("*").order("nome");
    setRegistros((data as Gestante[]) || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function marcarEntregue(id: string) {
    const { error } = await supabase
      .from("gestantes")
      .update({ kit_entregue: true, kit_entregue_em: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Não foi possível salvar. Tente novamente.");
      return;
    }
    carregar();
  }

  if (registros === null) {
    return <div className="text-center py-14 text-inksoft">Carregando dados...</div>;
  }

  const filtrados = busca.trim()
    ? registros.filter((r) => r.nome.toLowerCase().includes(busca.trim().toLowerCase()))
    : registros;

  return (
    <div className="card p-6">
      <input
        placeholder="Buscar por nome..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="input mb-5"
      />

      {!filtrados.length ? (
        <div className="text-center py-12 text-inksoft">Nenhuma inscrição encontrada.</div>
      ) : (
        <table className="w-full text-[13.5px] border-collapse">
          <thead>
            <tr className="text-left">
              {["Nome", "Região", "Posto", "Telefone", "Gestação", "Kit", "Ações"].map((h) => (
                <th
                  key={h}
                  className="text-inksoft font-semibold text-[12px] uppercase tracking-wide pb-2.5 border-b-[1.5px] border-line px-2"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((r) => (
              <>
                <tr key={r.id} className="border-b border-line">
                  <td className="p-3">{r.nome}</td>
                  <td className="p-3">{r.regiao}</td>
                  <td className="p-3">{r.posto || "—"}</td>
                  <td className="p-3">{r.tel1}</td>
                  <td className="p-3">{r.semanas_gestacao ?? "—"} sem.</td>
                  <td className="p-3">
                    {r.kit_entregue ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-tint text-teal-dark">
                        Entregue
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FBE9D6] text-[#946B1F]">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <button
                      onClick={() => setAberto(aberto === r.id ? null : r.id)}
                      className="btn btn-ghost !text-xs !py-1.5 !px-3 mr-2"
                    >
                      Detalhes
                    </button>
                    {!r.kit_entregue && (
                      <button
                        onClick={() => marcarEntregue(r.id)}
                        className="btn btn-teal !text-xs !py-1.5 !px-3"
                      >
                        Marcar entregue
                      </button>
                    )}
                  </td>
                </tr>
                {aberto === r.id && (
                  <tr className="bg-[#FCF9F6]">
                    <td colSpan={7} className="p-4 text-[13px] text-inksoft">
                      <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
                        <div><b className="block text-[11px] uppercase text-ink">CPF</b>{r.cpf || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">RG</b>{r.rg || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Nascimento</b>{r.nascimento || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Cartão SUS</b>{r.sus || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">CEP</b>{r.cep || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Endereço</b>{r.endereco || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">E-mail</b>{r.email || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Telefone 2</b>{r.tel2 || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Telefone 3</b>{r.tel3 || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Gestação de risco</b>{r.gestacao_risco === "sim" ? "Sim" : r.gestacao_risco === "nao" ? "Não" : "Não informado"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Quer kit</b>{r.quer_kit ? "Sim" : "Não"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Observações</b>{r.observacoes || "—"}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Cadastrado em</b>{new Date(r.criado_em).toLocaleString("pt-BR")}</div>
                        <div><b className="block text-[11px] uppercase text-ink">Entrega do kit</b>{r.kit_entregue ? `Entregue em ${new Date(r.kit_entregue_em!).toLocaleString("pt-BR")}` : "Pendente"}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
