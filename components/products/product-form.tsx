"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Warning } from "@phosphor-icons/react";
import { btn } from "@/components/ui/button";
import { STATI_PRODOTTO, STATO_PRODOTTO_LABEL } from "@/lib/domain";
import type { ActionState } from "@/lib/actions/products";
import type { Tables } from "@/lib/database.types";

type Categoria = Pick<Tables<"categories">, "id" | "nome">;
type Fornitore = Pick<Tables<"suppliers">, "id" | "ragione_sociale">;
type Prodotto = Tables<"products">;

const inputCls =
  "h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50";
const labelCls = "text-sm font-medium text-ink-700";

function Campo({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

function SubmitButton({ edit }: { edit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={btn("primary")}>
      {pending ? "Salvataggio…" : edit ? "Salva modifiche" : "Crea prodotto"}
    </button>
  );
}

export function ProductForm({
  action,
  categorie,
  fornitori,
  prodotto,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  categorie: Categoria[];
  fornitori: Fornitore[];
  prodotto?: Prodotto;
}) {
  const [state, formAction] = useActionState(action, null);
  const edit = Boolean(prodotto);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {prodotto && <input type="hidden" name="id" value={prodotto.id} />}

      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
          <Warning size={18} weight="fill" className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Campo label="Codice prodotto">
            <input
              name="codice"
              required
              defaultValue={prodotto?.codice}
              readOnly={edit}
              placeholder="ES. MP-1001"
              className={`${inputCls} ${edit ? "bg-ink-50 text-ink-500" : ""} font-mono`}
            />
          </Campo>
          <Campo label="Nome">
            <input
              name="nome"
              required
              defaultValue={prodotto?.nome}
              placeholder="Nome prodotto"
              className={inputCls}
            />
          </Campo>

          <div className="md:col-span-2">
            <Campo label="Descrizione">
              <textarea
                name="descrizione"
                rows={2}
                defaultValue={prodotto?.descrizione ?? ""}
                placeholder="Descrizione opzionale"
                className={`${inputCls} h-auto py-2.5`}
              />
            </Campo>
          </div>

          <Campo label="Categoria">
            <select
              name="category_id"
              defaultValue={prodotto?.category_id ?? ""}
              className={inputCls}
            >
              <option value="">— Nessuna —</option>
              {categorie.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Fornitore">
            <select
              name="supplier_id"
              defaultValue={prodotto?.supplier_id ?? ""}
              className={inputCls}
            >
              <option value="">— Nessuno —</option>
              {fornitori.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.ragione_sociale}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Unità di misura">
            <input
              name="unita_misura"
              defaultValue={prodotto?.unita_misura ?? "pz"}
              readOnly={edit}
              className={`${inputCls} ${edit ? "bg-ink-50 text-ink-500" : ""}`}
            />
          </Campo>
          <Campo label="Stato">
            <select
              name="stato"
              defaultValue={prodotto?.stato ?? "DISPONIBILE"}
              className={inputCls}
            >
              {STATI_PRODOTTO.map((s) => (
                <option key={s} value={s}>
                  {STATO_PRODOTTO_LABEL[s]}
                </option>
              ))}
            </select>
          </Campo>

          <Campo
            label="Quantità disponibile"
            hint={edit ? "Modificabile solo tramite movimenti di magazzino." : undefined}
          >
            <input
              type="number"
              step="0.01"
              name="quantita_disponibile"
              defaultValue={prodotto?.quantita_disponibile ?? 0}
              readOnly={edit}
              className={`${inputCls} ${edit ? "bg-ink-50 text-ink-500" : ""} font-mono`}
            />
          </Campo>
          <Campo label="Scorta minima">
            <input
              type="number"
              step="0.01"
              name="scorta_minima"
              defaultValue={prodotto?.scorta_minima ?? 0}
              className={`${inputCls} font-mono`}
            />
          </Campo>

          <Campo label="Lotto">
            <input
              name="lotto"
              defaultValue={prodotto?.lotto ?? ""}
              readOnly={edit}
              placeholder="LOT-…"
              className={`${inputCls} ${edit ? "bg-ink-50 text-ink-500" : ""} font-mono`}
            />
          </Campo>
          <Campo label="Prezzo unitario (€)">
            <input
              type="number"
              step="0.01"
              name="prezzo_unitario"
              defaultValue={prodotto?.prezzo_unitario ?? 0}
              className={`${inputCls} font-mono`}
            />
          </Campo>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton edit={edit} />
        <Link href="/prodotti" className={btn("secondary")}>
          Annulla
        </Link>
      </div>
    </form>
  );
}
