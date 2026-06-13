export type Ruolo =
  | "ADMIN"
  | "RESPONSABILE_MAGAZZINO"
  | "OPERATORE_PRODUZIONE"
  | "VISUALIZZATORE";

export const RUOLO_LABEL: Record<Ruolo, string> = {
  ADMIN: "Amministratore",
  RESPONSABILE_MAGAZZINO: "Responsabile Magazzino",
  OPERATORE_PRODUZIONE: "Operatore Produzione",
  VISUALIZZATORE: "Visualizzatore",
};

type Permesso =
  | "prodotti.scrivi"
  | "prodotti.elimina"
  | "movimenti.crea"
  | "produzione.crea"
  | "produzione.stato"
  | "utenti.gestisci";

const MATRICE: Record<Ruolo, Permesso[]> = {
  ADMIN: [
    "prodotti.scrivi",
    "prodotti.elimina",
    "movimenti.crea",
    "produzione.crea",
    "produzione.stato",
    "utenti.gestisci",
  ],
  RESPONSABILE_MAGAZZINO: ["prodotti.scrivi", "movimenti.crea"],
  OPERATORE_PRODUZIONE: ["produzione.stato"],
  VISUALIZZATORE: [],
};

export function can(ruolo: string | null | undefined, permesso: Permesso): boolean {
  if (!ruolo) return false;
  return MATRICE[ruolo as Ruolo]?.includes(permesso) ?? false;
}

export function isRuolo(value: string | null | undefined): value is Ruolo {
  return (
    value === "ADMIN" ||
    value === "RESPONSABILE_MAGAZZINO" ||
    value === "OPERATORE_PRODUZIONE" ||
    value === "VISUALIZZATORE"
  );
}
