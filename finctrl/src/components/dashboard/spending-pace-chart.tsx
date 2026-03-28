"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
  ComposedChart,
} from "recharts";
import type { TransactionWithRelations } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils/currency";

interface SpendingPaceChartProps {
  currentTransactions: TransactionWithRelations[];
  previousTransactions: TransactionWithRelations[];
  currentMonth: number;
  currentYear: number;
}

function buildDailyData(
  current: TransactionWithRelations[],
  previous: TransactionWithRelations[],
  month: number,
  year: number
) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDay = isCurrentMonth ? today.getDate() : daysInMonth;

  // Build cumulative current month expenses per day
  const currentByDay: Record<number, number> = {};
  for (const t of current) {
    if (t.type !== "expense") continue;
    const d = parseInt(t.date.split("-")[2], 10);
    currentByDay[d] = (currentByDay[d] ?? 0) + t.amount;
  }

  // Build cumulative previous month expenses per day
  const prevByDay: Record<number, number> = {};
  for (const t of previous) {
    if (t.type !== "expense") continue;
    const d = parseInt(t.date.split("-")[2], 10);
    prevByDay[d] = (prevByDay[d] ?? 0) + t.amount;
  }

  const data: { day: number; current?: number; previous?: number }[] = [];
  let cumCurrent = 0;
  let cumPrevious = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    cumCurrent += currentByDay[d] ?? 0;
    cumPrevious += prevByDay[d] ?? 0;

    data.push({
      day: d,
      current: d <= todayDay ? cumCurrent : undefined,
      previous: cumPrevious,
    });
  }

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "#1E2130",
        border: "1px solid #252840",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
      }}
    >
      <p style={{ color: "#8B8FA8", marginBottom: "6px" }}>Dia {label}</p>
      {payload.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entry: any) =>
          entry.value !== undefined && (
            <p key={entry.dataKey} style={{ color: entry.color, margin: "2px 0" }}>
              {entry.dataKey === "current" ? "Mês atual" : "Mês anterior"}:{" "}
              <strong>{formatCurrency(entry.value)}</strong>
            </p>
          )
      )}
    </div>
  );
}

export function SpendingPaceChart({
  currentTransactions,
  previousTransactions,
  currentMonth,
  currentYear,
}: SpendingPaceChartProps) {
  const data = buildDailyData(currentTransactions, previousTransactions, currentMonth, currentYear);

  return (
    <div
      style={{
        background: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#F0F2FF", marginBottom: "4px" }}>
        Ritmo de Gastos
      </h3>
      <p style={{ fontSize: "11px", color: "#8B8FA8", marginBottom: "20px" }}>
        Acumulado diário — mês atual vs anterior
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B8AF5" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#5B8AF5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#252840" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#555872", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: "#555872", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
            }
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Previous month: dashed line */}
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#555872"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            connectNulls={false}
          />
          {/* Current month: area with gradient */}
          <Area
            type="monotone"
            dataKey="current"
            stroke="#5B8AF5"
            strokeWidth={2}
            fill="url(#currentGradient)"
            dot={false}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: "20px", marginTop: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "20px", height: "2px", background: "#5B8AF5" }} />
          <span style={{ fontSize: "11px", color: "#8B8FA8" }}>Mês atual</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "20px",
              height: "2px",
              background: "repeating-linear-gradient(to right, #555872 0, #555872 4px, transparent 4px, transparent 8px)",
            }}
          />
          <span style={{ fontSize: "11px", color: "#8B8FA8" }}>Mês anterior</span>
        </div>
      </div>
    </div>
  );
}
