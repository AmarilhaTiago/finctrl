import type { Transaction } from "@/lib/types/database";

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc - t.amount, 0);
}

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
}

export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
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

export function calculateCategorySpending(transactions: Transaction[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    map.set(t.category_id, (map.get(t.category_id) ?? 0) + t.amount);
  }
  return map;
}
