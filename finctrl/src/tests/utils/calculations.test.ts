import { describe, it, expect } from "vitest";
import { calculateBalance, calculateSavingsRate, calculateBurnRate, calculateCategorySpending } from "@/lib/utils/calculations";
import type { Transaction } from "@/lib/types/database";

const makeTransaction = (overrides: Partial<Transaction>): Transaction => ({
  id: "1", user_id: "u1", type: "expense", amount: 100, description: "Test",
  category_id: "c1", account_id: "a1", credit_card_id: null, date: "2026-03-01",
  recurring_id: null, notes: null, created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z",
  ...overrides,
});

describe("calculateBalance", () => {
  it("sums income and subtracts expenses", () => {
    const txns = [
      makeTransaction({ type: "income", amount: 5000 }),
      makeTransaction({ type: "expense", amount: 1200 }),
      makeTransaction({ type: "expense", amount: 800 }),
    ];
    expect(calculateBalance(txns)).toBe(3000);
  });
  it("returns 0 for empty", () => {
    expect(calculateBalance([])).toBe(0);
  });
});

describe("calculateSavingsRate", () => {
  it("calculates percentage saved", () => {
    expect(calculateSavingsRate(5000, 3500)).toBe(30);
  });
  it("returns 0 when income is 0", () => {
    expect(calculateSavingsRate(0, 100)).toBe(0);
  });
  it("returns negative when overspending", () => {
    expect(calculateSavingsRate(3000, 4000)).toBe(-33.33);
  });
});

describe("calculateBurnRate", () => {
  it("calculates expense percentage", () => {
    expect(calculateBurnRate(5000, 3500)).toBe(70);
  });
  it("returns 0 when income is 0", () => {
    expect(calculateBurnRate(0, 100)).toBe(0);
  });
});

describe("calculateCategorySpending", () => {
  it("groups expenses by category", () => {
    const txns = [
      makeTransaction({ category_id: "c1", amount: 200, type: "expense" }),
      makeTransaction({ category_id: "c1", amount: 150, type: "expense" }),
      makeTransaction({ category_id: "c2", amount: 500, type: "expense" }),
      makeTransaction({ category_id: "c1", amount: 1000, type: "income" }),
    ];
    const result = calculateCategorySpending(txns);
    expect(result.get("c1")).toBe(350);
    expect(result.get("c2")).toBe(500);
    expect(result.size).toBe(2);
  });
});
