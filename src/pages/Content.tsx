import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, GripVertical } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Switch } from '../components/ui/Switch'
import { Select } from '../components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/Dialog'
import {
  useHomepageSections,
  upsertSection,
  deleteSection,
  type HomepageSectionRow,
  type SectionType,
} from '../hooks/useHomepageSections'

const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero',
  marquee: 'Marquee',
  featured_products: 'Produtos em destaque',
  category_grid: 'Grelha de categorias',
  banner: 'Banner promocional',
  testimonials: 'Testemunhos',
  trust_badges: 'Selos de confiança',
  newsletter_cta: 'Newsletter',
  custom_html: 'Bloco de texto livre',
}

export function Content() {
  const { sections, loading, refresh } = useHomepageSections()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<HomepageSectionRow | null>(null)

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(s: HomepageSectionRow) {
    setEditing(s)
    setModalOpen(true)
  }

  async function handleDelete(s: HomepageSectionRow) {
    if (!confirm('Remover esta secção da homepage?')) return
    await deleteSection(s.id)
    refresh()
  }

  return (
    <PageShell
      eyebrow="DVISION / CMS"
      title="Conteúdo do site"
      description="Gestão editorial da homepage — textos, títulos e secções."
      actions={
        <>
          <a href="http://localhost:5173" target="_blank" rel="noreferrer">
            <Button variant="outline">
              <Eye className="h-4 w-4" /> Ver site
            </Button>
          </a>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nova secção
          </Button>
        </>
      }
    >
      {loading ? (
        <p className="text-sm text-muted-foreground">A carregar...</p>
      ) : (
        <div className="rounded-lg border border-hairline bg-surface">
          {sections.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Ainda não há secções configuradas. Cria a primeira secção da homepage.
            </p>
          )}
          <div className="divide-y divide-hairline/60">
            {sections.map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-4">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="font-mono text-xs text-muted-foreground w-8 shrink-0">
                  {String(s.display_order).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{SECTION_LABELS[s.section_type]}</span>
                    {!s.is_active && (
                      <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase text-muted-foreground">
                        Oculta
                      </span>
                    )}
                  </div>
                  <div className="truncate text-sm text-muted-foreground">{s.title ?? '(sem título)'}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => openEdit(s)}>
                  <Pencil className="h-3 w-3" /> Editar
                </Button>
                <Button size="sm" variant="ghost" className="hover:text-danger" onClick={() => handleDelete(s)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        section={editing}
        nextOrder={sections.length + 1}
        onSaved={refresh}
      />
    </PageShell>
  )
}

function SectionModal({
  open,
  onOpenChange,
  section,
  nextOrder,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  section: HomepageSectionRow | null
  nextOrder: number
  onSaved: () => void
}) {
  const [sectionType, setSectionType] = useState<SectionType>('hero')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [contentText, setContentText] = useState('{}')
  const [order, setOrder] = useState(1)
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (section) {
      setSectionType(section.section_type)
      setTitle(section.title ?? '')
      setSubtitle(section.subtitle ?? '')
      setContentText(JSON.stringify(section.content ?? {}, null, 2))
      setOrder(section.display_order)
      setActive(section.is_active)
    } else {
      setSectionType('hero')
      setTitle('')
      setSubtitle('')
      setContentText('{}')
      setOrder(nextOrder)
      setActive(true)
    }
    setJsonError(null)
  }, [open, section, nextOrder])

  async function handleSave() {
    let content
    try {
      content = JSON.parse(contentText)
    } catch {
      setJsonError('JSON inválido — verifica a sintaxe.')
      return
    }
    setSaving(true)
    try {
      await upsertSection({
        id: section?.id,
        section_type: sectionType,
        title: title || null,
        subtitle: subtitle || null,
        content,
        display_order: order,
        is_active: active,
      })
      onSaved()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {section ? 'Editar secção' : 'Nova secção'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Tipo de secção</label>
            <Select value={sectionType} onChange={(e) => setSectionType(e.target.value as SectionType)}>
              {Object.entries(SECTION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Define Your Vision." />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Subtítulo</label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Streetwear criada para quem define o próprio caminho." />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Conteúdo avançado (JSON — imagens, links, produtos em destaque…)
            </label>
            <Textarea
              rows={6}
              value={contentText}
              onChange={(e) => {
                setContentText(e.target.value)
                setJsonError(null)
              }}
              className="font-mono text-xs"
            />
            {jsonError && <p className="mt-1 text-xs text-danger">{jsonError}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Ordem</label>
              <Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 1)} className="font-mono" />
            </div>
            <div className="flex items-center justify-between rounded-md border border-hairline bg-surface px-3">
              <span className="text-xs text-muted-foreground">Visível no site</span>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={saving} onClick={handleSave}>
            {saving ? 'A guardar...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
