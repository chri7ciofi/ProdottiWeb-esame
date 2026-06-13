export function PageHeader({
  titolo,
  descrizione,
  azione,
}: {
  titolo: string;
  descrizione?: string;
  azione?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tighter text-ink-900">
          {titolo}
        </h1>
        {descrizione && (
          <p className="mt-1 text-sm text-ink-500">{descrizione}</p>
        )}
      </div>
      {azione && <div className="shrink-0">{azione}</div>}
    </div>
  );
}
