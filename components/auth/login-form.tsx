"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Warning } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

const DEMO = [
  { label: "Amministratore", email: "admin@magazzino.it" },
  { label: "Resp. Magazzino", email: "responsabile@magazzino.it" },
  { label: "Operatore", email: "operatore@magazzino.it" },
  { label: "Visualizzatore", email: "visualizzatore@magazzino.it" },
];

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenziali non valide. Controlla email e password.");
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  function quickFill(mail: string) {
    setEmail(mail);
    setPassword("Demo1234!");
    setError(null);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <p className="text-sm font-medium text-accent-600">Accesso</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tighter text-ink-900">
          Bentornato.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Entra per gestire giacenze, movimenti e produzione.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-ink-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@magazzino.it"
            className="h-11 rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-ink-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
            <Warning size={18} weight="fill" className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-ink-900 text-sm font-medium text-white transition active:translate-y-px disabled:opacity-60"
        >
          {loading ? "Accesso in corso…" : "Accedi"}
          {!loading && (
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-ink-100 pt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
          Accessi demo · password Demo1234!
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => quickFill(d.email)}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-left text-xs text-ink-600 transition hover:border-accent-400 hover:text-accent-700 active:scale-[0.98]"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
