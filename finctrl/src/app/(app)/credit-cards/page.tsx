"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { CreditCardCard } from "@/components/credit-cards/credit-card-card"
import { CreditCardModal } from "@/components/credit-cards/credit-card-modal"
import { useCreditCards } from "@/lib/hooks/use-credit-cards"
import { Button } from "@/components/ui/button"
import type { CreditCard } from "@/lib/types/database"

export default function CreditCardsPage() {
  const { creditCards, loading, createCreditCard } = useCreditCards()
  const [modalOpen, setModalOpen] = useState(false)

  function handleCreated(_card: CreditCard) {
    void _card
  }

  return (
    <div>
      <PageHeader
        title="Faturas"
        subtitle="Seus cartoes de credito"
        action={
          <Button onClick={() => setModalOpen(true)}>Novo Cartao</Button>
        }
      />

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#1A1D27",
                border: "1px solid #252840",
                borderRadius: "12px",
                height: "220px",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      ) : creditCards.length === 0 ? (
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
          <span style={{ fontSize: "36px" }}>💳</span>
          <p style={{ fontSize: "16px", color: "#F0F2FF", fontWeight: 500 }}>
            Nenhum cartao cadastrado
          </p>
          <p style={{ fontSize: "14px", color: "#8B8FA8" }}>
            Adicione seu primeiro cartao de credito para acompanhar suas faturas.
          </p>
          <Button style={{ marginTop: "8px" }} onClick={() => setModalOpen(true)}>
            Novo Cartao
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {creditCards.map((card) => (
            <CreditCardCard key={card.id} card={card} />
          ))}
        </div>
      )}

      <CreditCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
        onCreate={createCreditCard}
      />
    </div>
  )
}
