"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RecurringWithRelations, Frequency } from "@/lib/types/database"

export interface RecurringWithNextDate extends RecurringWithRelations {
  nextPaymentDate: string
}

function calcNextPaymentDate(startDate: string, frequency: Frequency): string {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const start = new Date(startDate + "T12:00:00")

  if (start >= now) return startDate

  let next = new Date(start)

  while (next < now) {
    if (frequency === "weekly") {
      next.setDate(next.getDate() + 7)
    } else if (frequency === "monthly") {
      next.setMonth(next.getMonth() + 1)
    } else if (frequency === "yearly") {
      next.setFullYear(next.getFullYear() + 1)
    }
  }

  return next.toISOString().split("T")[0]
}

export function useRecurring() {
  const [recurring, setRecurring] = useState<RecurringWithNextDate[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecurring = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("recurring")
      .select(`
        *,
        category:categories(*),
        account:accounts(*),
        credit_card:credit_cards(*)
      `)
      .eq("is_active", true)
      .order("description", { ascending: true })

    if (error || !data) {
      setLoading(false)
      return
    }

    const withDates = (data as RecurringWithRelations[]).map((r) => ({
      ...r,
      nextPaymentDate: calcNextPaymentDate(r.start_date, r.frequency),
    }))

    setRecurring(withDates)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRecurring()
  }, [fetchRecurring])

  async function createRecurring(input: {
    type: "income" | "expense"
    amount: number
    description: string
    category_id: string
    account_id: string
    frequency: Frequency
    start_date: string
    end_date?: string | null
    total_installments?: number | null
    current_installment?: number | null
  }): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuário não autenticado")

    const { error } = await supabase
      .from("recurring")
      .insert([{ ...input, is_active: true, user_id: user.id }])

    if (error) throw error
    await fetchRecurring()
  }

  return { recurring, loading, createRecurring, refetch: fetchRecurring }
}
