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
import type { Category, Account, Frequency } from "@/lib/types/database"

const recurringSchema = z.object({
  description: z.string().min(1, "Descricao e obrigatoria"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  type: z.enum(["income", "expense"] as const),
  category_id: z.string().min(1, "Categoria e obrigatoria"),
  account_id: z.string().min(1, "Conta e obrigatoria"),
  frequency: z.enum(["weekly", "monthly", "yearly"] as const),
  start_date: z.string().min(1, "Data de inicio e obrigatoria"),
  end_date: z.string().optional(),
  total_installments: z.number().int().min(1).optional().nullable(),
})

type RecurringFormValues = z.infer<typeof recurringSchema>

interface RecurringModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
  categories: Category[]
  accounts: Account[]
  onCreate: (input: {
    type: "income" | "expense"
    amount: number
    description: string
    category_id: string
    account_id: string
    frequency: Frequency
    start_date: string
    end_date?: string | null
    total_installments?: number | null
    current_installment?: number | null
  }) => Promise<void>
}

export function RecurringModal({
  open,
  onClose,
  onCreated,
  categories,
  accounts,
  onCreate,
}: RecurringModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecurringFormValues>({
    resolver: zodResolver(recurringSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      category_id: "",
      account_id: "",
      frequency: "monthly",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      total_installments: null,
    },
  })

  const hasInstallments = watch("total_installments")

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onClose()
      reset()
    }
  }

  async function onSubmit(values: RecurringFormValues) {
    try {
      await onCreate({
        description: values.description,
        amount: values.amount,
        type: values.type,
        category_id: values.category_id,
        account_id: values.account_id,
        frequency: values.frequency,
        start_date: values.start_date,
        end_date: values.end_date || null,
        total_installments: values.total_installments || null,
        current_installment: values.total_installments ? 1 : null,
      })
      toast.success("Recorrente criada com sucesso!")
      onCreated()
      onClose()
      reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar recorrente"
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

  const expenseCategories = categories.filter(
    (c) => c.type === "expense" || c.type === "both"
  )
  const incomeCategories = categories.filter(
    (c) => c.type === "income" || c.type === "both"
  )
  const selectedType = watch("type")
  const availableCategories =
    selectedType === "income" ? incomeCategories : expenseCategories

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Nova Recorrente</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "70vh", overflowY: "auto", paddingRight: "4px" }}
        >
          {/* Description */}
          <div>
            <label style={labelStyle}>Descricao</label>
            <input
              placeholder="Ex: Netflix, Gym, Salario"
              {...register("description")}
              style={fieldStyle}
            />
            {errors.description && (
              <p style={errorStyle}>{errors.description.message}</p>
            )}
          </div>

          {/* Type + Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select {...register("type")} style={{ ...fieldStyle, cursor: "pointer" }}>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Valor</label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.amount && (
                <p style={errorStyle}>{errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Categoria</label>
            <select
              {...register("category_id")}
              style={{ ...fieldStyle, cursor: "pointer" }}
            >
              <option value="">Selecione...</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ""}{c.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p style={errorStyle}>{errors.category_id.message}</p>
            )}
          </div>

          {/* Account */}
          <div>
            <label style={labelStyle}>Conta</label>
            <select
              {...register("account_id")}
              style={{ ...fieldStyle, cursor: "pointer" }}
            >
              <option value="">Selecione...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {errors.account_id && (
              <p style={errorStyle}>{errors.account_id.message}</p>
            )}
          </div>

          {/* Frequency + Start date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Frequencia</label>
              <select
                {...register("frequency")}
                style={{ ...fieldStyle, cursor: "pointer" }}
              >
                <option value="monthly">Mensal</option>
                <option value="weekly">Semanal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Data de Inicio</label>
              <input
                type="date"
                {...register("start_date")}
                style={{ ...fieldStyle, colorScheme: "dark" }}
              />
              {errors.start_date && (
                <p style={errorStyle}>{errors.start_date.message}</p>
              )}
            </div>
          </div>

          {/* End date + installments */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Data de Fim (opcional)</label>
              <input
                type="date"
                {...register("end_date")}
                style={{ ...fieldStyle, colorScheme: "dark" }}
              />
            </div>
            <div>
              <label style={labelStyle}>Total de Parcelas (opcional)</label>
              <input
                type="number"
                min={1}
                placeholder="Ex: 12"
                {...register("total_installments", { valueAsNumber: true })}
                style={fieldStyle}
              />
            </div>
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
              {isSubmitting ? "Salvando..." : "Criar Recorrente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
