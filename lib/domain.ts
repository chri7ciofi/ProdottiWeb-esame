// ===== Stati produzione =====
export const STATI_PRODUZIONE = [
  "PIANIFICATO",
  "IN_ATTESA_MATERIALI",
  "IN_PRODUZIONE",
  "CONTROLLO_QUALITA",
  "COMPLETATO",
  "SOSPESO",
  "ANNULLATO",
] as const;
export type StatoProduzione = (typeof STATI_PRODUZIONE)[number];

export const STATO_PRODUZIONE_LABEL: Record<string, string> = {
  PIANIFICATO: "Pianificato",
  IN_ATTESA_MATERIALI: "In attesa materiali",
  IN_PRODUZIONE: "In produzione",
  CONTROLLO_QUALITA: "Controllo qualità",
  COMPLETATO: "Completato",
  SOSPESO: "Sospeso",
  ANNULLATO: "Annullato",
};

// classi tailwind per i badge di stato produzione
export const STATO_PRODUZIONE_STYLE: Record<string, string> = {
  PIANIFICATO: "bg-ink-100 text-ink-600 ring-ink-200",
  IN_ATTESA_MATERIALI: "bg-amber-50 text-amber-700 ring-amber-200",
  IN_PRODUZIONE: "bg-accent-50 text-accent-700 ring-accent-100",
  CONTROLLO_QUALITA: "bg-sky-50 text-sky-700 ring-sky-200",
  COMPLETATO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  SOSPESO: "bg-orange-50 text-orange-700 ring-orange-200",
  ANNULLATO: "bg-rose-50 text-rose-700 ring-rose-200",
};

// ===== Stati prodotto =====
export const STATI_PRODOTTO = [
  "DISPONIBILE",
  "IN_PRODUZIONE",
  "RISERVATO",
  "ESAURITO",
  "OBSOLETO",
] as const;

export const STATO_PRODOTTO_LABEL: Record<string, string> = {
  DISPONIBILE: "Disponibile",
  IN_PRODUZIONE: "In produzione",
  RISERVATO: "Riservato",
  ESAURITO: "Esaurito",
  OBSOLETO: "Obsoleto",
};

export const STATO_PRODOTTO_STYLE: Record<string, string> = {
  DISPONIBILE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  IN_PRODUZIONE: "bg-accent-50 text-accent-700 ring-accent-100",
  RISERVATO: "bg-sky-50 text-sky-700 ring-sky-200",
  ESAURITO: "bg-rose-50 text-rose-700 ring-rose-200",
  OBSOLETO: "bg-ink-100 text-ink-500 ring-ink-200",
};

// ===== Movimenti =====
export const TIPI_MOVIMENTO = [
  "INGRESSO",
  "USCITA",
  "TRASFERIMENTO",
  "RETTIFICA",
] as const;
export type TipoMovimento = (typeof TIPI_MOVIMENTO)[number];

export const TIPO_MOVIMENTO_LABEL: Record<string, string> = {
  INGRESSO: "Ingresso",
  USCITA: "Uscita",
  TRASFERIMENTO: "Trasferimento",
  RETTIFICA: "Rettifica",
};

export const TIPO_MOVIMENTO_STYLE: Record<string, string> = {
  INGRESSO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  USCITA: "bg-rose-50 text-rose-700 ring-rose-200",
  TRASFERIMENTO: "bg-sky-50 text-sky-700 ring-sky-200",
  RETTIFICA: "bg-amber-50 text-amber-700 ring-amber-200",
};

export const MOTIVAZIONI_USCITA = ["Vendita", "Produzione", "Reso", "Scarto"] as const;
