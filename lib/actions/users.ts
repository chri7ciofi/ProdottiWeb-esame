"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSbClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isRuolo } from "@/lib/rbac";

export type ActionState = { error?: string; ok?: string } | null;

/** Solo ADMIN (garantito anche da RLS). Cambia il ruolo di un utente. */
export async function updateUserRole(formData: FormData): Promise<void> {
  const id = (formData.get("id") as string)?.trim();
  const ruolo = (formData.get("ruolo") as string)?.trim();
  if (!id || !isRuolo(ruolo)) return;

  const supabase = await createClient();
  await supabase.from("users").update({ ruolo }).eq("id", id);
  revalidatePath("/utenti");
}

/** Crea un nuovo utente tramite signUp, senza toccare la sessione admin. */
export async function createUser(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const nome = (formData.get("nome") as string)?.trim();
  const cognome = ((formData.get("cognome") as string) ?? "").trim();
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string) ?? "";
  const ruolo = (formData.get("ruolo") as string)?.trim();

  if (!nome || !email) return { error: "Nome ed email sono obbligatori." };
  if (password.length < 6)
    return { error: "La password deve avere almeno 6 caratteri." };
  if (!isRuolo(ruolo)) return { error: "Ruolo non valido." };

  // client isolato: non persiste la sessione (l'admin resta loggato)
  const sb = createSbClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { nome, cognome, ruolo } },
  });

  if (error) {
    if (error.message.toLowerCase().includes("registered"))
      return { error: "Esiste già un utente con questa email." };
    return { error: "Impossibile creare l'utente: " + error.message };
  }

  revalidatePath("/utenti");
  return {
    ok: `Utente ${email} creato con ruolo assegnato. Se è attiva la conferma email, dovrà confermare prima del primo accesso.`,
  };
}
