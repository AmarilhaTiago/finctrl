import { describe, it, expect } from "vitest";
import { formatDate, getMonthRange, parseDateShortcut } from "@/lib/utils/date";

describe("formatDate", () => {
  it("formats as DD/MM/YYYY", () => {
    expect(formatDate("2026-03-25")).toBe("25/03/2026");
  });
});

describe("getMonthRange", () => {
  it("returns first and last day", () => {
    const range = getMonthRange(2026, 2);
    expect(range.start).toBe("2026-03-01");
    expect(range.end).toBe("2026-03-31");
  });
  it("handles February", () => {
    const range = getMonthRange(2027, 1);
    expect(range.start).toBe("2027-02-01");
    expect(range.end).toBe("2027-02-28");
  });
});

describe("parseDateShortcut", () => {
  it("parses h as today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(parseDateShortcut("h")).toBe(today);
  });
  it("parses o as yesterday", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    expect(parseDateShortcut("o")).toBe(yesterday);
  });
  it("parses DDMM as date", () => {
    const year = new Date().getFullYear();
    expect(parseDateShortcut("2503")).toBe(`${year}-03-25`);
  });
  it("returns null for invalid", () => {
    expect(parseDateShortcut("abc")).toBeNull();
  });
});
