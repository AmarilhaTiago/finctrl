"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Account } from "@/lib/types/database"

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (!error && data) {
      setAccounts(data as Account[])
    }
    setLoading(false)
  }, [])

  const deleteAccount = useCallback(async (id: string): Promise<{ error: string | null }> => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: "Usuário não autenticado" }
    }
    const { error } = await supabase
      .from("accounts")
      .delete()
      .eq("id", id)
    if (error) {
      return { error: error.message }
    }
    return { error: null }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return { accounts, loading, refetch: fetchAccounts, deleteAccount }
}
