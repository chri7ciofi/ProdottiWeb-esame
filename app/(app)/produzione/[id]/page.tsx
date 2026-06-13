import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Badge } from "@/components/ui/badge";
import { StatusControl } from "@/components/production/status-control";
import { formatNumero, formatData, formatDataOra } from "@/lib/format";
import { STATO_PRODUZIONE_LABEL, STATO_PRODUZIONE_STYLE } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function OrdineDettaglioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profilo = await requireProfilo();
  const supabase = await createClient();

  const [{ data: ordine }, { data: storico }] = await Promise.all([
    supabase
      .from("production_orders")
      .select(
        "id, codice_ordine, stato, quantita_da_produrre, data_prevista, data_inizio, data_fine, note, products(nome, codice)"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("production_status_history")
      .select("id, stato_precedente, stato_nuovo, changed_at, users(nome, cognome)")
      .eq("production_order_id", id)
      .order("changed_at", { ascending: false }),
  ]);

  if (!ordine) notFound();

  const ord = ordine as {
    id: string;
    codice_ordine: string;
    stato: string;
    quantita_da_produrre: number;
    data_prevista: string | null;
    data_inizio: string | null;
    data_fine: string | null;
    note: string | null;
    products: { nome: string; codice: string } | null;
  };

  const eventi = (storico ?? []) as {
    id: string;
    stato_precedente: string | null;
    stato_nuovo: string;
    changed_at: string | null;
    users: { nome: string; cognome: string | null } | null;
  }[];

  const puoCambiare = can(profilo.ruolo, "produzione.stato");

  const dati = [
    { label: "Prodotto", valore: ord.products?.nome ?? "—" },
    { label: "Codice prodotto", valore: ord.products?.codice ?? "—", mono: true },
    { label: "Quantità da produrre", valore: formatNumero(ord.quantita_da_produrre), mono: true },
    { label: "Data prevista", valore: formatData(ord.data_prevista) },
    { label: "Inizio produzione", valore: formatDataOra(ord.data_inizio) },
    { label: "Completamento", valore: formatDataOra(ord.data_fine) },
  ];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link
        href="/produzione"
        className="flex w-fit items-center gap-1.5 text-sm text-ink-500 transition hover:text-ink-900"
      >
        <ArrowLeft size={16} /> Ordini di produzione
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-ink-900">
              {ord.codice_ordine}
            </h1>
            <Badge className={STATO_PRODUZIONE_STYLE[ord.stato]}>
              {STATO_PRODUZIONE_LABEL[ord.stato] ?? ord.stato}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-500">{ord.products?.nome}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Dettagli */}
        <section className="rounded-2xl border border-ink-200 bg-white lg:col-span-2">
          <div className="divide-y divide-ink-100">
            {dati.map((d) => (
              <div key={d.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-ink-500">{d.label}</span>
                <span
                  className={`text-sm text-ink-900 ${d.mono ? "font-mono tnum" : ""}`}
                >
                  {d.valore}
                </span>
              </div>
            ))}
          </div>
          {ord.note && (
            <div className="border-t border-ink-100 px-5 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Note
              </p>
              <p className="mt-1 text-sm text-ink-700">{ord.note}</p>
            </div>
          )}
        </section>

        {/* Cambio stato */}
        <section className="rounded-2xl border border-ink-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink-900">Stato lavorazione</h2>
          {puoCambiare ? (
            <>
              <p className="mb-4 mt-1 text-xs text-ink-500">
                Aggiorna lo stato: ogni variazione viene storicizzata.
              </p>
              <StatusControl id={ord.id} statoCorrente={ord.stato} />
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-400">
              Non hai i permessi per modificare lo stato.
            </p>
          )}
        </section>
      </div>

      {/* Timeline storico */}
      <section className="rounded-2xl border border-ink-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <ClockCounterClockwise size={18} className="text-ink-400" />
          <h2 className="text-sm font-semibold text-ink-900">Storico stati</h2>
        </div>

        {eventi.length > 0 ? (
          <ol className="relative ml-1 border-l border-ink-100">
            {eventi.map((s) => (
              <li key={s.id} className="mb-5 ml-5 last:mb-0">
                <span className="absolute -left-[6.5px] mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-accent-500" />
                <div className="flex flex-wrap items-center gap-2">
                  {s.stato_precedente && (
                    <>
                      <Badge className={STATO_PRODUZIONE_STYLE[s.stato_precedente]}>
                        {STATO_PRODUZIONE_LABEL[s.stato_precedente] ?? s.stato_precedente}
                      </Badge>
                      <span className="text-ink-300">→</span>
                    </>
                  )}
                  <Badge className={STATO_PRODUZIONE_STYLE[s.stato_nuovo]}>
                    {STATO_PRODUZIONE_LABEL[s.stato_nuovo] ?? s.stato_nuovo}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink-400">
                  {formatDataOra(s.changed_at)}
                  {s.users &&
                    ` · ${s.users.nome ?? ""} ${s.users.cognome ?? ""}`.trimEnd()}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-4 text-center text-sm text-ink-400">
            Nessuna variazione di stato registrata.
          </p>
        )}
      </section>
    </div>
  );
}
