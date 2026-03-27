"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      setError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-card border border-stroke rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">
            <span className="text-accent">Fin</span>Ctrl
          </h1>
          <p className="text-text-secondary text-sm mt-2">Crie sua conta</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-text-secondary text-xs uppercase tracking-wide">Nome</Label>
            <Input
              id="name" type="text" placeholder="Seu nome"
              value={name} onChange={(e) => setName(e.target.value)} required
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-secondary text-xs uppercase tracking-wide">Email</Label>
            <Input
              id="email" type="email" placeholder="seu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-text-secondary text-xs uppercase tracking-wide">Senha</Label>
            <Input
              id="password" type="password" placeholder="Mínimo 6 caracteres"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          {error && <p className="text-negative text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-light text-white font-medium">
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-center text-text-tertiary text-sm mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-accent hover:text-accent-light">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
