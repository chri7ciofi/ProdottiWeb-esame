const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

const num = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 2 });

export function formatEuro(v: number | null | undefined): string {
  return eur.format(Number(v ?? 0));
}

export function formatNumero(v: number | null | undefined): string {
  return num.format(Number(v ?? 0));
}

export function formatData(v: string | null | undefined): string {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDataOra(v: string | null | undefined): string {
  if (!v) return "—";
  return new Date(v).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
