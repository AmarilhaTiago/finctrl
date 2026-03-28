"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { AccountCard } from "@/components/accounts/account-card"
import { AccountModal } from "@/components/accounts/account-modal"
import { useAccounts } from "@/lib/hooks/use-accounts"
import { useTransactions } from "@/lib/hooks/use-transactions"
import { useAccountBalances, useConsolidatedBalance } from "@/lib/hooks/use-account-balance"
import { formatCurrency } from "@/lib/utils/currency"
import { Button } from "@/components/ui/button"
import type { Account } from "@/lib/types/database"

export default function AccountsPage() {
  const { accounts, loading: loadingAccounts } = useAccounts()
  const { transactions, loading: loadingTransactions } = useTransactions()
  const [modalOpen, setModalOpen] = useState(false)

  const balances = useAccountBalances(accounts, transactions)
  const consolidatedBalance = useConsolidatedBalance(accounts, transactions)

  const isLoading = loadingAccounts || loadingTransactions

  function handleAccountCreated(account: Account) {
    // The useAccounts hook re-fetches on mount; for immediate update we rely on the
    // user seeing the new account after the page naturally re-renders via supabase.
    // A full refetch could be triggered here if the hook exposed one.
    void account
  }

  return (
    <div>
      <PageHeader
        title="Contas"
        subtitle="Suas contas bancárias e carteiras"
        action={
          <Button onClick={() => setModalOpen(true)}>
            Nova Conta
          </Button>
        }
      />

      {/* Consolidated balance card */}
      <div
        style={{
          backgroundColor: "#1A1D27",
          border: "1px solid #252840",
          borderRadius: "12px",
          padding: "24px 28px",
          marginBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#8B8FA8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Saldo Total Consolidado
        </span>
        {isLoading ? (
          <div
            style={{
              height: "36px",
              width: "160px",
              backgroundColor: "#252840",
              borderRadius: "8px",
              marginTop: "4px",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: consolidatedBalance < 0 ? "#EF5350" : "#22D3A0",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            {formatCurrency(consolidatedBalance)}
          </span>
        )}
        {!isLoading && (
          <span
            style={{
              fontSize: "13px",
              color: "#555872",
              marginTop: "2px",
            }}
          >
            {accounts.length === 0
              ? "Nenhuma conta cadastrada"
              : accounts.length === 1
              ? "1 conta ativa"
              : `${accounts.length} contas ativas`}
          </span>
        )}
      </div>

      {/* Account grid */}
      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
                height: "96px",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      ) : accounts.length === 0 ? (
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
          <span style={{ fontSize: "36px" }}>🏦</span>
          <p style={{ fontSize: "16px", color: "#F0F2FF", fontWeight: 500 }}>
            Nenhuma conta cadastrada
          </p>
          <p style={{ fontSize: "14px", color: "#8B8FA8" }}>
            Crie sua primeira conta para começar a controlar suas finanças.
          </p>
          <Button
            style={{ marginTop: "8px" }}
            onClick={() => setModalOpen(true)}
          >
            Nova Conta
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              balance={balances.get(account.id) ?? account.initial_balance}
            />
          ))}
        </div>
      )}

      <AccountModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleAccountCreated}
      />
    </div>
  )
}
