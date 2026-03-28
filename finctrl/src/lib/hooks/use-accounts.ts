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

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return { accounts, loading, refetch: fetchAccounts }
}
