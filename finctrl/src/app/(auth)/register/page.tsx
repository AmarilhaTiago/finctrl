"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message || "Erro ao criar conta. Tente novamente.");
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
          <p style={{ color: "#8B8FA8" }} className="text-sm mt-2">Crie sua conta</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" style={{ color: "#8B8FA8" }} className="text-xs uppercase tracking-wide block">Nome</label>
            <input
              id="name" type="text" placeholder="Seu nome"
              value={name} onChange={(e) => setName(e.target.value)} required
              style={{ backgroundColor: "#0D0F14", borderColor: "#252840", color: "#F0F2FF" }}
              className="w-full h-10 border rounded-lg px-3 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2"
              onFocus={(e) => e.target.style.borderColor = "#5B8AF5"}
              onBlur={(e) => e.target.style.borderColor = "#252840"}
            />
          </div>

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
              id="password" type="password" placeholder="Mínimo 6 caracteres"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              style={{ backgroundColor: "#0D0F14", borderColor: "#252840", color: "#F0F2FF" }}
              className="w-full h-10 border rounded-lg px-3 text-sm placeholder:opacity-40 focus:outline-none focus:ring-2"
              onFocus={(e) => e.target.style.borderColor = "#5B8AF5"}
              onBlur={(e) => e.target.style.borderColor = "#252840"}
            />
          </div>

          {error && <p style={{ color: "#EF5350" }} className="text-sm">{error}</p>}

          <button
            type="submit" disabled={loading}
            style={{ backgroundColor: "#5B8AF5", color: "#FFFFFF" }}
            className="w-full h-10 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p style={{ color: "#555872" }} className="text-center text-sm mt-6">
          Já tem conta?{" "}
          <Link href="/login" style={{ color: "#5B8AF5" }} className="hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
