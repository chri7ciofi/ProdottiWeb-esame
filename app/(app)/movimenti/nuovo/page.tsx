import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { MovementForm } from "@/components/movements/movement-form";

export const dynamic = "force-dynamic";

export default async function NuovoMovimentoPage() {
  const profilo = await requireProfilo();
  if (!can(profilo.ruolo, "movimenti.crea")) redirect("/movimenti");

  const supabase = await createClient();
  const { data: prodotti } = await supabase
    .from("products")
    .select("id, codice, nome, quantita_disponibile, unita_misura")
    .eq("is_deleted", false)
    .order("codice");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/movimenti"
        className="flex w-fit items-center gap-1.5 text-sm text-ink-500 transition hover:text-ink-900"
      >
        <ArrowLeft size={16} /> Movimenti
      </Link>
      <PageHeader
        titolo="Registra movimento"
        descrizione="La giacenza del prodotto viene aggiornata automaticamente."
      />
      <MovementForm prodotti={prodotti ?? []} />
    </div>
  );
}
