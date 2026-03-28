"use client"

import { useState } from "react"
import type { Account } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/currency"

const ACCOUNT_TYPE_LABELS: Record<Account["type"], string> = {
  checking: "Corrente",
  savings: "Poupança",
  investment: "Investimento",
  wallet: "Carteira",
}

const DEFAULT_COLOR = "#5B8AF5"

interface AccountCardProps {
  account: Account
  balance: number
}

export function AccountCard({ account, balance }: AccountCardProps) {
  const [hovered, setHovered] = useState(false)
  const color = account.color || DEFAULT_COLOR
  const isNegative = balance < 0

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#1E2130" : "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        display: "flex",
        overflow: "hidden",
        transition: "background-color 0.15s ease, box-shadow 0.15s ease",
        boxShadow: hovered
          ? "0 4px 24px rgba(0,0,0,0.35)"
          : "0 1px 4px rgba(0,0,0,0.2)",
        cursor: "default",
      }}
    >
      {/* Color indicator */}
      <div
        style={{
          width: "4px",
          flexShrink: 0,
          backgroundColor: color,
          borderRadius: "12px 0 0 12px",
        }}
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "#F0F2FF",
              lineHeight: 1.3,
            }}
          >
            {account.name}
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "#8B8FA8",
              backgroundColor: "#252840",
              borderRadius: "6px",
              padding: "2px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {ACCOUNT_TYPE_LABELS[account.type]}
          </span>
        </div>

        <div
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: isNegative ? "#EF5350" : "#F0F2FF",
            letterSpacing: "-0.02em",
          }}
        >
          {formatCurrency(balance)}
        </div>
      </div>
    </div>
  )
}
