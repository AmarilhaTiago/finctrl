"use client"

import { useMemo } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { IncomeSummary } from "@/components/income/income-summary"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { useTransactions } from "@/lib/hooks/use-transactions"
import { getMonthRange, getCurrentMonthYear } from "@/lib/utils/date"

export default function IncomePage() {
  const { month, year } = getCurrentMonthYear()

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

  const { transactions: currentTransactions, loading: loadingCurrent } =
    useTransactions({ startDate: start, endDate: end, type: "income" })

  const { transactions: previousTransactions, loading: loadingPrev } =
    useTransactions({ startDate: prevStart, endDate: prevEnd, type: "income" })

  const loading = loadingCurrent || loadingPrev

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
