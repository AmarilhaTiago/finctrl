"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { GoalCard } from "@/components/goals/goal-card"
import { GoalModal } from "@/components/goals/goal-modal"
import { ContributionModal } from "@/components/goals/contribution-modal"
import { useGoals, type GoalWithProgress } from "@/lib/hooks/use-goals"
import { useAccounts } from "@/lib/hooks/use-accounts"
import { Button } from "@/components/ui/button"
import type { Goal } from "@/lib/types/database"

export default function GoalsPage() {
  const { goals, loading, createGoal, addContribution } = useGoals()
  const { accounts } = useAccounts()
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<GoalWithProgress | null>(null)

  function handleCreated(_goal: Goal) {
    void _goal
  }

  function handleContribute(goal: GoalWithProgress) {
    setSelectedGoal(goal)
  }

  return (
    <div>
      <PageHeader
        title="Metas"
        subtitle="Seus objetivos financeiros"
        action={
          <Button onClick={() => setGoalModalOpen(true)}>Nova Meta</Button>
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
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#1A1D27",
                border: "1px solid #252840",
                borderRadius: "12px",
                height: "200px",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      ) : goals.length === 0 ? (
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
          <span style={{ fontSize: "36px" }}>🎯</span>
          <p style={{ fontSize: "16px", color: "#F0F2FF", fontWeight: 500 }}>
            Nenhuma meta cadastrada
          </p>
          <p style={{ fontSize: "14px", color: "#8B8FA8" }}>
            Defina seus objetivos financeiros e acompanhe seu progresso.
          </p>
          <Button style={{ marginTop: "8px" }} onClick={() => setGoalModalOpen(true)}>
            Nova Meta
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
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={handleContribute}
            />
          ))}
        </div>
      )}

      <GoalModal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onCreated={handleCreated}
        accounts={accounts}
        onCreate={createGoal}
      />

      <ContributionModal
        open={selectedGoal != null}
        onClose={() => setSelectedGoal(null)}
        goal={selectedGoal}
        onContribute={addContribution}
      />
    </div>
  )
}
