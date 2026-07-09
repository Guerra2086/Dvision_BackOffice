import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  FileText,
  Megaphone,
  BarChart3,
  Settings,
  Plus,
  Boxes,
  Palette,
  Image as ImageIcon,
  Star,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  CreditCard,
  Home,
  ImagePlus,
  Layers,
  HelpCircle,
  Ruler,
  Ticket,
  Mail,
  Sparkles,
  MousePointerClick,
  Store,
  ShieldCheck,
  MapPin,
  Search as SearchIcon,
  Database,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Input } from '../ui/Input'
import { useAdminAuth } from '../../hooks/useAdminAuth'

type MenuItem = { label: string; to: string; icon: typeof Package; desc: string }
type Menu = { label: string; to?: string; icon: typeof Package; items?: MenuItem[] }

const menus: Menu[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  {
    label: 'Produtos',
    to: '/produtos',
    icon: Package,
    items: [
      { label: 'Todos os produtos', to: '/produtos', icon: Boxes, desc: 'Catálogo completo com filtros' },
      { label: 'Criar produto', to: '/produtos?new=1', icon: Plus, desc: 'Adicionar nova referência ao catálogo' },
      { label: 'Categorias', to: '/categorias', icon: Tags, desc: 'Estrutura do catálogo' },
      { label: 'Variantes & Stock', to: '/produtos?tab=stock', icon: Palette, desc: 'Tamanhos, cores e SKUs' },
      { label: 'Imagens e media', to: '/produtos?tab=media', icon: ImageIcon, desc: 'Fotografia de produto' },
      { label: 'Produtos em destaque', to: '/produtos?tab=featured', icon: Star, desc: 'Curadoria da homepage' },
    ],
  },
  { label: 'Categorias', to: '/categorias', icon: Tags },
  {
    label: 'Encomendas',
    to: '/encomendas',
    icon: ShoppingBag,
    items: [
      { label: 'Todas as encomendas', to: '/encomendas', icon: ShoppingBag, desc: 'Vista global' },
      { label: 'Pendentes', to: '/encomendas?estado=pending', icon: Clock, desc: 'A aguardar pagamento' },
      { label: 'Pagas', to: '/encomendas?estado=paid', icon: CheckCircle2, desc: 'Pagamento confirmado' },
      { label: 'Em preparação', to: '/encomendas?estado=processing', icon: Package, desc: 'No armazém' },
      { label: 'Enviadas', to: '/encomendas?estado=shipped', icon: Truck, desc: 'Em trânsito' },
      { label: 'Entregues', to: '/encomendas?estado=delivered', icon: PackageCheck, desc: 'Concluídas' },
      { label: 'Canceladas', to: '/encomendas?estado=cancelled', icon: XCircle, desc: 'Anuladas ou reembolsadas' },
    ],
  },
  { label: 'Clientes', to: '/clientes', icon: Users },
  {
    label: 'Conteúdo',
    to: '/conteudo',
    icon: FileText,
    items: [
      { label: 'Homepage', to: '/conteudo', icon: Home, desc: 'Hero, secções e CTAs' },
      { label: 'Banners', to: '/conteudo?s=banner', icon: ImagePlus, desc: 'Comunicação promocional' },
      { label: 'Coleções', to: '/conteudo?s=category_grid', icon: Layers, desc: 'Drops e cápsulas' },
      { label: 'FAQ / Footer', to: '/conteudo?s=custom_html', icon: HelpCircle, desc: 'Blocos de texto livre' },
      { label: 'Testemunhos', to: '/conteudo?s=testimonials', icon: Ruler, desc: 'Feedback de clientes' },
    ],
  },
  {
    label: 'Marketing',
    to: '/marketing',
    icon: Megaphone,
    items: [
      { label: 'Newsletter', to: '/marketing', icon: Mail, desc: 'Subscritores e campanhas' },
      { label: 'Cupões', to: '/marketing?s=cupoes', icon: Ticket, desc: 'Descontos e promoções' },
      { label: 'Campanhas', to: '/marketing?s=campanhas', icon: Sparkles, desc: 'Drops e comunicações' },
      { label: 'Popups do site', to: '/marketing?s=popups', icon: MousePointerClick, desc: 'Modais promocionais' },
    ],
  },
  { label: 'Relatórios', to: '/relatorios', icon: BarChart3 },
  {
    label: 'Definições',
    to: '/definicoes',
    icon: Settings,
    items: [
      { label: 'Loja', to: '/definicoes', icon: Store, desc: 'Identidade e dados fiscais' },
      { label: 'Utilizadores admin', to: '/definicoes?s=users', icon: ShieldCheck, desc: 'Equipa e permissões' },
      { label: 'Métodos de pagamento', to: '/definicoes?s=pagamentos', icon: CreditCard, desc: 'Stripe, MB Way, PayPal' },
      { label: 'Zonas de entrega', to: '/definicoes?s=zonas', icon: MapPin, desc: 'Regiões e tarifas' },
      { label: 'SEO', to: '/definicoes?s=seo', icon: SearchIcon, desc: 'Meta tags e sitemap' },
      { label: 'Base de dados', to: '/definicoes?s=supabase', icon: Database, desc: 'Ligação Supabase' },
    ],
  },
]

export function TopBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { fullName, signOut } = useAdminAuth()

  const initials = (fullName ?? 'Admin')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 md:px-6">
        <Link to="/" className="group flex items-center gap-2 shrink-0">
          <div className="grid h-8 w-8 place-items-center rounded-sm bg-primary text-primary-foreground shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-transform group-hover:scale-105">
            <span className="font-display text-sm font-black">D</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-base font-bold leading-none tracking-tight">DVISION</div>
            <div className="font-mono text-[10px] leading-none text-muted-foreground mt-0.5">ADMIN</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpenMenu(null)}>
          {menus.map((menu) => {
            const active = menu.to === '/' ? pathname === '/' : pathname.startsWith(menu.to ?? '___')
            const hasSub = !!menu.items
            return (
              <div key={menu.label} className="relative" onMouseEnter={() => hasSub && setOpenMenu(menu.label)}>
                <Link
                  to={menu.to ?? '/'}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-medium uppercase tracking-wider transition-colors',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {menu.label}
                  {hasSub && <ChevronDown className="h-3 w-3 opacity-60" />}
                  {active && <span className="absolute inset-x-2 -bottom-[13px] h-[2px] bg-primary" />}
                </Link>

                {hasSub && openMenu === menu.label && (
                  <div className="absolute left-1/2 top-full z-50 mt-2 w-[560px] -translate-x-1/2">
                    <div className="overflow-hidden rounded-lg border border-hairline bg-popover shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                      <div className="border-b border-hairline bg-surface/60 px-4 py-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                          DVISION / {menu.label}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {menu.items!.map((it) => (
                          <Link
                            key={it.label}
                            to={it.to}
                            onClick={() => setOpenMenu(null)}
                            className="group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-surface-2"
                          >
                            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-hairline bg-surface transition-colors group-hover:border-primary/50 group-hover:text-primary">
                              <it.icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground">{it.label}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{it.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="flex-1" />

        <div className="relative hidden md:block w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Pesquisar..." className="h-9 pl-9 text-sm" />
        </div>

        <div className="flex items-center gap-1">
          <button className="relative grid h-9 w-9 place-items-center rounded-md border border-hairline bg-surface text-muted-foreground transition-colors hover:text-foreground">
            <Bell className="h-4 w-4" />
          </button>

          <div className="ml-2 hidden items-center gap-2 rounded-md border border-hairline bg-surface pl-1 pr-3 py-1 md:flex">
            <div className="grid h-7 w-7 place-items-center rounded-full border border-hairline bg-primary text-[11px] font-semibold text-primary-foreground">
              {initials}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-xs font-semibold text-foreground">{fullName ?? 'Admin'}</div>
              <div className="font-mono text-[10px] text-muted-foreground">ADMIN</div>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="ml-1 grid h-9 w-9 place-items-center rounded-md border border-hairline bg-surface text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-1 grid h-9 w-9 place-items-center rounded-md border border-hairline bg-surface text-foreground lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-hairline bg-background lg:hidden">
          <div className="max-h-[70vh] overflow-y-auto p-3">
            {menus.map((menu) => (
              <MobileMenuGroup key={menu.label} menu={menu} onNavigate={() => setMobileOpen(false)} />
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function MobileMenuGroup({ menu, onNavigate }: { menu: Menu; onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  if (!menu.items) {
    return (
      <Link
        to={menu.to ?? '/'}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
      >
        <menu.icon className="h-4 w-4 text-primary" />
        {menu.label}
      </Link>
    )
  }
  return (
    <div className="border-b border-hairline/60 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
      >
        <span className="flex items-center gap-3">
          <menu.icon className="h-4 w-4 text-primary" />
          {menu.label}
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="pb-2">
          {menu.items.map((it) => (
            <Link
              key={it.label}
              to={it.to}
              onClick={onNavigate}
              className="flex items-start gap-3 rounded-md px-6 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
            >
              <it.icon className="mt-0.5 h-3.5 w-3.5" />
              {it.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
