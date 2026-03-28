"use client"

import { useMemo, useEffect } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { IncomeSummary } from "@/components/income/income-summary"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { useTransactions } from "@/lib/hooks/use-transactions"
import { useUIStore } from "@/lib/stores/ui-store"
import { getMonthRange, getCurrentMonthYear } from "@/lib/utils/date"

export default function IncomePage() {
  const { month, year } = getCurrentMonthYear()
  const refetchKey = useUIStore((s) => s.refetchKey)

  const { start, end } = useMemo(
    () => getMonthRange(year, month),
    [year, month]
  )

  // Previous month range
  const { start: prevStart, end: prevEnd } = useMemo(() => {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    return getMonthRange(prevYear, prevMonth)
  }, [month, year])

  const { transactions: currentTransactions, loading: loadingCurrent, refetch: refetchCurrent } =
    useTransactions({ startDate: start, endDate: end, type: "income" })

  const { transactions: previousTransactions, loading: loadingPrev, refetch: refetchPrev } =
    useTransactions({ startDate: prevStart, endDate: prevEnd, type: "income" })

  const loading = loadingCurrent || loadingPrev

  // Refetch when a transaction is created via the global modal
  useEffect(() => {
    if (refetchKey > 0) {
      refetchCurrent()
      refetchPrev()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey])

  return (
    <div>
      <PageHeader
        title="Receitas"
        subtitle="Suas fontes de renda"
      />

      <IncomeSummary
        currentTransactions={currentTransactions}
        previousTransactions={previousTransactions}
        loading={loading}
      />

      <TransactionTable
        transactions={currentTransactions}
        loading={loadingCurrent}
      />
    </div>
  )
}
