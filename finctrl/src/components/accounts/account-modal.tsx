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
import { createClient } from "@/lib/supabase/client"
import type { Account, AccountType } from "@/lib/types/database"

const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "checking", label: "Corrente" },
  { value: "savings", label: "Poupança" },
  { value: "investment", label: "Investimento" },
  { value: "wallet", label: "Carteira" },
]

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

const accountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["checking", "savings", "investment", "wallet"] as const),
  initial_balance: z.number().min(0, "Saldo inicial deve ser zero ou maior"),
  color: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountSchema>

interface AccountModalProps {
  open: boolean
  onClose: () => void
  onCreated: (account: Account) => void
}

export function AccountModal({ open, onClose, onCreated }: AccountModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "checking",
      initial_balance: 0,
      color: "#5B8AF5",
    },
  })

  const selectedColor = watch("color")

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose()
      reset()
    }
  }

  async function onSubmit(values: AccountFormValues) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("accounts")
        .insert([
          {
            name: values.name,
            type: values.type,
            initial_balance: values.initial_balance,
            color: values.color || null,
            is_active: true,
          },
        ])
        .select()
        .single()

      if (error) throw error

      toast.success("Conta criada com sucesso!")
      onCreated(data as Account)
      onClose()
      reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar conta"
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
          <DialogTitle>Nova Conta</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Name */}
          <div>
            <label htmlFor="acc-name" style={labelStyle}>
              Nome da Conta
            </label>
            <input
              id="acc-name"
              placeholder="Ex: Nubank, Bradesco, Carteira"
              {...register("name")}
              style={fieldStyle}
            />
            {errors.name && (
              <p style={errorStyle}>{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="acc-type" style={labelStyle}>
              Tipo
            </label>
            <select
              id="acc-type"
              {...register("type")}
              style={{ ...fieldStyle, cursor: "pointer" }}
            >
              {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p style={errorStyle}>{errors.type.message}</p>
            )}
          </div>

          {/* Initial Balance */}
          <div>
            <label htmlFor="acc-balance" style={labelStyle}>
              Saldo Inicial
            </label>
            <Controller
              name="initial_balance"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="acc-balance"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.initial_balance && (
              <p style={errorStyle}>{errors.initial_balance.message}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label style={labelStyle}>Cor (opcional)</label>
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
                  title={color}
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Criar Conta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
