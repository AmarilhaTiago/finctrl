import { Shell } from "@/components/layout/shell";
import { KeyboardShortcutProvider } from "@/components/shared/keyboard-shortcut-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardShortcutProvider>
      <Shell>{children}</Shell>
    </KeyboardShortcutProvider>
  );
}
