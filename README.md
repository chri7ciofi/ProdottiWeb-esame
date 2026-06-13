# Sistema Web di Gestione Magazzino e Produzione

Web app per la gestione di magazzino e processi produttivi: anagrafiche prodotti, giacenze, movimenti, ordini di produzione con stati storicizzati, dashboard KPI e ricerca avanzata. Implementa l'MVP del PRD (`PRD-webapp.md`).

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **TailwindCSS**
- **Supabase** (PostgreSQL) — auth, RLS (RBAC), trigger di dominio
- **@supabase/ssr** per sessione lato server (cookie) e RLS applicata a ogni query
- **Recharts** (grafici), **Phosphor Icons**, font **Geist**

## Architettura

- **Auth**: Supabase Auth. La tabella `public.users` è il profilo (`id` = `auth.users.id`) e contiene il `ruolo`. Un trigger su `auth.users` crea il profilo alla registrazione.
- **RBAC via RLS**: ogni tabella ha policy basate sulla funzione `public.user_role()`. Ruoli: `ADMIN`, `RESPONSABILE_MAGAZZINO`, `OPERATORE_PRODUZIONE`, `VISUALIZZATORE`. Il database è la fonte di verità; la UI nasconde solo le azioni non permesse (`lib/rbac.ts`).
- **Trigger di dominio**:
  - inserimento movimento → calcola `giacenza_precedente/successiva` e aggiorna `products.quantita_disponibile` (blocca giacenze negative);
  - cambio stato ordine → riga in `production_status_history`;
  - `updated_at` automatico; audit log su prodotti/movimenti/ordini.
- **Letture** in Server Components; **scritture** via **Server Actions** (RLS enforce).

## Avvio locale

```bash
npm install
# crea .env.local (vedi .env.example) con URL e ANON KEY del progetto Supabase
npm run dev
```

App su http://localhost:3000.

### Variabili d'ambiente (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://uqvbnvetapmawargqbjt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

## Credenziali demo

Password comune: **`Demo1234!`**

| Ruolo | Email | Permessi |
|---|---|---|
| Amministratore | `admin@magazzino.it` | Tutto, gestione utenti, eliminazione prodotti |
| Responsabile Magazzino | `responsabile@magazzino.it` | CRUD prodotti, registrazione movimenti |
| Operatore Produzione | `operatore@magazzino.it` | Cambio stato ordini di produzione |
| Visualizzatore | `visualizzatore@magazzino.it` | Sola lettura |

## Database

Le 8 tabelle del PRD sono già presenti su Supabase. Le migrazioni applicate aggiungono: collegamento a Supabase Auth, policy RLS, trigger di dominio, viste dashboard (`dashboard_kpi`, `prodotti_sotto_scorta`, funzione `movimenti_mensili`), indici di ricerca (trigram su `nome`/`codice`) e dati demo.

## Funzionalità (MVP)

- Login con ruoli (RBAC)
- CRUD prodotti con ricerca full-text e filtri (codice, nome, categoria, lotto, stato, sotto scorta)
- Movimenti di magazzino (ingresso/uscita/trasferimento/rettifica) con storico, filtri temporali ed export CSV
- Ordini di produzione con cambio stato in tempo reale e timeline dello storico
- Dashboard: KPI, grafico andamento movimenti, prodotti sotto scorta, ultimi movimenti, ordini in lavorazione
- Gestione utenti (solo Admin): creazione utenti e assegnazione ruoli

## Build

```bash
npm run build
```
