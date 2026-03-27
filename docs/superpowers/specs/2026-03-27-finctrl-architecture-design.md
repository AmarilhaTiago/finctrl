# FinCtrl — Design de Arquitetura Web (Custo Zero)

**Data:** 2026-03-27
**Status:** Aprovado
**Versão:** 1.0

---

## 1. Visão Geral

O FinCtrl é um app web de gestão financeira pessoal com entrada de dados manual como core da experiência. Dark mode premium, keyboard-first UX, todas as funcionalidades desbloqueadas.

### Contexto da Decisão

- **Usuários iniciais:** 5 (Tiago + 4-5 amigos próximos)
- **Custo alvo:** R$0/mês na fase de validação
- **Futuro:** Se validado, virar produto SaaS (~R$10-15/mês) com Open Finance
- **Decisão:** Web app em vez de Desktop para facilitar distribuição e transição para produto

### Referência

O documento `FinCtrl_Benchmark_v1.docx` contém o benchmark completo contra VisorFinance, referências visuais do Dribbble, design system (dark mode), regras de componentes e roadmap original. Este spec adapta aquele documento para a arquitetura web.

---

## 2. Tech Stack

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Next.js 15 (App Router) | Deploy nativo Vercel, API Routes integradas, SSR futuro |
| Linguagem | TypeScript (strict) | Tipagem de todas as entidades do banco |
| Deploy | Vercel free tier | Experiência do usuário, R$0 |
| Banco de dados | Supabase PostgreSQL (free tier, 500MB) | Suficiente para 5 usuários, RLS nativo |
| Autenticação | Supabase Auth (email + senha) | Free tier 50k requests/mês, "manter conectado" nativo |
| Estilização | Tailwind CSS v4 + CSS Variables | Tokens do design system como variáveis CSS |
| Componentes UI | shadcn/ui (adaptado dark mode) | Componentes acessíveis, customizáveis, sem lock-in |
| Gráficos | Recharts | Área, barras, donut, linha — todas as visualizações do spec |
| Estado global | Zustand | Leve, sem boilerplate |
| Formulários | React Hook Form + Zod | Validação tipada, performance |
| Ícones | Lucide React | Mesmo icon set do doc original |
| Formatação datas | date-fns | Lightweight, sem moment |
| Formatação monetária | Intl.NumberFormat | Nativo, BRL |
| Build | Turbopack (via Next.js) | Dev server rápido |
| Testes | Vitest + Testing Library | Mesmo do doc original |
| Export CSV | papaparse | Mesmo do doc original |
| Export PDF | jsPDF | Mesmo do doc original |

---

## 3. Escopo MVP Intermediário

### Incluído

**Grupo 1 — Organização**

| Tela | Funcionalidades |
|---|---|
| Dashboard | KPI Row (Receita/Despesa/Saldo/Taxa Economia) + Gráfico Ritmo de Gastos + Donut Categorias + Resultado Parcial + Top Categorias + Últimas Transações |
| Transações | CRUD completo + filtros (período, tipo, categoria, conta) + busca inline + atalhos de teclado (Ctrl+N, Tab, Enter) + modo batch |
| Recorrentes | Cards de assinaturas + próximo vencimento + parcelas com progresso |
| Receitas | KPIs de receita + gráfico por fonte + lista de entradas |

**Grupo 2 — Controle Financeiro**

| Tela | Funcionalidades |
|---|---|
| Contas | Cards por conta + saldo consolidado + histórico |
| Faturas | Cards de cartão (limite/gasto/vencimento) + barra gasto/limite + transações da fatura |
| Categorias | Grid com orçamento vs gasto + barras de progresso + alertas de limite |
| Metas | Cards de meta + gauge de progresso + histórico de contribuições |

### Excluído do MVP (próximas iterações)

- Fluxo de Caixa (gráfico receita vs despesa com seletor de período)
- Projeção 12 meses (cenários otimista/realista/pessimista)
- Patrimônio (ativos vs passivos, evolução)
- Relatórios avançados + export CSV/PDF
- Import CSV/OFX
- Notificações
- Configurações avançadas (temas, categorias customizadas)
- Open Finance

---

## 4. Modelo de Dados

Todas as tabelas possuem `user_id UUID REFERENCES auth.users(id)` + Row Level Security.

### profiles

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK, = auth.uid) | ID do usuário |
| name | TEXT NOT NULL | Nome de exibição |
| avatar_url | TEXT | URL do avatar (opcional) |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Última atualização |

### accounts

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| name | TEXT NOT NULL | Ex: "Nubank", "Carteira" |
| type | TEXT NOT NULL | 'checking', 'savings', 'investment', 'wallet' |
| initial_balance | DECIMAL(12,2) | Saldo inicial na criação |
| color | TEXT | Cor para identificação visual |
| is_active | BOOLEAN DEFAULT true | Soft delete |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### credit_cards

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| name | TEXT NOT NULL | Ex: "Nubank Mastercard" |
| bank | TEXT | Banco emissor |
| credit_limit | DECIMAL(12,2) | Limite do cartão |
| closing_day | INTEGER (1-31) | Dia de fechamento |
| due_day | INTEGER (1-31) | Dia de vencimento |
| color | TEXT | Cor para identificação visual |
| is_active | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### categories

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| name | TEXT NOT NULL | Ex: "Alimentação" |
| icon | TEXT | Nome do ícone Lucide |
| color | TEXT NOT NULL | Hex da cor (da paleta do design system) |
| monthly_limit | DECIMAL(12,2) | Limite mensal (opcional) |
| type | TEXT NOT NULL | 'expense', 'income', 'both' |
| sort_order | INTEGER | Ordem de exibição |
| is_active | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### transactions

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| type | TEXT NOT NULL | 'income', 'expense' |
| amount | DECIMAL(12,2) NOT NULL | Valor (sempre positivo) |
| description | TEXT NOT NULL | Descrição da transação |
| category_id | UUID (FK → categories) | |
| account_id | UUID (FK → accounts) | |
| credit_card_id | UUID (FK → credit_cards) | NULL se não for cartão |
| date | DATE NOT NULL | Data da transação |
| recurring_id | UUID (FK → recurring) | NULL se não for recorrente |
| notes | TEXT | Observações (max 500 chars) |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### recurring

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| type | TEXT NOT NULL | 'income', 'expense' |
| amount | DECIMAL(12,2) NOT NULL | |
| description | TEXT NOT NULL | |
| category_id | UUID (FK → categories) | |
| account_id | UUID (FK → accounts) | |
| credit_card_id | UUID (FK → credit_cards) | |
| frequency | TEXT NOT NULL | 'weekly', 'monthly', 'yearly' |
| start_date | DATE NOT NULL | |
| end_date | DATE | NULL = sem fim |
| total_installments | INTEGER | NULL = assinatura, N = parcela |
| current_installment | INTEGER | Parcela atual |
| is_active | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### goals

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| name | TEXT NOT NULL | Nome da meta |
| target_amount | DECIMAL(12,2) NOT NULL | Valor alvo |
| current_amount | DECIMAL(12,2) DEFAULT 0 | Valor acumulado |
| deadline | DATE | Prazo (opcional) |
| account_id | UUID (FK → accounts) | Conta destino |
| color | TEXT | Cor do progresso |
| is_completed | BOOLEAN DEFAULT false | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### goal_contributions

| Coluna | Tipo | Descrição |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| goal_id | UUID (FK → goals) | |
| amount | DECIMAL(12,2) NOT NULL | Valor da contribuição |
| date | DATE NOT NULL | |
| created_at | TIMESTAMPTZ | |

---

## 5. Segurança — Row Level Security

Cada tabela terá uma policy RLS idêntica:

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own data" ON <table>
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

Isso garante isolamento total entre usuários a nível de banco de dados.

---

## 6. Autenticação

- **Método:** Email + senha via Supabase Auth
- **"Manter conectado":** Checkbox no login que controla a persistência da sessão (Supabase usa JWT com refresh token — sessão persiste por padrão, o checkbox controlará se o refresh token é mantido no localStorage)
- **Fluxo:** Login → redirect para Dashboard. Sem acesso a nenhuma rota sem autenticação.
- **Middleware Next.js:** Verifica sessão em todas as rotas protegidas via `middleware.ts`

---

## 7. Design System

100% fiel ao documento `FinCtrl_Benchmark_v1.docx`:

- **Tema:** Dark mode com camadas de profundidade (#0D0F14 → #13161E → #1A1D27 → #1E2130)
- **Tipografia:** Inter (principal) → Plus Jakarta Sans → System UI
- **Cores accent:** #5B8AF5 (primary), #22D3A0 (positive), #EF5350 (negative), #F5A623 (warning)
- **Paleta de categorias:** 10 cores fixas conforme documento
- **Espaçamento:** Escala 4px (4, 8, 12, 16, 20, 24, 32, 48)
- **Grid:** 12 colunas, gutter 16px
- **Componentes:** Seguem as regras detalhadas nas seções 9.1 a 9.6 do documento

Os tokens serão implementados como CSS Variables no Tailwind v4.

---

## 8. Layout da Aplicação

### Shell

- **Sidebar:** 240px fixa, fundo Surface (#13161E), não colapsável
- **Nav Groups:** 2 grupos — "Organização" (Dashboard, Transações, Recorrentes, Receitas) e "Controle Financeiro" (Contas, Faturas, Categorias, Metas)
- **Footer Sidebar:** Avatar + nome + saldo projetado do mês
- **Content Area:** Largura fluida (100% - 240px), fundo Base (#0D0F14), padding 24px
- **Page Header:** Título (20px) + período atual + botão de ação primária

### Atalhos de Teclado Globais

Conforme seção 7.2 do documento:
- Ctrl+N: Nova Transação (de qualquer tela)
- Ctrl+F: Focar busca
- Ctrl+D: Dashboard
- Ctrl+T: Transações
- Escape: Fechar modal
- Enter: Confirmar/Salvar
- Tab/Shift+Tab: Navegar campos

---

## 9. Estrutura de Pastas

```
finctrl/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-03-27-finctrl-architecture-design.md
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx          # Shell (sidebar + content)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx
│   │   │   ├── recurring/
│   │   │   │   └── page.tsx
│   │   │   ├── income/
│   │   │   │   └── page.tsx
│   │   │   ├── accounts/
│   │   │   │   └── page.tsx
│   │   │   ├── credit-cards/
│   │   │   │   └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   └── goals/
│   │   │       └── page.tsx
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Redirect para /dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # shadcn/ui base
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── shell.tsx
│   │   │   └── page-header.tsx
│   │   ├── dashboard/
│   │   │   ├── kpi-card.tsx
│   │   │   ├── spending-pace-chart.tsx
│   │   │   ├── category-donut.tsx
│   │   │   ├── partial-result.tsx
│   │   │   ├── top-categories.tsx
│   │   │   └── recent-transactions.tsx
│   │   ├── transactions/
│   │   │   ├── transaction-table.tsx
│   │   │   ├── transaction-modal.tsx
│   │   │   ├── filter-bar.tsx
│   │   │   └── transaction-summary.tsx
│   │   ├── recurring/
│   │   ├── accounts/
│   │   ├── credit-cards/
│   │   ├── categories/
│   │   ├── goals/
│   │   └── shared/
│   │       ├── progress-bar.tsx
│   │       ├── badge.tsx
│   │       ├── toast.tsx
│   │       └── confirm-dialog.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client (RSC)
│   │   │   └── middleware.ts       # Auth middleware
│   │   ├── hooks/
│   │   │   ├── use-transactions.ts
│   │   │   ├── use-accounts.ts
│   │   │   ├── use-categories.ts
│   │   │   ├── use-keyboard-shortcuts.ts
│   │   │   └── ...
│   │   ├── stores/
│   │   │   └── ui-store.ts         # Sidebar state, modal state
│   │   ├── utils/
│   │   │   ├── currency.ts         # Formatação BRL
│   │   │   ├── date.ts             # Helpers de data
│   │   │   └── calculations.ts     # KPIs, burn rate, etc.
│   │   └── types/
│   │       └── database.ts         # Types gerados do Supabase
│   └── styles/
│       └── tokens.css              # CSS Variables do design system
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                    # Dados iniciais (categorias padrão)
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                      # SUPABASE_URL, SUPABASE_ANON_KEY
```

---

## 10. Limites do Free Tier

| Recurso | Limite Supabase Free | Uso estimado (5 usuários) |
|---|---|---|
| Banco de dados | 500 MB | ~5-10 MB (anos de transações) |
| Auth requests | 50.000/mês | ~500/mês |
| API requests | 500.000/mês | ~10.000/mês |
| Storage | 1 GB | Não usado no MVP |
| Edge Functions | 500.000/mês | Não usado no MVP |

| Recurso | Limite Vercel Free | Uso estimado |
|---|---|---|
| Bandwidth | 100 GB/mês | < 1 GB/mês |
| Serverless executions | 100.000/mês | ~5.000/mês |
| Builds | 6.000 min/mês | ~100 min/mês |

**Conclusão:** Os free tiers cobrem confortavelmente 5 usuários. Mesmo com 50 usuários, provavelmente não seria ultrapassado.

---

## 11. Caminho para Produto (Futuro)

Quando validado, a transição para produto envolve:

1. **Billing:** Stripe ou Mercado Pago integrado ao Supabase
2. **Upgrade Supabase:** Pro plan ($25/mês) para mais capacidade
3. **Open Finance:** Integração via Pluggy ou Belvo (backend já existe via API Routes)
4. **Domínio customizado:** finctrl.com.br na Vercel
5. **Email transacional:** Resend free tier para confirmações

Nenhuma dessas mudanças requer reescrita — é incremental sobre a mesma base.
