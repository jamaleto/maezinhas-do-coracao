# Mãezinhas do Coração

Sistema de cadastro e entrega de kits para gestantes: landing page pública + painel
administrativo (dashboard, busca, controle de entrega, relatórios). Construído com
Next.js, para deploy na Vercel, usando Supabase como banco de dados e autenticação.

## 1. Configurar o Supabase

1. Abra seu projeto em [supabase.com](https://supabase.com).
2. Vá em **SQL Editor** → **New query**, cole o conteúdo de `supabase/schema.sql`
   e clique em **Run**. Isso cria a tabela `gestantes` e as regras de segurança
   (RLS): qualquer pessoa pode se cadastrar, mas só a equipe logada consegue ver
   os dados.
3. Crie o usuário de acesso ao painel em **Authentication → Users → Add user**:
   - **E-mail:** `admin@maezinhasdocoracao.org`
   - **Senha:** `admin1234` (ou a senha que preferir — só troque também no código,
     veja abaixo)
   - Marque **Auto Confirm User** para não precisar confirmar por e-mail.

   Como quem vai operar o painel são pessoas que preferem algo bem simples, a
   tela de login do `/admin` pede **só a senha** (o e-mail fica fixo no código,
   em `app/admin/login/page.tsx`, na constante `ADMIN_EMAIL`). Se quiser trocar
   o e-mail ou usar uma senha diferente de `admin1234`, é só criar o usuário
   com esses novos dados no Supabase e (se mudar o e-mail) atualizar a
   constante `ADMIN_EMAIL` nesse arquivo.

   Se mais de uma pessoa vai usar o painel, todas podem entrar com a mesma
   senha — não é obrigatório ter um usuário por pessoa.
4. Copie a **Project URL** e a **anon public key** em
   **Project Settings → API** — você vai precisar delas no próximo passo.

## 2. Configurar o projeto localmente (opcional, para testar antes do deploy)

```bash
cp .env.local.example .env.local
# edite .env.local com a URL e a anon key do seu projeto Supabase

npm install
npm run dev
```

Acesse `http://localhost:3000` para a landing page e
`http://localhost:3000/admin` para o painel (vai pedir login).

## 3. Deploy na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (os mesmos valores do `.env.local`)
4. Clique em **Deploy**. Pronto — a landing page e o painel `/admin` já ficam
   no ar, gravando e lendo direto do Supabase.

## Atualização de campos do formulário

O formulário pede **CPF ou RG** (basta um dos dois, não precisa dos dois).
Cartão SUS e Posto de Saúde/UBS agora são opcionais. O campo **CEP** também é
opcional, mas quando preenchido busca automaticamente rua e bairro (via
ViaCEP) e já preenche os campos de endereço e região.

Se você já tinha rodado uma versão anterior do `supabase/schema.sql` e a
tabela `gestantes` já existe no seu Supabase, **não rode o `create table`
de novo** — role até o topo do arquivo e rode só o bloco de migração indicado
lá (adiciona as colunas `rg` e `cep` e remove a obrigatoriedade de `cpf`,
`sus` e `posto`).

## Como o cadastro gradual funciona

Não existe importação em lote: cada pessoa que preenche o formulário na landing
page grava uma linha na tabela `gestantes` no mesmo instante. O painel admin
sempre reflete o estado atual do banco, então dá pra acompanhar os cadastros
chegando aos poucos, sem nenhuma etapa manual de sincronização.

## Estrutura do projeto

```
app/
  page.tsx                 → landing page pública (formulário de cadastro)
  admin/
    login/page.tsx         → login do painel (Supabase Auth)
    layout.tsx             → abas e navegação do admin
    page.tsx               → dashboard (estatísticas, ranking por região/posto)
    inscricoes/page.tsx    → busca por nome + marcar kit como entregue
    relatorios/page.tsx    → exportação CSV para prestação de contas
lib/
  supabase/client.ts       → cliente Supabase para o navegador
  supabase/server.ts       → cliente Supabase para Server Components
  types.ts                 → tipo TypeScript do registro de gestante
middleware.ts              → protege as rotas /admin exigindo login
supabase/schema.sql        → script para criar a tabela e as políticas de segurança
```

## Segurança e LGPD

- A tabela usa Row Level Security: visitantes anônimos só conseguem *inserir*
  cadastros (não conseguem ler nenhum dado de volta); apenas usuários
  autenticados (a equipe) conseguem visualizar e atualizar os registros.
- O texto do termo de consentimento em `app/page.tsx` é um rascunho — como
  envolve dado de saúde (dado sensível pela LGPD), recomendo revisar com um
  advogado antes de publicar oficialmente.
- Para adicionar mais pessoas da equipe com acesso ao painel, basta criar
  novos usuários em Supabase → Authentication → Users. Não é preciso mexer
  no código.
