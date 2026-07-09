import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Input } from '../components/ui/Input'
import { Sheet, SheetContent } from '../components/ui/Sheet'
import { useCustomersAdmin, type CustomerRow } from '../hooks/useCustomersAdmin'
import { formatPrice, formatDate } from '../lib/format'

export function Customers() {
  const { customers, loading } = useCustomersAdmin()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<CustomerRow | null>(null)

  const filtered = customers.filter((c) => {
    const name = c.profiles?.full_name?.toLowerCase() ?? ''
    return !search || name.includes(search.toLowerCase())
  })

  const stats = useMemo(() => {
    const total = customers.length
    const vip = customers.filter((c) => c.total_spent > 500).length
    const avgSpend = total ? customers.reduce((s, c) => s + c.total_spent, 0) / total : 0
    return { total, vip, avgSpend }
  }, [customers])

  return (
    <PageShell eyebrow="DVISION / CRM" title="Clientes" description="Base de clientes, histórico e segmentação.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total clientes" value={String(stats.total)} />
        <Stat label="VIP (+500€)" value={String(stats.vip)} accent />
        <Stat label="Lifetime médio" value={formatPrice(stats.avgSpend)} />
        <Stat label="Aceitam marketing" value={String(customers.filter((c) => c.accepts_marketing).length)} />
      </div>

      <div className="mt-6 rounded-lg border border-hairline bg-surface p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Pesquisar cliente..." className="bg-background pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-hairline text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3 text-right">Total gasto</th>
                <th className="px-4 py-3 text-right">Encomendas</th>
                <th className="px-4 py-3">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer transition-colors hover:bg-surface-2/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-hairline bg-surface-2 font-mono text-xs font-semibold text-primary">
                        {(c.profiles?.full_name ?? 'C')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0 truncate font-medium">{c.profiles?.full_name ?? 'Cliente'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.profiles?.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{formatPrice(c.total_spent)}</td>
                  <td className="px-4 py-3 text-right font-mono">{c.total_orders}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatDate(c.created_at)}</td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="max-w-lg">
          {selected && (
            <div>
              <div className="border-b border-hairline bg-surface/60 p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10 font-display text-xl font-bold text-primary">
                    {(selected.profiles?.full_name ?? 'C')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">DVISION / CUSTOMER</div>
                    <h2 className="mt-1 truncate font-display text-2xl">{selected.profiles?.full_name ?? 'Cliente'}</h2>
                  </div>
                </div>
              </div>
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Gasto" value={formatPrice(selected.total_spent)} />
                  <MiniStat label="Encomendas" value={String(selected.total_orders)} />
                  <MiniStat
                    label="AOV"
                    value={formatPrice(selected.total_orders ? selected.total_spent / selected.total_orders : 0)}
                  />
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Contactos</div>
                  <div className="rounded-lg border border-hairline bg-surface p-4 text-sm">
                    {selected.profiles?.phone ?? 'Sem telefone registado'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-primary/40 bg-primary/5' : 'border-hairline bg-surface'}`}>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-2xl font-bold ${accent ? 'text-primary' : ''}`}>{value}</div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-hairline bg-surface p-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold">{value}</div>
    </div>
  )
}
