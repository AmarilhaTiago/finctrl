"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpendingPaceChart } from "@/components/dashboard/spending-pace-chart";
import { CategoryDonut } from "@/components/dashboard/category-donut";
import { PartialResult } from "@/components/dashboard/partial-result";
import { TopCategories } from "@/components/dashboard/top-categories";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { useCategories } from "@/lib/hooks/use-categories";
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateSavingsRate,
  calculateCategorySpending,
} from "@/lib/utils/calculations";
import { formatCurrency } from "@/lib/utils/currency";
import { getMonthRange, getCurrentMonthYear } from "@/lib/utils/date";

function getPreviousMonthYear(month: number, year: number): { month: number; year: number } {
  if (month === 0) return { month: 11, year: year - 1 };
  return { month: month - 1, year };
}

export default function DashboardPage() {
  const { month, year } = getCurrentMonthYear();
  const { month: prevMonth, year: prevYear } = getPreviousMonthYear(month, year);

  const currentRange = getMonthRange(year, month);
  const previousRange = getMonthRange(prevYear, prevMonth);

  const { transactions: currentTransactions, loading: loadingCurrent } = useTransactions({
    startDate: currentRange.start,
    endDate: currentRange.end,
  });

  const { transactions: previousTransactions, loading: loadingPrevious } = useTransactions({
    startDate: previousRange.start,
    endDate: previousRange.end,
  });

  const { categories, loading: loadingCategories } = useCategories();

  // KPI calculations
  const currentIncome = useMemo(() => calculateTotalIncome(currentTransactions), [currentTransactions]);
  const currentExpenses = useMemo(() => calculateTotalExpenses(currentTransactions), [currentTransactions]);
  const currentBalance = currentIncome - currentExpenses;
  const currentSavingsRate = useMemo(
    () => calculateSavingsRate(currentIncome, currentExpenses),
    [currentIncome, currentExpenses]
  );

  const prevIncome = useMemo(() => calculateTotalIncome(previousTransactions), [previousTransactions]);
  const prevExpenses = useMemo(() => calculateTotalExpenses(previousTransactions), [previousTransactions]);
  const prevBalance = prevIncome - prevExpenses;
  const prevSavingsRate = useMemo(
    () => calculateSavingsRate(prevIncome, prevExpenses),
    [prevIncome, prevExpenses]
  );

  // Variations vs previous month
  const incomeVariation = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : undefined;
  const expensesVariation =
    prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : undefined;
  const balanceVariation =
    Math.abs(prevBalance) > 0 ? ((currentBalance - prevBalance) / Math.abs(prevBalance)) * 100 : undefined;
  const savingsVariation =
    Math.abs(prevSavingsRate) > 0
      ? currentSavingsRate - prevSavingsRate
      : undefined;

  // Category spending
  const currentCategorySpending = useMemo(
    () => calculateCategorySpending(currentTransactions),
    [currentTransactions]
  );
  const previousCategorySpending = useMemo(
    () => calculateCategorySpending(previousTransactions),
    [previousTransactions]
  );

  const isLoading = loadingCurrent || loadingPrevious || loadingCategories;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral das suas finanças" />

      {/* Zone 1: KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        <KpiCard
          label="Receita"
          value={formatCurrency(currentIncome)}
          valueColor="#22D3A0"
          variation={incomeVariation}
        />
        <KpiCard
          label="Despesas"
          value={formatCurrency(currentExpenses)}
          valueColor="#EF5350"
          variation={expensesVariation !== undefined ? -expensesVariation : undefined}
        />
        <KpiCard
          label="Saldo"
          value={formatCurrency(currentBalance)}
          valueColor={currentBalance >= 0 ? "#F0F2FF" : "#EF5350"}
          variation={balanceVariation}
        />
        <KpiCard
          label="Taxa de Economia"
          value={`${currentSavingsRate.toFixed(1)}%`}
          valueColor={currentSavingsRate >= 0 ? "#5B8AF5" : "#EF5350"}
          variation={savingsVariation}
        />
      </div>

      {/* Zone 2: Chart + Donut */}
      <div style={{ display: "grid", gridTemplateColumns: "60% 40%", gap: "16px", marginBottom: "20px" }}>
        <SpendingPaceChart
          currentTransactions={currentTransactions}
          previousTransactions={previousTransactions}
          currentMonth={month}
          currentYear={year}
        />
        <CategoryDonut
          categorySpending={currentCategorySpending}
          categories={categories}
          savingsRate={currentSavingsRate}
        />
      </div>

      {/* Zone 3: Partial Result + Top Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "35% 65%", gap: "16px", marginBottom: "20px" }}>
        <PartialResult income={currentIncome} expenses={currentExpenses} />
        <TopCategories
          categorySpending={currentCategorySpending}
          previousCategorySpending={previousCategorySpending}
          categories={categories}
        />
      </div>

      {/* Zone 4: Recent Transactions */}
      <div style={{ marginBottom: "20px" }}>
        <RecentTransactions transactions={currentTransactions} />
      </div>
    </div>
  );
}
