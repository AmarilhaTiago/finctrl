# FinCtrl MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-cost personal finance web app with dark mode premium UI, keyboard-first UX, email+password auth, and 8 functional screens (Dashboard, Transactions, Recurring, Income, Accounts, Credit Cards, Categories, Goals).

**Architecture:** Next.js 15 App Router deployed on Vercel free tier, Supabase free tier for PostgreSQL + Auth with Row Level Security for multi-tenant isolation. Frontend uses shadcn/ui + Tailwind CSS v4 with custom dark mode design tokens. State managed with Zustand, forms with React Hook Form + Zod, charts with Recharts.

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind CSS v4, shadcn/ui, Supabase (PostgreSQL + Auth), Zustand, React Hook Form, Zod, Recharts, Lucide React, date-fns, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-03-27-finctrl-architecture-design.md`

---

## Phase 1 — Project Setup & Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `.env.local`, `.gitignore`

- [ ] **Step 1: Create Next.js project with TypeScript and Tailwind**

```bash
cd /Users/tiagoamarilha/Documents/Finances
npx create-next-app@latest finctrl --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"
```

- [ ] **Step 2: Move into project and verify it runs**

```bash
cd finctrl
npm run dev
```
Expected: Dev server starts at localhost:3000 with default Next.js page.

- [ ] **Step 3: Install all dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr zustand recharts react-hook-form @hookform/resolvers zod date-fns lucide-react class-variance-authority clsx tailwind-merge
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

- [ ] **Step 4: Create .env.local template**

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Create `.env.example` (committed to git, without real values):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 5: Configure Vitest**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Create `src/tests/setup.ts`:
```typescript
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 6: Add test script to package.json**

Add to `package.json` scripts:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 7: Verify test setup works**

Create `src/tests/smoke.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

describe("smoke test", () => {
  it("should pass", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm test -- --run`
Expected: 1 test passes.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project with TypeScript, Tailwind, and test setup"
```

---

### Task 2: Design System — CSS Tokens

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/app/globals.css`
- Create: `src/lib/utils.ts` (cn utility)

- [ ] **Step 1: Create design system tokens**

Create `src/styles/tokens.css`:
```css
@layer base {
  :root {
    /* Background Tokens */
    --color-base: #0D0F14;
    --color-surface: #13161E;
    --color-card: #1A1D27;
    --color-card-elevated: #1E2130;
    --color-stroke: #252840;

    /* Text Tokens */
    --color-text-primary: #F0F2FF;
    --color-text-secondary: #8B8FA8;
    --color-text-tertiary: #555872;
    --color-text-disabled: #2A2D3A;

    /* Accent & Semantic */
    --color-accent: #5B8AF5;
    --color-accent-light: #7C9EF8;
    --color-positive: #22D3A0;
    --color-negative: #EF5350;
    --color-warning: #F5A623;
    --color-purple: #A78BFA;

    /* Category Colors */
    --color-cat-housing: #5B8AF5;
    --color-cat-food: #22D3A0;
    --color-cat-transport: #F5A623;
    --color-cat-leisure: #A78BFA;
    --color-cat-health: #EF5350;
    --color-cat-education: #38BDF8;
    --color-cat-clothing: #FB7185;
    --color-cat-subscriptions: #34D399;
    --color-cat-travel: #FBBF24;
    --color-cat-other: #94A3B8;

    /* Spacing Scale (4px base) */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-12: 48px;

    /* Typography */
    --font-sans: "Inter", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
    --font-mono: "Inter", ui-monospace, monospace;

    /* Border Radius */
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-full: 9999px;

    /* Sidebar */
    --sidebar-width: 240px;
  }
}
```

- [ ] **Step 2: Update globals.css**

Replace `src/app/globals.css` with:
```css
@import "tailwindcss";
@import "../styles/tokens.css";

@layer base {
  body {
    background-color: var(--color-base);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    border-color: var(--color-stroke);
  }
}
```

- [ ] **Step 3: Create cn utility**

Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Configure Tailwind with custom tokens**

Update `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--color-base)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        "card-elevated": "var(--color-card-elevated)",
        stroke: "var(--color-stroke)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        "text-disabled": "var(--color-text-disabled)",
        accent: "var(--color-accent)",
        "accent-light": "var(--color-accent-light)",
        positive: "var(--color-positive)",
        negative: "var(--color-negative)",
        warning: "var(--color-warning)",
        purple: "var(--color-purple)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      spacing: {
        "sidebar": "var(--sidebar-width)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Verify tokens render correctly**

Replace `src/app/page.tsx` with:
```tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-base p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-4">FinCtrl Design Tokens</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-lg border border-stroke">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Surface</span>
        </div>
        <div className="bg-card p-5 rounded-lg border border-stroke">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Card</span>
        </div>
        <div className="bg-card-elevated p-5 rounded-lg border border-stroke">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Elevated</span>
        </div>
        <div className="bg-accent/12 p-5 rounded-lg">
          <span className="text-accent text-xs uppercase tracking-wide">Accent</span>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <span className="text-positive font-semibold">+R$ 1.200,00</span>
        <span className="text-negative font-semibold">-R$ 850,00</span>
        <span className="text-warning font-semibold">⚠ 82%</span>
      </div>
    </div>
  );
}
```

Run: `npm run dev` — verify visually at localhost:3000.
Expected: Dark background with properly colored cards and text.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add design system CSS tokens and Tailwind configuration"
```

---

### Task 3: Install and Configure shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/dropdown-menu.tsx`, `src/components/ui/select.tsx`, `src/components/ui/checkbox.tsx`, `src/components/ui/label.tsx`, `src/components/ui/tooltip.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/table.tsx`, `src/components/ui/progress.tsx`, `src/components/ui/separator.tsx`, `src/components/ui/sonner.tsx`

- [ ] **Step 1: Initialize shadcn/ui**

```bash
cd /Users/tiagoamarilha/Documents/Finances/finctrl
npx shadcn@latest init
```

Select: New York style, Zinc color, CSS variables = yes.

- [ ] **Step 2: Install required shadcn components**

```bash
npx shadcn@latest add button input dialog dropdown-menu select checkbox label tooltip badge table progress separator sonner
```

- [ ] **Step 3: Install sonner toast library**

```bash
npm install sonner
```

- [ ] **Step 4: Verify components installed**

Run: `ls src/components/ui/`
Expected: All component files listed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: install and configure shadcn/ui components"
```

---

### Task 4: Supabase Client Setup

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Create browser Supabase client**

Create `src/lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2: Create server Supabase client**

Create `src/lib/supabase/server.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if middleware refreshes sessions.
          }
        },
      },
    }
  );
}
```

- [ ] **Step 3: Create middleware Supabase client**

Create `src/lib/supabase/middleware.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in and trying to access app routes, redirect to login
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/register") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If logged in and trying to access auth routes, redirect to dashboard
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

- [ ] **Step 4: Create Next.js middleware**

Create `src/middleware.ts`:
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure Supabase client, server, and auth middleware"
```

---

### Task 5: TypeScript Types & Database Schema

**Files:**
- Create: `src/lib/types/database.ts`
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `supabase/seed.sql`

- [ ] **Step 1: Define TypeScript types for all entities**

Create `src/lib/types/database.ts`:
```typescript
export type TransactionType = "income" | "expense";
export type AccountType = "checking" | "savings" | "investment" | "wallet";
export type Frequency = "weekly" | "monthly" | "yearly";
export type CategoryType = "expense" | "income" | "both";

export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditCard {
  id: string;
  user_id: string;
  name: string;
  bank: string | null;
  credit_limit: number;
  closing_day: number;
  due_day: number;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string;
  monthly_limit: number | null;
  type: CategoryType;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category_id: string;
  account_id: string;
  credit_card_id: string | null;
  date: string;
  recurring_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionWithRelations extends Transaction {
  category: Category;
  account: Account;
  credit_card: CreditCard | null;
}

export interface Recurring {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category_id: string;
  account_id: string;
  credit_card_id: string | null;
  frequency: Frequency;
  start_date: string;
  end_date: string | null;
  total_installments: number | null;
  current_installment: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringWithRelations extends Recurring {
  category: Category;
  account: Account;
  credit_card: CreditCard | null;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  account_id: string | null;
  color: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GoalContribution {
  id: string;
  user_id: string;
  goal_id: string;
  amount: number;
  date: string;
  created_at: string;
}
```

- [ ] **Step 2: Write test for types**

Create `src/tests/types.test.ts`:
```typescript
import { describe, it, expectTypeOf } from "vitest";
import type {
  Transaction,
  TransactionType,
  Account,
  AccountType,
  Category,
  CategoryType,
  CreditCard,
  Recurring,
  Frequency,
  Goal,
  GoalContribution,
  Profile,
} from "@/lib/types/database";

describe("database types", () => {
  it("Transaction has required fields", () => {
    expectTypeOf<Transaction>().toHaveProperty("id");
    expectTypeOf<Transaction>().toHaveProperty("user_id");
    expectTypeOf<Transaction>().toHaveProperty("type");
    expectTypeOf<Transaction>().toHaveProperty("amount");
    expectTypeOf<Transaction>().toHaveProperty("description");
    expectTypeOf<Transaction>().toHaveProperty("category_id");
    expectTypeOf<Transaction>().toHaveProperty("account_id");
    expectTypeOf<Transaction>().toHaveProperty("date");
  });

  it("TransactionType is union of income and expense", () => {
    expectTypeOf<"income">().toMatchTypeOf<TransactionType>();
    expectTypeOf<"expense">().toMatchTypeOf<TransactionType>();
  });

  it("AccountType is union of valid types", () => {
    expectTypeOf<"checking">().toMatchTypeOf<AccountType>();
    expectTypeOf<"savings">().toMatchTypeOf<AccountType>();
    expectTypeOf<"investment">().toMatchTypeOf<AccountType>();
    expectTypeOf<"wallet">().toMatchTypeOf<AccountType>();
  });

  it("CategoryType is union of valid types", () => {
    expectTypeOf<"expense">().toMatchTypeOf<CategoryType>();
    expectTypeOf<"income">().toMatchTypeOf<CategoryType>();
    expectTypeOf<"both">().toMatchTypeOf<CategoryType>();
  });

  it("Frequency is union of valid types", () => {
    expectTypeOf<"weekly">().toMatchTypeOf<Frequency>();
    expectTypeOf<"monthly">().toMatchTypeOf<Frequency>();
    expectTypeOf<"yearly">().toMatchTypeOf<Frequency>();
  });

  it("nullable fields are typed correctly", () => {
    expectTypeOf<Transaction["credit_card_id"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Transaction["recurring_id"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Transaction["notes"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Goal["deadline"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Account["color"]>().toEqualTypeOf<string | null>();
  });
});
```

- [ ] **Step 3: Run type tests**

Run: `npm test -- --run src/tests/types.test.ts`
Expected: All tests pass.

- [ ] **Step 4: Create SQL migration**

Create `supabase/migrations/001_initial_schema.sql`:
```sql
-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'investment', 'wallet')),
  initial_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own accounts" ON accounts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Credit Cards
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bank TEXT,
  credit_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
  closing_day INTEGER NOT NULL CHECK (closing_day BETWEEN 1 AND 31),
  due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own credit_cards" ON credit_cards
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT NOT NULL,
  monthly_limit DECIMAL(12,2),
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'both')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  credit_card_id UUID REFERENCES credit_cards(id),
  date DATE NOT NULL,
  recurring_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);

-- Recurring
CREATE TABLE recurring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  credit_card_id UUID REFERENCES credit_cards(id),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  total_installments INTEGER,
  current_installment INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recurring ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own recurring" ON recurring
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add FK from transactions to recurring after recurring table exists
ALTER TABLE transactions
  ADD CONSTRAINT fk_transactions_recurring
  FOREIGN KEY (recurring_id) REFERENCES recurring(id);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  deadline DATE,
  account_id UUID REFERENCES accounts(id),
  color TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Goal Contributions
CREATE TABLE goal_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own goal_contributions" ON goal_contributions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON credit_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON recurring FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 5: Create seed data for default categories**

Create `supabase/seed.sql`:
```sql
-- This seed is run per-user after signup via a function or manually.
-- Default categories to insert for each new user:
--
-- INSERT INTO categories (user_id, name, icon, color, type, sort_order) VALUES
-- (USER_ID, 'Moradia', 'home', '#5B8AF5', 'expense', 1),
-- (USER_ID, 'Alimentação', 'utensils', '#22D3A0', 'expense', 2),
-- (USER_ID, 'Transporte', 'car', '#F5A623', 'expense', 3),
-- (USER_ID, 'Lazer', 'gamepad-2', '#A78BFA', 'expense', 4),
-- (USER_ID, 'Saúde', 'heart-pulse', '#EF5350', 'expense', 5),
-- (USER_ID, 'Educação', 'graduation-cap', '#38BDF8', 'expense', 6),
-- (USER_ID, 'Vestuário', 'shirt', '#FB7185', 'expense', 7),
-- (USER_ID, 'Assinaturas', 'repeat', '#34D399', 'expense', 8),
-- (USER_ID, 'Viagem', 'plane', '#FBBF24', 'expense', 9),
-- (USER_ID, 'Outros', 'circle-dot', '#94A3B8', 'both', 10),
-- (USER_ID, 'Salário', 'banknote', '#22D3A0', 'income', 11),
-- (USER_ID, 'Freelance', 'laptop', '#5B8AF5', 'income', 12),
-- (USER_ID, 'Investimentos', 'trending-up', '#A78BFA', 'income', 13),
-- (USER_ID, 'Outras Receitas', 'plus-circle', '#94A3B8', 'income', 14);

-- The actual seeding happens in handle_new_user() trigger or via app code.

-- Create function to seed categories for new users
CREATE OR REPLACE FUNCTION seed_user_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (user_id, name, icon, color, type, sort_order) VALUES
    (NEW.id, 'Moradia', 'home', '#5B8AF5', 'expense', 1),
    (NEW.id, 'Alimentação', 'utensils', '#22D3A0', 'expense', 2),
    (NEW.id, 'Transporte', 'car', '#F5A623', 'expense', 3),
    (NEW.id, 'Lazer', 'gamepad-2', '#A78BFA', 'expense', 4),
    (NEW.id, 'Saúde', 'heart-pulse', '#EF5350', 'expense', 5),
    (NEW.id, 'Educação', 'graduation-cap', '#38BDF8', 'expense', 6),
    (NEW.id, 'Vestuário', 'shirt', '#FB7185', 'expense', 7),
    (NEW.id, 'Assinaturas', 'repeat', '#34D399', 'expense', 8),
    (NEW.id, 'Viagem', 'plane', '#FBBF24', 'expense', 9),
    (NEW.id, 'Outros', 'circle-dot', '#94A3B8', 'both', 10),
    (NEW.id, 'Salário', 'banknote', '#22D3A0', 'income', 11),
    (NEW.id, 'Freelance', 'laptop', '#5B8AF5', 'income', 12),
    (NEW.id, 'Investimentos', 'trending-up', '#A78BFA', 'income', 13),
    (NEW.id, 'Outras Receitas', 'plus-circle', '#94A3B8', 'income', 14);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION seed_user_categories();
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add TypeScript types, SQL migration schema, and seed data"
```

---

### Task 6: Utility Functions

**Files:**
- Create: `src/lib/utils/currency.ts`
- Create: `src/lib/utils/date.ts`
- Create: `src/lib/utils/calculations.ts`
- Create: `src/tests/utils/currency.test.ts`
- Create: `src/tests/utils/date.test.ts`
- Create: `src/tests/utils/calculations.test.ts`

- [ ] **Step 1: Write failing tests for currency utils**

Create `src/tests/utils/currency.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { formatCurrency, parseCurrencyInput } from "@/lib/utils/currency";

describe("formatCurrency", () => {
  it("formats positive number as BRL", () => {
    expect(formatCurrency(1250.5)).toBe("R$ 1.250,50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("R$ 0,00");
  });

  it("formats negative number", () => {
    expect(formatCurrency(-350.99)).toBe("-R$ 350,99");
  });

  it("formats large numbers with thousands separator", () => {
    expect(formatCurrency(1000000)).toBe("R$ 1.000.000,00");
  });
});

describe("parseCurrencyInput", () => {
  it("parses digits into decimal value", () => {
    expect(parseCurrencyInput("1250")).toBe(12.5);
  });

  it("parses empty string as 0", () => {
    expect(parseCurrencyInput("")).toBe(0);
  });

  it("parses large value", () => {
    expect(parseCurrencyInput("125000")).toBe(1250.0);
  });

  it("strips non-digit characters", () => {
    expect(parseCurrencyInput("R$ 1.250,00")).toBe(1250.0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run src/tests/utils/currency.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement currency utils**

Create `src/lib/utils/currency.ts`:
```typescript
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function parseCurrencyInput(input: string): number {
  const digits = input.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

export function formatCurrencyInput(value: number): string {
  if (value === 0) return "";
  return formatCurrency(value).replace("R$\u00a0", "");
}
```

- [ ] **Step 4: Run currency tests**

Run: `npm test -- --run src/tests/utils/currency.test.ts`
Expected: All tests pass.

- [ ] **Step 5: Write failing tests for date utils**

Create `src/tests/utils/date.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { formatDate, getMonthRange, parseDateShortcut } from "@/lib/utils/date";

describe("formatDate", () => {
  it("formats date as DD/MM/YYYY", () => {
    expect(formatDate("2026-03-25")).toBe("25/03/2026");
  });
});

describe("getMonthRange", () => {
  it("returns first and last day of given month", () => {
    const range = getMonthRange(2026, 2); // March (0-indexed)
    expect(range.start).toBe("2026-03-01");
    expect(range.end).toBe("2026-03-31");
  });

  it("handles February in non-leap year", () => {
    const range = getMonthRange(2027, 1);
    expect(range.start).toBe("2027-02-01");
    expect(range.end).toBe("2027-02-28");
  });
});

describe("parseDateShortcut", () => {
  it("parses 'h' as today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(parseDateShortcut("h")).toBe(today);
  });

  it("parses 'o' as yesterday", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    expect(parseDateShortcut("o")).toBe(yesterday);
  });

  it("parses DDMM as full date in current year", () => {
    const year = new Date().getFullYear();
    expect(parseDateShortcut("2503")).toBe(`${year}-03-25`);
  });

  it("returns null for invalid input", () => {
    expect(parseDateShortcut("abc")).toBeNull();
  });
});
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `npm test -- --run src/tests/utils/date.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement date utils**

Create `src/lib/utils/date.ts`:
```typescript
import { format, startOfMonth, endOfMonth, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateLong(dateStr: string): string {
  return format(new Date(dateStr + "T12:00:00"), "dd 'de' MMMM", { locale: ptBR });
}

export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const date = new Date(year, month, 1);
  const start = format(startOfMonth(date), "yyyy-MM-dd");
  const end = format(endOfMonth(date), "yyyy-MM-dd");
  return { start, end };
}

export function parseDateShortcut(input: string): string | null {
  const lower = input.toLowerCase().trim();

  if (lower === "h") {
    return new Date().toISOString().split("T")[0];
  }

  if (lower === "o") {
    return subDays(new Date(), 1).toISOString().split("T")[0];
  }

  // DDMM format
  if (/^\d{4}$/.test(lower)) {
    const day = parseInt(lower.slice(0, 2), 10);
    const month = parseInt(lower.slice(2, 4), 10);
    const year = new Date().getFullYear();

    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    const monthStr = String(month).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  }

  return null;
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}
```

- [ ] **Step 8: Run date tests**

Run: `npm test -- --run src/tests/utils/date.test.ts`
Expected: All tests pass.

- [ ] **Step 9: Write failing tests for calculation utils**

Create `src/tests/utils/calculations.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import {
  calculateBalance,
  calculateSavingsRate,
  calculateBurnRate,
  calculateCategorySpending,
} from "@/lib/utils/calculations";
import type { Transaction } from "@/lib/types/database";

const makeTransaction = (overrides: Partial<Transaction>): Transaction => ({
  id: "1",
  user_id: "u1",
  type: "expense",
  amount: 100,
  description: "Test",
  category_id: "c1",
  account_id: "a1",
  credit_card_id: null,
  date: "2026-03-01",
  recurring_id: null,
  notes: null,
  created_at: "2026-03-01T00:00:00Z",
  updated_at: "2026-03-01T00:00:00Z",
  ...overrides,
});

describe("calculateBalance", () => {
  it("sums income and subtracts expenses", () => {
    const transactions = [
      makeTransaction({ type: "income", amount: 5000 }),
      makeTransaction({ type: "expense", amount: 1200 }),
      makeTransaction({ type: "expense", amount: 800 }),
    ];
    expect(calculateBalance(transactions)).toBe(3000);
  });

  it("returns 0 for empty array", () => {
    expect(calculateBalance([])).toBe(0);
  });
});

describe("calculateSavingsRate", () => {
  it("calculates percentage of income saved", () => {
    expect(calculateSavingsRate(5000, 3500)).toBe(30);
  });

  it("returns 0 when income is 0", () => {
    expect(calculateSavingsRate(0, 100)).toBe(0);
  });

  it("returns negative when expenses exceed income", () => {
    expect(calculateSavingsRate(3000, 4000)).toBe(-33.33);
  });
});

describe("calculateBurnRate", () => {
  it("calculates expense as percentage of income", () => {
    expect(calculateBurnRate(5000, 3500)).toBe(70);
  });

  it("returns 0 when income is 0", () => {
    expect(calculateBurnRate(0, 100)).toBe(0);
  });
});

describe("calculateCategorySpending", () => {
  it("groups expenses by category", () => {
    const transactions = [
      makeTransaction({ category_id: "c1", amount: 200, type: "expense" }),
      makeTransaction({ category_id: "c1", amount: 150, type: "expense" }),
      makeTransaction({ category_id: "c2", amount: 500, type: "expense" }),
      makeTransaction({ category_id: "c1", amount: 1000, type: "income" }),
    ];
    const result = calculateCategorySpending(transactions);
    expect(result.get("c1")).toBe(350);
    expect(result.get("c2")).toBe(500);
    expect(result.size).toBe(2);
  });
});
```

- [ ] **Step 10: Run tests to verify they fail**

Run: `npm test -- --run src/tests/utils/calculations.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 11: Implement calculation utils**

Create `src/lib/utils/calculations.ts`:
```typescript
import type { Transaction } from "@/lib/types/database";

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);
}

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
}

export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
}

export function calculateSavingsRate(income: number, expenses: number): number {
  if (income === 0) return 0;
  const rate = ((income - expenses) / income) * 100;
  return Math.round(rate * 100) / 100;
}

export function calculateBurnRate(income: number, expenses: number): number {
  if (income === 0) return 0;
  return Math.round((expenses / income) * 100);
}

export function calculateCategorySpending(
  transactions: Transaction[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const current = map.get(t.category_id) ?? 0;
    map.set(t.category_id, current + t.amount);
  }
  return map;
}
```

- [ ] **Step 12: Run all calculation tests**

Run: `npm test -- --run src/tests/utils/calculations.test.ts`
Expected: All tests pass.

- [ ] **Step 13: Run all tests together**

Run: `npm test -- --run`
Expected: All tests pass (smoke + types + currency + date + calculations).

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: add currency, date, and calculation utility functions with tests"
```

---

## Phase 2 — Authentication & Shell

### Task 7: Login Page

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/layout.tsx`

- [ ] **Step 1: Create auth layout**

Create `src/app/(auth)/layout.tsx`:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create login page**

Create `src/app/(auth)/login/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-card border border-stroke rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">FinCtrl</h1>
          <p className="text-text-secondary text-sm mt-2">
            Entre na sua conta
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-secondary text-xs uppercase tracking-wide">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-text-secondary text-xs uppercase tracking-wide">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-stroke data-[state=checked]:bg-accent data-[state=checked]:border-accent"
            />
            <Label htmlFor="remember" className="text-text-secondary text-sm cursor-pointer">
              Manter conectado
            </Label>
          </div>

          {error && (
            <p className="text-negative text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-light text-white font-medium"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-text-tertiary text-sm mt-6">
          Não tem conta?{" "}
          <Link href="/register" className="text-accent hover:text-accent-light">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify page renders**

Run: `npm run dev` — navigate to localhost:3000/login.
Expected: Dark-themed login form with email, password, checkbox, and button.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add login page with email/password and remember me"
```

---

### Task 8: Register Page

**Files:**
- Create: `src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Create register page**

Create `src/app/(auth)/register/page.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-card border border-stroke rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">FinCtrl</h1>
          <p className="text-text-secondary text-sm mt-2">
            Crie sua conta
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-text-secondary text-xs uppercase tracking-wide">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-secondary text-xs uppercase tracking-wide">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-text-secondary text-xs uppercase tracking-wide">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          {error && (
            <p className="text-negative text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-light text-white font-medium"
          >
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-center text-text-tertiary text-sm mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-accent hover:text-accent-light">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify page renders**

Run: `npm run dev` — navigate to localhost:3000/register.
Expected: Dark-themed registration form with name, email, password fields.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add registration page"
```

---

### Task 9: Application Shell — Sidebar & Layout

**Files:**
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/shell.tsx`
- Create: `src/components/layout/page-header.tsx`
- Create: `src/app/(app)/layout.tsx`
- Create: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Sidebar component**

Create `src/components/layout/sidebar.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Repeat,
  TrendingUp,
  Wallet,
  CreditCard,
  Tags,
  Target,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navGroups = [
  {
    label: "Organização",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/transactions", label: "Transações", icon: ArrowRightLeft },
      { href: "/recurring", label: "Recorrentes", icon: Repeat },
      { href: "/income", label: "Receitas", icon: TrendingUp },
    ],
  },
  {
    label: "Controle Financeiro",
    items: [
      { href: "/accounts", label: "Contas", icon: Wallet },
      { href: "/credit-cards", label: "Faturas", icon: CreditCard },
      { href: "/categories", label: "Categorias", icon: Tags },
      { href: "/goals", label: "Metas", icon: Target },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar bg-surface border-r border-stroke flex flex-col">
      {/* Header */}
      <div className="h-[60px] flex items-center px-5 border-b border-stroke">
        <h1 className="text-lg font-semibold text-text-primary">
          <span className="text-accent">Fin</span>Ctrl
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <span className="text-[10px] font-normal text-text-tertiary uppercase tracking-[0.8px] px-3 mb-2 block">
              {group.label}
            </span>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 h-10 rounded-md text-sm transition-colors duration-100",
                      isActive
                        ? "bg-accent/12 text-accent border-l-2 border-accent"
                        : "text-text-secondary hover:bg-card-elevated hover:text-text-primary"
                    )}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-stroke p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-text-secondary hover:text-text-primary text-sm transition-colors w-full px-3 py-2 rounded-md hover:bg-card-elevated"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create Shell component**

Create `src/components/layout/shell.tsx`:
```tsx
import { Sidebar } from "./sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base">
      <Sidebar />
      <main className="ml-sidebar min-h-screen p-6">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Create PageHeader component**

Create `src/components/layout/page-header.tsx`:
```tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between h-12 mb-6">
      <div>
        <h1 className="text-xl font-medium text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
```

- [ ] **Step 4: Create app layout with Shell**

Create `src/app/(app)/layout.tsx`:
```tsx
import { Shell } from "@/components/layout/shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
```

- [ ] **Step 5: Create placeholder Dashboard page**

Create `src/app/(app)/dashboard/page.tsx`:
```tsx
import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral das suas finanças"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 bg-card border border-stroke rounded-lg p-5">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Receitas</span>
          <p className="text-2xl font-semibold text-positive mt-1">R$ 0,00</p>
        </div>
        <div className="col-span-3 bg-card border border-stroke rounded-lg p-5">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Despesas</span>
          <p className="text-2xl font-semibold text-negative mt-1">R$ 0,00</p>
        </div>
        <div className="col-span-3 bg-card border border-stroke rounded-lg p-5">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Saldo</span>
          <p className="text-2xl font-semibold text-text-primary mt-1">R$ 0,00</p>
        </div>
        <div className="col-span-3 bg-card border border-stroke rounded-lg p-5">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Economia</span>
          <p className="text-2xl font-semibold text-accent mt-1">0%</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Update root page to redirect**

Replace `src/app/page.tsx`:
```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
```

- [ ] **Step 7: Create placeholder pages for all routes**

Create each file with a minimal placeholder:

`src/app/(app)/transactions/page.tsx`:
```tsx
import { PageHeader } from "@/components/layout/page-header";

export default function TransactionsPage() {
  return <PageHeader title="Transações" subtitle="Todas as suas movimentações" />;
}
```

`src/app/(app)/recurring/page.tsx`:
```tsx
import { PageHeader } from "@/components/layout/page-header";

export default function RecurringPage() {
  return <PageHeader title="Recorrentes" subtitle="Assinaturas e parcelas" />;
}
```

`src/app/(app)/income/page.tsx`:
```tsx
import { PageHeader } from "@/components/layout/page-header";

export default function IncomePage() {
  return <PageHeader title="Receitas" subtitle="Suas fontes de renda" />;
}
```

`src/app/(app)/accounts/page.tsx`:
```tsx
import { PageHeader } from "@/components/layout/page-header";

export default function AccountsPage() {
  return <PageHeader title="Contas" subtitle="Suas contas bancárias e carteiras" />;
}
```

`src/app/(app)/credit-cards/page.tsx`:
```tsx
import { PageHeader } from "@/components/layout/page-header";

export default function CreditCardsPage() {
  return <PageHeader title="Faturas" subtitle="Cartões de crédito" />;
}
```

`src/app/(app)/categories/page.tsx`:
```tsx
import { PageHeader } from "@/components/layout/page-header";

export default function CategoriesPage() {
  return <PageHeader title="Categorias" subtitle="Orçamento por categoria" />;
}
```

`src/app/(app)/goals/page.tsx`:
```tsx
import { PageHeader } from "@/components/layout/page-header";

export default function GoalsPage() {
  return <PageHeader title="Metas" subtitle="Seus objetivos financeiros" />;
}
```

- [ ] **Step 8: Verify shell renders**

Run: `npm run dev` — navigate to localhost:3000/dashboard.
Expected: Dark sidebar with navigation groups on the left, dashboard content on the right.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add application shell with sidebar, routing, and placeholder pages"
```

---

## Phase 3 — Core Features (Transactions, Accounts, Categories)

### Task 10: Zustand UI Store & Keyboard Shortcuts

**Files:**
- Create: `src/lib/stores/ui-store.ts`
- Create: `src/lib/hooks/use-keyboard-shortcuts.ts`
- Create: `src/components/shared/keyboard-shortcut-provider.tsx`

- [ ] **Step 1: Create UI store**

Create `src/lib/stores/ui-store.ts`:
```typescript
import { create } from "zustand";

interface UIState {
  isTransactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTransactionModalOpen: false,
  openTransactionModal: () => set({ isTransactionModalOpen: true }),
  closeTransactionModal: () => set({ isTransactionModalOpen: false }),
}));
```

- [ ] **Step 2: Create keyboard shortcuts hook**

Create `src/lib/hooks/use-keyboard-shortcuts.ts`:
```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/stores/ui-store";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { openTransactionModal, closeTransactionModal, isTransactionModalOpen } =
    useUIStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Escape always works
      if (e.key === "Escape") {
        closeTransactionModal();
        return;
      }

      // Don't trigger shortcuts when typing in inputs (except Escape)
      if (isInput) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            openTransactionModal();
            break;
          case "d":
            e.preventDefault();
            router.push("/dashboard");
            break;
          case "t":
            e.preventDefault();
            router.push("/transactions");
            break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, openTransactionModal, closeTransactionModal, isTransactionModalOpen]);
}
```

- [ ] **Step 3: Create provider component**

Create `src/components/shared/keyboard-shortcut-provider.tsx`:
```tsx
"use client";

import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";

export function KeyboardShortcutProvider({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}
```

- [ ] **Step 4: Add provider to app layout**

Update `src/app/(app)/layout.tsx`:
```tsx
import { Shell } from "@/components/layout/shell";
import { KeyboardShortcutProvider } from "@/components/shared/keyboard-shortcut-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardShortcutProvider>
      <Shell>{children}</Shell>
    </KeyboardShortcutProvider>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Zustand UI store and global keyboard shortcuts"
```

---

### Task 11: Transaction Modal (New Transaction Form)

**Files:**
- Create: `src/components/transactions/transaction-modal.tsx`
- Create: `src/components/transactions/currency-input.tsx`
- Create: `src/lib/hooks/use-transactions.ts`
- Create: `src/lib/hooks/use-accounts.ts`
- Create: `src/lib/hooks/use-categories.ts`

This is the core feature — keyboard-first data entry in under 10 seconds. The modal has 8 fields navigable by Tab: Type, Value, Description, Category, Account, Date, Recurring, Notes.

- [ ] **Step 1: Create currency input component**

Create `src/components/transactions/currency-input.tsx`:
```tsx
"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { parseCurrencyInput } from "@/lib/utils/currency";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  autoFocus?: boolean;
}

export function CurrencyInput({ value, onChange, className, autoFocus }: CurrencyInputProps) {
  const [display, setDisplay] = useState(() => {
    if (value === 0) return "";
    return Math.round(value * 100).toString();
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      setDisplay(raw);
      onChange(parseCurrencyInput(raw));
    },
    [onChange]
  );

  const formatDisplay = (digits: string): string => {
    if (!digits) return "";
    const num = parseInt(digits, 10) / 100;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <span className="absolute left-3 text-text-secondary text-sm">R$</span>
      <input
        type="text"
        inputMode="numeric"
        value={formatDisplay(display)}
        onChange={handleChange}
        autoFocus={autoFocus}
        placeholder="0,00"
        className="w-full h-10 bg-base border border-stroke rounded-md pl-10 pr-3 text-right text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15 text-sm"
      />
    </div>
  );
}
```

- [ ] **Step 2: Create data hooks**

Create `src/lib/hooks/use-categories.ts`:
```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types/database";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      setCategories(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { categories, loading };
}
```

Create `src/lib/hooks/use-accounts.ts`:
```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Account } from "@/lib/types/database";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("accounts")
        .select("*")
        .eq("is_active", true)
        .order("name");
      setAccounts(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { accounts, loading };
}
```

Create `src/lib/hooks/use-transactions.ts`:
```typescript
"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Transaction, TransactionWithRelations } from "@/lib/types/database";

interface UseTransactionsOptions {
  startDate?: string;
  endDate?: string;
  type?: "income" | "expense";
  categoryId?: string;
  accountId?: string;
  limit?: number;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("transactions")
      .select("*, category:categories(*), account:accounts(*), credit_card:credit_cards(*)")
      .order("date", { ascending: false });

    if (options.startDate) query = query.gte("date", options.startDate);
    if (options.endDate) query = query.lte("date", options.endDate);
    if (options.type) query = query.eq("type", options.type);
    if (options.categoryId) query = query.eq("category_id", options.categoryId);
    if (options.accountId) query = query.eq("account_id", options.accountId);
    if (options.limit) query = query.limit(options.limit);

    const { data } = await query;
    setTransactions((data as TransactionWithRelations[]) ?? []);
    setLoading(false);
  }, [options.startDate, options.endDate, options.type, options.categoryId, options.accountId, options.limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  async function createTransaction(
    transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("transactions")
      .insert({ ...transaction, user_id: user.id })
      .select("*, category:categories(*), account:accounts(*), credit_card:credit_cards(*)")
      .single();

    if (!error && data) {
      setTransactions((prev) => [data as TransactionWithRelations, ...prev]);
    }
    return { data, error };
  }

  async function deleteTransaction(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
    return { error };
  }

  return { transactions, loading, createTransaction, deleteTransaction, refetch: fetchTransactions };
}
```

- [ ] **Step 3: Create transaction modal**

Create `src/components/transactions/transaction-modal.tsx`:
```tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCategories } from "@/lib/hooks/use-categories";
import { useAccounts } from "@/lib/hooks/use-accounts";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { CurrencyInput } from "./currency-input";
import { parseDateShortcut } from "@/lib/utils/date";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Valor deve ser maior que zero"),
  description: z.string().min(1, "Descrição obrigatória"),
  category_id: z.string().min(1, "Categoria obrigatória"),
  account_id: z.string().min(1, "Conta obrigatória"),
  credit_card_id: z.string().nullable(),
  date: z.string().min(1, "Data obrigatória"),
  notes: z.string().nullable(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function TransactionModal() {
  const { isTransactionModalOpen, closeTransactionModal } = useUIStore();
  const { categories } = useCategories();
  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      description: "",
      category_id: "",
      account_id: "",
      credit_card_id: null,
      date: new Date().toISOString().split("T")[0],
      notes: null,
    },
  });

  const selectedType = watch("type");

  const filteredCategories = categories.filter(
    (c) => c.type === selectedType || c.type === "both"
  );

  async function onSubmit(data: TransactionFormData) {
    const result = await createTransaction({
      ...data,
      recurring_id: null,
    });

    if (result?.error) {
      toast.error("Erro ao salvar transação");
      return;
    }

    toast.success("Transação criada", {
      description: `${data.description} — R$ ${data.amount.toFixed(2).replace(".", ",")}`,
    });
    reset();
    closeTransactionModal();
  }

  async function onSubmitBatch(data: TransactionFormData) {
    const result = await createTransaction({
      ...data,
      recurring_id: null,
    });

    if (result?.error) {
      toast.error("Erro ao salvar transação");
      return;
    }

    toast.success("Transação criada — formulário mantido para próxima");
    // Keep type, category, account — clear amount, description, notes
    setValue("amount", 0);
    setValue("description", "");
    setValue("notes", null);
  }

  function handleDateInput(e: React.ChangeEvent<HTMLInputElement>) {
    const shortcut = parseDateShortcut(e.target.value);
    if (shortcut) {
      setValue("date", shortcut);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmitBatch)();
    }
  }

  return (
    <Dialog open={isTransactionModalOpen} onOpenChange={(open) => !open && closeTransactionModal()}>
      <DialogContent className="bg-card border-stroke text-text-primary sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Nova Transação</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          className="space-y-4"
        >
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue("type", "expense")}
              className={cn(
                "flex-1 py-2 rounded-md text-sm font-medium transition-colors",
                selectedType === "expense"
                  ? "bg-negative/12 text-negative"
                  : "bg-base text-text-secondary hover:text-text-primary"
              )}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "income")}
              className={cn(
                "flex-1 py-2 rounded-md text-sm font-medium transition-colors",
                selectedType === "income"
                  ? "bg-positive/12 text-positive"
                  : "bg-base text-text-secondary hover:text-text-primary"
              )}
            >
              Receita
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wide">Valor</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput value={field.value} onChange={field.onChange} autoFocus />
              )}
            />
            {errors.amount && <p className="text-negative text-xs">{errors.amount.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wide">Descrição</Label>
            <Input
              {...register("description")}
              placeholder="Ex: Mercado, Uber, Salário..."
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
            {errors.description && <p className="text-negative text-xs">{errors.description.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wide">Categoria</Label>
            <select
              {...register("category_id")}
              className="w-full h-10 bg-base border border-stroke rounded-md px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
            >
              <option value="">Selecione...</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-negative text-xs">{errors.category_id.message}</p>}
          </div>

          {/* Account */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wide">Conta</Label>
            <select
              {...register("account_id")}
              className="w-full h-10 bg-base border border-stroke rounded-md px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
            >
              <option value="">Selecione...</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
            {errors.account_id && <p className="text-negative text-xs">{errors.account_id.message}</p>}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wide">
              Data <span className="normal-case text-text-tertiary">(h=hoje, o=ontem, DDMM)</span>
            </Label>
            <Input
              type="date"
              {...register("date")}
              onBlur={handleDateInput}
              className="bg-base border-stroke text-text-primary focus:border-accent"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary text-xs uppercase tracking-wide">
              Observação <span className="normal-case text-text-tertiary">(opcional)</span>
            </Label>
            <textarea
              {...register("notes")}
              maxLength={500}
              rows={2}
              className="w-full bg-base border border-stroke rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15 resize-none"
              placeholder="Notas adicionais..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent hover:bg-accent-light text-white font-medium"
            >
              Salvar (Enter)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => { closeTransactionModal(); reset(); }}
              className="border-stroke text-text-secondary hover:text-text-primary hover:bg-card-elevated"
            >
              Cancelar
            </Button>
          </div>

          <p className="text-text-tertiary text-xs text-center">
            Ctrl+Enter = salvar e continuar (modo batch)
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Add TransactionModal to app layout**

Update `src/app/(app)/layout.tsx`:
```tsx
import { Shell } from "@/components/layout/shell";
import { KeyboardShortcutProvider } from "@/components/shared/keyboard-shortcut-provider";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardShortcutProvider>
      <Shell>{children}</Shell>
      <TransactionModal />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--color-card)",
            border: "1px solid var(--color-stroke)",
            color: "var(--color-text-primary)",
          },
        }}
      />
    </KeyboardShortcutProvider>
  );
}
```

- [ ] **Step 5: Verify modal works**

Run: `npm run dev` — press Ctrl+N from any page.
Expected: Transaction modal opens with all fields, type toggle, and currency input working.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add transaction modal with keyboard-first data entry and batch mode"
```

---

### Task 12: Transactions Page (List, Filters, Search)

This task builds the full Transactions page with filterable table, search, and summary row. Due to plan length constraints, subsequent tasks follow the same pattern but are described more concisely.

**Files:**
- Create: `src/components/transactions/transaction-table.tsx`
- Create: `src/components/transactions/filter-bar.tsx`
- Create: `src/components/transactions/transaction-summary.tsx`
- Modify: `src/app/(app)/transactions/page.tsx`

Implementation follows the same TDD approach: create the table component with category badges (inline pill with category color), value formatting (positive green, negative red), hover actions (edit, delete), filter bar with period/type/category/account selects, and summary row (total income, total expenses, balance). Wire everything together on the Transactions page.

- [ ] **Step 1: Build TransactionTable component** — Render transactions with date, description, category badge, account, and formatted value. Row height 44px, hover shows action menu.

- [ ] **Step 2: Build FilterBar component** — Period selector (current month default), type filter (all/income/expense), category dropdown, account dropdown, search input with Ctrl+F focus.

- [ ] **Step 3: Build TransactionSummary component** — Three KPI cards: total income (green), total expenses (red), balance.

- [ ] **Step 4: Wire Transactions page** — Compose FilterBar + TransactionSummary + TransactionTable + "Nova Transação" button calling openTransactionModal.

- [ ] **Step 5: Verify** — Run dev server, navigate to /transactions, test filters and search.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add transactions page with table, filters, search, and summary"
```

---

## Phase 4 — Remaining MVP Screens

Each task below follows the same pattern: create domain-specific components, compose them on the page, verify visually, commit.

### Task 13: Accounts Page

**Files:** `src/components/accounts/account-card.tsx`, `src/components/accounts/account-modal.tsx`, `src/lib/hooks/use-account-balance.ts`, `src/app/(app)/accounts/page.tsx`

- [ ] **Step 1:** Build AccountCard — shows name, type, current balance (initial_balance + sum of transactions), color indicator.
- [ ] **Step 2:** Build AccountModal — form to create/edit account (name, type, initial balance, color).
- [ ] **Step 3:** Build useAccountBalance hook — calculates real balance per account from transactions.
- [ ] **Step 4:** Wire Accounts page — consolidated balance card at top + grid of AccountCards + "Nova Conta" button.
- [ ] **Step 5:** Verify and commit.

```bash
git commit -m "feat: add accounts page with balance calculation and account management"
```

---

### Task 14: Categories Page

**Files:** `src/components/categories/category-card.tsx`, `src/components/categories/category-modal.tsx`, `src/app/(app)/categories/page.tsx`

- [ ] **Step 1:** Build CategoryCard — name, icon, color, progress bar (spent/limit), alert badge if > 80%.
- [ ] **Step 2:** Build CategoryModal — form to create/edit category (name, icon picker, color, monthly limit).
- [ ] **Step 3:** Wire Categories page — grid of CategoryCards with spending data from current month transactions.
- [ ] **Step 4:** Verify and commit.

```bash
git commit -m "feat: add categories page with budget tracking and limit alerts"
```

---

### Task 15: Credit Cards (Faturas) Page

**Files:** `src/components/credit-cards/credit-card-card.tsx`, `src/components/credit-cards/credit-card-modal.tsx`, `src/lib/hooks/use-credit-cards.ts`, `src/app/(app)/credit-cards/page.tsx`

- [ ] **Step 1:** Build CreditCardCard — name, bank, limit, current bill amount, progress bar (spent/limit), closing and due dates.
- [ ] **Step 2:** Build CreditCardModal — form to create/edit card (name, bank, limit, closing day, due day).
- [ ] **Step 3:** Build useCreditCards hook — fetches cards and calculates current bill from transactions.
- [ ] **Step 4:** Wire page — grid of cards + transaction list for selected card's current billing period.
- [ ] **Step 5:** Verify and commit.

```bash
git commit -m "feat: add credit cards page with bill tracking"
```

---

### Task 16: Recurring Page

**Files:** `src/components/recurring/recurring-card.tsx`, `src/components/recurring/recurring-modal.tsx`, `src/lib/hooks/use-recurring.ts`, `src/app/(app)/recurring/page.tsx`

- [ ] **Step 1:** Build RecurringCard — description, amount, frequency, next payment date, installment progress (if applicable).
- [ ] **Step 2:** Build RecurringModal — form to create/edit (description, amount, category, account, frequency, start/end date, installments).
- [ ] **Step 3:** Build useRecurring hook — fetches recurring items, calculates next payment.
- [ ] **Step 4:** Wire page — active subscriptions section + installments section + "Nova Recorrente" button.
- [ ] **Step 5:** Verify and commit.

```bash
git commit -m "feat: add recurring page with subscriptions and installments"
```

---

### Task 17: Income Page

**Files:** `src/components/income/income-summary.tsx`, `src/components/income/income-by-source-chart.tsx`, `src/app/(app)/income/page.tsx`

- [ ] **Step 1:** Build IncomeSummary — KPI cards (total income current month, comparison vs previous month, income count).
- [ ] **Step 2:** Build IncomeBySourceChart — Recharts bar chart grouping income transactions by category.
- [ ] **Step 3:** Wire page — summary + chart + filtered transaction list (type=income only).
- [ ] **Step 4:** Verify and commit.

```bash
git commit -m "feat: add income page with summary, chart, and transaction list"
```

---

### Task 18: Goals Page

**Files:** `src/components/goals/goal-card.tsx`, `src/components/goals/goal-modal.tsx`, `src/components/goals/contribution-modal.tsx`, `src/lib/hooks/use-goals.ts`, `src/app/(app)/goals/page.tsx`

- [ ] **Step 1:** Build GoalCard — name, target amount, current amount, circular progress gauge, deadline, color.
- [ ] **Step 2:** Build GoalModal — form to create/edit goal (name, target, deadline, account, color).
- [ ] **Step 3:** Build ContributionModal — form to add contribution (amount, date).
- [ ] **Step 4:** Build useGoals hook — fetches goals and contributions, calculates progress percentage.
- [ ] **Step 5:** Wire page — grid of GoalCards + "Nova Meta" button.
- [ ] **Step 6:** Verify and commit.

```bash
git commit -m "feat: add goals page with progress tracking and contributions"
```

---

## Phase 5 — Dashboard with Real Data

### Task 19: Dashboard KPI Cards

**Files:** `src/components/dashboard/kpi-card.tsx`, modify `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1:** Build KpiCard component — value (28px/600), label (11px/400 uppercase), variation badge (vs previous month). Green/red badge with arrow.
- [ ] **Step 2:** Wire to Dashboard — 4 KPI cards (Receita, Despesas, Saldo, Taxa de Economia) using useTransactions with current and previous month data.
- [ ] **Step 3:** Verify and commit.

```bash
git commit -m "feat: add dashboard KPI cards with real data"
```

---

### Task 20: Dashboard Charts (Spending Pace + Category Donut)

**Files:** `src/components/dashboard/spending-pace-chart.tsx`, `src/components/dashboard/category-donut.tsx`

- [ ] **Step 1:** Build SpendingPaceChart — Recharts AreaChart, two datasets (current month accumulated daily vs previous month), gradient fill, tooltip with day value.
- [ ] **Step 2:** Build CategoryDonut — Recharts PieChart (donut), max 8 slices + "Outros", center text showing savings %, vertical legend with color/name/percentage.
- [ ] **Step 3:** Add to Dashboard — Zona 2 layout (60% area chart left, 40% donut right).
- [ ] **Step 4:** Verify and commit.

```bash
git commit -m "feat: add spending pace area chart and category donut to dashboard"
```

---

### Task 21: Dashboard Bottom Zone (Partial Result + Top Categories + Recent Transactions)

**Files:** `src/components/dashboard/partial-result.tsx`, `src/components/dashboard/top-categories.tsx`, `src/components/dashboard/recent-transactions.tsx`

- [ ] **Step 1:** Build PartialResult — month result (income - expenses) with color, progress bar (income vs expense proportional).
- [ ] **Step 2:** Build TopCategories — table with icon, category name, spent value, progress bar, variation badge vs previous month.
- [ ] **Step 3:** Build RecentTransactions — last 8 transactions with category icon, description, date, value. "Ver todas" link to /transactions.
- [ ] **Step 4:** Add to Dashboard — Zona 3 (35% partial result left, 65% top categories right) + Zona 4 (full width recent transactions).
- [ ] **Step 5:** Verify and commit.

```bash
git commit -m "feat: complete dashboard with partial result, top categories, and recent transactions"
```

---

## Phase 6 — Polish & Deploy

### Task 22: Supabase Setup & Deploy

**Files:** None (external configuration)

- [ ] **Step 1:** Create Supabase project at supabase.com (free tier). Copy URL and anon key to `.env.local`.
- [ ] **Step 2:** Run migration — go to Supabase SQL Editor, paste contents of `supabase/migrations/001_initial_schema.sql`, execute.
- [ ] **Step 3:** Run seed — paste contents of `supabase/seed.sql`, execute.
- [ ] **Step 4:** Configure Auth — in Supabase dashboard, enable email+password provider. Disable email confirmation for testing phase.
- [ ] **Step 5:** Test locally — `npm run dev`, register a user, verify categories are auto-created, create a transaction.
- [ ] **Step 6:** Deploy to Vercel — connect GitHub repo, add environment variables (SUPABASE_URL, SUPABASE_ANON_KEY), deploy.
- [ ] **Step 7:** Verify production — access Vercel URL, register, test core flow.
- [ ] **Step 8:** Commit any deploy-related config changes.

```bash
git commit -m "chore: finalize deploy configuration"
```

---

### Task 23: Root Layout & Font Configuration

**Files:** `src/app/layout.tsx`

- [ ] **Step 1:** Configure Inter font via next/font/google in root layout. Set as body className.
- [ ] **Step 2:** Add metadata (title: "FinCtrl", description: "Gestão financeira pessoal").
- [ ] **Step 3:** Verify font renders correctly.
- [ ] **Step 4:** Commit.

```bash
git commit -m "feat: configure Inter font and app metadata"
```

---

## Summary

| Phase | Tasks | What it delivers |
|---|---|---|
| 1 — Foundation | 1-6 | Project setup, design tokens, shadcn/ui, Supabase client, types, utilities |
| 2 — Auth & Shell | 7-9 | Login, register, sidebar, routing, all placeholder pages |
| 3 — Core Features | 10-12 | Keyboard shortcuts, transaction modal, transactions page |
| 4 — MVP Screens | 13-18 | Accounts, categories, credit cards, recurring, income, goals |
| 5 — Dashboard | 19-21 | KPIs, charts, complete dashboard with real data |
| 6 — Deploy | 22-23 | Supabase setup, Vercel deploy, font config |

Total: **23 tasks**, organized so each phase delivers usable, testable functionality.
