"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STATI_PRODUZIONE } from "@/lib/domain";

export type ActionState = { error?: string } | null;

export async function createOrder(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const codice_ordine = (formData.get("codice_ordine") as string)?.trim();
  const prodotto_id = (formData.get("prodotto_id") as string)?.trim();
  const quantita_da_produrre = Number(formData.get("quantita_da_produrre"));
  const data_prevista = (formData.get("data_prevista") as string) || null;
  const note = ((formData.get("note") as string) ?? "").trim() || null;

  if (!codice_ordine) return { error: "Inserisci il codice ordine." };
  if (!prodotto_id) return { error: "Seleziona il prodotto da produrre." };
  if (!Number.isFinite(quantita_da_produrre) || quantita_da_produrre <= 0)
    return { error: "Quantità da produrre non valida." };

  const { error } = await supabase.from("production_orders").insert({
    codice_ordine,
    prodotto_id,
    quantita_da_produrre,
    data_prevista,
    note,
    stato: "PIANIFICATO",
  });

  if (error) {
    if (error.code === "23505")
      return { error: "Esiste già un ordine con questo codice." };
    return { error: "Impossibile creare l'ordine: " + error.message };
  }

  revalidatePath("/produzione");
  revalidatePath("/dashboard");
  redirect("/produzione");
}

export async function updateOrderStatus(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = (formData.get("id") as string)?.trim();
  const stato = (formData.get("stato") as string)?.trim();

  if (!id || !stato || !STATI_PRODUZIONE.includes(stato as never)) return;

  await supabase.from("production_orders").update({ stato }).eq("id", id);

  revalidatePath(`/produzione/${id}`);
  revalidatePath("/produzione");
  revalidatePath("/dashboard");
}
