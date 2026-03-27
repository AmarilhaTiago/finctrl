import { Sidebar } from "./sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base">
      <Sidebar />
      <main className="ml-[240px] min-h-screen p-6">{children}</main>
    </div>
  );
}
