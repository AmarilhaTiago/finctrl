export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function parseCurrencyInput(input: string): number {
  const digits = input.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

export function formatCurrencyInput(value: number): string {
  if (value === 0) return "";
  return formatCurrency(value).replace("R$\u00a0", "");
}
