"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Warning, ArrowDown, ArrowUp, ArrowsLeftRight, Sliders } from "@phosphor-icons/react";
import { btn } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { MOTIVAZIONI_USCITA } from "@/lib/domain";
import { createMovement, type ActionState } from "@/lib/actions/movements";
import type { Tables } from "@/lib/database.types";

type Prodotto = Pick<
  Tables<"products">,
  "id" | "codice" | "nome" | "quantita_disponibile" | "unita_misura"
>;

const TIPI = [
  { val: "INGRESSO", label: "Ingresso", icon: ArrowDown, desc: "Carico merce" },
  { val: "USCITA", label: "Uscita", icon: ArrowUp, desc: "Scarico merce" },
  { val: "TRASFERIMENTO", label: "Trasferimento", icon: ArrowsLeftRight, desc: "Spostamento" },
  { val: "RETTIFICA", label: "Rettifica", icon: Sliders, desc: "Imposta giacenza" },
] as const;

const inputCls =
  "h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={btn("primary")}>
      {pending ? "Registrazione…" : "Registra movimento"}
    </button>
  );
}

export function MovementForm({ prodotti }: { prodotti: Prodotto[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createMovement,
    null
  );
  const [tipo, setTipo] = useState("INGRESSO");
  const [productId, setProductId] = useState("");

  const selezionato = prodotti.find((p) => p.id === productId);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
          <Warning size={18} weight="fill" className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <input type="hidden" name="tipo" value={tipo} />

      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <p className="mb-3 text-sm font-medium text-ink-700">Tipo di movimento</p>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {TIPI.map(({ val, label, icon: Icon, desc }) => (
            <button
              key={val}
              type="button"
              onClick={() => setTipo(val)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition active:scale-[0.98]",
                tipo === val
                  ? "border-accent-500 bg-accent-50 ring-2 ring-accent-100"
                  : "border-ink-200 bg-white hover:border-ink-300"
              )}
            >
              <Icon
                size={18}
                weight="bold"
                className={tipo === val ? "text-accent-700" : "text-ink-400"}
              />
              <span className="text-sm font-medium text-ink-900">{label}</span>
              <span className="text-xs text-ink-400">{desc}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-ink-700">Prodotto</label>
            <select
              name="product_id"
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={inputCls}
            >
              <option value="">— Seleziona prodotto —</option>
              {prodotti.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.codice} · {p.nome}
                </option>
              ))}
            </select>
            {selezionato && (
              <p className="text-xs text-ink-400">
                Giacenza attuale:{" "}
                <span className="font-mono text-ink-600">
                  {Number(selezionato.quantita_disponibile ?? 0)}{" "}
                  {selezionato.unita_misura}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700">
              {tipo === "RETTIFICA" ? "Nuova giacenza" : "Quantità"}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="quantita"
              required
              placeholder="0"
              className={`${inputCls} font-mono`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700">Motivazione</label>
            {tipo === "USCITA" ? (
              <select name="motivazione" className={inputCls} defaultValue="Vendita">
                {MOTIVAZIONI_USCITA.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="motivazione"
                placeholder="Note opzionali"
                className={inputCls}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/movimenti" className={btn("secondary")}>
          Annulla
        </Link>
      </div>
    </form>
  );
}
