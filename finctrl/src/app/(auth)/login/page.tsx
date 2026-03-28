"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div style={{ backgroundColor: "#1A1D27", borderColor: "#252840" }} className="border rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: "#F0F2FF" }}>
            <span style={{ color: "#5B8AF5" }}>Fin</span>Ctrl
          </h1>
          <p style={{ color: "#8B8FA8" }} className="text-sm mt-2">Entre na sua conta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" style={{ color: "#8B8FA8" }} className="text-xs uppercase tracking-wide block">Email</label>
            <input
              id="email" type="email" placeholder="seu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ backgroundColor: "#0D0F14", borderColor: "#252840", color: "#F0F2FF" }}
              className="w-full h-10 border rounded-lg px-3 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2"
              onFocus={(e) => e.target.style.borderColor = "#5B8AF5"}
              onBlur={(e) => e.target.style.borderColor = "#252840"}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" style={{ color: "#8B8FA8" }} className="text-xs uppercase tracking-wide block">Senha</label>
            <input
              id="password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ backgroundColor: "#0D0F14", borderColor: "#252840", color: "#F0F2FF" }}
              className="w-full h-10 border rounded-lg px-3 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2"
              onFocus={(e) => e.target.style.borderColor = "#5B8AF5"}
              onBlur={(e) => e.target.style.borderColor = "#252840"}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remember" type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded"
              style={{ accentColor: "#5B8AF5" }}
            />
            <label htmlFor="remember" style={{ color: "#8B8FA8" }} className="text-sm cursor-pointer">Manter conectado</label>
          </div>

          {error && <p style={{ color: "#EF5350" }} className="text-sm">{error}</p>}

          <button
            type="submit" disabled={loading}
            style={{ backgroundColor: "#5B8AF5", color: "#FFFFFF" }}
            className="w-full h-10 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={{ color: "#555872" }} className="text-center text-sm mt-6">
          Não tem conta?{" "}
          <Link href="/register" style={{ color: "#5B8AF5" }} className="hover:underline">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
