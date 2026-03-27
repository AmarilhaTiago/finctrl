import { describe, it, expect } from "vitest";
import { formatCurrency, parseCurrencyInput } from "@/lib/utils/currency";

describe("formatCurrency", () => {
  it("formats positive number as BRL", () => {
    expect(formatCurrency(1250.5)).toBe("R$\u00a01.250,50");
  });
  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("R$\u00a00,00");
  });
  it("formats negative number", () => {
    expect(formatCurrency(-350.99)).toBe("-R$\u00a0350,99");
  });
  it("formats large numbers", () => {
    expect(formatCurrency(1000000)).toBe("R$\u00a01.000.000,00");
  });
});

describe("parseCurrencyInput", () => {
  it("parses digits into decimal", () => {
    expect(parseCurrencyInput("1250")).toBe(12.5);
  });
  it("parses empty as 0", () => {
    expect(parseCurrencyInput("")).toBe(0);
  });
  it("parses large value", () => {
    expect(parseCurrencyInput("125000")).toBe(1250.0);
  });
  it("strips non-digits", () => {
    expect(parseCurrencyInput("R$ 1.250,00")).toBe(1250.0);
  });
});
