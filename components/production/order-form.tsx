"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Warning } from "@phosphor-icons/react";
import { btn } from "@/components/ui/button";
import { createOrder, type ActionState } from "@/lib/actions/production";
import type { Tables } from "@/lib/database.types";

type Prodotto = Pick<Tables<"products">, "id" | "codice" | "nome">;

const inputCls =
  "h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={btn("primary")}>
      {pending ? "Creazione…" : "Crea ordine"}
    </button>
  );
}

export function OrderForm({ prodotti }: { prodotti: Prodotto[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createOrder,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
          <Warning size={18} weight="fill" className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700">Codice ordine</label>
            <input
              name="codice_ordine"
              required
              placeholder="ES. OP-2024-013"
              className={`${inputCls} font-mono`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700">Data prevista</label>
            <input type="date" name="data_prevista" className={inputCls} />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Prodotto</label>
            <select name="prodotto_id" required defaultValue="" className={inputCls}>
              <option value="" disabled>
                — Seleziona prodotto —
              </option>
              {prodotti.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.codice} · {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700">
              Quantità da produrre
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="quantita_da_produrre"
              required
              placeholder="0"
              className={`${inputCls} font-mono`}
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Note</label>
            <textarea
              name="note"
              rows={2}
              placeholder="Note opzionali sull'ordine"
              className={`${inputCls} h-auto py-2.5`}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/produzione" className={btn("secondary")}>
          Annulla
        </Link>
      </div>
    </form>
  );
}
