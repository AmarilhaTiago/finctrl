interface KpiCardProps {
  label: string;
  value: string;
  valueColor?: string;
  variation?: number; // percentage vs previous month
}

export function KpiCard({ label, value, valueColor, variation }: KpiCardProps) {
  const hasVariation = variation !== undefined && variation !== null;
  const isPositive = hasVariation && variation >= 0;

  return (
    <div
      style={{
        background: "#1A1D27",
        border: "1px solid #252840",
        borderRadius: "12px",
        padding: "16px 20px",
        transition: "background 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "#1E2130";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "#1A1D27";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "#8B8FA8",
          }}
        >
          {label}
        </span>
        {hasVariation && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: "9999px",
              background: isPositive ? "rgba(34, 211, 160, 0.12)" : "rgba(239, 83, 80, 0.12)",
              color: isPositive ? "#22D3A0" : "#EF5350",
              whiteSpace: "nowrap",
            }}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(variation).toFixed(1)}%
          </span>
        )}
      </div>
      <p
        style={{
          fontSize: "28px",
          fontWeight: 600,
          color: valueColor ?? "#F0F2FF",
          marginTop: "8px",
          lineHeight: 1.2,
        }}
      >
        {value}
      </p>
    </div>
  );
}
