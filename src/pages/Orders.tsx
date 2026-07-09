import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Package as PackageIcon, Clock, User } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Textarea'
import { Select } from '../components/ui/Select'
import { Sheet, SheetContent } from '../components/ui/Sheet'
import { useOrdersAdmin, fetchOrderItems, updateOrderStatus, updateOrderNotes, type OrderRow, type OrderItemRow } from '../hooks/useOrdersAdmin'
import { formatPrice, formatDateTime } from '../lib/format'

const STATUSES = [
  { value: 'pending', label: 'Pendente' },
  { value: 'paid', label: 'Paga' },
  { value: 'processing', label: 'Preparação' },
  { value: 'shipped', label: 'Enviada' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'refunded', label: 'Reembolsada' },
]

export function Orders() {
  const [searchParams] = useSearchParams()
  const { orders, loading, refresh } = useOrdersAdmin()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<OrderRow | null>(null)
  const statusFilter = searchParams.get('estado') ?? ''

  const filtered = orders.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const name = o.customers?.profiles?.full_name?.toLowerCase() ?? ''
      return o.order_number?.toLowerCase().includes(q) || name.includes(q)
    }
    return true
  })

  return (
    <PageShell eyebrow="DVISION / ORDERS" title="Encomendas" description="Todas as encomendas com fluxo de estados e detalhes completos.">
      <div className="rounded-lg border border-hairline bg-surface p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Pesquisar por Nº ou cliente..." className="bg-background pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-hairline text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Nº</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Pagamento</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {filtered.map((o) => (
                <tr key={o.id} onClick={() => setSelected(o)} className="cursor-pointer transition-colors hover:bg-surface-2/60">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{o.order_number}</td>
                  <td className="px-4 py-3 font-medium">{o.customers?.profiles?.full_name ?? 'Cliente'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatDateTime(o.created_at)}</td>
                  <td className="px-4 py-3">
                    <StateBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.payment_method ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{formatPrice(o.total)}</td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Nenhuma encomenda encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent>
          {selected && (
            <OrderDetail
              order={selected}
              onChanged={() => {
                refresh()
              }}
              onClose={() => setSelected(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}

function OrderDetail({ order, onChanged, onClose }: { order: OrderRow; onChanged: () => void; onClose: () => void }) {
  const [items, setItems] = useState<OrderItemRow[]>([])
  const [status, setStatus] = useState(order.status)
  const [notes, setNotes] = useState(order.notes ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchOrderItems(order.id).then(setItems)
    setStatus(order.status)
    setNotes(order.notes ?? '')
  }, [order])

  async function handleStatusChange(newStatus: string) {
    setStatus(newStatus)
    setSaving(true)
    await updateOrderStatus(order.id, newStatus)
    setSaving(false)
    onChanged()
  }

  async function handleSaveNotes() {
    setSaving(true)
    await updateOrderNotes(order.id, notes)
    setSaving(false)
    onChanged()
  }

  const shipping = order.shipping_address

  return (
    <div>
      <div className="border-b border-hairline bg-surface/60 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">DVISION / ORDER</div>
        <h2 className="mt-1 font-display text-2xl">{order.order_number}</h2>
        <div className="mt-2 flex items-center gap-2">
          <StateBadge status={status} />
          <span className="font-mono text-xs text-muted-foreground">{formatDateTime(order.created_at)}</span>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <Panel title="Cliente" icon={User}>
          <div className="text-sm">{order.customers?.profiles?.full_name ?? 'Cliente'}</div>
        </Panel>

        {shipping && (
          <Panel title="Morada de envio" icon={MapPin}>
            <div className="text-sm text-muted-foreground">
              {shipping.street}
              <br />
              {shipping.postal_code} {shipping.city}, {shipping.country ?? 'Portugal'}
            </div>
          </Panel>
        )}

        <Panel title="Produtos" icon={PackageIcon}>
          <div className="divide-y divide-hairline/60">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{it.product_name_snapshot}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {it.product_variants?.color} / {it.product_variants?.size} · x{it.quantity}
                  </div>
                </div>
                <div className="font-mono text-sm">{formatPrice(it.line_total)}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1 border-t border-hairline pt-3 text-sm">
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label="Envio" value={formatPrice(order.shipping_cost)} />
            {order.discount_total > 0 && <Row label="Desconto" value={`-${formatPrice(order.discount_total)}`} />}
            <div className="flex items-center justify-between border-t border-hairline pt-2 font-display text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </Panel>

        <Panel title="Pagamento" icon={Clock}>
          <div className="text-sm">
            <span className="text-muted-foreground">Método: </span>
            <span className="font-medium">{order.payment_method ?? '—'}</span>
            <span className="text-muted-foreground"> · Estado: </span>
            <span className="font-medium">{order.payment_status}</span>
          </div>
        </Panel>

        <div className="rounded-lg border border-hairline bg-surface p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Alterar estado</div>
          <Select value={status} onChange={(e) => handleStatusChange(e.target.value)} disabled={saving}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Notas internas</div>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Adicionar nota..." />
          <Button size="sm" variant="outline" className="mt-2" onClick={handleSaveNotes} disabled={saving}>
            Guardar nota
          </Button>
        </div>

        <Button variant="outline" className="w-full" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  )
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {title}
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}

function StateBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-warning/15 text-warning border-warning/30',
    paid: 'bg-info/15 text-info border-info/30',
    processing: 'bg-chart-5/15 text-chart-5 border-chart-5/30',
    shipped: 'bg-primary/15 text-primary border-primary/30',
    delivered: 'bg-success/15 text-success border-success/30',
    cancelled: 'bg-muted text-muted-foreground border-hairline',
    refunded: 'bg-muted text-muted-foreground border-hairline',
  }
  const label = STATUSES.find((s) => s.value === status)?.label ?? status
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${map[status] ?? map.pending}`}>
      {label}
    </span>
  )
}
