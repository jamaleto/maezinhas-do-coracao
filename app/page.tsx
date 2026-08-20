"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const HeartIcon = ({ size = 26, color = "#C6707A" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 27C16 27 4 20.2 4 12.4C4 8.3 7.2 5 11.1 5C13.2 5 15.1 6 16 7.6C16.9 6 18.8 5 20.9 5C24.8 5 28 8.3 28 12.4C28 20.2 16 27 16 27Z"
      fill={color}
    />
  </svg>
);

export default function CadastroPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [regiao, setRegiao] = useState("");

  async function buscarCep(cepDigitado: string) {
    const cep = cepDigitado.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        const ruaBairro = [data.logradouro, data.bairro].filter(Boolean).join(", ");
        if (ruaBairro) setEndereco(ruaBairro);
        if (data.bairro) setRegiao(data.bairro);
      }
    } catch {
      // se a busca falhar, a pessoa preenche o endereço manualmente — sem problema
    } finally {
      setBuscandoCep(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const consentimento = fd.get("consentimento") === "on";
    const cpf = String(fd.get("cpf") || "").trim();
    const rg = String(fd.get("rg") || "").trim();

    if (!consentimento) {
      setStatus("err");
      setErrMsg("É necessário autorizar o uso dos dados para concluir o cadastro.");
      return;
    }

    if (!cpf && !rg) {
      setStatus("err");
      setErrMsg("Informe pelo menos um documento: CPF ou RG.");
      return;
    }

    const payload = {
      p_nome: String(fd.get("nome") || "").trim(),
      p_nascimento: String(fd.get("nascimento") || "") || null,
      p_cpf: cpf || null,
      p_rg: rg || null,
      p_endereco: String(fd.get("endereco") || "").trim() || null,
      p_cep: String(fd.get("cep") || "").trim() || null,
      p_regiao: String(fd.get("regiao") || "").trim(),
      p_email: String(fd.get("email") || "").trim() || null,
      p_tel1: String(fd.get("tel1") || "").trim(),
      p_tel2: String(fd.get("tel2") || "").trim() || null,
      p_tel3: String(fd.get("tel3") || "").trim() || null,
      p_sus: String(fd.get("sus") || "").trim() || null,
      p_posto: String(fd.get("posto") || "").trim() || null,
      p_semanas_gestacao: Number(fd.get("semanas")) || null,
      p_gestacao_risco: String(fd.get("risco") || "") || null,
      p_observacoes: String(fd.get("obs") || "").trim() || null,
      p_quer_kit: fd.get("kit") === "on",
      p_consentimento: true,
    };

    const supabase = createClient();
    const { error } = await supabase.rpc("cadastrar_gestante", payload);

    if (error) {
      setStatus("err");
      setErrMsg("Não foi possível enviar seu cadastro agora. Tente novamente em instantes.");
      return;
    }

    setStatus("ok");
    form.reset();
    setEndereco("");
    setRegiao("");
  }

  return (
    <div>
      {/* TOPBAR */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-line sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <HeartIcon />
          <div>
            <h1 className="text-xl font-semibold">Mãezinhas do Coração</h1>
            <div className="text-[11px] text-inksoft uppercase tracking-wide">
              Cadastro &amp; Entrega de Kits para Gestantes
            </div>
          </div>
        </div>
        <a href="/admin" className="btn btn-teal">
          Painel administrativo
        </a>
      </div>

      {/* HERO */}
      <section className="px-8 pt-16 pb-14">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_.9fr] gap-14 items-center">
          <div>
            <div className="flex items-center gap-2 text-rose-dark font-semibold text-[13px] uppercase tracking-wide mb-4">
              <HeartIcon size={14} color="#A85764" />
              Acolhimento a quem espera
            </div>
            <h2 className="text-4xl md:text-[44px] leading-tight mb-4">
              Um kit de carinho para <span className="text-rose-dark">cada</span> gestante da nossa comunidade.
            </h2>
            <p className="text-lg text-inksoft max-w-md mb-7">
              Cadastre-se para receber seu kit de gestante. É rápido, gratuito e seus dados ficam
              protegidos — usados apenas para organizar a entrega.
            </p>
            <a href="#form" className="btn btn-rose">
              Quero me cadastrar
            </a>
          </div>
          <svg viewBox="0 0 360 320" fill="none" className="w-full max-w-xs mx-auto">
            <circle cx="180" cy="160" r="150" fill="#F4E4E4" />
            <path
              d="M180 210C180 210 110 168 110 122C110 98 128 80 151 80C164 80 176 87 180 97C184 87 196 80 209 80C232 80 250 98 250 122C250 168 180 210 180 210Z"
              fill="#C6707A"
            />
            <rect x="140" y="220" width="80" height="60" rx="8" fill="#2F6F62" />
            <path d="M140 236H220" stroke="#E1EEE9" strokeWidth="3" />
            <circle cx="180" cy="252" r="10" fill="#D9A441" />
          </svg>
        </div>
      </section>

      {/* STEPS */}
      <section className="px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl text-center mb-9">Como funciona</h3>
          <div className="grid md:grid-cols-3 gap-7">
            {[
              ["1", "Você se cadastra", "Preencha o formulário abaixo com seus dados e informações da gestação."],
              ["2", "Confirmamos no posto", "Cruzamos seu cadastro com a unidade de saúde informada."],
              ["3", "Você retira o kit", "Avisaremos quando e onde retirar seu kit de gestante."],
            ].map(([n, t, d]) => (
              <div key={n} className="card p-6 text-center">
                <div className="w-11 h-11 mx-auto mb-3.5 rounded-full bg-rose-tint flex items-center justify-center text-rose-dark font-display font-semibold">
                  {n}
                </div>
                <h4 className="text-base font-semibold mb-2">{t}</h4>
                <p className="text-sm text-inksoft">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="px-8 pb-20" id="form">
        <div className="max-w-2xl mx-auto card p-8 md:p-11 shadow-[0_8px_30px_rgba(58,42,51,0.08)]">
          <h3 className="text-2xl mb-1.5">Formulário de cadastro</h3>
          <p className="text-sm text-inksoft mb-7">
            Campos com <span className="text-rose-dark">*</span> são obrigatórios.
          </p>

          {status === "ok" && (
            <div className="p-3.5 rounded-lg bg-teal-tint text-teal-dark text-sm mb-5">
              Cadastro enviado com sucesso! Em breve entraremos em contato sobre a retirada do kit.
            </div>
          )}
          {status === "err" && (
            <div className="p-3.5 rounded-lg bg-[#FBE4E4] text-[#A03A3A] text-sm mb-5">{errMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="border border-line rounded-lg p-4">
              <legend className="text-[13px] font-semibold px-1.5">Dados pessoais</legend>
              <div className="mb-4">
                <label className="label">Nome completo *</label>
                <input name="nome" required className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Data de nascimento *</label>
                  <input name="nascimento" type="date" required className="input" />
                </div>
                <div>
                  <label className="label">E-mail (opcional)</label>
                  <input name="email" type="email" className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">CPF (opcional)</label>
                  <input name="cpf" placeholder="000.000.000-00" className="input" />
                </div>
                <div>
                  <label className="label">RG (opcional)</label>
                  <input name="rg" placeholder="00.000.000-0" className="input" />
                </div>
              </div>
              <p className="text-xs text-inksoft -mt-2 mb-4">
                Informe pelo menos um documento: CPF ou RG.
              </p>
              <div className="mb-4">
                <label className="label">CEP (opcional)</label>
                <input
                  name="cep"
                  placeholder="00000-000"
                  className="input max-w-[180px]"
                  onBlur={(e) => buscarCep(e.target.value)}
                />
                {buscandoCep && <p className="text-xs text-inksoft mt-1.5">Buscando endereço...</p>}
              </div>
              <div className="mb-4">
                <label className="label">Endereço (opcional)</label>
                <input
                  name="endereco"
                  placeholder="Rua, número, complemento"
                  className="input"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Bairro / Região *</label>
                <input
                  name="regiao"
                  required
                  className="input"
                  value={regiao}
                  onChange={(e) => setRegiao(e.target.value)}
                />
              </div>
            </fieldset>

            <fieldset className="border border-line rounded-lg p-4">
              <legend className="text-[13px] font-semibold px-1.5">Contato (até 3 números)</legend>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Telefone 1 *</label>
                  <input name="tel1" required placeholder="(00) 00000-0000" className="input" />
                </div>
                <div>
                  <label className="label">Telefone 2 (opcional)</label>
                  <input name="tel2" placeholder="(00) 00000-0000" className="input" />
                </div>
              </div>
              <div>
                <label className="label">Telefone 3 (opcional)</label>
                <input name="tel3" placeholder="(00) 00000-0000" className="input" />
              </div>
            </fieldset>

            <fieldset className="border border-line rounded-lg p-4">
              <legend className="text-[13px] font-semibold px-1.5">Dados de saúde / gestação</legend>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Número do Cartão SUS (opcional)</label>
                  <input name="sus" className="input" />
                </div>
                <div>
                  <label className="label">Posto de saúde / UBS (opcional)</label>
                  <input name="posto" className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Tempo de gestação (semanas) *</label>
                  <input name="semanas" type="number" min={1} max={42} required className="input" />
                </div>
                <div>
                  <label className="label">Gestação de risco (opcional)</label>
                  <select name="risco" className="input">
                    <option value="">Não informado</option>
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Observações (alergias, necessidades especiais, etc.)</label>
                <textarea name="obs" className="input min-h-[70px]" />
              </div>
            </fieldset>

            <label className="flex items-start gap-2.5 text-sm text-inksoft">
              <input type="checkbox" name="kit" className="mt-1 accent-teal" />
              Quero receber o kit de gestante
            </label>

            <div className="bg-teal-tint rounded-lg p-4">
              <p className="text-[13px] text-inksoft mb-3 max-h-32 overflow-y-auto pr-1.5">
                Ao marcar a caixa abaixo, autorizo o projeto <b>Mãezinhas do Coração</b> a armazenar e
                tratar meus dados pessoais e de saúde informados neste formulário, com a finalidade
                exclusiva de viabilizar meu cadastro e a entrega do kit de gestante. Meus dados não
                serão compartilhados com terceiros para fins comerciais e poderei solicitar a correção
                ou exclusão do meu cadastro a qualquer momento, entrando em contato com a equipe
                responsável, nos termos da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
              <label className="flex items-start gap-2.5 text-[13.5px]">
                <input type="checkbox" name="consentimento" required className="mt-0.5 accent-teal" />
                <span>
                  <b>Li e autorizo</b> o armazenamento dos meus dados conforme descrito acima.{" "}
                  <span className="text-rose-dark">*</span>
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={status === "sending"} className="btn btn-rose disabled:opacity-60">
                {status === "sending" ? "Enviando..." : "Enviar cadastro"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="px-8 py-7 text-center text-inksoft text-sm border-t border-line">
        Mãezinhas do Coração — cadastro e entrega de kits para gestantes.
      </footer>

      <style jsx global>{`
        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }
      `}</style>
    </div>
  );
}
