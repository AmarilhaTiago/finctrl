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
import type { Account, Goal } from "@/lib/types/database"

const COLOR_PRESETS = [
  "#5B8AF5",
  "#22D3A0",
  "#EF5350",
  "#F5A623",
  "#A78BFA",
  "#EC4899",
  "#14B8A6",
  "#F97316",
]

const goalSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  target_amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  deadline: z.string().optional(),
  account_id: z.string().optional(),
  color: z.string().optional(),
})

type GoalFormValues = z.infer<typeof goalSchema>

interface GoalModalProps {
  open: boolean
  onClose: () => void
  onCreated: (goal: Goal) => void
  accounts: Account[]
  onCreate: (input: {
    name: string
    target_amount: number
    deadline?: string | null
    account_id?: string | null
    color?: string | null
  }) => Promise<Goal | null>
}

export function GoalModal({
  open,
  onClose,
  onCreated,
  accounts,
  onCreate,
}: GoalModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      target_amount: 0,
      deadline: "",
      account_id: "",
      color: "#5B8AF5",
    },
  })

  const selectedColor = watch("color")

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onClose()
      reset()
    }
  }

  async function onSubmit(values: GoalFormValues) {
    try {
      const result = await onCreate({
        name: values.name,
        target_amount: values.target_amount,
        deadline: values.deadline || null,
        account_id: values.account_id || null,
        color: values.color || null,
      })
      if (result) {
        toast.success("Meta criada com sucesso!")
        onCreated(result)
        onClose()
        reset()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar meta"
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Name */}
          <div>
            <label style={labelStyle}>Nome da Meta</label>
            <input
              placeholder="Ex: Viagem, Carro, Reserva de emergencia"
              {...register("name")}
              style={fieldStyle}
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>

          {/* Target amount */}
          <div>
            <label style={labelStyle}>Valor Alvo</label>
            <Controller
              name="target_amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.target_amount && (
              <p style={errorStyle}>{errors.target_amount.message}</p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label style={labelStyle}>Prazo (opcional)</label>
            <input
              type="date"
              {...register("deadline")}
              style={{ ...fieldStyle, colorScheme: "dark" }}
            />
          </div>

          {/* Account */}
          <div>
            <label style={labelStyle}>Conta Vinculada (opcional)</label>
            <select
              {...register("account_id")}
              style={{ ...fieldStyle, cursor: "pointer" }}
            >
              <option value="">Nenhuma</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label style={labelStyle}>Cor</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border:
                      selectedColor === color
                        ? "2px solid #F0F2FF"
                        : "2px solid transparent",
                    cursor: "pointer",
                    padding: 0,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.1s ease",
                  }}
                />
              ))}
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
              {isSubmitting ? "Salvando..." : "Criar Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
