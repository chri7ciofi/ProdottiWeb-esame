"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Warning, CheckCircle, UserPlus, X } from "@phosphor-icons/react";
import { btn } from "@/components/ui/button";
import { RUOLO_LABEL, type Ruolo } from "@/lib/rbac";
import { createUser, type ActionState } from "@/lib/actions/users";

const RUOLI: Ruolo[] = [
  "VISUALIZZATORE",
  "OPERATORE_PRODUZIONE",
  "RESPONSABILE_MAGAZZINO",
  "ADMIN",
];

const inputCls =
  "h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={btn("primary")}>
      {pending ? "Creazione…" : "Crea utente"}
    </button>
  );
}

export function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(
    createUser,
    null
  );

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={btn("primary")}>
        <UserPlus size={16} weight="bold" /> Nuovo utente
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/40" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-ink-900">
            Nuovo utente
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"
          >
            <X size={18} />
          </button>
        </div>

        {state?.ok ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
              <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
              <span>{state.ok}</span>
            </div>
            <button onClick={() => setOpen(false)} className={btn("secondary")}>
              Chiudi
            </button>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                <Warning size={18} weight="fill" className="mt-0.5 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-ink-700">Nome</label>
                <input name="nome" required className={inputCls} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-ink-700">Cognome</label>
                <input name="cognome" className={inputCls} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink-700">Email</label>
              <input type="email" name="email" required className={inputCls} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink-700">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink-700">Ruolo</label>
              <select name="ruolo" defaultValue="VISUALIZZATORE" className={inputCls}>
                {RUOLI.map((r) => (
                  <option key={r} value={r}>
                    {RUOLO_LABEL[r]}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <SubmitButton />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={btn("secondary")}
              >
                Annulla
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
