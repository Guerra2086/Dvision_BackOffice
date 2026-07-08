// Tipos gerados manualmente a partir de supabase/schema.sql.
// Se preferires a versão 100% oficial, corre `npm run gen:types`
// (requer `npx supabase login` primeiro) para substituir este ficheiro.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          profile_id: string
          admin_role: Database['public']['Enums']['admin_role']
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          profile_id: string
          admin_role?: Database['public']['Enums']['admin_role']
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          admin_role?: Database['public']['Enums']['admin_role']
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          base_price: number
          compare_at_price: number | null
          sku: string | null
          status: Database['public']['Enums']['product_status']
          stock_quantity: number
          is_featured: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          base_price: number
          compare_at_price?: number | null
          sku?: string | null
          status?: Database['public']['Enums']['product_status']
          stock_quantity?: number
          is_featured?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          base_price?: number
          compare_at_price?: number | null
          sku?: string | null
          status?: Database['public']['Enums']['product_status']
          stock_quantity?: number
          is_featured?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          storage_path: string
          alt_text: string | null
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          storage_path: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          storage_path?: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size: string | null
          color: string | null
          sku: string | null
          price_override: number | null
          stock_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size?: string | null
          color?: string | null
          sku?: string | null
          price_override?: number | null
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          size?: string | null
          color?: string | null
          sku?: string | null
          price_override?: number | null
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          profile_id: string
          billing_address: Json | null
          shipping_address: Json | null
          accepts_marketing: boolean
          total_orders: number
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          billing_address?: Json | null
          shipping_address?: Json | null
          accepts_marketing?: boolean
          total_orders?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          billing_address?: Json | null
          shipping_address?: Json | null
          accepts_marketing?: boolean
          total_orders?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          order_number: string | null
          status: Database['public']['Enums']['order_status']
          subtotal: number
          shipping_cost: number
          discount_total: number
          total: number
          shipping_address: Json
          billing_address: Json
          payment_method: string | null
          payment_status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          order_number?: string | null
          status?: Database['public']['Enums']['order_status']
          subtotal: number
          shipping_cost?: number
          discount_total?: number
          total: number
          shipping_address: Json
          billing_address: Json
          payment_method?: string | null
          payment_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          order_number?: string | null
          status?: Database['public']['Enums']['order_status']
          subtotal?: number
          shipping_cost?: number
          discount_total?: number
          total?: number
          shipping_address?: Json
          billing_address?: Json
          payment_method?: string | null
          payment_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name_snapshot: string
          unit_price: number
          quantity: number
          line_total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          product_name_snapshot: string
          unit_price: number
          quantity: number
          line_total: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          product_name_snapshot?: string
          unit_price?: number
          quantity?: number
          line_total?: number
          created_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          profile_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          product_id: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          id: string
          profile_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          profile_id: string | null
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          profile_id?: string | null
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          profile_id?: string | null
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          id: string
          section_type: Database['public']['Enums']['homepage_section_type']
          title: string | null
          subtitle: string | null
          content: Json
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_type: Database['public']['Enums']['homepage_section_type']
          title?: string | null
          subtitle?: string | null
          content?: Json
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_type?: Database['public']['Enums']['homepage_section_type']
          title?: string | null
          subtitle?: string | null
          content?: Json
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          profile_id: string
          order_item_id: string | null
          rating: number
          title: string | null
          comment: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          profile_id: string
          order_item_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          profile_id?: string
          order_item_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      product_status: 'draft' | 'active' | 'archived'
      order_status:
        | 'pending'
        | 'paid'
        | 'processing'
        | 'shipped'
        | 'delivered'
        | 'cancelled'
        | 'refunded'
      admin_role: 'super_admin' | 'manager' | 'editor'
      homepage_section_type:
        | 'hero'
        | 'marquee'
        | 'featured_products'
        | 'category_grid'
        | 'banner'
        | 'testimonials'
        | 'trust_badges'
        | 'newsletter_cta'
        | 'custom_html'
    }
    CompositeTypes: Record<string, never>
  }
}
