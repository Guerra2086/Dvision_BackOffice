import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Download } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Button } from '../components/ui/Button'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { formatPrice } from '../lib/format'

export function Reports() {
  const { stats, loading } = useDashboardStats()

  return (
    <PageShell
      eyebrow="DVISION / ANALYTICS"
      title="Relatórios"
      description="Vendas por período, categoria e produto."
      actions={
        <Button variant="outline">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      }
    >
      {loading || !stats ? (
        <p className="text-sm text-muted-foreground">A carregar...</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
            <div className="border-b border-hairline p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">REVENUE</div>
              <div className="mt-1 font-display text-xl font-semibold">Receita por mês</div>
            </div>
            <div className="h-72 p-4">
              {stats.monthlyRevenue.length === 0 ? (
                <p className="grid h-full place-items-center text-sm text-muted-foreground">Sem dados ainda.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthlyRevenue}>
                    <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--popover)', border: '1px solid var(--hairline)', borderRadius: 6, fontSize: 12 }}
                      formatter={(v: any) => [formatPrice(Number(v)), 'Receita']}
                    />
                    <Bar dataKey="v" fill="var(--primary)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
            <div className="border-b border-hairline p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">CATEGORY</div>
              <div className="mt-1 font-display text-xl font-semibold">Vendas por categoria</div>
            </div>
            <div className="h-72 p-4">
              {stats.categorySales.length === 0 ? (
                <p className="grid h-full place-items-center text-sm text-muted-foreground">Sem dados ainda.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categorySales}>
                    <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="c" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--popover)', border: '1px solid var(--hairline)', borderRadius: 6, fontSize: 12 }}
                      formatter={(v: any) => [formatPrice(Number(v)), 'Vendas']}
                    />
                    <Bar dataKey="v" fill="var(--info)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-hairline bg-surface lg:col-span-2">
            <div className="border-b border-hairline p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">TOP</div>
              <div className="mt-1 font-display text-xl font-semibold">Produtos mais vendidos</div>
            </div>
            <div className="divide-y divide-hairline/60">
              {stats.topProducts.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Sem vendas registadas.</p>}
              {stats.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-4 p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-hairline bg-surface font-mono text-xs text-primary">
                    0{i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.sold} unidades vendidas</div>
                  </div>
                  <div className="font-mono text-sm font-semibold">{formatPrice(p.revenue)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
