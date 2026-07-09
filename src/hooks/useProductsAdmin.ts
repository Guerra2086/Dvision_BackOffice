import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ProductRow } from '../types/product'

const SELECT = 'id, category_id, name, slug, description, base_price, compare_at_price, sku, status, stock_quantity, is_featured, created_at, categories(name, slug), product_images(*), product_variants(*)'

export function useProductsAdmin() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select(SELECT).order('created_at', { ascending: false })
    setProducts((data as unknown as ProductRow[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { products, loading, refresh }
}

export interface ProductInput {
  name: string
  slug: string
  category_id: string | null
  description: string | null
  base_price: number
  compare_at_price: number | null
  sku: string | null
  status: 'draft' | 'active' | 'archived'
  is_featured: boolean
}

export async function createProduct(input: ProductInput) {
  const { data, error } = await supabase.from('products').insert(input).select('id').single()
  if (error) throw error
  return data.id as string
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { error } = await supabase.from('products').update(input).eq('id', id)
  if (error) throw error
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function upsertVariant(variant: {
  id?: string
  product_id: string
  size: string
  color: string
  sku: string
  stock_quantity: number
}) {
  const { error } = await supabase.from('product_variants').upsert(variant)
  if (error) throw error
}

export async function deleteVariant(id: string) {
  const { error } = await supabase.from('product_variants').delete().eq('id', id)
  if (error) throw error
}

export async function addProductImage(productId: string, storagePath: string, isPrimary: boolean) {
  const { error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, storage_path: storagePath, is_primary: isPrimary })
  if (error) throw error
}

export async function deleteProductImage(id: string) {
  const { error } = await supabase.from('product_images').delete().eq('id', id)
  if (error) throw error
}
