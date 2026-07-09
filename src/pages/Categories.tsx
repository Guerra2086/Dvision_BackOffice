import { useEffect, useState } from 'react'
import { Plus, ImageIcon, Pencil, Trash2, Upload } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Switch } from '../components/ui/Switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/Dialog'
import {
  useCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryRow,
} from '../hooks/useCategoriesAdmin'
import { supabase } from '../lib/supabase'

export function Categories() {
  const { categories, loading, refresh } = useCategoriesAdmin()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryRow | null>(null)

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(c: CategoryRow) {
    setEditing(c)
    setModalOpen(true)
  }

  async function handleDelete(c: CategoryRow) {
    if (!confirm(`Apagar categoria "${c.name}"? Os produtos ficam sem categoria.`)) return
    await deleteCategory(c.id)
    refresh()
  }

  return (
    <PageShell
      eyebrow="DVISION / TAXONOMY"
      title="Categorias"
      description="Estrutura do catálogo — organização, ordem e visibilidade."
      actions={
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Nova categoria
        </Button>
      }
    >
      {loading ? (
        <p className="text-sm text-muted-foreground">A carregar...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <div key={c.id} className="group overflow-hidden rounded-lg border border-hairline bg-surface transition-all hover:border-primary/40">
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-surface-2 via-background to-surface">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">{c.name}</h3>
                </div>
                <div className="absolute right-3 top-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur ${
                      c.is_active ? 'border-success/40 bg-success/15 text-success' : 'border-hairline bg-background/60 text-muted-foreground'
                    }`}
                  >
                    {c.is_active ? 'Ativa' : 'Oculta'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{c.description ?? 'Sem descrição.'}</p>
                <div className="mt-3 flex items-center justify-between border-t border-hairline/60 pt-3">
                  <div className="font-mono text-xs">
                    <span className="text-primary">{c.count}</span>
                    <span className="text-muted-foreground"> produtos</span>
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">/{c.slug}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(c)}>
                    <Pencil className="h-3 w-3" /> Editar
                  </Button>
                  <Button size="sm" variant="ghost" className="hover:text-danger" onClick={() => handleDelete(c)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={editing}
        nextOrder={categories.length + 1}
        onSaved={refresh}
      />
    </PageShell>
  )
}

function CategoryModal({
  open,
  onOpenChange,
  category,
  nextOrder,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  category: CategoryRow | null
  nextOrder: number
  onSaved: () => void
}) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [active, setActive] = useState(true)
  const [order, setOrder] = useState(1)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!open) return
    if (category) {
      setName(category.name)
      setSlug(category.slug)
      setDescription(category.description ?? '')
      setImageUrl(category.image_url ?? '')
      setActive(category.is_active)
      setOrder(category.display_order)
    } else {
      setName('')
      setSlug('')
      setDescription('')
      setImageUrl('')
      setActive(true)
      setOrder(nextOrder)
    }
  }, [open, category, nextOrder])

  function slugify(text: string) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleUpload(file: File | null) {
    if (!file) return
    setUploading(true)
    try {
      const path = `categories/${crypto.randomUUID()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('homepage-assets').upload(path, file)
      if (error) throw error
      const url = supabase.storage.from('homepage-assets').getPublicUrl(path).data.publicUrl
      setImageUrl(url)
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const input = {
        name,
        slug: slug || slugify(name),
        description: description || null,
        image_url: imageUrl || null,
        display_order: order,
        is_active: active,
      }
      if (category) {
        await updateCategory(category.id, input)
      } else {
        await createCategory(input)
      }
      onSaved()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {category ? 'Editar categoria' : 'Nova categoria'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hoodies" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(name) || 'hoodies'} className="font-mono" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Descrição</label>
            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Imagem</label>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-hairline p-3 text-xs text-muted-foreground hover:border-primary hover:text-primary">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0] ?? null)} />
              <Upload className="h-4 w-4" /> {uploading ? 'A enviar...' : imageUrl ? 'Trocar imagem' : 'Carregar imagem'}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Ordem</label>
              <Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 1)} className="font-mono" />
            </div>
            <div className="flex items-center justify-between rounded-md border border-hairline bg-surface px-3">
              <span className="text-xs text-muted-foreground">Ativa</span>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={saving || !name} onClick={handleSave}>
            {saving ? 'A guardar...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
