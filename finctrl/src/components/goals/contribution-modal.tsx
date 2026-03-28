"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/transactions/currency-input"
import { formatCurrency } from "@/lib/utils/currency"
import type { GoalWithProgress } from "@/lib/hooks/use-goals"

const contributionSchema = z.object({
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  date: z.string().min(1, "Data e obrigatoria"),
})

type ContributionFormValues = z.infer<typeof contributionSchema>

interface ContributionModalProps {
  open: boolean
  onClose: () => void
  goal: GoalWithProgress | null
  onContribute: (goalId: string, amount: number, date: string) => Promise<void>
}

export function ContributionModal({
  open,
  onClose,
  goal,
  onContribute,
}: ContributionModalProps) {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    },
  })

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onClose()
      reset()
    }
  }

  async function onSubmit(values: ContributionFormValues) {
    if (!goal) return
    try {
      await onContribute(goal.id, values.amount, values.date)
      toast.success("Aporte registrado com sucesso!")
      onClose()
      reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao registrar aporte"
      toast.error(message)
    }
  }

  const fieldStyle: React.CSSProperties = {
    height: "36px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #252840",
    backgroundColor: "#0D0F14",
    color: "#F0F2FF",
    padding: "0 10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    color: "#8B8FA8",
    marginBottom: "4px",
    display: "block",
  }

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#EF5350",
    marginTop: "2px",
  }

  const remaining = goal ? goal.target_amount - goal.current_amount : 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton>
        <DialogHeader>
          <DialogTitle>Adicionar Aporte</DialogTitle>
        </DialogHeader>

        {goal && (
          <div
            style={{
              backgroundColor: "#0D0F14",
              border: "1px solid #252840",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "4px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#F0F2FF", marginBottom: "4px" }}>
              {goal.name}
            </div>
            <div style={{ fontSize: "12px", color: "#8B8FA8" }}>
              {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)} &bull; faltam {formatCurrency(remaining)}
            </div>
            <div
              style={{
                height: "4px",
                backgroundColor: "#252840",
                borderRadius: "2px",
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${goal.progressPercent}%`,
                  backgroundColor: goal.color || "#5B8AF5",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Amount */}
          <div>
            <label style={labelStyle}>Valor do Aporte</label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.amount && <p style={errorStyle}>{errors.amount.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Data</label>
            <input
              type="date"
              {...register("date")}
              style={{ ...fieldStyle, colorScheme: "dark" }}
            />
            {errors.date && <p style={errorStyle}>{errors.date.message}</p>}
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              borderTop: "1px solid #252840",
              marginTop: "4px",
              paddingTop: "16px",
            }}
          >
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Confirmar Aporte"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
