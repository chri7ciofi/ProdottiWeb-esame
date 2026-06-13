import { Package, TrendUp, ClipboardText, ChartBar } from "@phosphor-icons/react/dist/ssr";
import { LoginForm } from "@/components/auth/login-form";

const PUNTI = [
  { icon: Package, testo: "Anagrafiche prodotti e giacenze sempre allineate" },
  { icon: TrendUp, testo: "Movimenti di magazzino tracciati e storicizzati" },
  { icon: ClipboardText, testo: "Ordini di produzione con stato in tempo reale" },
  { icon: ChartBar, testo: "Dashboard, KPI e report a colpo d'occhio" },
];

export default function LoginPage() {
  return (
    <main className="grid min-h-[100dvh] lg:grid-cols-2">
      {/* Form */}
      <div className="flex items-center justify-center bg-ink-50 px-6 py-12">
        <LoginForm />
      </div>

      {/* Pannello brand */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500">
              <Package size={20} weight="bold" className="text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              Magazzino &amp; Produzione
            </span>
          </div>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tighter text-white">
            Un&apos;unica piattaforma per magazzino e produzione.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {PUNTI.map(({ icon: Icon, testo }) => (
              <li key={testo} className="flex items-center gap-3 text-ink-300">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon size={16} weight="bold" className="text-accent-400" />
                </span>
                <span className="text-sm">{testo}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-ink-500">
          Sistema gestionale · versione 1.0
        </p>
      </div>
    </main>
  );
}
