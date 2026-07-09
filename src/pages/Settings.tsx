import { useEffect, useState } from 'react'
import { Store, ShieldCheck, CreditCard, MapPin, Search, Database } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { supabase } from '../lib/supabase'

const TABS = [
  { id: 'loja', label: 'Loja', icon: Store },
  { id: 'users', label: 'Utilizadores admin', icon: ShieldCheck },
  { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
  { id: 'zonas', label: 'Zonas de entrega', icon: MapPin },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'supabase', label: 'Base de dados', icon: Database },
]

interface AdminUserRow {
  id: string
  admin_role: string
  is_active: boolean
  profiles: { full_name: string | null } | null
}

export function Settings() {
  const [tab, setTab] = useState('users')
  const [admins, setAdmins] = useState<AdminUserRow[]>([])

  useEffect(() => {
    supabase
      .from('admin_users')
      .select('id, admin_role, is_active, profiles(full_name)')
      .then(({ data }) => setAdmins((data as unknown as AdminUserRow[]) ?? []))
  }, [])

  return (
    <PageShell eyebrow="DVISION / CONFIG" title="Definições" description="Configuração da loja, equipa e integrações.">
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

      {tab === 'users' && (
        <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
          <div className="border-b border-hairline bg-surface-2/40 px-4 py-2.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {admins.length} administradores
            </span>
          </div>
          <div className="divide-y divide-hairline/60">
            {admins.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-medium">{a.profiles?.full_name ?? 'Admin'}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs uppercase text-muted-foreground">{a.admin_role}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${
                      a.is_active ? 'border-success/30 bg-success/15 text-success' : 'border-hairline text-muted-foreground'
                    }`}
                  >
                    {a.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
            {admins.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Nenhum admin encontrado.</p>}
          </div>
          <div className="border-t border-hairline p-4 text-xs text-muted-foreground">
            Para promover um novo utilizador a admin, corre o SQL indicado no README do repositório (tabelas{' '}
            <code className="font-mono">profiles</code> e <code className="font-mono">admin_users</code>).
          </div>
        </div>
      )}

      {tab === 'supabase' && (
        <div className="rounded-lg border border-hairline bg-surface p-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Ligação ativa</div>
          <div className="mt-2 font-display text-lg font-semibold">{import.meta.env.VITE_SUPABASE_URL}</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Backoffice e frontoffice partilham o mesmo projeto Supabase. As permissões são controladas por RLS
            (função <code className="font-mono">is_admin()</code>), não por esta página.
          </p>
        </div>
      )}

      {tab !== 'users' && tab !== 'supabase' && (
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
