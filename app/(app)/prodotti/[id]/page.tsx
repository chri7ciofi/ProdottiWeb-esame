import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { ProductForm } from "@/components/products/product-form";
import { updateProduct } from "@/lib/actions/products";
import type { Tables } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function ModificaProdottoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profilo = await requireProfilo();
  if (!can(profilo.ruolo, "prodotti.scrivi")) redirect("/prodotti");

  const supabase = await createClient();
  const [{ data: prodotto }, { data: categorie }, { data: fornitori }] =
    await Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase.from("categories").select("id, nome").order("nome"),
      supabase.from("suppliers").select("id, ragione_sociale").order("ragione_sociale"),
    ]);

  if (!prodotto) notFound();
  const p = prodotto as Tables<"products">;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/prodotti"
        className="flex w-fit items-center gap-1.5 text-sm text-ink-500 transition hover:text-ink-900"
      >
        <ArrowLeft size={16} /> Prodotti
      </Link>
      <PageHeader
        titolo={p.nome}
        descrizione={`Codice ${p.codice} · modifica anagrafica`}
      />
      <ProductForm
        action={updateProduct}
        categorie={categorie ?? []}
        fornitori={fornitori ?? []}
        prodotto={p}
      />
    </div>
  );
}
