import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { ProductForm } from "@/components/products/product-form";
import { createProduct } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default async function NuovoProdottoPage() {
  const profilo = await requireProfilo();
  if (!can(profilo.ruolo, "prodotti.scrivi")) redirect("/prodotti");

  const supabase = await createClient();
  const [{ data: categorie }, { data: fornitori }] = await Promise.all([
    supabase.from("categories").select("id, nome").order("nome"),
    supabase.from("suppliers").select("id, ragione_sociale").order("ragione_sociale"),
  ]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/prodotti"
        className="flex w-fit items-center gap-1.5 text-sm text-ink-500 transition hover:text-ink-900"
      >
        <ArrowLeft size={16} /> Prodotti
      </Link>
      <PageHeader
        titolo="Nuovo prodotto"
        descrizione="Inserisci l'anagrafica e la giacenza iniziale."
      />
      <ProductForm
        action={createProduct}
        categorie={categorie ?? []}
        fornitori={fornitori ?? []}
      />
    </div>
  );
}
