import { Shell } from "@/components/layout/shell";
import { KeyboardShortcutProvider } from "@/components/shared/keyboard-shortcut-provider";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardShortcutProvider>
      <Shell>{children}</Shell>
      <TransactionModal />
      <Toaster theme="dark" richColors position="bottom-right" />
    </KeyboardShortcutProvider>
  );
}
