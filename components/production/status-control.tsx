"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle } from "@phosphor-icons/react";
import { btn } from "@/components/ui/button";
import { STATI_PRODUZIONE, STATO_PRODUZIONE_LABEL } from "@/lib/domain";
import { updateOrderStatus } from "@/lib/actions/production";

function SaveButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={btn("primary")}
    >
      <CheckCircle size={16} weight="bold" />
      {pending ? "Aggiorno…" : "Aggiorna stato"}
    </button>
  );
}

export function StatusControl({
  id,
  statoCorrente,
}: {
  id: string;
  statoCorrente: string;
}) {
  const [stato, setStato] = useState(statoCorrente);

  return (
    <form action={updateOrderStatus} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input type="hidden" name="id" value={id} />
      <select
        name="stato"
        value={stato}
        onChange={(e) => setStato(e.target.value)}
        className="h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50"
      >
        {STATI_PRODUZIONE.map((s) => (
          <option key={s} value={s}>
            {STATO_PRODUZIONE_LABEL[s]}
          </option>
        ))}
      </select>
      <SaveButton disabled={stato === statoCorrente} />
    </form>
  );
}
