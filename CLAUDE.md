# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Web app per gestione magazzino e processi produttivi (progetto d'esame, PRD in `PRD-webapp.md`). Next.js 15 (App Router) + TypeScript + Tailwind, backend su **Supabase** (PostgreSQL gestito). MVP completo: auth con ruoli, CRUD prodotti, movimenti, ordini di produzione, dashboard.

## Comandi

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check completo + build produzione
npm run lint
```

Non esistono test automatici. La verifica si fa via build (type-check) + smoke test runtime contro Supabase (login REST + query). Credenziali demo (password `Demo1234!`): `admin@` / `responsabile@` / `operatore@` / `visualizzatore@magazzino.it`.

Richiede `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (vedi `.env.example`).

## Architettura

**Il database è la fonte di verità per i permessi.** Solo l'anon key è disponibile lato client: ogni accesso ai dati passa per RLS. La UI nasconde le azioni non permesse solo per UX (`lib/rbac.ts`), ma la sicurezza vera è nelle policy RLS.

- **Auth**: Supabase Auth. `public.users.id` = `auth.users.id`; il profilo porta il `ruolo`. Un trigger su `auth.users` (`handle_new_user`) crea il profilo alla signup (default `VISUALIZZATORE`). I 4 ruoli: `ADMIN`, `RESPONSABILE_MAGAZZINO`, `OPERATORE_PRODUZIONE`, `VISUALIZZATORE`.
- **RBAC**: tutte le policy RLS usano `public.user_role()` (SQL security definer che legge il ruolo di `auth.uid()`). La matrice permessi lato app è in `lib/rbac.ts` e DEVE restare coerente con le policy.
- **Logica di dominio nei trigger DB, non nell'app**:
  - insert su `inventory_movements` → calcola `giacenza_precedente`/`successiva` e aggiorna `products.quantita_disponibile` (blocca giacenze negative, segna `ESAURITO`). Non aggiornare mai la giacenza manualmente: registra un movimento.
  - update di `production_orders.stato` → riga in `production_status_history`, set `data_inizio`/`data_fine`.
  - audit log su prodotti/movimenti/ordini; `updated_at` automatico.
- **Letture** in Server Components via `lib/supabase/server.ts`; **scritture** via Server Actions in `lib/actions/*` (usano lo stesso server client, quindi RLS è applicata). Le isole client (form, grafici, filtri) usano `lib/supabase/client.ts`.
- **`middleware.ts`**: rinfresca la sessione e protegge le rotte (redirect a `/login` se non loggato, a `/dashboard` se loggato sulla login).
- **Routing**: `app/login` è pubblica; tutto sotto `app/(app)/` richiede sessione (`requireProfilo()` in `lib/auth.ts`) e mostra la shell con sidebar. Le pagine con scritture ricontrollano il permesso con `can()` e fanno `redirect` se negato.

### Pattern UI
- Tipi DB generati in `lib/database.types.ts`; helper `Tables<"...">`. Costanti/label/stili di stato in `lib/domain.ts`; formattazione in `lib/format.ts`.
- Le pagine elenco usano `searchParams` (Promise in Next 15) per filtri/ricerca; i componenti filtro (client) aggiornano l'URL via `router.replace`.
- Design: palette neutra `ink` + accent emerald, font Geist, icone Phosphor, numeri in `font-mono`. Niente emoji.

## Vincoli ambiente

- `@supabase/ssr` deve essere allineato a `@supabase/supabase-js` (qui ssr ≥0.12 con supabase-js 2.108). Con versioni disallineate il generic `Database` collassa a `never` e le query/insert non tipano (insert diventa `never[]`).
- Le modifiche allo schema/policy si fanno con gli strumenti MCP Supabase (`apply_migration` per DDL, `execute_sql` per query). Dopo modifiche allo schema rigenerare `lib/database.types.ts` e lanciare `get_advisors` (security).
- Tipi Supabase per gli embed con FK ambigue (es. `product_id` referenzia sia `products` sia le viste): se l'inferenza dà `never`, è prassi in questa codebase castare `.data` a un tipo locale esplicito.
