import type { Category } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils/currency";

interface TopCategoriesProps {
  categorySpending: Map<string, number>;
  previousCategorySpending: Map<string, number>;
  categories: Category[];
}

export function TopCategories({
  categorySpending,
  previousCategorySpending,
  categories,
}: TopCategoriesProps) {
  const categoryMap = new Map<string, Category>();
  for (const c of categories) {
    categoryMap.set(c.id, c);
  }

  // Build sorted entries
  const entries = Array.from(categorySpending.entries())
    .map(([id, amount]) => {
      const cat = categoryMap.get(id);
      const prev = previousCategorySpending.get(id) ?? 0;
      const variation = prev > 0 ? ((amount - prev) / prev) * 100 : 0;
      const limit = cat?.monthly_limit ?? null;
      const progressVsLimit = limit ? Math.min((amount / limit) * 100, 100) : null;
      const maxRef = prev > 0 ? Math.max(amount, prev) : amount;
      const progressVsPrev = maxRef > 0 ? (amount / maxRef) * 100 : 0;

      return {
        id,
        name: cat?.name ?? "Sem categoria",
        color: cat?.color ?? "#94A3B8",
        amount,
        variation: prev > 0 ? variation : null,
        progressBar: progressVsLimit ?? progressVsPrev,
        hasLimit: !!limit,
        limit,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const maxAmount = entries.length > 0 ? entries[0].amount : 1;

  return (
    <div
      style={{
        background: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "20px",
        height: "100%",
      }}
    >
      <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#F0F2FF", marginBottom: "4px" }}>
        Top Categorias
      </h3>
      <p style={{ fontSize: "11px", color: "#8B8FA8", marginBottom: "16px" }}>
        Maiores gastos do mês
      </p>

      {entries.length === 0 ? (
        <p style={{ fontSize: "13px", color: "#555872", textAlign: "center", paddingTop: "20px" }}>
          Nenhum gasto registrado
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 120px 70px",
              gap: "8px",
              paddingBottom: "8px",
              borderBottom: "1px solid #252840",
              marginBottom: "4px",
            }}
          >
            <span style={{ fontSize: "10px", color: "#555872", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Categoria
            </span>
            <span style={{ fontSize: "10px", color: "#555872", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>
              Gasto
            </span>
            <span style={{ fontSize: "10px", color: "#555872", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Progresso
            </span>
            <span style={{ fontSize: "10px", color: "#555872", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>
              Var.
            </span>
          </div>

          {entries.map((entry) => {
            const barWidth = maxAmount > 0 ? (entry.amount / maxAmount) * 100 : 0;
            const isOverLimit = entry.hasLimit && entry.limit && entry.amount > entry.limit;

            return (
              <div
                key={entry.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 120px 70px",
                  gap: "8px",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(37, 40, 64, 0.5)",
                }}
              >
                {/* Category name + dot */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: entry.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#F0F2FF",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.name}
                  </span>
                </div>

                {/* Amount */}
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isOverLimit ? "#EF5350" : "#F0F2FF",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(entry.amount)}
                </span>

                {/* Progress bar */}
                <div>
                  <div
                    style={{
                      height: "5px",
                      background: "#252840",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${barWidth}%`,
                        background: isOverLimit ? "#EF5350" : entry.color,
                        borderRadius: "3px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  {entry.hasLimit && entry.limit && (
                    <span style={{ fontSize: "9px", color: "#555872", marginTop: "2px", display: "block" }}>
                      Limite: {formatCurrency(entry.limit)}
                    </span>
                  )}
                </div>

                {/* Variation badge */}
                <div style={{ textAlign: "center" }}>
                  {entry.variation !== null ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "9999px",
                        background:
                          entry.variation <= 0
                            ? "rgba(34, 211, 160, 0.12)"
                            : "rgba(239, 83, 80, 0.12)",
                        color: entry.variation <= 0 ? "#22D3A0" : "#EF5350",
                      }}
                    >
                      {entry.variation > 0 ? "▲" : "▼"} {Math.abs(entry.variation).toFixed(0)}%
                    </span>
                  ) : (
                    <span style={{ fontSize: "10px", color: "#555872" }}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
