import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface DashboardStats {
  totalRevenue: number
  orderCount: number
  customerCount: number
  productCount: number
  lowStockCount: number
  monthlyRevenue: { m: string; v: number }[]
  orderStates: { name: string; value: number }[]
  topProducts: { name: string; sold: number; revenue: number }[]
  categorySales: { c: string; v: number }[]
  recentOrders: { id: string; order_number: string | null; customer: string; total: number; state: string; created_at: string }[]
  recentCustomers: { name: string; email: string; spent: number }[]
  stockAlerts: { name: string; left: number }[]
}

const STATE_LABELS: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Paga',
  processing: 'Preparação',
  shipped: 'Enviada',
  delivered: 'Entregue',
  cancelled: 'Cancelada',
  refunded: 'Reembolsada',
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [ordersRes, customersRes, productsRes, variantsRes, itemsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, order_number, total, status, created_at, customers(profiles(full_name))')
          .order('created_at', { ascending: false }),
        supabase.from('customers').select('id, total_spent, created_at, profiles(full_name)').order('created_at', { ascending: false }),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('product_variants').select('id, stock_quantity, size, color, product_id, products(name)').lt('stock_quantity', 6),
        supabase.from('order_items').select('product_name_snapshot, quantity, line_total, product_id, products(category_id, categories(name))'),
      ])

      const orders = (ordersRes.data as unknown as Array<{
        id: string
        order_number: string | null
        total: number
        status: string
        created_at: string
        customers: { profiles: { full_name: string | null } | null } | null
      }>) ?? []
      const customers = (customersRes.data as unknown as Array<{
        id: string
        total_spent: number
        created_at: string
        profiles: { full_name: string | null } | null
      }>) ?? []
      const items = (itemsRes.data as unknown as Array<{
        product_name_snapshot: string
        quantity: number
        line_total: number
        product_id: string | null
        products: { category_id: string | null; categories: { name: string } | null } | null
      }>) ?? []

      const totalRevenue = orders.reduce((s, o) => s + o.total, 0)

      const monthMap = new Map<string, number>()
      for (const o of orders) {
        const d = new Date(o.created_at)
        const key = d.toLocaleDateString('pt-PT', { month: 'short' })
        monthMap.set(key, (monthMap.get(key) ?? 0) + o.total)
      }
      const monthlyRevenue = Array.from(monthMap.entries()).map(([m, v]) => ({ m, v }))

      const stateMap = new Map<string, number>()
      for (const o of orders) {
        const label = STATE_LABELS[o.status] ?? o.status
        stateMap.set(label, (stateMap.get(label) ?? 0) + 1)
      }
      const orderStates = Array.from(stateMap.entries()).map(([name, value]) => ({ name, value }))

      const productMap = new Map<string, { sold: number; revenue: number }>()
      for (const it of items) {
        const cur = productMap.get(it.product_name_snapshot) ?? { sold: 0, revenue: 0 }
        cur.sold += it.quantity
        cur.revenue += it.line_total
        productMap.set(it.product_name_snapshot, cur)
      }
      const topProducts = Array.from(productMap.entries())
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      const categoryMap = new Map<string, number>()
      for (const it of items) {
        const catName = it.products?.categories?.name ?? 'Outros'
        categoryMap.set(catName, (categoryMap.get(catName) ?? 0) + it.line_total)
      }
      const categorySales = Array.from(categoryMap.entries()).map(([c, v]) => ({ c, v }))

      const recentOrders = orders.slice(0, 5).map((o) => ({
        id: o.id,
        order_number: o.order_number,
        customer: o.customers?.profiles?.full_name ?? 'Cliente',
        total: o.total,
        state: STATE_LABELS[o.status] ?? o.status,
        created_at: o.created_at,
      }))

      const recentCustomers = customers.slice(0, 4).map((c) => ({
        name: c.profiles?.full_name ?? 'Cliente',
        email: '',
        spent: c.total_spent,
      }))

      const variants = (variantsRes.data as unknown as Array<{
        id: string
        stock_quantity: number
        size: string | null
        color: string | null
        products: { name: string } | null
      }>) ?? []
      const stockAlerts = variants.map((v) => ({
        name: `${v.products?.name ?? 'Produto'} — ${v.color ?? ''} / ${v.size ?? ''}`,
        left: v.stock_quantity,
      }))

      setStats({
        totalRevenue,
        orderCount: orders.length,
        customerCount: customers.length,
        productCount: productsRes.count ?? 0,
        lowStockCount: variants.length,
        monthlyRevenue,
        orderStates,
        topProducts,
        categorySales,
        recentOrders,
        recentCustomers,
        stockAlerts,
      })
      setLoading(false)
    }

    load()
  }, [])

  return { stats, loading }
}
