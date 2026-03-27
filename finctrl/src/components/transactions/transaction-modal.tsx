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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CurrencyInput } from "@/components/transactions/currency-input"
import { useUIStore } from "@/lib/stores/ui-store"
import { useCategories } from "@/lib/hooks/use-categories"
import { useAccounts } from "@/lib/hooks/use-accounts"
import { useTransactions } from "@/lib/hooks/use-transactions"
import type { TransactionType } from "@/lib/types/database"

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Valor deve ser maior que zero"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  account_id: z.string().min(1, "Conta é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  notes: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

export function TransactionModal() {
  const { isTransactionModalOpen, closeTransactionModal } = useUIStore()
  const { categories } = useCategories()
  const { accounts } = useAccounts()
  const { createTransaction } = useTransactions()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      description: "",
      category_id: "",
      account_id: "",
      date: todayISO(),
      notes: "",
    },
  })

  const selectedType = watch("type")

  const filteredCategories = categories.filter(
    (cat) => cat.type === selectedType || cat.type === "both"
  )

  const amountRef = React.useRef<HTMLInputElement>(null)

  // Focus amount input when modal opens
  React.useEffect(() => {
    if (isTransactionModalOpen) {
      // Small timeout to let the dialog render
      const timer = setTimeout(() => {
        amountRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isTransactionModalOpen])

  async function onSubmit(
    values: TransactionFormValues,
    keepOpen: boolean = false
  ) {
    try {
      await createTransaction({
        type: values.type as TransactionType,
        amount: values.amount,
        description: values.description,
        category_id: values.category_id,
        account_id: values.account_id,
        date: values.date,
        notes: values.notes || null,
        credit_card_id: null,
      })

      toast.success("Transação registrada com sucesso!")

      if (keepOpen) {
        // Batch mode: keep type, category, account — reset amount, description, notes
        reset({
          type: values.type,
          amount: 0,
          description: "",
          category_id: values.category_id,
          account_id: values.account_id,
          date: values.date,
          notes: "",
        })
        setTimeout(() => amountRef.current?.focus(), 50)
      } else {
        closeTransactionModal()
        reset({
          type: "expense",
          amount: 0,
          description: "",
          category_id: "",
          account_id: "",
          date: todayISO(),
          notes: "",
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar transação"
      toast.error(message)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      handleSubmit((values) => onSubmit(values, true))()
    } else if (e.key === "Enter" && !e.ctrlKey) {
      // Allow Enter only on non-textarea elements (textarea uses Enter for newlines)
      const target = e.target as HTMLElement
      if (target.tagName !== "TEXTAREA" && target.tagName !== "SELECT") {
        e.preventDefault()
        handleSubmit((values) => onSubmit(values, false))()
      }
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      closeTransactionModal()
    }
  }

  return (
    <Dialog open={isTransactionModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values, false))}
          onKeyDown={handleKeyDown}
          className="flex flex-col gap-4"
        >
          {/* Type toggle */}
          <div className="flex flex-col gap-1.5">
            <Label>Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange("expense")}
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      field.value === "expense"
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border bg-transparent text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("income")}
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      field.value === "income"
                        ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "border-border bg-transparent text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Receita
                  </button>
                </div>
              )}
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Valor</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  ref={amountRef}
                  value={field.value}
                  onChange={field.onChange}
                  id="amount"
                  autoFocus
                />
              )}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category_id">Categoria</Label>
            <select
              id="category_id"
              {...register("category_id")}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="">Selecionar categoria</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-xs text-destructive">{errors.category_id.message}</p>
            )}
          </div>

          {/* Account */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account_id">Conta</Label>
            <select
              id="account_id"
              {...register("account_id")}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="">Selecionar conta</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
            {errors.account_id && (
              <p className="text-xs text-destructive">{errors.account_id.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Observação</Label>
            <textarea
              id="notes"
              placeholder="Opcional"
              {...register("notes")}
              rows={2}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none resize-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          {/* Actions */}
          <div className="-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => closeTransactionModal()}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={handleSubmit((values) => onSubmit(values, true))}
              title="Ctrl+Enter"
            >
              Salvar e continuar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
