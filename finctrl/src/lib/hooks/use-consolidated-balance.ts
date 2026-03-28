"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

/**
 * Fetches the consolidated balance directly from Supabase.
 * Balance = sum(initial_balance of all accounts) + sum(income transactions) - sum(expense transactions)
 * This avoids needing to load ALL transactions into memory.
 */
export function useConsolidatedBalanceDirect() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchBalance = useCallback(async () => {
    const supabase = createClient()

    // Get sum of initial balances
    const { data: accounts } = await supabase
      .from("accounts")
      .select("initial_balance")
      .eq("is_active", true)

    const initialTotal = (accounts ?? []).reduce(
      (sum, acc) => sum + Number(acc.initial_balance),
      0
    )

    // Get sum of all income
    const { data: incomeData } = await supabase
      .from("transactions")
      .select("amount")
      .eq("type", "income")

    const totalIncome = (incomeData ?? []).reduce(
      (sum, t) => sum + Number(t.amount),
      0
    )

    // Get sum of all expenses
    const { data: expenseData } = await supabase
      .from("transactions")
      .select("amount")
      .eq("type", "expense")

    const totalExpenses = (expenseData ?? []).reduce(
      (sum, t) => sum + Number(t.amount),
      0
    )

    setBalance(initialTotal + totalIncome - totalExpenses)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return { balance, loading, refetch: fetchBalance }
}
