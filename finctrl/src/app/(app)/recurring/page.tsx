"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { RecurringCard } from "@/components/recurring/recurring-card"
import { RecurringModal } from "@/components/recurring/recurring-modal"
import { useRecurring } from "@/lib/hooks/use-recurring"
import { useCategories } from "@/lib/hooks/use-categories"
import { useAccounts } from "@/lib/hooks/use-accounts"
import { Button } from "@/components/ui/button"

export default function RecurringPage() {
  const { recurring, loading, createRecurring } = useRecurring()
  const { categories } = useCategories()
  const { accounts } = useAccounts()
  const [modalOpen, setModalOpen] = useState(false)

  const subscriptions = recurring.filter((r) => r.total_installments == null)
  const installments = recurring.filter((r) => r.total_installments != null)

  function SectionTitle({ title, count }: { title: string; count: number }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#8B8FA8", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {title}
        </h2>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#555872",
            backgroundColor: "#252840",
            borderRadius: "100px",
            padding: "1px 7px",
          }}
        >
          {count}
        </span>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Recorrentes"
        subtitle="Assinaturas e parcelas"
        action={
          <Button onClick={() => setModalOpen(true)}>Nova Recorrente</Button>
        }
      />

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#1A1D27",
                border: "1px solid #252840",
                borderRadius: "12px",
                height: "160px",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      ) : recurring.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            textAlign: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "36px" }}>🔄</span>
          <p style={{ fontSize: "16px", color: "#F0F2FF", fontWeight: 500 }}>
            Nenhuma recorrente cadastrada
          </p>
          <p style={{ fontSize: "14px", color: "#8B8FA8" }}>
            Adicione assinaturas ou parcelas para acompanha-las automaticamente.
          </p>
          <Button style={{ marginTop: "8px" }} onClick={() => setModalOpen(true)}>
            Nova Recorrente
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {subscriptions.length > 0 && (
            <div>
              <SectionTitle title="Assinaturas" count={subscriptions.length} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}
              >
                {subscriptions.map((item) => (
                  <RecurringCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {installments.length > 0 && (
            <div>
              <SectionTitle title="Parcelas" count={installments.length} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}
              >
                {installments.map((item) => (
                  <RecurringCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <RecurringModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {}}
        categories={categories}
        accounts={accounts}
        onCreate={createRecurring}
      />
    </div>
  )
}
