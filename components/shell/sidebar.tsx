"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChartPieSlice,
  Package,
  ArrowsLeftRight,
  Factory,
  Users,
  SignOut,
  List,
  X,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { RUOLO_LABEL, type Ruolo } from "@/lib/rbac";
import { cn } from "@/lib/cn";
import type { Profilo } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: ChartPieSlice },
  { href: "/prodotti", label: "Prodotti", icon: Package },
  { href: "/movimenti", label: "Movimenti", icon: ArrowsLeftRight },
  { href: "/produzione", label: "Produzione", icon: Factory },
  { href: "/utenti", label: "Utenti", icon: Users, soloAdmin: true },
];

export function Sidebar({ profilo }: { profilo: Profilo }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const iniziali = `${profilo.nome?.[0] ?? ""}${profilo.cognome?.[0] ?? ""}`.toUpperCase();
  const voci = NAV.filter((v) => !v.soloAdmin || profilo.ruolo === "ADMIN");

  const contenuto = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600">
          <Package size={18} weight="bold" className="text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-ink-900">
          Magazzino
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
        {voci.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
              )}
            >
              <Icon size={18} weight={active ? "fill" : "regular"} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-100 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-50 text-xs font-semibold text-accent-700 ring-1 ring-accent-100">
            {iniziali || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-900">
              {profilo.nome} {profilo.cognome}
            </p>
            <p className="truncate text-xs text-ink-400">
              {RUOLO_LABEL[profilo.ruolo as Ruolo] ?? profilo.ruolo}
            </p>
          </div>
          <button
            onClick={logout}
            title="Esci"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
          >
            <SignOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Topbar mobile */}
      <header className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600">
            <Package size={16} weight="bold" className="text-white" />
          </div>
          <span className="text-sm font-semibold text-ink-900">Magazzino</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100"
        >
          <List size={20} />
        </button>
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white lg:block">
        {contenuto}
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100"
            >
              <X size={18} />
            </button>
            {contenuto}
          </div>
        </div>
      )}
    </>
  );
}
