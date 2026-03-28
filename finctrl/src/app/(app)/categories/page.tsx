"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { CategoryCard } from "@/components/categories/category-card"
import { CategoryModal } from "@/components/categories/category-modal"
import { useCategories } from "@/lib/hooks/use-categories"
import { useTransactions } from "@/lib/hooks/use-transactions"
import { calculateCategorySpending } from "@/lib/utils/calculations"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types/database"

function getCurrentMonthRange() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const startDate = new Date(year, month, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0]
  return { startDate, endDate }
}

const { startDate, endDate } = getCurrentMonthRange()

export default function CategoriesPage() {
  const { categories, loading: loadingCategories } = useCategories()
  const { transactions, loading: loadingTransactions } = useTransactions({ startDate, endDate })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const spendingMap = useMemo(
    () => calculateCategorySpending(transactions),
    [transactions]
  )

  const isLoading = loadingCategories || loadingTransactions

  const expenseCategories = categories.filter(
    (c) => c.type === "expense" || c.type === "both"
  )
  const incomeCategories = categories.filter(
    (c) => c.type === "income" || c.type === "both"
  )

  function handleEdit(category: Category) {
    setEditingCategory(category)
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
    setEditingCategory(null)
  }

  function handleSaved() {
    // Categories hook refetches on mount; page will update after dialog closes
  }

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#555872",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "12px",
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  }

  const skeletonCard: React.CSSProperties = {
    backgroundColor: "#1A1D27",
    border: "1px solid #252840",
    borderRadius: "12px",
    height: "120px",
    opacity: 0.6,
  }

  return (
    <div>
      <PageHeader
        title="Categorias"
        subtitle="Orçamento por categoria — mês atual"
        action={
          <Button onClick={() => { setEditingCategory(null); setModalOpen(true) }}>
            Nova Categoria
          </Button>
        }
      />

      {isLoading ? (
        <div style={gridStyle}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={skeletonCard} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Despesas section */}
          {expenseCategories.length > 0 && (
            <div>
              <p style={sectionLabelStyle}>Despesas</p>
              <div style={gridStyle}>
                {expenseCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    spent={spendingMap.get(category.id) ?? 0}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Receitas section */}
          {incomeCategories.filter((c) => c.type === "income").length > 0 && (
            <div>
              <p style={sectionLabelStyle}>Receitas</p>
              <div style={gridStyle}>
                {incomeCategories
                  .filter((c) => c.type === "income")
                  .map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      spent={spendingMap.get(category.id) ?? 0}
                      onEdit={handleEdit}
                    />
                  ))}
              </div>
            </div>
          )}

          {categories.length === 0 && (
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
              <span style={{ fontSize: "36px" }}>🗂️</span>
              <p style={{ fontSize: "16px", color: "#F0F2FF", fontWeight: 500 }}>
                Nenhuma categoria cadastrada
              </p>
              <p style={{ fontSize: "14px", color: "#8B8FA8" }}>
                Crie categorias para organizar seus gastos e receitas.
              </p>
              <Button
                style={{ marginTop: "8px" }}
                onClick={() => { setEditingCategory(null); setModalOpen(true) }}
              >
                Nova Categoria
              </Button>
            </div>
          )}
        </div>
      )}

      <CategoryModal
        open={modalOpen}
        onClose={handleModalClose}
        onSaved={handleSaved}
        category={editingCategory}
      />
    </div>
  )
}
