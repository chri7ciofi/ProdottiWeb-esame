import { cn } from "@/lib/cn";

export function EmptyState({
  icon,
  titolo,
  descrizione,
  azione,
}: {
  icon: React.ReactNode;
  titolo: string;
  descrizione?: string;
  azione?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-50 text-ink-400 ring-1 ring-ink-100">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-ink-800">{titolo}</p>
        {descrizione && (
          <p className="mt-1 text-sm text-ink-500">{descrizione}</p>
        )}
      </div>
      {azione}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-ink-100",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export function ErrorState({ messaggio }: { messaggio: string }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
      {messaggio}
    </div>
  );
}
