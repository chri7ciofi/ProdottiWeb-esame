import Link from "next/link";
import { Plus, PencilSimple, Package } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { btn } from "@/components/ui/button";
import { ProductFilters } from "@/components/products/product-filters";
import { DeleteProductButton } from "@/components/products/delete-product-button";
import { formatEuro, formatNumero } from "@/lib/format";
import { STATO_PRODOTTO_LABEL, STATO_PRODOTTO_STYLE } from "@/lib/domain";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  categoria?: string;
  stato?: string;
  scorta?: string;
}>;

export default async function ProdottiPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const profilo = await requireProfilo();
  const supabase = await createClient();

  const [{ data: categorie }] = await Promise.all([
    supabase.from("categories").select("id, nome").order("nome"),
  ]);

  let query = supabase
    .from("products")
    .select(
      "id, codice, nome, quantita_disponibile, scorta_minima, unita_misura, prezzo_unitario, stato, categories(nome)"
    )
    .eq("is_deleted", false)
    .order("codice");

  if (sp.q) query = query.or(`nome.ilike.%${sp.q}%,codice.ilike.%${sp.q}%,lotto.ilike.%${sp.q}%`);
  if (sp.categoria) query = query.eq("category_id", Number(sp.categoria));
  if (sp.stato) query = query.eq("stato", sp.stato);

  const { data, error } = await query.limit(300);

  type RigaProdotto = {
    id: string;
    codice: string;
    nome: string;
    quantita_disponibile: number | null;
    scorta_minima: number | null;
    unita_misura: string;
    prezzo_unitario: number | null;
    stato: string;
    categories: { nome: string } | null;
  };

  let prodotti = (data ?? []) as RigaProdotto[];
  if (sp.scorta === "1") {
    prodotti = prodotti.filter(
      (p) => Number(p.quantita_disponibile ?? 0) < Number(p.scorta_minima ?? 0)
    );
  }

  const puoScrivere = can(profilo.ruolo, "prodotti.scrivi");
  const puoEliminare = can(profilo.ruolo, "prodotti.elimina");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titolo="Prodotti"
        descrizione="Anagrafica, giacenze e disponibilità."
        azione={
          puoScrivere && (
            <Link href="/prodotti/nuovo" className={btn("primary")}>
              <Plus size={16} weight="bold" /> Nuovo prodotto
            </Link>
          )
        }
      />

      <ProductFilters
        categorie={categorie ?? []}
        defaults={{
          q: sp.q ?? "",
          categoria: sp.categoria ?? "",
          stato: sp.stato ?? "",
          scorta: sp.scorta ?? "",
        }}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          Errore nel caricamento dei prodotti.
        </div>
      ) : prodotti.length === 0 ? (
        <EmptyState
          icon={<Package size={22} />}
          titolo="Nessun prodotto trovato"
          descrizione={
            sp.q || sp.categoria || sp.stato || sp.scorta
              ? "Prova a modificare i filtri di ricerca."
              : "Inizia inserendo il primo prodotto a catalogo."
          }
          azione={
            puoScrivere &&
            !sp.q &&
            !sp.categoria &&
            !sp.stato &&
            !sp.scorta && (
              <Link href="/prodotti/nuovo" className={btn("primary")}>
                <Plus size={16} weight="bold" /> Nuovo prodotto
              </Link>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3">Codice</th>
                  <th className="px-5 py-3">Prodotto</th>
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3 text-right">Giacenza</th>
                  <th className="px-5 py-3 text-right">Prezzo</th>
                  <th className="px-5 py-3">Stato</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {prodotti.map((p) => {
                  const sotto =
                    Number(p.quantita_disponibile ?? 0) <
                    Number(p.scorta_minima ?? 0);
                  return (
                    <tr key={p.id} className="transition hover:bg-ink-50/60">
                      <td className="px-5 py-3 font-mono text-xs text-ink-500">
                        {p.codice}
                      </td>
                      <td className="px-5 py-3 font-medium text-ink-900">
                        {p.nome}
                      </td>
                      <td className="px-5 py-3 text-ink-500">
                        {p.categories?.nome ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-mono tnum">
                        <span className={sotto ? "font-semibold text-rose-600" : "text-ink-700"}>
                          {formatNumero(p.quantita_disponibile)}
                        </span>
                        <span className="ml-1 text-xs text-ink-400">
                          {p.unita_misura}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-ink-700 tnum">
                        {formatEuro(p.prezzo_unitario)}
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={STATO_PRODOTTO_STYLE[p.stato]}>
                          {STATO_PRODOTTO_LABEL[p.stato] ?? p.stato}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {puoScrivere && (
                            <Link
                              href={`/prodotti/${p.id}`}
                              title="Modifica"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-ink-100 hover:text-ink-900 active:scale-95"
                            >
                              <PencilSimple size={16} />
                            </Link>
                          )}
                          {puoEliminare && (
                            <DeleteProductButton id={p.id} nome={p.nome} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
