"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { CreditCard } from "@/lib/types/database"

export interface CreditCardWithBill extends CreditCard {
  currentBill: number
}

function getBillingPeriod(closingDay: number): { start: string; end: string } {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  let periodStart: Date
  let periodEnd: Date

  if (day <= closingDay) {
    // We're before closing: period started last month after closing day
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    periodStart = new Date(prevYear, prevMonth, closingDay + 1)
    periodEnd = new Date(year, month, closingDay)
  } else {
    // We're after closing: period started this month after closing day
    periodStart = new Date(year, month, closingDay + 1)
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    periodEnd = new Date(nextYear, nextMonth, closingDay)
  }

  const fmt = (d: Date) => d.toISOString().split("T")[0]
  return { start: fmt(periodStart), end: fmt(periodEnd) }
}

export function useCreditCards() {
  const [creditCards, setCreditCards] = useState<CreditCardWithBill[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCreditCards = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    const { data: cards, error } = await supabase
      .from("credit_cards")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error || !cards) {
      setLoading(false)
      return
    }

    // For each card, calculate the current bill
    const cardsWithBills = await Promise.all(
      cards.map(async (card: CreditCard) => {
        const { start, end } = getBillingPeriod(card.closing_day)
        const { data: txns } = await supabase
          .from("transactions")
          .select("amount")
          .eq("credit_card_id", card.id)
          .eq("type", "expense")
          .gte("date", start)
          .lte("date", end)

        const currentBill = (txns || []).reduce(
          (sum: number, t: { amount: number }) => sum + t.amount,
          0
        )
        return { ...card, currentBill } as CreditCardWithBill
      })
    )

    setCreditCards(cardsWithBills)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCreditCards()
  }, [fetchCreditCards])

  async function createCreditCard(input: {
    name: string
    bank: string | null
    credit_limit: number
    closing_day: number
    due_day: number
    color: string | null
  }): Promise<CreditCard | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuário não autenticado")

    const { data, error } = await supabase
      .from("credit_cards")
      .insert([{ ...input, is_active: true, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    await fetchCreditCards()
    return data as CreditCard
  }

  return { creditCards, loading, createCreditCard, refetch: fetchCreditCards }
}
