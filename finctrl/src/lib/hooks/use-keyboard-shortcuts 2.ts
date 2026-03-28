"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/stores/ui-store";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { openTransactionModal, closeTransactionModal } = useUIStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (e.key === "Escape") {
        closeTransactionModal();
        return;
      }

      if (isInput) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            openTransactionModal();
            break;
          case "d":
            e.preventDefault();
            router.push("/dashboard");
            break;
          case "t":
            e.preventDefault();
            router.push("/transactions");
            break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, openTransactionModal, closeTransactionModal]);
}
