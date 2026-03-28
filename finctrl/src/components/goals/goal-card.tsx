"use client"

import { useState } from "react"
import type { GoalWithProgress } from "@/lib/hooks/use-goals"
import { formatCurrency } from "@/lib/utils/currency"
import { formatDate } from "@/lib/utils/date"

const DEFAULT_COLOR = "#5B8AF5"

interface GoalCardProps {
  goal: GoalWithProgress
  onContribute: (goal: GoalWithProgress) => void
}

export function GoalCard({ goal, onContribute }: GoalCardProps) {
  const [hovered, setHovered] = useState(false)
  const color = goal.color || DEFAULT_COLOR
  const percent = goal.progressPercent
  const isCompleted = goal.is_completed

  const barColor = isCompleted
    ? "#22D3A0"
    : percent >= 75
    ? "#22D3A0"
    : percent >= 50
    ? "#F5A623"
    : "#5B8AF5"

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isCompleted && onContribute(goal)}
      style={{
        backgroundColor: hovered ? "#1E2130" : "#1A1D27",
        border: `1px solid ${hovered && !isCompleted ? color : "#252840"}`,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        boxShadow: hovered
          ? "0 4px 24px rgba(0,0,0,0.35)"
          : "0 1px 4px rgba(0,0,0,0.2)",
        cursor: isCompleted ? "default" : "pointer",
      }}
    >
      {/* Color top bar */}
      <div style={{ height: "4px", backgroundColor: color, width: "100%" }} />

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
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
              {goal.name}
            </div>
            {goal.deadline && (
              <div style={{ fontSize: "12px", color: "#8B8FA8", marginTop: "2px" }}>
                Prazo: {formatDate(goal.deadline)}
              </div>
            )}
          </div>
          {isCompleted ? (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#22D3A0",
                backgroundColor: "rgba(34, 211, 160, 0.12)",
                borderRadius: "6px",
                padding: "2px 8px",
                flexShrink: 0,
              }}
            >
              Concluida
            </span>
          ) : (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: color,
                backgroundColor: `${color}1A`,
                borderRadius: "6px",
                padding: "2px 8px",
                flexShrink: 0,
              }}
            >
              {percent.toFixed(0)}%
            </span>
          )}
        </div>

        {/* Amounts */}
        <div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: isCompleted ? "#22D3A0" : "#F0F2FF",
              letterSpacing: "-0.02em",
            }}
          >
            {formatCurrency(goal.current_amount)}
          </div>
          <div style={{ fontSize: "12px", color: "#8B8FA8", marginTop: "2px" }}>
            de {formatCurrency(goal.target_amount)}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#252840",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percent}%`,
                backgroundColor: barColor,
                borderRadius: "4px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Remaining / action hint */}
        {!isCompleted && (
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
              Faltam {formatCurrency(goal.target_amount - goal.current_amount)}
            </span>
            {hovered && (
              <span style={{ fontSize: "11px", color: color, fontWeight: 500 }}>
                Clique para aportar
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
