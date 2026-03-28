import { formatCurrency } from "@/lib/utils/currency";

interface PartialResultProps {
  income: number;
  expenses: number;
}

export function PartialResult({ income, expenses }: PartialResultProps) {
  const result = income - expenses;
  const isPositive = result >= 0;
  const incomeRatio = income > 0 ? Math.min((income / (income + expenses)) * 100, 100) : 0;
  const expenseRatio = income > 0 ? Math.min((expenses / income) * 100, 100) : 100;

  return (
    <div
      style={{
        background: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#F0F2FF", marginBottom: "4px" }}>
        Resultado do Mês
      </h3>
      <p style={{ fontSize: "11px", color: "#8B8FA8", marginBottom: "20px" }}>
        Receitas menos despesas
      </p>

      {/* Result value */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: isPositive ? "#22D3A0" : "#EF5350",
            lineHeight: 1,
          }}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(result)}
        </p>
        <p style={{ fontSize: "12px", color: "#8B8FA8", marginTop: "6px" }}>
          {isPositive ? "Superavit" : "Deficit"} no mês
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            height: "8px",
            background: "#252840",
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {income > 0 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${Math.min(expenseRatio, 100)}%`,
                background: isPositive ? "#22D3A0" : "#EF5350",
                borderRadius: "4px",
                transition: "width 0.4s ease",
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <span style={{ fontSize: "11px", color: "#8B8FA8" }}>
            Despesas: {income > 0 ? `${Math.min(expenseRatio, 100).toFixed(0)}%` : "—"} da receita
          </span>
        </div>
      </div>

      {/* Income vs Expenses breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22D3A0" }} />
            <span style={{ fontSize: "12px", color: "#8B8FA8" }}>Receitas</span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#22D3A0" }}>
            {formatCurrency(income)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF5350" }} />
            <span style={{ fontSize: "12px", color: "#8B8FA8" }}>Despesas</span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#EF5350" }}>
            {formatCurrency(expenses)}
          </span>
        </div>
      </div>
    </div>
  );
}
