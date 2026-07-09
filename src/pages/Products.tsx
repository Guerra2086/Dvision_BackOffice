import { useMemo, useState } from 'react'
import { Plus, Search, Eye, Pencil, Trash2, MoreHorizontal, ImageIcon } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { ProductModal } from '../components/products/ProductModal'
import { useProductsAdmin, deleteProduct } from '../hooks/useProductsAdmin'
import { useCategoriesAdmin } from '../hooks/useCategoriesAdmin'
import { productImageUrl } from '../lib/images'
import { formatPrice, formatDate } from '../lib/format'
import type { ProductRow } from '../types/product'

export function Products() {
  const { products, loading, refresh } = useProductsAdmin()
  const { categories } = useCategoriesAdmin()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProductRow | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter && p.category_id !== categoryFilter) return false
      if (statusFilter && p.status !== statusFilter) return false
      return true
    })
  }, [products, search, categoryFilter, statusFilter])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(p: ProductRow) {
    setEditing(p)
    setModalOpen(true)
    setOpenMenuId(null)
  }

  async function handleDelete(p: ProductRow) {
    setOpenMenuId(null)
    if (!confirm(`Apagar "${p.name}"? Esta ação não pode ser desfeita.`)) return
    await deleteProduct(p.id)
    refresh()
  }

  const totalStock = (p: ProductRow) => p.product_variants.reduce((s, v) => s + v.stock_quantity, 0)

  return (
    <PageShell
      eyebrow="DVISION / CATALOG"
      title="Produtos"
      description="Catálogo completo com variantes, stock e media."
      actions={
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Criar produto
        </Button>
      }
    >
      <div className="rounded-lg border border-hairline bg-surface p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome..."
              className="bg-background pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select className="w-auto min-w-[160px] bg-background" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select className="w-auto min-w-[140px] bg-background" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos os estados</option>
            <option value="active">Ativo</option>
            <option value="draft">Rascunho</option>
            <option value="archived">Arquivado</option>
          </Select>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className="flex items-center justify-between border-b border-hairline bg-surface-2/40 px-4 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {loading ? 'A carregar...' : `${filtered.length} produtos`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-hairline text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Criado</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {filtered.map((p) => {
                const primaryImage = p.product_images.find((i) => i.is_primary) ?? p.product_images[0]
                const stock = totalStock(p)
                return (
                  <tr key={p.id} className="group transition-colors hover:bg-surface-2/60">
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(p)} className="flex items-center gap-3 text-left">
                        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-md border border-hairline bg-gradient-to-br from-surface-2 to-background text-muted-foreground/40">
                          {primaryImage ? (
                            <img src={productImageUrl(primaryImage.storage_path)} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium">{p.name}</div>
                          <div className="font-mono text-[10px] text-muted-foreground">{p.sku ?? p.slug}</div>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.categories?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="font-mono font-semibold">{formatPrice(p.base_price)}</div>
                      {p.compare_at_price && (
                        <div className="font-mono text-[10px] text-muted-foreground line-through">{formatPrice(p.compare_at_price)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StockCell value={stock} />
                    </td>
                    <td className="px-4 py-3">
                      <StateBadge state={p.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                          className="grid h-8 w-8 place-items-center rounded-md opacity-60 hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openMenuId === p.id && (
                          <div className="absolute right-0 top-9 z-10 w-40 rounded-md border border-hairline bg-popover py-1 shadow-lg">
                            <a
                              href={`http://localhost:5173/product/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-2"
                            >
                              <Eye className="h-3.5 w-3.5" /> Ver
                            </a>
                            <button onClick={() => openEdit(p)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-2">
                              <Pencil className="h-3.5 w-3.5" /> Editar
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-surface-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Apagar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        categories={categories}
        product={editing}
        onSaved={refresh}
      />
    </PageShell>
  )
}

function StockCell({ value }: { value: number }) {
  const pct = Math.min(100, (value / 100) * 100)
  const color = value === 0 ? 'bg-danger' : value < 15 ? 'bg-warning' : 'bg-success'
  const label = value === 0 ? 'Esgotado' : value < 15 ? 'Baixo' : 'OK'
  return (
    <div className="min-w-[110px]">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono font-semibold">{value}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function StateBadge({ state }: { state: string }) {
  const map: Record<string, string> = {
    active: 'bg-success/15 text-success border-success/30',
    draft: 'bg-muted text-muted-foreground border-hairline',
    archived: 'bg-warning/15 text-warning border-warning/30',
  }
  const labels: Record<string, string> = { active: 'Ativo', draft: 'Rascunho', archived: 'Arquivado' }
  return (
    <Badge className={map[state] ?? map.draft}>{labels[state] ?? state}</Badge>
  )
}
