"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Category } from "@/lib/types/database";

interface CategoryDonutProps {
  categorySpending: Map<string, number>;
  categories: Category[];
  savingsRate: number;
}

const OTHERS_COLOR = "#94A3B8";
const MAX_SLICES = 8;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div
      style={{
        background: "#1E2130",
        border: "1px solid #252840",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "12px",
      }}
    >
      <p style={{ color: item.payload.fill, fontWeight: 600 }}>{item.name}</p>
      <p style={{ color: "#F0F2FF" }}>
        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.value)}
      </p>
      <p style={{ color: "#8B8FA8" }}>{item.payload.percentage.toFixed(1)}%</p>
    </div>
  );
}

export function CategoryDonut({ categorySpending, categories, savingsRate }: CategoryDonutProps) {
  // Build category map for quick lookup
  const categoryMap = new Map<string, Category>();
  for (const c of categories) {
    categoryMap.set(c.id, c);
  }

  // Build entries with amounts
  const entries: { id: string; name: string; color: string; amount: number }[] = [];
  for (const [catId, amount] of categorySpending.entries()) {
    const cat = categoryMap.get(catId);
    entries.push({
      id: catId,
      name: cat?.name ?? "Sem categoria",
      color: cat?.color ?? OTHERS_COLOR,
      amount,
    });
  }

  // Sort by amount desc
  entries.sort((a, b) => b.amount - a.amount);

  const total = entries.reduce((s, e) => s + e.amount, 0);

  // Take top MAX_SLICES-1, group rest as "Outros"
  let slices: { name: string; color: string; amount: number; percentage: number }[] = [];

  if (entries.length <= MAX_SLICES) {
    slices = entries.map((e) => ({
      name: e.name,
      color: e.color,
      amount: e.amount,
      percentage: total > 0 ? (e.amount / total) * 100 : 0,
    }));
  } else {
    const top = entries.slice(0, MAX_SLICES - 1);
    const rest = entries.slice(MAX_SLICES - 1);
    const othersAmount = rest.reduce((s, e) => s + e.amount, 0);
    slices = [
      ...top.map((e) => ({
        name: e.name,
        color: e.color,
        amount: e.amount,
        percentage: total > 0 ? (e.amount / total) * 100 : 0,
      })),
      {
        name: "Outros",
        color: OTHERS_COLOR,
        amount: othersAmount,
        percentage: total > 0 ? (othersAmount / total) * 100 : 0,
      },
    ];
  }

  // Biggest category percentage for center text
  const biggest = slices.length > 0 ? slices[0] : null;

  const isEmpty = total === 0;

  return (
    <div
      style={{
        background: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#F0F2FF", marginBottom: "4px" }}>
        Gastos por Categoria
      </h3>
      <p style={{ fontSize: "11px", color: "#8B8FA8", marginBottom: "16px" }}>
        Distribuição do mês atual
      </p>

      <div style={{ display: "flex", gap: "20px", flex: 1, alignItems: "center" }}>
        {/* Donut */}
        <div style={{ position: "relative", width: "160px", height: "160px", flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={isEmpty ? [{ name: "Sem dados", amount: 1, percentage: 100 }] : slices}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                dataKey="amount"
                nameKey="name"
                strokeWidth={2}
                stroke="#1A1D27"
              >
                {isEmpty ? (
                  <Cell fill="#252840" />
                ) : (
                  slices.map((slice, i) => <Cell key={i} fill={slice.color} />)
                )}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {isEmpty ? (
              <span style={{ fontSize: "11px", color: "#555872" }}>Sem dados</span>
            ) : biggest ? (
              <>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "#F0F2FF" }}>
                  {biggest.percentage.toFixed(0)}%
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    color: "#8B8FA8",
                    textAlign: "center",
                    maxWidth: "60px",
                    lineHeight: 1.3,
                    marginTop: "2px",
                  }}
                >
                  {biggest.name}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "#22D3A0" }}>
                  {savingsRate.toFixed(0)}%
                </span>
                <span style={{ fontSize: "9px", color: "#8B8FA8" }}>economia</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", overflow: "hidden" }}>
          {slices.map((slice, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: slice.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  color: "#8B8FA8",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {slice.name}
              </span>
              <span style={{ fontSize: "11px", color: "#F0F2FF", fontWeight: 500, flexShrink: 0 }}>
                {slice.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
          {isEmpty && (
            <span style={{ fontSize: "12px", color: "#555872" }}>Nenhum gasto registrado</span>
          )}
        </div>
      </div>
    </div>
  );
}
