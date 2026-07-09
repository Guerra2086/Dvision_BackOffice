import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Json } from '../types/database.types'

export type SectionType =
  | 'hero'
  | 'marquee'
  | 'featured_products'
  | 'category_grid'
  | 'banner'
  | 'testimonials'
  | 'trust_badges'
  | 'newsletter_cta'
  | 'custom_html'

export interface HomepageSectionRow {
  id: string
  section_type: SectionType
  title: string | null
  subtitle: string | null
  content: Json
  display_order: number
  is_active: boolean
}

export function useHomepageSections() {
  const [sections, setSections] = useState<HomepageSectionRow[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('display_order', { ascending: true })
    setSections((data as unknown as HomepageSectionRow[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { sections, loading, refresh }
}

export async function upsertSection(section: {
  id?: string
  section_type: SectionType
  title: string | null
  subtitle: string | null
  content: Json
  display_order: number
  is_active: boolean
}) {
  const { error } = await supabase.from('homepage_sections').upsert(section)
  if (error) throw error
}

export async function deleteSection(id: string) {
  const { error } = await supabase.from('homepage_sections').delete().eq('id', id)
  if (error) throw error
}
