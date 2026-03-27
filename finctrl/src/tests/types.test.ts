import { describe, it, expectTypeOf } from "vitest";
import type {
  Transaction, TransactionType, Account, AccountType,
  Category, CategoryType, CreditCard, Recurring, Frequency,
  Goal, GoalContribution, Profile,
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

  it("nullable fields are typed correctly", () => {
    expectTypeOf<Transaction["credit_card_id"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Transaction["notes"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Goal["deadline"]>().toEqualTypeOf<string | null>();
    expectTypeOf<Account["color"]>().toEqualTypeOf<string | null>();
  });
});
