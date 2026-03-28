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
import { createClient } from "@/lib/supabase/client"
import type { Category, CategoryType } from "@/lib/types/database"

const CATEGORY_COLOR_PRESETS = [
  "#5B8AF5",
  "#22D3A0",
  "#EF5350",
  "#F5A623",
  "#A78BFA",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#64B5F6",
  "#FFD54F",
]

const CATEGORY_TYPE_OPTIONS: { value: CategoryType; label: string }[] = [
  { value: "expense", label: "Despesa" },
  { value: "income", label: "Receita" },
  { value: "both", label: "Ambos" },
]

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  icon: z.string().optional(),
  color: z.string().min(1, "Cor é obrigatória"),
  monthly_limit: z.number().min(0).optional(),
  type: z.enum(["expense", "income", "both"] as const),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  category?: Category | null
}

export function CategoryModal({ open, onClose, onSaved, category }: CategoryModalProps) {
  const isEdit = !!category

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: "",
      color: "#5B8AF5",
      monthly_limit: 0,
      type: "expense",
    },
  })

  // Populate form when editing
  React.useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        icon: category.icon ?? "",
        color: category.color,
        monthly_limit: category.monthly_limit ?? 0,
        type: category.type,
      })
    } else if (open && !category) {
      reset({
        name: "",
        icon: "",
        color: "#5B8AF5",
        monthly_limit: 0,
        type: "expense",
      })
    }
  }, [open, category, reset])

  const selectedColor = watch("color")

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onClose()
      reset()
    }
  }

  async function onSubmit(values: CategoryFormValues) {
    try {
      const supabase = createClient()

      const payload = {
        name: values.name,
        icon: values.icon || null,
        color: values.color,
        monthly_limit: values.monthly_limit && values.monthly_limit > 0 ? values.monthly_limit : null,
        type: values.type,
      }

      if (isEdit && category) {
        const { error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", category.id)

        if (error) throw error
        toast.success("Categoria atualizada com sucesso!")
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([{ ...payload, is_active: true }])

        if (error) throw error
        toast.success("Categoria criada com sucesso!")
      }

      onSaved()
      onClose()
      reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar categoria"
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
          <DialogTitle>{isEdit ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Name */}
          <div>
            <label htmlFor="cat-name" style={labelStyle}>
              Nome
            </label>
            <input
              id="cat-name"
              placeholder="Ex: Alimentação, Transporte..."
              {...register("name")}
              style={fieldStyle}
            />
            {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
          </div>

          {/* Icon */}
          <div>
            <label htmlFor="cat-icon" style={labelStyle}>
              Ícone (nome Lucide, opcional)
            </label>
            <input
              id="cat-icon"
              placeholder="Ex: utensils, car, home..."
              {...register("icon")}
              style={fieldStyle}
            />
            <p style={{ fontSize: "12px", color: "#555872", marginTop: "4px" }}>
              Ícones disponíveis: home, utensils, car, gamepad-2, heart-pulse, graduation-cap, shirt, repeat, plane, circle-dot, banknote, laptop, trending-up, plus-circle
            </p>
          </div>

          {/* Type */}
          <div>
            <label htmlFor="cat-type" style={labelStyle}>
              Tipo
            </label>
            <select
              id="cat-type"
              {...register("type")}
              style={{ ...fieldStyle, cursor: "pointer" }}
            >
              {CATEGORY_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.type && <p style={errorStyle}>{errors.type.message}</p>}
          </div>

          {/* Monthly Limit */}
          <div>
            <label htmlFor="cat-limit" style={labelStyle}>
              Limite Mensal (opcional)
            </label>
            <Controller
              name="monthly_limit"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="cat-limit"
                  value={field.value ?? 0}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.monthly_limit && (
              <p style={errorStyle}>{errors.monthly_limit.message}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label style={labelStyle}>Cor</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORY_COLOR_PRESETS.map((color) => (
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
            {errors.color && <p style={errorStyle}>{errors.color.message}</p>}
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
              {isSubmitting ? "Salvando..." : isEdit ? "Salvar" : "Criar Categoria"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
