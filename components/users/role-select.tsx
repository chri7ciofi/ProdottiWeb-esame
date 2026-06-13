"use client";

import { useRef } from "react";
import { RUOLO_LABEL, type Ruolo } from "@/lib/rbac";
import { updateUserRole } from "@/lib/actions/users";

const RUOLI: Ruolo[] = [
  "ADMIN",
  "RESPONSABILE_MAGAZZINO",
  "OPERATORE_PRODUZIONE",
  "VISUALIZZATORE",
];

export function RoleSelect({
  id,
  ruolo,
  disabled,
}: {
  id: string;
  ruolo: string;
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateUserRole}>
      <input type="hidden" name="id" value={id} />
      <select
        name="ruolo"
        defaultValue={ruolo}
        disabled={disabled}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-9 rounded-lg border border-ink-200 bg-white px-2.5 text-sm text-ink-700 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-50 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400"
      >
        {RUOLI.map((r) => (
          <option key={r} value={r}>
            {RUOLO_LABEL[r]}
          </option>
        ))}
      </select>
    </form>
  );
}
