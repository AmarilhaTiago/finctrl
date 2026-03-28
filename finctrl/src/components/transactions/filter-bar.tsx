"use client"

import { useMemo } from "react"
import type { Category, Account, TransactionType } from "@/lib/types/database"
import { getMonthRange, getCurrentMonthYear } from "@/lib/utils/date"

export interface FilterState {
  year: number
  month: number
  type: TransactionType | ""
  categoryId: string
  accountId: string
  search: string
}

interface FilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: Category[]
  accounts: Account[]
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const currentYear = new Date().getFullYear()
const YEARS = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

const inputStyle: React.CSSProperties = {
  backgroundColor: "#1A1D27",
  border: "1px solid #252840",
  borderRadius: "8px",
  color: "#F0F2FF",
  fontSize: "13px",
  padding: "7px 10px",
  outline: "none",
  cursor: "pointer",
  height: "36px",
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  WebkitAppearance: "none",
  paddingRight: "28px",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B8FA8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 8px center",
}

export function FilterBar({ filters, onFiltersChange, categories, accounts }: FilterBarProps) {
  const update = (partial: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...partial })
  }

  const typeButtons: { label: string; value: TransactionType | "" }[] = [
    { label: "Todos", value: "" },
    { label: "Receitas", value: "income" },
    { label: "Despesas", value: "expense" },
  ]

  return (
    <div
      style={{
        backgroundColor: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "16px",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
      }}
    >
      {/* Period selectors */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <select
          style={selectStyle}
          value={filters.month}
          onChange={(e) => update({ month: Number(e.target.value) })}
        >
          {MONTHS.map((name, idx) => (
            <option key={idx} value={idx}>
              {name}
            </option>
          ))}
        </select>
        <select
          style={{ ...selectStyle, width: "80px" }}
          value={filters.year}
          onChange={(e) => update({ year: Number(e.target.value) })}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "24px", backgroundColor: "#252840" }} />

      {/* Type filter */}
      <div style={{ display: "flex", gap: "4px" }}>
        {typeButtons.map((btn) => {
          const isActive = filters.type === btn.value
          return (
            <button
              key={btn.value}
              onClick={() => update({ type: btn.value })}
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                border: isActive ? "1px solid #5B8AF5" : "1px solid #252840",
                backgroundColor: isActive ? "rgba(91, 138, 245, 0.15)" : "transparent",
                color: isActive ? "#5B8AF5" : "#8B8FA8",
                cursor: "pointer",
                height: "36px",
                transition: "all 0.15s",
              }}
            >
              {btn.label}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "24px", backgroundColor: "#252840" }} />

      {/* Category dropdown */}
      <select
        style={{ ...selectStyle, minWidth: "140px" }}
        value={filters.categoryId}
        onChange={(e) => update({ categoryId: e.target.value })}
      >
        <option value="">Todas categorias</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Account dropdown */}
      <select
        style={{ ...selectStyle, minWidth: "130px" }}
        value={filters.accountId}
        onChange={(e) => update({ accountId: e.target.value })}
      >
        <option value="">Todas contas</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.name}
          </option>
        ))}
      </select>

      {/* Search input */}
      <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
        <svg
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#555872",
            pointerEvents: "none",
          }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Buscar descrição..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          style={{
            ...inputStyle,
            paddingLeft: "32px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  )
}
