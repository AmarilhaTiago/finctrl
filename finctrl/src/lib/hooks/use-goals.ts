"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Goal } from "@/lib/types/database"

export interface GoalWithProgress extends Goal {
  progressPercent: number
}

export function useGoals() {
  const [goals, setGoals] = useState<GoalWithProgress[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGoals = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false })

    if (error || !data) {
      setLoading(false)
      return
    }

    const withProgress = (data as Goal[]).map((g) => ({
      ...g,
      progressPercent:
        g.target_amount > 0
          ? Math.min(100, (g.current_amount / g.target_amount) * 100)
          : 0,
    }))

    setGoals(withProgress)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  async function createGoal(input: {
    name: string
    target_amount: number
    deadline?: string | null
    account_id?: string | null
    color?: string | null
  }): Promise<Goal | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("goals")
      .insert([{ ...input, current_amount: 0, is_completed: false }])
      .select()
      .single()

    if (error) throw error
    await fetchGoals()
    return data as Goal
  }

  async function addContribution(
    goalId: string,
    amount: number,
    date: string
  ): Promise<void> {
    const supabase = createClient()

    // Insert contribution
    const { error: contribError } = await supabase
      .from("goal_contributions")
      .insert([{ goal_id: goalId, amount, date }])

    if (contribError) throw contribError

    // Update goal current_amount
    const goal = goals.find((g) => g.id === goalId)
    if (goal) {
      const newAmount = goal.current_amount + amount
      const { error: updateError } = await supabase
        .from("goals")
        .update({
          current_amount: newAmount,
          is_completed: newAmount >= goal.target_amount,
        })
        .eq("id", goalId)

      if (updateError) throw updateError
    }

    await fetchGoals()
  }

  return { goals, loading, createGoal, addContribution, refetch: fetchGoals }
}
