import Link from "next/link";
import { WarningCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { MovimentiChart } from "@/components/dashboard/movimenti-chart";
import { formatNumero, formatDataOra, formatData } from "@/lib/format";
import {
  TIPO_MOVIMENTO_LABEL,
  TIPO_MOVIMENTO_STYLE,
  STATO_PRODUZIONE_LABEL,
  STATO_PRODUZIONE_STYLE,
} from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [kpiRes, chartRes, scortaRes, movRes, ordiniRes] =
    await Promise.all([
      supabase.from("dashboard_kpi").select("*").single(),
      supabase.rpc("movimenti_mensili"),
      supabase
        .from("prodotti_sotto_scorta")
        .select("id, codice, nome, quantita_disponibile, scorta_minima, unita_misura")
        .limit(6),
      supabase
        .from("inventory_movements")
        .select("id, tipo, quantita, created_at, products(nome, codice)")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("production_orders")
        .select("id, codice_ordine, stato, quantita_da_produrre, data_prevista, products(nome)")
        .not("stato", "in", "(COMPLETATO,ANNULLATO)")
        .order("data_prevista", { ascending: true })
        .limit(6),
    ]);

  const chart = (chartRes.data ?? []) as {
    mese: string;
    ingressi: number;
    uscite: number;
  }[];

  const sottoScorta = (scortaRes.data ?? []) as {
    id: string;
    codice: string;
    nome: string;
    quantita_disponibile: number | null;
    scorta_minima: number | null;
    unita_misura: string;
  }[];

  const movimenti = (movRes.data ?? []) as {
    id: string;
    tipo: string;
    quantita: number;
    created_at: string | null;
    products: { nome: string; codice: string } | null;
  }[];

  const ordini = (ordiniRes.data ?? []) as {
    id: string;
    codice_ordine: string;
    stato: string;
    quantita_da_produrre: number;
    data_prevista: string | null;
    products: { nome: string } | null;
  }[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titolo="Dashboard"
        descrizione="Panoramica di magazzino e produzione in tempo reale."
      />

      <KpiGrid kpi={kpiRes.data} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Grafico movimenti */}
        <section className="rounded-2xl border border-ink-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-ink-900">
                Andamento movimenti
              </h2>
              <p className="text-xs text-ink-500">Ultimi 12 mesi · ingressi vs uscite</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent-600" /> Ingressi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-ink-400" /> Uscite
              </span>
            </div>
          </div>
          <MovimentiChart dati={chart} />
        </section>

        {/* Sotto scorta */}
        <section className="rounded-2xl border border-ink-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <WarningCircle size={18} weight="fill" className="text-amber-500" />
            <h2 className="text-sm font-semibold text-ink-900">
              Prodotti sotto scorta
            </h2>
          </div>
          {sottoScorta.length > 0 ? (
            <ul className="divide-y divide-ink-100">
              {sottoScorta.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">
                      {p.nome}
                    </p>
                    <p className="font-mono text-xs text-ink-400">{p.codice}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-rose-600 tnum">
                      {formatNumero(p.quantita_disponibile)}
                    </p>
                    <p className="font-mono text-xs text-ink-400 tnum">
                      min {formatNumero(p.scorta_minima)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-ink-400">
              Nessun prodotto sotto scorta.
            </p>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Ultimi movimenti */}
        <section className="rounded-2xl border border-ink-200 bg-white p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Ultimi movimenti</h2>
            <Link
              href="/movimenti"
              className="flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
            >
              Tutti <ArrowRight size={12} weight="bold" />
            </Link>
          </div>
          {movimenti.length > 0 ? (
            <ul className="divide-y divide-ink-100">
              {movimenti.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Badge className={TIPO_MOVIMENTO_STYLE[m.tipo]}>
                      {TIPO_MOVIMENTO_LABEL[m.tipo] ?? m.tipo}
                    </Badge>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-800">
                        {m.products?.nome ?? "—"}
                      </p>
                      <p className="text-xs text-ink-400">
                        {formatDataOra(m.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold text-ink-700 tnum">
                    {formatNumero(m.quantita)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-ink-400">
              Nessun movimento registrato.
            </p>
          )}
        </section>

        {/* Ordini in lavorazione */}
        <section className="rounded-2xl border border-ink-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">In lavorazione</h2>
            <Link
              href="/produzione"
              className="flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
            >
              Ordini <ArrowRight size={12} weight="bold" />
            </Link>
          </div>
          {ordini.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {ordini.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">
                      {o.products?.nome ?? "—"}
                    </p>
                    <p className="font-mono text-xs text-ink-400">
                      {o.codice_ordine} · scad. {formatData(o.data_prevista)}
                    </p>
                  </div>
                  <Badge className={STATO_PRODUZIONE_STYLE[o.stato]}>
                    {STATO_PRODUZIONE_LABEL[o.stato] ?? o.stato}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-ink-400">
              Nessun ordine in lavorazione.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
