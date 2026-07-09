import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface CategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  count: number
}

export function useCategoriesAdmin() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url, display_order, is_active')
      .order('display_order', { ascending: true })

    if (!data) {
      setLoading(false)
      return
    }

    const withCounts = await Promise.all(
      data.map(async (c) => {
        const { count } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('category_id', c.id)
        return { ...c, count: count ?? 0 }
      }),
    )
    setCategories(withCounts)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { categories, loading, refresh }
}

export interface CategoryInput {
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
}

export async function createCategory(input: CategoryInput) {
  const { error } = await supabase.from('categories').insert(input)
  if (error) throw error
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const { error } = await supabase.from('categories').update(input).eq('id', id)
  if (error) throw error
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
