"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string } | null;

function parseNum(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function str(v: FormDataEntryValue | null): string | null {
  const s = (v as string)?.trim();
  return s ? s : null;
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const payload = {
    codice: str(formData.get("codice")) ?? "",
    nome: str(formData.get("nome")) ?? "",
    descrizione: str(formData.get("descrizione")),
    category_id: formData.get("category_id")
      ? parseNum(formData.get("category_id"))
      : null,
    supplier_id: str(formData.get("supplier_id")),
    unita_misura: str(formData.get("unita_misura")) ?? "pz",
    quantita_disponibile: parseNum(formData.get("quantita_disponibile")),
    scorta_minima: parseNum(formData.get("scorta_minima")),
    lotto: str(formData.get("lotto")),
    prezzo_unitario: parseNum(formData.get("prezzo_unitario")),
    stato: str(formData.get("stato")) ?? "DISPONIBILE",
  };

  if (!payload.codice || !payload.nome) {
    return { error: "Codice e nome sono obbligatori." };
  }

  const { error } = await supabase.from("products").insert(payload);

  if (error) {
    if (error.code === "23505")
      return { error: "Esiste già un prodotto con questo codice." };
    return { error: "Impossibile salvare il prodotto: " + error.message };
  }

  revalidatePath("/prodotti");
  redirect("/prodotti");
}

export async function updateProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const id = str(formData.get("id"));
  if (!id) return { error: "Prodotto non valido." };

  const payload = {
    nome: str(formData.get("nome")) ?? "",
    descrizione: str(formData.get("descrizione")),
    category_id: formData.get("category_id")
      ? parseNum(formData.get("category_id"))
      : null,
    supplier_id: str(formData.get("supplier_id")),
    scorta_minima: parseNum(formData.get("scorta_minima")),
    prezzo_unitario: parseNum(formData.get("prezzo_unitario")),
    stato: str(formData.get("stato")) ?? "DISPONIBILE",
  };

  if (!payload.nome) return { error: "Il nome è obbligatorio." };

  const { error } = await supabase.from("products").update(payload).eq("id", id);

  if (error) return { error: "Impossibile aggiornare: " + error.message };

  revalidatePath("/prodotti");
  revalidatePath(`/prodotti/${id}`);
  redirect("/prodotti");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = str(formData.get("id"));
  if (!id) return;

  await supabase.from("products").update({ is_deleted: true }).eq("id", id);
  revalidatePath("/prodotti");
}
