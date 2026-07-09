export interface ProductImage {
  id: string
  product_id: string
  storage_path: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
}

export interface ProductVariant {
  id: string
  product_id: string
  size: string | null
  color: string | null
  sku: string | null
  price_override: number | null
  stock_quantity: number
}

export interface ProductRow {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  base_price: number
  compare_at_price: number | null
  sku: string | null
  status: 'draft' | 'active' | 'archived'
  stock_quantity: number
  is_featured: boolean
  created_at: string
  categories: { name: string; slug: string } | null
  product_images: ProductImage[]
  product_variants: ProductVariant[]
}
