export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          created_at: string | null
          dettagli: Json | null
          entita: string
          id: string
          operazione: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dettagli?: Json | null
          entita: string
          id?: string
          operazione: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dettagli?: Json | null
          entita?: string
          id?: string
          operazione?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          descrizione: string | null
          id: number
          nome: string
        }
        Insert: {
          created_at?: string | null
          descrizione?: string | null
          id?: number
          nome: string
        }
        Update: {
          created_at?: string | null
          descrizione?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string | null
          giacenza_precedente: number | null
          giacenza_successiva: number | null
          id: string
          motivazione: string | null
          product_id: string
          quantita: number
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          giacenza_precedente?: number | null
          giacenza_successiva?: number | null
          id?: string
          motivazione?: string | null
          product_id: string
          quantita: number
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          giacenza_precedente?: number | null
          giacenza_successiva?: number | null
          id?: string
          motivazione?: string | null
          product_id?: string
          quantita?: number
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "prodotti_sotto_scorta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      production_orders: {
        Row: {
          codice_ordine: string
          created_at: string | null
          data_fine: string | null
          data_inizio: string | null
          data_prevista: string | null
          id: string
          note: string | null
          prodotto_id: string
          quantita_da_produrre: number
          stato: string
          updated_at: string | null
        }
        Insert: {
          codice_ordine: string
          created_at?: string | null
          data_fine?: string | null
          data_inizio?: string | null
          data_prevista?: string | null
          id?: string
          note?: string | null
          prodotto_id: string
          quantita_da_produrre: number
          stato?: string
          updated_at?: string | null
        }
        Update: {
          codice_ordine?: string
          created_at?: string | null
          data_fine?: string | null
          data_inizio?: string | null
          data_prevista?: string | null
          id?: string
          note?: string | null
          prodotto_id?: string
          quantita_da_produrre?: number
          stato?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_orders_prodotto_id_fkey"
            columns: ["prodotto_id"]
            isOneToOne: false
            referencedRelation: "prodotti_sotto_scorta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_prodotto_id_fkey"
            columns: ["prodotto_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      production_status_history: {
        Row: {
          changed_at: string | null
          id: string
          note: string | null
          production_order_id: string
          stato_nuovo: string
          stato_precedente: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          id?: string
          note?: string | null
          production_order_id: string
          stato_nuovo: string
          stato_precedente?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          id?: string
          note?: string | null
          production_order_id?: string
          stato_nuovo?: string
          stato_precedente?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_status_history_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_status_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          codice: string
          created_at: string | null
          descrizione: string | null
          id: string
          is_deleted: boolean | null
          lotto: string | null
          nome: string
          prezzo_unitario: number | null
          quantita_disponibile: number | null
          scorta_minima: number | null
          stato: string
          supplier_id: string | null
          unita_misura: string
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          codice: string
          created_at?: string | null
          descrizione?: string | null
          id?: string
          is_deleted?: boolean | null
          lotto?: string | null
          nome: string
          prezzo_unitario?: number | null
          quantita_disponibile?: number | null
          scorta_minima?: number | null
          stato?: string
          supplier_id?: string | null
          unita_misura: string
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          codice?: string
          created_at?: string | null
          descrizione?: string | null
          id?: string
          is_deleted?: boolean | null
          lotto?: string | null
          nome?: string
          prezzo_unitario?: number | null
          quantita_disponibile?: number | null
          scorta_minima?: number | null
          stato?: string
          supplier_id?: string | null
          unita_misura?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          indirizzo: string | null
          partita_iva: string | null
          ragione_sociale: string
          telefono: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          indirizzo?: string | null
          partita_iva?: string | null
          ragione_sociale: string
          telefono?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          indirizzo?: string | null
          partita_iva?: string | null
          ragione_sociale?: string
          telefono?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          cognome: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          password_hash: string | null
          ruolo: string
          updated_at: string | null
        }
        Insert: {
          cognome?: string | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          password_hash?: string | null
          ruolo: string
          updated_at?: string | null
        }
        Update: {
          cognome?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          password_hash?: string | null
          ruolo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_kpi: {
        Row: {
          giacenza_totale: number | null
          ordini_aperti: number | null
          prodotti_totali: number | null
          produzioni_completate: number | null
          valore_magazzino: number | null
        }
        Relationships: []
      }
      prodotti_sotto_scorta: {
        Row: {
          codice: string | null
          id: string | null
          nome: string | null
          quantita_disponibile: number | null
          scorta_minima: number | null
          unita_misura: string | null
        }
        Insert: {
          codice?: string | null
          id?: string | null
          nome?: string | null
          quantita_disponibile?: number | null
          scorta_minima?: number | null
          unita_misura?: string | null
        }
        Update: {
          codice?: string | null
          id?: string | null
          nome?: string | null
          quantita_disponibile?: number | null
          scorta_minima?: number | null
          unita_misura?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      movimenti_mensili: {
        Args: Record<PropertyKey, never>
        Returns: {
          ingressi: number
          mese: string
          uscite: number
        }[]
      }
      user_role: { Args: Record<PropertyKey, never>; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
