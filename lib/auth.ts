import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";

export type Profilo = Pick<
  Tables<"users">,
  "id" | "nome" | "cognome" | "email" | "ruolo"
>;

/** Ritorna il profilo dell'utente loggato, oppure reindirizza al login. */
export async function requireProfilo(): Promise<Profilo> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profilo } = await supabase
    .from("users")
    .select("id, nome, cognome, email, ruolo")
    .eq("id", user.id)
    .single();

  if (!profilo) redirect("/login");
  return profilo;
}
