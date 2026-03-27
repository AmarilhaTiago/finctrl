"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ArrowRightLeft, Repeat, TrendingUp,
  Wallet, CreditCard, Tags, Target, LogOut,
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
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface border-r border-stroke flex flex-col">
      <div className="h-[60px] flex items-center px-5 border-b border-stroke">
        <h1 className="text-lg font-semibold text-text-primary">
          <span className="text-accent">Fin</span>Ctrl
        </h1>
      </div>

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
