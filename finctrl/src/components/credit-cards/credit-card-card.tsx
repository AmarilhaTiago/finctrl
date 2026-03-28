"use client"

import { useState } from "react"
import type { CreditCardWithBill } from "@/lib/hooks/use-credit-cards"
import { formatCurrency } from "@/lib/utils/currency"

const DEFAULT_COLOR = "#5B8AF5"

interface CreditCardCardProps {
  card: CreditCardWithBill
}

function ordinalDay(day: number): string {
  return `dia ${day}`
}

export function CreditCardCard({ card }: CreditCardCardProps) {
  const [hovered, setHovered] = useState(false)
  const color = card.color || DEFAULT_COLOR
  const spentPercent =
    card.credit_limit > 0
      ? Math.min(100, (card.currentBill / card.credit_limit) * 100)
      : 0
  const available = card.credit_limit - card.currentBill
  const isOverLimit = card.currentBill > card.credit_limit

  const barColor =
    spentPercent >= 90
      ? "#EF5350"
      : spentPercent >= 70
      ? "#F5A623"
      : "#22D3A0"

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#1E2130" : "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "background-color 0.15s ease, box-shadow 0.15s ease",
        boxShadow: hovered
          ? "0 4px 24px rgba(0,0,0,0.35)"
          : "0 1px 4px rgba(0,0,0,0.2)",
        cursor: "default",
      }}
    >
      {/* Top color bar */}
      <div style={{ height: "4px", backgroundColor: color, width: "100%" }} />

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#F0F2FF",
                lineHeight: 1.3,
              }}
            >
              {card.name}
            </div>
            {card.bank && (
              <div style={{ fontSize: "12px", color: "#8B8FA8", marginTop: "2px" }}>
                {card.bank}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "#8B8FA8",
              backgroundColor: "#252840",
              borderRadius: "6px",
              padding: "2px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            Cartao
          </div>
        </div>

        {/* Bill amount */}
        <div>
          <div style={{ fontSize: "11px", color: "#555872", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Fatura Atual
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: isOverLimit ? "#EF5350" : "#F0F2FF",
              letterSpacing: "-0.02em",
            }}
          >
            {formatCurrency(card.currentBill)}
          </div>
          <div style={{ fontSize: "12px", color: "#8B8FA8", marginTop: "2px" }}>
            de {formatCurrency(card.credit_limit)} limite &bull; {formatCurrency(available)} disponivel
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div
            style={{
              height: "6px",
              backgroundColor: "#252840",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${spentPercent}%`,
                backgroundColor: barColor,
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span style={{ fontSize: "11px", color: "#555872" }}>
              {spentPercent.toFixed(0)}% utilizado
            </span>
            <span style={{ fontSize: "11px", color: barColor, fontWeight: 500 }}>
              {spentPercent.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Dates */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "8px",
            borderTop: "1px solid #252840",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "11px", color: "#555872", marginBottom: "2px" }}>Fechamento</div>
            <div style={{ fontSize: "13px", color: "#8B8FA8", fontWeight: 500 }}>
              {ordinalDay(card.closing_day)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#555872", marginBottom: "2px" }}>Vencimento</div>
            <div style={{ fontSize: "13px", color: "#8B8FA8", fontWeight: 500 }}>
              {ordinalDay(card.due_day)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
