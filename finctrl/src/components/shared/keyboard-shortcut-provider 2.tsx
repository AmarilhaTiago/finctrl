"use client";

import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";

export function KeyboardShortcutProvider({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}
