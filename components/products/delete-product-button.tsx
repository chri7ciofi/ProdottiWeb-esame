"use client";

import { useState } from "react";
import { Trash } from "@phosphor-icons/react";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({ id, nome }: { id: string; nome: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <form action={deleteProduct} className="flex items-center gap-1">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="rounded-lg bg-rose-600 px-2 py-1 text-xs font-medium text-white transition active:scale-95"
        >
          Conferma
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg px-2 py-1 text-xs text-ink-500 hover:bg-ink-100"
        >
          No
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      title={`Elimina ${nome}`}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
    >
      <Trash size={16} />
    </button>
  );
}
