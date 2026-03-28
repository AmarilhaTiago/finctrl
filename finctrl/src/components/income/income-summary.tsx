"use client"

import type { TransactionWithRelations } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/currency"

interface IncomeSummaryProps {
  currentTransactions: TransactionWithRelations[]
  previousTransactions: TransactionWithRelations[]
  loading: boolean
}

function KPICard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: React.ReactNode
  accent?: string
}) {
  return (
    <div
      style={{
        backgroundColor: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#555872",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "26px",
          fontWeight: 700,
          color: accent || "#F0F2FF",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
      {sub && (
        <div style={{ fontSize: "12px", color: "#8B8FA8", marginTop: "2px" }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export function IncomeSummary({
  currentTransactions,
  previousTransactions,
  loading,
}: IncomeSummaryProps) {
  const totalIncome = currentTransactions.reduce((sum, t) => sum + t.amount, 0)
  const prevTotalIncome = previousTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  )
  const count = currentTransactions.length

  let changePercent: number | null = null
  if (prevTotalIncome > 0) {
    changePercent = ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100
  }

  const badgeColor =
    changePercent == null
      ? "#8B8FA8"
      : changePercent >= 0
      ? "#22D3A0"
      : "#EF5350"

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#1A1D27",
              border: "1px solid #252840",
              borderRadius: "12px",
              height: "96px",
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <KPICard
        label="Total de Receitas"
        value={formatCurrency(totalIncome)}
        accent="#22D3A0"
        sub={
          changePercent != null ? (
            <span style={{ color: badgeColor }}>
              {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(1)}% vs mes anterior
            </span>
          ) : (
            "Sem dados do mes anterior"
          )
        }
      />
      <KPICard
        label="Transacoes"
        value={String(count)}
        sub={
          count === 1
            ? "1 receita este mes"
            : `${count} receitas este mes`
        }
      />
      <KPICard
        label="Mes Anterior"
        value={formatCurrency(prevTotalIncome)}
        sub={
          prevTotalIncome === 0 ? "Sem receitas" : `${previousTransactions.length} transacoes`
        }
      />
    </div>
  )
}
