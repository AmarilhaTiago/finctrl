"use client"

import { useState } from "react"
import type { RecurringWithNextDate } from "@/lib/hooks/use-recurring"
import { formatCurrency } from "@/lib/utils/currency"
import { formatDate } from "@/lib/utils/date"

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
}

interface RecurringCardProps {
  item: RecurringWithNextDate
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function RecurringCard({ item }: RecurringCardProps) {
  const [hovered, setHovered] = useState(false)
  const isIncome = item.type === "income"
  const amountColor = isIncome ? "#22D3A0" : "#EF5350"
  const categoryColor = item.category?.color || "#8B8FA8"
  const hasInstallments =
    item.total_installments != null && item.current_installment != null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#1E2130" : "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "background-color 0.15s ease, box-shadow 0.15s ease",
        boxShadow: hovered
          ? "0 4px 24px rgba(0,0,0,0.35)"
          : "0 1px 4px rgba(0,0,0,0.2)",
        cursor: "default",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: "8px" }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#F0F2FF",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.description}
          </div>
          {item.category && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "4px",
                padding: "2px 8px",
                borderRadius: "100px",
                backgroundColor: hexToRgba(categoryColor, 0.15),
                fontSize: "11px",
                fontWeight: 500,
                color: categoryColor,
              }}
            >
              {item.category.icon && <span>{item.category.icon}</span>}
              {item.category.name}
            </span>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: amountColor,
              letterSpacing: "-0.01em",
            }}
          >
            {isIncome ? "+" : "-"}{formatCurrency(item.amount)}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#8B8FA8",
              marginTop: "2px",
              backgroundColor: "#252840",
              borderRadius: "6px",
              padding: "1px 6px",
              display: "inline-block",
            }}
          >
            {FREQUENCY_LABELS[item.frequency] || item.frequency}
          </div>
        </div>
      </div>

      {/* Installment progress */}
      {hasInstallments && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", color: "#555872" }}>
              {item.current_installment}/{item.total_installments} parcelas
            </span>
            <span style={{ fontSize: "11px", color: "#8B8FA8" }}>
              {Math.round(
                ((item.current_installment ?? 0) /
                  (item.total_installments ?? 1)) *
                  100
              )}
              %
            </span>
          </div>
          <div
            style={{
              height: "4px",
              backgroundColor: "#252840",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(
                  100,
                  ((item.current_installment ?? 0) /
                    (item.total_installments ?? 1)) *
                    100
                )}%`,
                backgroundColor: "#5B8AF5",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      )}

      {/* Next date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "8px",
          borderTop: "1px solid #252840",
        }}
      >
        <span style={{ fontSize: "12px", color: "#555872" }}>
          Proximo pagamento
        </span>
        <span style={{ fontSize: "12px", color: "#8B8FA8", fontWeight: 500 }}>
          {formatDate(item.nextPaymentDate)}
        </span>
      </div>
    </div>
  )
}
