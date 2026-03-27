"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Account } from "@/lib/types/database"

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAccounts() {
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
    }

    fetchAccounts()
  }, [])

  return { accounts, loading }
}
