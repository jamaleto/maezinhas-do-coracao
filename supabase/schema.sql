-- Execute este script no SQL Editor do seu projeto Supabase
-- (Supabase Dashboard > SQL Editor > New query > colar e rodar)
--
-- ATENÇÃO: se você JÁ rodou uma versão anterior deste schema e a tabela
-- "gestantes" já existe, NÃO rode o "create table" abaixo de novo.
-- Rode só este bloco de migração e pule para a seção de POLÍTICAS mais abaixo:
--
--   alter table public.gestantes add column if not exists rg text;
--   alter table public.gestantes add column if not exists cep text;
--   alter table public.gestantes alter column cpf drop not null;
--   alter table public.gestantes alter column sus drop not null;
--   alter table public.gestantes alter column posto drop not null;
--   alter table public.gestantes add constraint cpf_ou_rg check (cpf is not null or rg is not null);

create table if not exists public.gestantes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  nascimento date,
  cpf text,
  rg text,
  endereco text,
  cep text,
  regiao text not null,
  email text,
  tel1 text not null,
  tel2 text,
  tel3 text,
  sus text,
  posto text,
  semanas_gestacao int,
  gestacao_risco text,
  observacoes text,
  quer_kit boolean default true,
  consentimento boolean not null default false,
  consentimento_em timestamptz,
  kit_entregue boolean not null default false,
  kit_entregue_em timestamptz,
  criado_em timestamptz not null default now(),
  constraint cpf_ou_rg check (cpf is not null or rg is not null)
);

-- Índice para acelerar a busca por nome no painel admin
create index if not exists gestantes_nome_idx on public.gestantes using gin (to_tsvector('portuguese', nome));
create index if not exists gestantes_regiao_idx on public.gestantes (regiao);
create index if not exists gestantes_kit_entregue_idx on public.gestantes (kit_entregue);

-- Ativa Row Level Security (obrigatório)
alter table public.gestantes enable row level security;

-- Qualquer visitante (não autenticado) pode CADASTRAR, desde que tenha marcado o consentimento
drop policy if exists "Cadastro publico" on public.gestantes;
create policy "Cadastro publico"
  on public.gestantes
  for insert
  to anon
  with check (consentimento = true);

-- Só usuários autenticados (equipe/admin) podem VISUALIZAR os cadastros
drop policy if exists "Admin visualiza" on public.gestantes;
create policy "Admin visualiza"
  on public.gestantes
  for select
  to authenticated
  using (true);

-- Só usuários autenticados (equipe/admin) podem ATUALIZAR (ex.: marcar kit entregue)
drop policy if exists "Admin atualiza" on public.gestantes;
create policy "Admin atualiza"
  on public.gestantes
  for update
  to authenticated
  using (true);

-- Observação: o cadastro público NÃO consegue ler os próprios dados de volta
-- nem ver dados de outras pessoas — isso é proposital, para proteger a privacidade.
