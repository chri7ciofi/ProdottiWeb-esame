import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { OrderForm } from "@/components/production/order-form";

export const dynamic = "force-dynamic";

export default async function NuovoOrdinePage() {
  const profilo = await requireProfilo();
  if (!can(profilo.ruolo, "produzione.crea")) redirect("/produzione");

  const supabase = await createClient();
  const { data: prodotti } = await supabase
    .from("products")
    .select("id, codice, nome")
    .eq("is_deleted", false)
    .order("codice");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/produzione"
        className="flex w-fit items-center gap-1.5 text-sm text-ink-500 transition hover:text-ink-900"
      >
        <ArrowLeft size={16} /> Ordini di produzione
      </Link>
      <PageHeader
        titolo="Nuovo ordine di produzione"
        descrizione="L'ordine viene creato nello stato Pianificato."
      />
      <OrderForm prodotti={prodotti ?? []} />
    </div>
  );
}
