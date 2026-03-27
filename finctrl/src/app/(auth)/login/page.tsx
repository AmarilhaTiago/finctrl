"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
      <div className="bg-card border border-stroke rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">
            <span className="text-accent">Fin</span>Ctrl
          </h1>
          <p className="text-text-secondary text-sm mt-2">Entre na sua conta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              id="password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              className="bg-base border-stroke text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-stroke data-checked:bg-accent data-checked:border-accent"
            />
            <Label htmlFor="remember" className="text-text-secondary text-sm cursor-pointer">Manter conectado</Label>
          </div>

          {error && <p className="text-negative text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-light text-white font-medium">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-text-tertiary text-sm mt-6">
          Não tem conta?{" "}
          <Link href="/register" className="text-accent hover:text-accent-light">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
