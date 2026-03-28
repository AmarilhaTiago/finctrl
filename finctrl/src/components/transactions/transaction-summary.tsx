"use client"

import type { TransactionWithRelations } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/currency"

interface TransactionSummaryProps {
  transactions: TransactionWithRelations[]
  loading: boolean
}

export function TransactionSummary({ transactions, loading }: TransactionSummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const cards = [
    {
      label: "Total Receitas",
      value: totalIncome,
      color: "#22D3A0",
      bgColor: "rgba(34, 211, 160, 0.08)",
    },
    {
      label: "Total Despesas",
      value: totalExpense,
      color: "#EF5350",
      bgColor: "rgba(239, 83, 80, 0.08)",
    },
    {
      label: "Saldo",
      value: balance,
      color: balance >= 0 ? "#22D3A0" : "#EF5350",
      bgColor: balance >= 0 ? "rgba(34, 211, 160, 0.08)" : "rgba(239, 83, 80, 0.08)",
    },
  ]

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            backgroundColor: "#1A1D27",
            border: "1px solid #252840",
            borderRadius: "12px",
            padding: "16px 20px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#8B8FA8",
              marginBottom: "8px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {card.label}
          </p>
          {loading ? (
            <div
              style={{
                height: "24px",
                width: "120px",
                backgroundColor: "#252840",
                borderRadius: "6px",
                animation: "pulse 1.5s infinite",
              }}
            />
          ) : (
            <p
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: card.color,
                lineHeight: 1,
              }}
            >
              {formatCurrency(card.value)}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
