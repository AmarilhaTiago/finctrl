"use client"

import { useMemo } from "react"
import type { Account, Transaction } from "@/lib/types/database"

/**
 * Calculates the current balance of an account from its initial_balance and transactions.
 * Balance = initial_balance + sum(income) - sum(expense)
 */
export function calculateAccountBalance(
  account: Account,
  transactions: Transaction[]
): number {
  const accountTransactions = transactions.filter(
    (t) => t.account_id === account.id
  )

  const transactionDelta = accountTransactions.reduce((acc, t) => {
    if (t.type === "income") return acc + t.amount
    if (t.type === "expense") return acc - t.amount
    return acc
  }, 0)

  return account.initial_balance + transactionDelta
}

/**
 * Hook that returns a map of accountId -> balance for all accounts.
 */
export function useAccountBalances(
  accounts: Account[],
  transactions: Transaction[]
): Map<string, number> {
  return useMemo(() => {
    const map = new Map<string, number>()
    for (const account of accounts) {
      map.set(account.id, calculateAccountBalance(account, transactions))
    }
    return map
  }, [accounts, transactions])
}

/**
 * Hook that calculates the consolidated (total) balance across all accounts.
 */
export function useConsolidatedBalance(
  accounts: Account[],
  transactions: Transaction[]
): number {
  return useMemo(() => {
    return accounts.reduce((total, account) => {
      return total + calculateAccountBalance(account, transactions)
    }, 0)
  }, [accounts, transactions])
}
