import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfilo } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { RoleSelect } from "@/components/users/role-select";
import { CreateUserForm } from "@/components/users/create-user-form";
import { formatData } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UtentiPage() {
  const profilo = await requireProfilo();
  if (profilo.ruolo !== "ADMIN") redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("id, nome, cognome, email, ruolo, created_at")
    .order("created_at", { ascending: true });

  const utenti = (data ?? []) as {
    id: string;
    nome: string;
    cognome: string | null;
    email: string;
    ruolo: string;
    created_at: string | null;
  }[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titolo="Gestione utenti"
        descrizione="Crea utenti e assegna i ruoli (RBAC)."
        azione={<CreateUserForm />}
      />

      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3">Utente</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Creato</th>
                <th className="px-5 py-3">Ruolo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {(utenti ?? []).map((u) => {
                const iniziali = `${u.nome?.[0] ?? ""}${u.cognome?.[0] ?? ""}`.toUpperCase();
                const isSelf = u.id === profilo.id;
                return (
                  <tr key={u.id} className="transition hover:bg-ink-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-50 text-xs font-semibold text-accent-700 ring-1 ring-accent-100">
                          {iniziali || "?"}
                        </span>
                        <span className="font-medium text-ink-900">
                          {u.nome} {u.cognome}
                          {isSelf && (
                            <Badge className="ml-2 bg-ink-100 text-ink-500 ring-ink-200">
                              tu
                            </Badge>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500">{u.email}</td>
                    <td className="px-5 py-3 text-ink-500">
                      {formatData(u.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <RoleSelect id={u.id} ruolo={u.ruolo} disabled={isSelf} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
