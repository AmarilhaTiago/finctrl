import Link from "next/link";
import type { TransactionWithRelations } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

interface RecentTransactionsProps {
  transactions: TransactionWithRelations[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 8);

  return (
    <div
      style={{
        background: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#F0F2FF" }}>
          Transações Recentes
        </h3>
        <Link
          href="/transactions"
          style={{
            fontSize: "12px",
            color: "#5B8AF5",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Ver todas →
        </Link>
      </div>
      <p style={{ fontSize: "11px", color: "#8B8FA8", marginBottom: "16px" }}>
        Últimas 8 movimentações
      </p>

      {recent.length === 0 ? (
        <p style={{ fontSize: "13px", color: "#555872", textAlign: "center", padding: "20px 0" }}>
          Nenhuma transação registrada
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 120px",
              gap: "8px",
              paddingBottom: "8px",
              borderBottom: "1px solid #252840",
            }}
          >
            <span style={{ fontSize: "10px", color: "#555872", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Descrição
            </span>
            <span style={{ fontSize: "10px", color: "#555872", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>
              Data
            </span>
            <span style={{ fontSize: "10px", color: "#555872", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>
              Valor
            </span>
          </div>

          {recent.map((t) => {
            const isIncome = t.type === "income";
            return (
              <div
                key={t.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 120px",
                  gap: "8px",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(37, 40, 64, 0.5)",
                }}
              >
                {/* Description + category dot */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: t.category?.color ?? "#94A3B8",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#F0F2FF",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        margin: 0,
                      }}
                    >
                      {t.description}
                    </p>
                    <p style={{ fontSize: "11px", color: "#555872", margin: 0 }}>
                      {t.category?.name ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <span style={{ fontSize: "12px", color: "#8B8FA8", textAlign: "center" }}>
                  {formatDate(t.date)}
                </span>

                {/* Amount */}
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isIncome ? "#22D3A0" : "#EF5350",
                    textAlign: "right",
                  }}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
