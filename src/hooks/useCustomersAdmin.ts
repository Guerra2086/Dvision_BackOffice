import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface CustomerRow {
  id: string
  profile_id: string
  total_orders: number
  total_spent: number
  accepts_marketing: boolean
  created_at: string
  profiles: { full_name: string | null; phone: string | null } | null
  email?: string
}

export function useCustomersAdmin() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('customers')
      .select('id, profile_id, total_orders, total_spent, accepts_marketing, created_at, profiles(full_name, phone)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCustomers((data as unknown as CustomerRow[]) ?? [])
        setLoading(false)
      })
  }, [])

  return { customers, loading }
}
