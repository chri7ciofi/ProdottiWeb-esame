import Link from "next/link";
import { Plus, ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { btn } from "@/components/ui/button";
import { MovementFilters } from "@/components/movements/movement-filters";
import { ExportCsv, type RigaCsv } from "@/components/movements/export-csv";
import { formatNumero, formatDataOra } from "@/lib/format";
import { TIPO_MOVIMENTO_LABEL, TIPO_MOVIMENTO_STYLE } from "@/lib/domain";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ tipo?: string; da?: string; a?: string }>;

export default async function MovimentiPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const profilo = await requireProfilo();
  const supabase = await createClient();

  let query = supabase
    .from("inventory_movements")
    .select(
      "id, tipo, quantita, giacenza_successiva, motivazione, created_at, products(nome, codice), users(nome, cognome)"
    )
    .order("created_at", { ascending: false });

  if (sp.tipo) query = query.eq("tipo", sp.tipo);
  if (sp.da) query = query.gte("created_at", `${sp.da}T00:00:00`);
  if (sp.a) query = query.lte("created_at", `${sp.a}T23:59:59`);

  const { data } = await query.limit(500);
  const movimenti = (data ?? []) as {
    id: string;
    tipo: string;
    quantita: number;
    giacenza_successiva: number | null;
    motivazione: string | null;
    created_at: string | null;
    products: { nome: string; codice: string } | null;
    users: { nome: string; cognome: string | null } | null;
  }[];

  const righeCsv: RigaCsv[] = movimenti.map((m) => ({
    data: formatDataOra(m.created_at),
    tipo: TIPO_MOVIMENTO_LABEL[m.tipo] ?? m.tipo,
    prodotto: m.products?.nome ?? "",
    codice: m.products?.codice ?? "",
    quantita: Number(m.quantita),
    giacenza_successiva: m.giacenza_successiva,
    motivazione: m.motivazione ?? "",
    operatore: `${m.users?.nome ?? ""} ${m.users?.cognome ?? ""}`.trim(),
  }));

  const puoCreare = can(profilo.ruolo, "movimenti.crea");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titolo="Movimenti di magazzino"
        descrizione="Storico di carichi, scarichi, trasferimenti e rettifiche."
        azione={
          <div className="flex items-center gap-2">
            <ExportCsv righe={righeCsv} />
            {puoCreare && (
              <Link href="/movimenti/nuovo" className={btn("primary")}>
                <Plus size={16} weight="bold" /> Registra
              </Link>
            )}
          </div>
        }
      />

      <MovementFilters
        defaults={{ tipo: sp.tipo ?? "", da: sp.da ?? "", a: sp.a ?? "" }}
      />

      {movimenti.length === 0 ? (
        <EmptyState
          icon={<ArrowsLeftRight size={22} />}
          titolo="Nessun movimento"
          descrizione="Non ci sono movimenti per i filtri selezionati."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Prodotto</th>
                  <th className="px-5 py-3 text-right">Quantità</th>
                  <th className="px-5 py-3 text-right">Giacenza</th>
                  <th className="px-5 py-3">Motivazione</th>
                  <th className="px-5 py-3">Operatore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {movimenti.map((m) => (
                  <tr key={m.id} className="transition hover:bg-ink-50/60">
                    <td className="whitespace-nowrap px-5 py-3 text-ink-500">
                      {formatDataOra(m.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={TIPO_MOVIMENTO_STYLE[m.tipo]}>
                        {TIPO_MOVIMENTO_LABEL[m.tipo] ?? m.tipo}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink-900">
                        {m.products?.nome ?? "—"}
                      </p>
                      <p className="font-mono text-xs text-ink-400">
                        {m.products?.codice}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-ink-700 tnum">
                      {formatNumero(m.quantita)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-ink-500 tnum">
                      {m.giacenza_successiva != null
                        ? formatNumero(m.giacenza_successiva)
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-500">
                      {m.motivazione ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-500">
                      {`${m.users?.nome ?? ""} ${m.users?.cognome ?? ""}`.trim() || "—"}
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
