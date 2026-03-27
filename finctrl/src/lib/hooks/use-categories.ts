"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types/database"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (!error && data) {
        setCategories(data as Category[])
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  return { categories, loading }
}
