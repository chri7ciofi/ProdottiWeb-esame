# Product Requirements Document (PRD)

## Titolo

Sistema Web di Gestione Magazzino e Processi Produttivi

## Versione

1.0

## Obiettivo

Realizzare una piattaforma web centralizzata che consenta la gestione completa del magazzino aziendale e dei processi produttivi, garantendo tracciabilità dei prodotti, monitoraggio delle giacenze, gestione dei movimenti di magazzino e controllo dello stato di avanzamento della produzione.

---

# 1. Panoramica del Prodotto

L'applicazione permetterà agli utenti autorizzati di:

- Gestire anagrafiche prodotti.
- Monitorare disponibilità e giacenze.
- Registrare movimenti di magazzino.
- Gestire il ciclo produttivo.
- Aggiornare lo stato di lavorazione dei prodotti.
- Visualizzare dashboard con grafici e KPI.
- Consultare report storici.

---

# 2. Ruoli Utente

## Amministratore

Può:

- Creare utenti.
- Configurare il sistema.
- Gestire tutti i dati.

## Responsabile Magazzino

Può:

- Inserire prodotti.
- Modificare prodotti.
- Registrare movimenti.
- Consultare report.

## Operatore Produzione

Può:

- Visualizzare ordini di produzione.
- Aggiornare stati di lavorazione.
- Registrare avanzamento produzione.

## Visualizzatore

Può:

- Consultare dashboard e report.
- Non può modificare dati.

---

# 3. Funzionalità Principali

## 3.1 Gestione Prodotti

### Inserimento prodotto

Campi:

- Codice prodotto
- Nome
- Descrizione
- Categoria
- Unità di misura
- Quantità disponibile
- Quantità minima
- Lotto
- Fornitore
- Prezzo unitario

### Modifica prodotto

L'utente può aggiornare:

- Nome
- Descrizione
- Categoria
- Quantità minima
- Prezzo
- Stato

### Eliminazione prodotto

Consentita solo agli amministratori.

Eliminazione logica tramite flag:

```text
is_deleted = true
```

### Ricerca prodotti

Filtri:

- Codice
- Nome
- Categoria
- Lotto
- Stato
- Disponibilità

Ricerca full-text.

---

## 3.2 Gestione Magazzino

### Carico merce

Registrazione ingresso prodotti.

Informazioni:

- Data
- Quantità
- Fornitore
- Operatore

### Scarico merce

Registrazione uscita prodotti.

Motivazioni:

- Vendita
- Produzione
- Reso
- Scarto

### Inventario

Visualizzazione:

- Giacenza attuale
- Valore economico
- Differenze inventariali

---

## 3.3 Movimenti di Magazzino

Ogni movimento deve essere storicizzato.

Tipologie:

- INGRESSO
- USCITA
- TRASFERIMENTO
- RETTIFICA

Dati registrati:

- Timestamp
- Utente
- Quantità
- Prodotto
- Motivazione

Funzionalità:

- Ricerca movimenti
- Filtri temporali
- Esportazione CSV/Excel

---

## 3.4 Gestione Produzione

### Ordini di Produzione

Creazione di:

- Ordine
- Quantità da produrre
- Data prevista

### Stati Produzione

Possibili stati:

```text
Pianificato
In Attesa Materiali
In Produzione
Controllo Qualità
Completato
Sospeso
Annullato
```

### Aggiornamento Stato

Gli operatori possono modificare lo stato in tempo reale.

Ogni variazione viene registrata nello storico.

---

## 3.5 Dashboard e Reportistica

### KPI

Visualizzazione di:

- Prodotti totali
- Giacenza totale
- Valore magazzino
- Ordini aperti
- Produzioni completate

### Grafici

Grafico andamento movimenti mensili.

Esempio:

### Tabelle

- Prodotti sotto scorta minima
- Ultimi movimenti
- Ordini in lavorazione
- Produzioni completate

---

# 4. Requisiti Non Funzionali

## Sicurezza

- Login autenticato
- Password cifrate
- RBAC (Role Based Access Control)
- Audit log

## Performance

- Ricerca prodotti < 2 secondi
- Dashboard < 3 secondi

## Disponibilità

- Uptime 99,5%

## Scalabilità

Supporto per:

- 100.000 prodotti
- 1.000.000 movimenti

---

# 5. Tecnologie Consigliate

## Frontend

- React
- Next.js
- TypeScript
- TailwindCSS

## Backend

- Node.js
- NestJS

## Database

- PostgreSQL

## Autenticazione

- JWT
- Refresh Token

## Deployment

- Docker
- Kubernetes
- Nginx

---

# 6. Schema Database (PostgreSQL)

## Tabella utenti

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    ruolo VARCHAR(50),
    created_at TIMESTAMP
);
```

## Tabella categorie

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    descrizione TEXT
);
```

## Tabella prodotti

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,
    codice VARCHAR(50) UNIQUE,
    nome VARCHAR(255),
    descrizione TEXT,
    category_id INTEGER REFERENCES categories(id),
    unita_misura VARCHAR(20),
    quantita DECIMAL(12,2),
    scorta_minima DECIMAL(12,2),
    lotto VARCHAR(100),
    prezzo_unitario DECIMAL(12,2),
    stato VARCHAR(50),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Tabella fornitori

```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY,
    ragione_sociale VARCHAR(255),
    partita_iva VARCHAR(20),
    email VARCHAR(255),
    telefono VARCHAR(50)
);
```

## Tabella movimenti

```sql
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES users(id),
    tipo VARCHAR(30),
    quantita DECIMAL(12,2),
    motivazione TEXT,
    created_at TIMESTAMP
);
```

## Tabella ordini produzione

```sql
CREATE TABLE production_orders (
    id UUID PRIMARY KEY,
    codice_ordine VARCHAR(50),
    prodotto_id UUID REFERENCES products(id),
    quantita DECIMAL(12,2),
    stato VARCHAR(50),
    data_prevista DATE,
    data_completamento DATE,
    created_at TIMESTAMP
);
```

## Tabella storico stati

```sql
CREATE TABLE production_status_history (
    id UUID PRIMARY KEY,
    production_order_id UUID REFERENCES production_orders(id),
    stato_precedente VARCHAR(50),
    stato_nuovo VARCHAR(50),
    user_id UUID REFERENCES users(id),
    changed_at TIMESTAMP
);
```

## Tabella audit log

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    entita VARCHAR(100),
    operazione VARCHAR(50),
    dettagli JSONB,
    created_at TIMESTAMP
);
```

---

# 7. API Principali

## Prodotti

```http
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

## Movimenti

```http
GET    /api/movements
POST   /api/movements
```

## Produzione

```http
GET    /api/production-orders
POST   /api/production-orders
PUT    /api/production-orders/{id}/status
```

## Dashboard

```http
GET /api/dashboard/kpi
GET /api/dashboard/charts
```

---

# 8. MVP (Versione Iniziale)

Funzionalità obbligatorie:

- Login
- CRUD prodotti
- Gestione movimenti magazzino
- Storico movimenti
- Gestione stati produzione
- Dashboard KPI
- Grafici giacenze e movimenti
- Ricerca avanzata prodotti

# 9. Evoluzioni Future

- Barcode Scanner
- QR Code
- Gestione multi-magazzino
- Notifiche automatiche
- Integrazione ERP
- Previsioni di consumo tramite AI
- App mobile Android/iOS
- Reportistica avanzata BI

```

```
