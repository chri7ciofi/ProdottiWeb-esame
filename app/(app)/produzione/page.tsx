import Link from "next/link";
import { Plus, Factory } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { btn } from "@/components/ui/button";
import { formatNumero, formatData } from "@/lib/format";
import { STATO_PRODUZIONE_LABEL, STATO_PRODUZIONE_STYLE } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function ProduzionePage() {
  const profilo = await requireProfilo();
  const supabase = await createClient();

  const { data } = await supabase
    .from("production_orders")
    .select(
      "id, codice_ordine, stato, quantita_da_produrre, data_prevista, data_fine, products(nome, codice)"
    )
    .order("created_at", { ascending: false });

  const ordini = (data ?? []) as {
    id: string;
    codice_ordine: string;
    stato: string;
    quantita_da_produrre: number;
    data_prevista: string | null;
    data_fine: string | null;
    products: { nome: string; codice: string } | null;
  }[];
  const puoCreare = can(profilo.ruolo, "produzione.crea");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titolo="Ordini di produzione"
        descrizione="Pianificazione e avanzamento delle lavorazioni."
        azione={
          puoCreare && (
            <Link href="/produzione/nuovo" className={btn("primary")}>
              <Plus size={16} weight="bold" /> Nuovo ordine
            </Link>
          )
        }
      />

      {ordini.length === 0 ? (
        <EmptyState
          icon={<Factory size={22} />}
          titolo="Nessun ordine di produzione"
          descrizione="Crea il primo ordine per avviare la pianificazione."
          azione={
            puoCreare && (
              <Link href="/produzione/nuovo" className={btn("primary")}>
                <Plus size={16} weight="bold" /> Nuovo ordine
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
                  <th className="px-5 py-3">Ordine</th>
                  <th className="px-5 py-3">Prodotto</th>
                  <th className="px-5 py-3 text-right">Quantità</th>
                  <th className="px-5 py-3">Prevista</th>
                  <th className="px-5 py-3">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {ordini.map((o) => (
                  <tr key={o.id} className="transition hover:bg-ink-50/60">
                    <td className="px-5 py-3">
                      <Link
                        href={`/produzione/${o.id}`}
                        className="font-mono text-xs font-medium text-accent-700 hover:underline"
                      >
                        {o.codice_ordine}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink-900">
                        {o.products?.nome ?? "—"}
                      </p>
                      <p className="font-mono text-xs text-ink-400">
                        {o.products?.codice}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-ink-700 tnum">
                      {formatNumero(o.quantita_da_produrre)}
                    </td>
                    <td className="px-5 py-3 text-ink-500">
                      {formatData(o.data_prevista)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={STATO_PRODUZIONE_STYLE[o.stato]}>
                        {STATO_PRODUZIONE_LABEL[o.stato] ?? o.stato}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
