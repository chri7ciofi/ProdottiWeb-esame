"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string } | null;

export async function createMovement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessione scaduta. Effettua di nuovo l'accesso." };

  const product_id = (formData.get("product_id") as string)?.trim();
  const tipo = (formData.get("tipo") as string)?.trim();
  const quantita = Number(formData.get("quantita"));
  const motivazione = ((formData.get("motivazione") as string) ?? "").trim() || null;

  if (!product_id) return { error: "Seleziona un prodotto." };
  if (!tipo) return { error: "Seleziona il tipo di movimento." };
  if (!Number.isFinite(quantita) || quantita < 0)
    return { error: "Quantità non valida." };

  const { error } = await supabase.from("inventory_movements").insert({
    product_id,
    user_id: user.id,
    tipo,
    quantita,
    motivazione,
  });

  if (error) {
    // eccezioni dal trigger (es. giacenza insufficiente) arrivano come messaggio
    if (error.message.includes("Giacenza insufficiente"))
      return { error: "Giacenza insufficiente per questa uscita." };
    return { error: "Impossibile registrare il movimento: " + error.message };
  }

  revalidatePath("/movimenti");
  revalidatePath("/prodotti");
  revalidatePath("/dashboard");
  redirect("/movimenti");
}
