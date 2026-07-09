import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface OrderRow {
  id: string
  order_number: string | null
  status: string
  payment_method: string | null
  payment_status: string
  subtotal: number
  shipping_cost: number
  discount_total: number
  total: number
  shipping_address: Record<string, string> | null
  billing_address: Record<string, string> | null
  notes: string | null
  created_at: string
  customers: {
    id: string
    profiles: { full_name: string | null } | null
  } | null
  customer_email?: string
}

export interface OrderItemRow {
  id: string
  product_name_snapshot: string
  unit_price: number
  quantity: number
  line_total: number
  product_id: string | null
  variant_id: string | null
  product_variants: { size: string | null; color: string | null } | null
}

const ORDER_SELECT =
  'id, order_number, status, payment_method, payment_status, subtotal, shipping_cost, discount_total, total, shipping_address, billing_address, notes, created_at, customers(id, profiles(full_name))'

export function useOrdersAdmin() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select(ORDER_SELECT).order('created_at', { ascending: false })
    setOrders((data as unknown as OrderRow[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { orders, loading, refresh }
}

export async function fetchOrderItems(orderId: string): Promise<OrderItemRow[]> {
  const { data } = await supabase
    .from('order_items')
    .select('id, product_name_snapshot, unit_price, quantity, line_total, product_id, variant_id, product_variants(size, color)')
    .eq('order_id', orderId)
  return (data as unknown as OrderItemRow[]) ?? []
}

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from('orders').update({ status: status as OrderStatus }).eq('id', id)
  if (error) throw error
}

export async function updateOrderNotes(id: string, notes: string) {
  const { error } = await supabase.from('orders').update({ notes }).eq('id', id)
  if (error) throw error
}
