import { useState } from 'react'
import { Mail, Ticket, Sparkles, MousePointerClick, Download } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Button } from '../components/ui/Button'
import { useNewsletterAdmin } from '../hooks/useNewsletterAdmin'
import { formatDate } from '../lib/format'

const TABS = [
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'cupoes', label: 'Cupões', icon: Ticket },
  { id: 'campanhas', label: 'Campanhas', icon: Sparkles },
  { id: 'popups', label: 'Popups', icon: MousePointerClick },
]

export function Marketing() {
  const [tab, setTab] = useState('newsletter')
  const { subscribers, loading } = useNewsletterAdmin()

  return (
    <PageShell eyebrow="DVISION / GROWTH" title="Marketing" description="Comunicação, promoções e campanhas.">
      <div className="mb-4 flex flex-wrap gap-1 border-b border-hairline">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {tab === t.id && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {tab === 'newsletter' && (
        <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
          <div className="flex items-center justify-between border-b border-hairline bg-surface-2/40 px-4 py-2.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {loading ? 'A carregar...' : `${subscribers.length} subscritores`}
            </span>
            <Button size="sm" variant="outline">
              <Download className="h-3.5 w-3.5" /> Exportar
            </Button>
          </div>
          <div className="divide-y divide-hairline/60">
            {subscribers.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{s.email}</span>
                <span className="font-mono text-xs text-muted-foreground">{formatDate(s.subscribed_at)}</span>
              </div>
            ))}
            {subscribers.length === 0 && !loading && (
              <p className="p-8 text-center text-sm text-muted-foreground">Ainda sem subscritores.</p>
            )}
          </div>
        </div>
      )}

      {tab !== 'newsletter' && (
        <div className="grid place-items-center rounded-lg border border-dashed border-hairline bg-surface p-16 text-center">
          <p className="font-display text-lg font-semibold">Em breve</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Esta área ainda não tem tabelas dedicadas no schema atual — pode ser adicionada numa próxima fase.
          </p>
        </div>
      )}
    </PageShell>
  )
}
