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

  async function marcarAgendado(id: string) {
    const { error } = await supabase
      .from("gestantes")
      .update({ kit_agendado: true, kit_agendado_em: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Não foi possível salvar. Tente novamente.");
      return;
    }
    carregar();
  }

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
        <table className="w-full text-base border-collapse">
          <thead>
            <tr className="text-left">
              {["Nome", "Região", "Posto", "Telefone", "Gestação", "Kit", "Ações"].map((h) => (
                <th
                  key={h}
                  className="text-inksoft font-semibold text-[13px] uppercase tracking-wide pb-3 border-b-[1.5px] border-line px-3"
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
                  <td className="p-4">{r.nome}</td>
                  <td className="p-4">{r.regiao}</td>
                  <td className="p-4">{r.posto || "—"}</td>
                  <td className="p-4">{r.tel1}</td>
                  <td className="p-4">{r.semanas_gestacao ?? "—"} sem.</td>
                  <td className="p-4">
                    {r.kit_entregue ? (
                      <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-teal-tint text-teal-dark">
                        Entregue
                      </span>
                    ) : r.kit_agendado ? (
                      <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[#FBEDD3] text-[#8A5E13]">
                        Agendado
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-[#EFE9E7] text-[#7A6670]">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setAberto(aberto === r.id ? null : r.id)}
                        className="btn btn-ghost !text-sm !py-2 !px-4"
                      >
                        Detalhes
                      </button>
                      {!r.kit_agendado && !r.kit_entregue && (
                        <button
                          onClick={() => marcarAgendado(r.id)}
                          className="btn btn-gold !text-sm !py-2 !px-4"
                        >
                          Marcar agendado
                        </button>
                      )}
                      {!r.kit_entregue && (
                        <button
                          onClick={() => marcarEntregue(r.id)}
                          className="btn btn-teal !text-sm !py-2 !px-4"
                        >
                          Marcar entregue
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {aberto === r.id && (
                  <tr className="bg-[#FCF9F6]">
                    <td colSpan={7} className="p-5 text-[13px] text-inksoft">
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
                        <div><b className="block text-[11px] uppercase text-ink">Agendamento</b>{r.kit_agendado ? `Agendado em ${new Date(r.kit_agendado_em!).toLocaleString("pt-BR")}` : "Não agendado"}</div>
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
