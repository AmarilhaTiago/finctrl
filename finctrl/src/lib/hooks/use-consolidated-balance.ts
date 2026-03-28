"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

/**
 * Fetches the consolidated balance directly from Supabase.
 * Balance = sum(initial_balance of all accounts) + sum(income transactions) - sum(expense transactions)
 */
export function useConsolidatedBalanceDirect() {
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchBalance = useCallback(async () => {
    try {
      const supabase = createClient()

      // Get all active accounts with their initial balances
      const { data: accounts, error: accError } = await supabase
        .from("accounts")
        .select("initial_balance")
        .eq("is_active", true)

      if (accError) {
        console.error("Error fetching accounts for balance:", accError)
        setLoading(false)
        return
      }

      let initialTotal = 0
      if (accounts && accounts.length > 0) {
        for (const acc of accounts) {
          const val = parseFloat(String(acc.initial_balance ?? 0))
          if (!isNaN(val)) initialTotal += val
        }
      }

      // Get all transactions to calculate net flow
      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("type, amount")

      if (txError) {
        console.error("Error fetching transactions for balance:", txError)
        // Still show initial balance even if transactions fail
        setBalance(initialTotal)
        setLoading(false)
        return
      }

      let totalIncome = 0
      let totalExpenses = 0
      if (transactions && transactions.length > 0) {
        for (const t of transactions) {
          const amount = parseFloat(String(t.amount ?? 0))
          if (isNaN(amount)) continue
          if (t.type === "income") totalIncome += amount
          else if (t.type === "expense") totalExpenses += amount
        }
      }

      const total = initialTotal + totalIncome - totalExpenses
      setBalance(total)
    } catch (err) {
      console.error("Error calculating consolidated balance:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return { balance, loading, refetch: fetchBalance }
}
