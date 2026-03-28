"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
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
  onDelete?: (account: Account) => void
}

export function AccountCard({ account, balance, onDelete }: AccountCardProps) {
  const [hovered, setHovered] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const color = account.color || DEFAULT_COLOR
  const isNegative = balance < 0

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation()
    setConfirmOpen(true)
  }

  function handleCancelDelete(e: React.MouseEvent) {
    e.stopPropagation()
    setConfirmOpen(false)
  }

  function handleConfirmDelete(e: React.MouseEvent) {
    e.stopPropagation()
    setConfirmOpen(false)
    onDelete?.(account)
  }

  return (
    <>
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
          position: "relative",
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
              {/* Delete button — visible on hover */}
              <button
                onClick={handleDeleteClick}
                aria-label={`Excluir conta ${account.name}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: hovered ? "#EF535018" : "transparent",
                  color: hovered ? "#EF5350" : "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease, color 0.15s ease",
                  flexShrink: 0,
                }}
              >
                <Trash2 size={14} strokeWidth={2} />
              </button>
            </div>
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

      {/* Confirmation dialog */}
      {confirmOpen && (
        <div
          onClick={handleCancelDelete}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1A1D27",
              border: "1px solid #252840",
              borderRadius: "16px",
              padding: "28px 32px",
              maxWidth: "400px",
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#EF535018",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={20} color="#EF5350" strokeWidth={2} />
            </div>

            {/* Title + message */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#F0F2FF",
                  lineHeight: 1.3,
                }}
              >
                Excluir conta
              </span>
              <span style={{ fontSize: "14px", color: "#8B8FA8", lineHeight: 1.5 }}>
                Tem certeza que deseja excluir a conta{" "}
                <span style={{ color: "#F0F2FF", fontWeight: 500 }}>{account.name}</span>?
                Esta ação não pode ser desfeita.
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={handleCancelDelete}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "1px solid #252840",
                  backgroundColor: "transparent",
                  color: "#8B8FA8",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#EF5350",
                  color: "#F0F2FF",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
