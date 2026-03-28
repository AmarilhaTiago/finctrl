"use client"

import { useState } from "react"
import {
  Home,
  Utensils,
  Car,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Shirt,
  Repeat,
  Plane,
  CircleDot,
  Banknote,
  Laptop,
  TrendingUp,
  PlusCircle,
  LucideIcon,
} from "lucide-react"
import type { Category } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/currency"

const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  utensils: Utensils,
  car: Car,
  "gamepad-2": Gamepad2,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  shirt: Shirt,
  repeat: Repeat,
  plane: Plane,
  "circle-dot": CircleDot,
  banknote: Banknote,
  laptop: Laptop,
  "trending-up": TrendingUp,
  "plus-circle": PlusCircle,
}

interface CategoryCardProps {
  category: Category
  spent: number
  onEdit?: (category: Category) => void
}

export function CategoryCard({ category, spent, onEdit }: CategoryCardProps) {
  const [hovered, setHovered] = useState(false)

  const IconComponent = category.icon ? (ICON_MAP[category.icon] ?? CircleDot) : CircleDot
  const color = category.color || "#5B8AF5"
  const limit = category.monthly_limit

  const percentage = limit && limit > 0 ? (spent / limit) * 100 : 0
  const isOverLimit = limit ? spent > limit : false
  const isNearLimit = limit ? percentage > 80 && !isOverLimit : false

  const progressColor = isOverLimit
    ? "#EF5350"
    : isNearLimit
    ? "#F5A623"
    : color

  const clampedPercentage = Math.min(percentage, 100)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onEdit?.(category)}
      style={{
        backgroundColor: hovered ? "#1E2130" : "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "background-color 0.15s ease, box-shadow 0.15s ease",
        boxShadow: hovered
          ? "0 4px 24px rgba(0,0,0,0.35)"
          : "0 1px 4px rgba(0,0,0,0.2)",
        cursor: onEdit ? "pointer" : "default",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Color dot + icon */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: `${color}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconComponent size={18} color={color} strokeWidth={1.8} />
          </div>

          <div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#F0F2FF",
                lineHeight: 1.3,
              }}
            >
              {category.name}
            </span>
            {category.type !== "both" && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#555872",
                  marginTop: "1px",
                  textTransform: "capitalize",
                }}
              >
                {category.type === "expense" ? "Despesa" : "Receita"}
              </div>
            )}
          </div>
        </div>

        {/* Alert badge */}
        {limit && percentage > 80 && (
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: isOverLimit ? "#EF5350" : "#F5A623",
              backgroundColor: isOverLimit ? "#EF535018" : "#F5A62318",
              borderRadius: "6px",
              padding: "3px 8px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {isOverLimit ? "⚠ " : "⚠ "}
            {Math.round(percentage)}%
          </div>
        )}
      </div>

      {/* Amount info */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: isOverLimit ? "#EF5350" : "#F0F2FF",
            letterSpacing: "-0.02em",
          }}
        >
          {formatCurrency(spent)}
        </span>
        {limit && (
          <span
            style={{
              fontSize: "13px",
              color: "#555872",
            }}
          >
            de {formatCurrency(limit)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {limit && (
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "#252840",
            borderRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${clampedPercentage}%`,
              height: "100%",
              backgroundColor: progressColor,
              borderRadius: "9999px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}
    </div>
  )
}
