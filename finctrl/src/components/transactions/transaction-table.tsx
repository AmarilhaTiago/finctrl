"use client"

import { useState } from "react"
import type { TransactionWithRelations } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/currency"
import { formatDate } from "@/lib/utils/date"

interface TransactionTableProps {
  transactions: TransactionWithRelations[]
  loading: boolean
  onDelete?: (id: string) => void
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const COL_WIDTHS = {
  date: "100px",
  description: "1fr",
  category: "150px",
  account: "150px",
  amount: "130px",
  actions: "48px",
}

function TableHeader() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${COL_WIDTHS.date} ${COL_WIDTHS.description} ${COL_WIDTHS.category} ${COL_WIDTHS.account} ${COL_WIDTHS.amount} ${COL_WIDTHS.actions}`,
        padding: "0 16px",
        height: "36px",
        alignItems: "center",
        borderBottom: "1px solid #252840",
      }}
    >
      {["Data", "Descrição", "Categoria", "Conta", "Valor", ""].map((col) => (
        <span
          key={col}
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#555872",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {col}
        </span>
      ))}
    </div>
  )
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${COL_WIDTHS.date} ${COL_WIDTHS.description} ${COL_WIDTHS.category} ${COL_WIDTHS.account} ${COL_WIDTHS.amount} ${COL_WIDTHS.actions}`,
        padding: "0 16px",
        height: "44px",
        alignItems: "center",
        borderBottom: "1px solid #252840",
        gap: "8px",
      }}
    >
      {[70, 160, 90, 100, 80].map((w, i) => (
        <div
          key={i}
          style={{
            height: "14px",
            width: `${w}px`,
            backgroundColor: "#252840",
            borderRadius: "4px",
            opacity: 0.6,
          }}
        />
      ))}
      <div />
    </div>
  )
}

interface TransactionRowProps {
  transaction: TransactionWithRelations
  onDelete?: (id: string) => void
}

function TransactionRow({ transaction, onDelete }: TransactionRowProps) {
  const [hovered, setHovered] = useState(false)
  const [deleteHovered, setDeleteHovered] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isIncome = transaction.type === "income"
  const amountColor = isIncome ? "#22D3A0" : "#EF5350"
  const amountPrefix = isIncome ? "+" : "-"
  const categoryColor = transaction.category?.color || "#8B8FA8"

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!onDelete) return
    setDeleting(true)
    try {
      await onDelete(transaction.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: `${COL_WIDTHS.date} ${COL_WIDTHS.description} ${COL_WIDTHS.category} ${COL_WIDTHS.account} ${COL_WIDTHS.amount} ${COL_WIDTHS.actions}`,
        padding: "0 16px",
        height: "44px",
        alignItems: "center",
        borderBottom: "1px solid #252840",
        backgroundColor: hovered ? "#1E2130" : "transparent",
        transition: "background-color 0.1s",
        cursor: "default",
      }}
    >
      {/* Date */}
      <span style={{ fontSize: "13px", color: "#8B8FA8" }}>
        {formatDate(transaction.date)}
      </span>

      {/* Description */}
      <span
        style={{
          fontSize: "13px",
          color: "#F0F2FF",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          paddingRight: "12px",
        }}
      >
        {transaction.description}
      </span>

      {/* Category badge */}
      <div style={{ paddingRight: "8px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "3px 8px",
            borderRadius: "100px",
            backgroundColor: hexToRgba(categoryColor, 0.15),
            fontSize: "12px",
            fontWeight: 500,
            color: categoryColor,
            maxWidth: "130px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {transaction.category?.icon && (
            <span style={{ fontSize: "11px" }}>{transaction.category.icon}</span>
          )}
          {transaction.category?.name || "—"}
        </span>
      </div>

      {/* Account */}
      <span
        style={{
          fontSize: "13px",
          color: "#8B8FA8",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          paddingRight: "8px",
        }}
      >
        {transaction.account?.name || "—"}
      </span>

      {/* Amount */}
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: amountColor,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {amountPrefix} {formatCurrency(transaction.amount)}
      </span>

      {/* Delete button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {hovered && onDelete && (
          <button
            onClick={handleDelete}
            onMouseEnter={() => setDeleteHovered(true)}
            onMouseLeave={() => setDeleteHovered(false)}
            disabled={deleting}
            title="Excluir transação"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: deleteHovered ? "rgba(239, 83, 80, 0.15)" : "transparent",
              color: deleteHovered ? "#EF5350" : "#555872",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.1s",
              opacity: deleting ? 0.5 : 1,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export function TransactionTable({ transactions, loading, onDelete }: TransactionTableProps) {
  return (
    <div
      style={{
        backgroundColor: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <TableHeader />

      {loading ? (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </>
      ) : transactions.length === 0 ? (
        <div
          style={{
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📭</div>
          <p style={{ fontSize: "14px", color: "#8B8FA8", margin: 0 }}>
            Nenhuma transação encontrada
          </p>
          <p style={{ fontSize: "13px", color: "#555872", marginTop: "4px" }}>
            Ajuste os filtros ou adicione uma nova transação
          </p>
        </div>
      ) : (
        transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} onDelete={onDelete} />
        ))
      )}

      {!loading && transactions.length > 0 && (
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #252840",
            fontSize: "12px",
            color: "#555872",
          }}
        >
          {transactions.length} transaç{transactions.length === 1 ? "ão" : "ões"} encontrada{transactions.length === 1 ? "" : "s"}
        </div>
      )}
    </div>
  )
}
