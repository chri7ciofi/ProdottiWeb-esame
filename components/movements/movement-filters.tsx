"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TIPI_MOVIMENTO, TIPO_MOVIMENTO_LABEL } from "@/lib/domain";

const cls =
  "h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-700 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50";

export function MovementFilters({
  defaults,
}: {
  defaults: { tipo: string; da: string; a: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}?${next.toString()}`));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <select
        defaultValue={defaults.tipo}
        onChange={(e) => setParam("tipo", e.target.value)}
        className={cls}
      >
        <option value="">Tutti i tipi</option>
        {TIPI_MOVIMENTO.map((t) => (
          <option key={t} value={t}>
            {TIPO_MOVIMENTO_LABEL[t]}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-ink-500">
        Dal
        <input
          type="date"
          defaultValue={defaults.da}
          onChange={(e) => setParam("da", e.target.value)}
          className={cls}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-500">
        al
        <input
          type="date"
          defaultValue={defaults.a}
          onChange={(e) => setParam("a", e.target.value)}
          className={cls}
        />
      </label>

      {pending && <span className="text-xs text-ink-400">Aggiorno…</span>}
    </div>
  );
}
