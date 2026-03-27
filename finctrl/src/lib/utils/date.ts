import { format, startOfMonth, endOfMonth, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateLong(dateStr: string): string {
  return format(new Date(dateStr + "T12:00:00"), "dd 'de' MMMM", { locale: ptBR });
}

export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const date = new Date(year, month, 1);
  const start = format(startOfMonth(date), "yyyy-MM-dd");
  const end = format(endOfMonth(date), "yyyy-MM-dd");
  return { start, end };
}

export function parseDateShortcut(input: string): string | null {
  const lower = input.toLowerCase().trim();
  if (lower === "h") return new Date().toISOString().split("T")[0];
  if (lower === "o") return subDays(new Date(), 1).toISOString().split("T")[0];
  if (/^\d{4}$/.test(lower)) {
    const day = parseInt(lower.slice(0, 2), 10);
    const month = parseInt(lower.slice(2, 4), 10);
    const year = new Date().getFullYear();
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return null;
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}
