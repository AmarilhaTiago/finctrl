"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Transaction, TransactionWithRelations, TransactionType } from "@/lib/types/database"

interface TransactionFilters {
  startDate?: string
  endDate?: string
  type?: TransactionType
  categoryId?: string
  accountId?: string
  limit?: number
}

interface CreateTransactionInput {
  type: TransactionType
  amount: number
  description: string
  category_id: string
  account_id: string
  credit_card_id?: string | null
  date: string
  notes?: string | null
}

export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from("transactions")
      .select(`
        *,
        category:categories(*),
        account:accounts(*),
        credit_card:credit_cards(*)
      `)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })

    if (filters.startDate) {
      query = query.gte("date", filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte("date", filters.endDate)
    }
    if (filters.type) {
      query = query.eq("type", filters.type)
    }
    if (filters.categoryId) {
      query = query.eq("category_id", filters.categoryId)
    }
    if (filters.accountId) {
      query = query.eq("account_id", filters.accountId)
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (!error && data) {
      setTransactions(data as TransactionWithRelations[])
    }
    setLoading(false)
  }, [
    filters.startDate,
    filters.endDate,
    filters.type,
    filters.categoryId,
    filters.accountId,
    filters.limit,
  ])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  async function createTransaction(input: CreateTransactionInput): Promise<Transaction | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("transactions")
      .insert([input])
      .select()
      .single()

    if (error) {
      throw error
    }

    await fetchTransactions()
    return data as Transaction
  }

  async function deleteTransaction(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)

    if (error) {
      throw error
    }

    await fetchTransactions()
  }

  return {
    transactions,
    loading,
    createTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  }
}
