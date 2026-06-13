import {
  Package,
  Stack,
  CurrencyEur,
  ClipboardText,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { formatEuro, formatNumero } from "@/lib/format";

type Kpi = {
  prodotti_totali: number | null;
  giacenza_totale: number | null;
  valore_magazzino: number | null;
  ordini_aperti: number | null;
  produzioni_completate: number | null;
};

export function KpiGrid({ kpi }: { kpi: Kpi | null }) {
  const voci = [
    {
      icon: Package,
      label: "Prodotti a catalogo",
      valore: formatNumero(kpi?.prodotti_totali),
    },
    {
      icon: Stack,
      label: "Giacenza totale",
      valore: formatNumero(kpi?.giacenza_totale),
    },
    {
      icon: CurrencyEur,
      label: "Valore magazzino",
      valore: formatEuro(kpi?.valore_magazzino),
    },
    {
      icon: ClipboardText,
      label: "Ordini aperti",
      valore: formatNumero(kpi?.ordini_aperti),
    },
    {
      icon: CheckCircle,
      label: "Produzioni completate",
      valore: formatNumero(kpi?.produzioni_completate),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 lg:grid-cols-5">
      {voci.map(({ icon: Icon, label, valore }) => (
        <div key={label} className="bg-white p-5">
          <Icon size={18} className="text-ink-400" weight="bold" />
          <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-ink-900 tnum">
            {valore}
          </p>
          <p className="mt-1 text-xs text-ink-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
