"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { parseCurrencyInput, formatCurrencyInput } from "@/lib/utils/currency"

interface CurrencyInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value: number
  onChange: (value: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ value, onChange, className, ...props }, ref) {
    const displayValue = formatCurrencyInput(value)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const parsed = parseCurrencyInput(e.target.value)
      onChange(parsed)
    }

    return (
      <div className="relative flex items-center">
        <span className="absolute left-2.5 text-sm text-muted-foreground select-none pointer-events-none">
          R$
        </span>
        <input
          {...props}
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          className={cn(
            "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent pl-9 pr-2.5 py-1 text-right text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 md:text-sm",
            className
          )}
        />
      </div>
    )
  }
)

export { CurrencyInput }
