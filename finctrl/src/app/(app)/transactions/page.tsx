"use client"

import { useState, useMemo, useEffect } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { FilterBar, type FilterState } from "@/components/transactions/filter-bar"
import { TransactionSummary } from "@/components/transactions/transaction-summary"
import { useTransactions } from "@/lib/hooks/use-transactions"
import { useCategories } from "@/lib/hooks/use-categories"
import { useAccounts } from "@/lib/hooks/use-accounts"
import { useUIStore } from "@/lib/stores/ui-store"
import { getMonthRange, getCurrentMonthYear } from "@/lib/utils/date"

export default function TransactionsPage() {
  const { month, year } = getCurrentMonthYear()
  const openTransactionModal = useUIStore((s) => s.openTransactionModal)
  const openEditTransactionModal = useUIStore((s) => s.openEditTransactionModal)
  const refetchKey = useUIStore((s) => s.refetchKey)

  const [filters, setFilters] = useState<FilterState>({
    year,
    month,
    type: "",
    categoryId: "",
    accountId: "",
    search: "",
  })

  const { start, end } = useMemo(
    () => getMonthRange(filters.year, filters.month),
    [filters.year, filters.month]
  )

  const { transactions, loading, deleteTransaction, refetch: refetchTransactions } = useTransactions({
    startDate: start,
    endDate: end,
    type: filters.type || undefined,
    categoryId: filters.categoryId || undefined,
    accountId: filters.accountId || undefined,
  })

  const { categories } = useCategories()
  const { accounts } = useAccounts()

  // Refetch when a transaction is created via the global modal
  useEffect(() => {
    if (refetchKey > 0) {
      refetchTransactions()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey])

  // Client-side search filter on description
  const filteredTransactions = useMemo(() => {
    if (!filters.search.trim()) return transactions
    const query = filters.search.toLowerCase()
    return transactions.filter((t) =>
      t.description.toLowerCase().includes(query)
    )
  }, [transactions, filters.search])

  return (
    <div>
      <PageHeader
        title="Transações"
        subtitle="Todas as suas movimentações"
        action={
          <button
            onClick={openTransactionModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: "#5B8AF5",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nova Transação
          </button>
        }
      />

      <TransactionSummary transactions={filteredTransactions} loading={loading} />

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        accounts={accounts}
      />

      <TransactionTable
        transactions={filteredTransactions}
        loading={loading}
        onDelete={deleteTransaction}
        onEdit={openEditTransactionModal}
      />
    </div>
  )
}
