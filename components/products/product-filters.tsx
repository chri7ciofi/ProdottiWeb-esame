"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { STATI_PRODOTTO, STATO_PRODOTTO_LABEL } from "@/lib/domain";
import type { Tables } from "@/lib/database.types";

type Categoria = Pick<Tables<"categories">, "id" | "nome">;

const selCls =
  "h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-700 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50";

export function ProductFilters({
  categorie,
  defaults,
}: {
  categorie: Categoria[];
  defaults: { q: string; categoria: string; stato: string; scorta: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[260px]">
        <MagnifyingGlass
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          defaultValue={defaults.q}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Cerca per nome, codice o lotto…"
          className="h-10 w-full rounded-xl border border-ink-200 bg-white pl-9 pr-3 text-sm text-ink-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50"
        />
      </div>

      <select
        defaultValue={defaults.categoria}
        onChange={(e) => setParam("categoria", e.target.value)}
        className={selCls}
      >
        <option value="">Tutte le categorie</option>
        {categorie.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.nome}
          </option>
        ))}
      </select>

      <select
        defaultValue={defaults.stato}
        onChange={(e) => setParam("stato", e.target.value)}
        className={selCls}
      >
        <option value="">Tutti gli stati</option>
        {STATI_PRODOTTO.map((s) => (
          <option key={s} value={s}>
            {STATO_PRODOTTO_LABEL[s]}
          </option>
        ))}
      </select>

      <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-700">
        <input
          type="checkbox"
          defaultChecked={defaults.scorta === "1"}
          onChange={(e) => setParam("scorta", e.target.checked ? "1" : "")}
          className="h-4 w-4 accent-accent-600"
        />
        Solo sotto scorta
      </label>

      {pending && <span className="text-xs text-ink-400">Aggiorno…</span>}
    </div>
  );
}
