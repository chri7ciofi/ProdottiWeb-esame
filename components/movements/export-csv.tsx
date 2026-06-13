"use client";

import { DownloadSimple } from "@phosphor-icons/react";
import { btn } from "@/components/ui/button";

export type RigaCsv = {
  data: string;
  tipo: string;
  prodotto: string;
  codice: string;
  quantita: number;
  giacenza_successiva: number | null;
  motivazione: string;
  operatore: string;
};

export function ExportCsv({ righe }: { righe: RigaCsv[] }) {
  function scarica() {
    const intestazioni = [
      "Data",
      "Tipo",
      "Prodotto",
      "Codice",
      "Quantita",
      "Giacenza risultante",
      "Motivazione",
      "Operatore",
    ];
    const linee = righe.map((r) =>
      [
        r.data,
        r.tipo,
        `"${r.prodotto.replace(/"/g, '""')}"`,
        r.codice,
        r.quantita,
        r.giacenza_successiva ?? "",
        `"${r.motivazione.replace(/"/g, '""')}"`,
        `"${r.operatore.replace(/"/g, '""')}"`,
      ].join(";")
    );
    const csv = "﻿" + [intestazioni.join(";"), ...linee].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movimenti_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={scarica} disabled={righe.length === 0} className={btn("secondary")}>
      <DownloadSimple size={16} weight="bold" /> Esporta CSV
    </button>
  );
}
