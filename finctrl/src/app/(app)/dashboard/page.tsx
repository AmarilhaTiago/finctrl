import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral das suas finanças" />
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-card border border-stroke rounded-lg p-5">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Receitas</span>
          <p className="text-2xl font-semibold text-positive mt-1">R$ 0,00</p>
        </div>
        <div className="bg-card border border-stroke rounded-lg p-5">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Despesas</span>
          <p className="text-2xl font-semibold text-negative mt-1">R$ 0,00</p>
        </div>
        <div className="bg-card border border-stroke rounded-lg p-5">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Saldo</span>
          <p className="text-2xl font-semibold text-text-primary mt-1">R$ 0,00</p>
        </div>
        <div className="bg-card border border-stroke rounded-lg p-5">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Economia</span>
          <p className="text-2xl font-semibold text-accent mt-1">0%</p>
        </div>
      </div>
    </div>
  );
}
