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
import type { CreditCard } from "@/lib/types/database"

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

const cardSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  bank: z.string().optional(),
  credit_limit: z.number().min(1, "Limite deve ser maior que zero"),
  closing_day: z
    .number()
    .int()
    .min(1, "Dia invalido")
    .max(31, "Dia invalido"),
  due_day: z
    .number()
    .int()
    .min(1, "Dia invalido")
    .max(31, "Dia invalido"),
  color: z.string().optional(),
})

type CardFormValues = z.infer<typeof cardSchema>

interface CreditCardModalProps {
  open: boolean
  onClose: () => void
  onCreated: (card: CreditCard) => void
  onCreate: (input: {
    name: string
    bank: string | null
    credit_limit: number
    closing_day: number
    due_day: number
    color: string | null
  }) => Promise<CreditCard | null>
}

export function CreditCardModal({
  open,
  onClose,
  onCreated,
  onCreate,
}: CreditCardModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: "",
      bank: "",
      credit_limit: 0,
      closing_day: 1,
      due_day: 10,
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

  async function onSubmit(values: CardFormValues) {
    try {
      const result = await onCreate({
        name: values.name,
        bank: values.bank || null,
        credit_limit: values.credit_limit,
        closing_day: values.closing_day,
        due_day: values.due_day,
        color: values.color || null,
      })
      if (result) {
        toast.success("Cartao criado com sucesso!")
        onCreated(result)
        onClose()
        reset()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar cartao"
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
          <DialogTitle>Novo Cartao</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Name */}
          <div>
            <label style={labelStyle}>Nome do Cartao</label>
            <input
              placeholder="Ex: Nubank, Inter, Itau"
              {...register("name")}
              style={fieldStyle}
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>

          {/* Bank */}
          <div>
            <label style={labelStyle}>Banco (opcional)</label>
            <input
              placeholder="Ex: Nubank, Bradesco"
              {...register("bank")}
              style={fieldStyle}
            />
          </div>

          {/* Limit */}
          <div>
            <label style={labelStyle}>Limite</label>
            <Controller
              name="credit_limit"
              control={control}
              render={({ field }) => (
                <CurrencyInput value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.credit_limit && (
              <p style={errorStyle}>{errors.credit_limit.message}</p>
            )}
          </div>

          {/* Closing and Due days */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Dia de Fechamento</label>
              <input
                type="number"
                min={1}
                max={31}
                {...register("closing_day", { valueAsNumber: true })}
                style={fieldStyle}
              />
              {errors.closing_day && (
                <p style={errorStyle}>{errors.closing_day.message}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Dia de Vencimento</label>
              <input
                type="number"
                min={1}
                max={31}
                {...register("due_day", { valueAsNumber: true })}
                style={fieldStyle}
              />
              {errors.due_day && (
                <p style={errorStyle}>{errors.due_day.message}</p>
              )}
            </div>
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
              {isSubmitting ? "Salvando..." : "Criar Cartao"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
