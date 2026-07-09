import {
  ArrowUpRight,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Circle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { PageShell } from '../components/layout/PageShell'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { formatPrice } from '../lib/format'

const CHART_COLORS = ['var(--warning)', 'var(--info)', 'var(--chart-5)', 'var(--primary)', 'var(--success)', 'var(--muted-foreground)']

export function Dashboard() {
  const { stats, loading } = useDashboardStats()

  return (
    <PageShell
      eyebrow="DVISION / OVERVIEW"
      title="Dashboard"
      description="Visão geral do desempenho da loja em tempo real."
    >
      {loading || !stats ? (
        <p className="text-sm text-muted-foreground">A carregar...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="Vendas totais" value={formatPrice(stats.totalRevenue)} icon={DollarSign} />
            <Kpi label="Encomendas" value={String(stats.orderCount)} icon={ShoppingBag} />
            <Kpi label="Clientes" value={String(stats.customerCount)} icon={Users} />
            <Kpi label="Produtos ativos" value={String(stats.productCount)} icon={Package} />
            <Kpi label="Stock baixo" value={String(stats.lowStockCount)} icon={AlertTriangle} warning={stats.lowStockCount > 0} />
            <Kpi
              label="Valor médio encomenda"
              value={formatPrice(stats.orderCount ? stats.totalRevenue / stats.orderCount : 0)}
              icon={TrendingUp}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="border-b border-hairline p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">REVENUE</div>
                <div className="mt-1 font-display text-xl font-semibold">Receita por mês</div>
              </div>
              <div className="h-72 p-4">
                {stats.monthlyRevenue.length === 0 ? (
                  <EmptyState label="Ainda sem encomendas para mostrar." />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyRevenue} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--popover)', border: '1px solid var(--hairline)', borderRadius: 6, fontSize: 12 }}
                        formatter={(v: any) => [formatPrice(Number(v)), 'Receita']}
                      />
                      <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} fill="url(#rev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card>
              <div className="border-b border-hairline p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">ORDERS</div>
                <div className="mt-1 font-display text-xl font-semibold">Por estado</div>
              </div>
              <div className="p-4">
                {stats.orderStates.length === 0 ? (
                  <EmptyState label="Sem encomendas ainda." />
                ) : (
                  <>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={stats.orderStates} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2} stroke="var(--background)" strokeWidth={2}>
                            {stats.orderStates.map((s, i) => (
                              <Cell key={s.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--hairline)', borderRadius: 6, fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {stats.orderStates.map((s, i) => (
                        <div key={s.name} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Circle className="h-2 w-2 fill-current" style={{ color: CHART_COLORS[i % CHART_COLORS.length] }} />
                            {s.name}
                          </span>
                          <span className="font-mono font-medium text-foreground">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <div className="border-b border-hairline p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">TOP</div>
                <div className="mt-1 font-display text-xl font-semibold">Produtos mais vendidos</div>
              </div>
              {stats.topProducts.length === 0 ? (
                <EmptyState label="Sem vendas registadas." />
              ) : (
                <div className="divide-y divide-hairline/60">
                  {stats.topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-2">
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
              )}
            </Card>

            <Card>
              <div className="border-b border-hairline p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">CATEGORY</div>
                <div className="mt-1 font-display text-xl font-semibold">Vendas por categoria</div>
              </div>
              <div className="h-64 p-4">
                {stats.categorySales.length === 0 ? (
                  <EmptyState label="Sem vendas registadas." />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.categorySales}>
                      <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="c" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--popover)', border: '1px solid var(--hairline)', borderRadius: 6, fontSize: 12 }}
                        cursor={{ fill: 'var(--surface-2)' }}
                        formatter={(v: any) => [formatPrice(Number(v)), 'Vendas']}
                      />
                      <Bar dataKey="v" fill="var(--primary)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-hairline p-5">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">RECENT</div>
                  <div className="mt-1 font-display text-xl font-semibold">Últimas encomendas</div>
                </div>
                <a href="/encomendas" className="text-sm font-medium text-primary hover:underline">
                  Ver todas →
                </a>
              </div>
              {stats.recentOrders.length === 0 ? (
                <EmptyState label="Ainda sem encomendas." />
              ) : (
                <div className="divide-y divide-hairline/60">
                  {stats.recentOrders.map((o) => (
                    <div key={o.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-4 transition-colors hover:bg-surface-2">
                      <div className="font-mono text-xs text-primary">{o.order_number}</div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{o.customer}</div>
                      </div>
                      <StateBadge state={o.state} />
                      <div className="font-mono text-sm font-semibold">{formatPrice(o.total)}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="space-y-4">
              <Card>
                <div className="border-b border-hairline p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">CUSTOMERS</div>
                  <div className="mt-1 font-display text-base font-semibold">Clientes recentes</div>
                </div>
                {stats.recentCustomers.length === 0 ? (
                  <EmptyState label="Sem clientes ainda." />
                ) : (
                  <div className="divide-y divide-hairline/60">
                    {stats.recentCustomers.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 hover:bg-surface-2">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline bg-surface text-xs font-semibold text-primary">
                          {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</div>
                        <div className="font-mono text-xs">{formatPrice(c.spent)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card>
                <div className="flex items-center justify-between border-b border-hairline p-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">STOCK</div>
                    <div className="mt-1 font-display text-base font-semibold">Alertas</div>
                  </div>
                  <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-xs text-primary-foreground">
                    {stats.stockAlerts.length}
                  </span>
                </div>
                {stats.stockAlerts.length === 0 ? (
                  <EmptyState label="Stock em dia." />
                ) : (
                  <div className="divide-y divide-hairline/60">
                    {stats.stockAlerts.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 hover:bg-surface-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1 truncate text-sm">{s.name}</div>
                        <div className="font-mono text-xs font-semibold text-primary">{s.left} un</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </PageShell>
  )
}

function Kpi({
  label,
  value,
  icon: Icon,
  warning,
}: {
  label: string
  value: string
  icon: typeof DollarSign
  warning?: boolean
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-hairline bg-surface p-4 transition-all hover:border-primary/40 hover:bg-surface-2">
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="grid h-7 w-7 place-items-center rounded-md border border-hairline bg-background text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-3 font-display text-2xl font-bold tracking-tight">{value}</div>
      {warning && (
        <div className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-warning">
          <ArrowUpRight className="h-3 w-3" /> Atenção
        </div>
      )}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`overflow-hidden rounded-lg border border-hairline bg-surface ${className}`}>{children}</div>
}

function EmptyState({ label }: { label: string }) {
  return <div className="grid h-full place-items-center p-8 text-center text-xs text-muted-foreground">{label}</div>
}

function StateBadge({ state }: { state: string }) {
  const map: Record<string, string> = {
    Pendente: 'bg-warning/15 text-warning border-warning/30',
    Paga: 'bg-info/15 text-info border-info/30',
    Preparação: 'bg-chart-5/15 text-chart-5 border-chart-5/30',
    Enviada: 'bg-primary/15 text-primary border-primary/30',
    Entregue: 'bg-success/15 text-success border-success/30',
    Cancelada: 'bg-muted text-muted-foreground border-hairline',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${map[state] ?? map.Cancelada}`}>
      {state}
    </span>
  )
}
