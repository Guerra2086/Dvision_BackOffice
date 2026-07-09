import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { Switch } from '../ui/Switch'
import { Badge } from '../ui/Badge'
import { Progress } from '../ui/Progress'
import { Select } from '../ui/Select'
import { Info, Tag, Boxes, ImagePlus, Layers, Upload, X, Star, Save, ImageIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { CategoryRow } from '../../hooks/useCategoriesAdmin'
import type { ProductRow } from '../../types/product'
import {
  createProduct,
  updateProduct,
  upsertVariant,
  addProductImage,
  deleteProductImage,
  type ProductInput,
} from '../../hooks/useProductsAdmin'
import { uploadProductImage, productImageUrl } from '../../lib/images'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface VariantDraft {
  id?: string
  color: string
  size: string
  sku: string
  stock_quantity: number
}

export function ProductModal({
  open,
  onOpenChange,
  categories,
  product,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  categories: CategoryRow[]
  product: ProductRow | null
  onSaved: () => void
}) {
  const [tab, setTab] = useState('info')
  const tabs = [
    { id: 'info', label: 'Informação', icon: Info },
    { id: 'price', label: 'Preço', icon: Tag },
    { id: 'stock', label: 'Stock', icon: Boxes },
    { id: 'media', label: 'Media', icon: ImagePlus },
    { id: 'org', label: 'Organização', icon: Layers },
  ]
  const progress = ((tabs.findIndex((t) => t.id === tab) + 1) / tabs.length) * 100

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [basePrice, setBasePrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [saleOn, setSaleOn] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [colors, setColors] = useState<string[]>([])
  const [newColor, setNewColor] = useState('')
  const [variants, setVariants] = useState<VariantDraft[]>([])
  const [images, setImages] = useState<{ id: string; storage_path: string; is_primary: boolean }[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setTab('info')
    if (product) {
      setProductId(product.id)
      setName(product.name)
      setSlug(product.slug)
      setCategoryId(product.category_id ?? '')
      setDescription(product.description ?? '')
      setActive(product.status === 'active')
      setBasePrice(String(product.base_price))
      setCompareAtPrice(product.compare_at_price ? String(product.compare_at_price) : '')
      setSaleOn(!!product.compare_at_price)
      setFeatured(product.is_featured)
      const uniqueColors = Array.from(new Set(product.product_variants.map((v) => v.color).filter(Boolean))) as string[]
      setColors(uniqueColors)
      setVariants(
        product.product_variants.map((v) => ({
          id: v.id,
          color: v.color ?? '',
          size: v.size ?? '',
          sku: v.sku ?? '',
          stock_quantity: v.stock_quantity,
        })),
      )
      setImages(product.product_images.map((i) => ({ id: i.id, storage_path: i.storage_path, is_primary: i.is_primary })))
    } else {
      setProductId(null)
      setName('')
      setSlug('')
      setCategoryId('')
      setDescription('')
      setActive(false)
      setBasePrice('')
      setCompareAtPrice('')
      setSaleOn(false)
      setFeatured(false)
      setColors([])
      setVariants([])
      setImages([])
    }
  }, [open, product])

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function addColor() {
    if (!newColor.trim()) return
    setColors((c) => [...c, newColor.trim()])
    setNewColor('')
  }

  function variantFor(color: string, size: string) {
    return variants.find((v) => v.color === color && v.size === size)
  }

  function setVariantStock(color: string, size: string, stock: number) {
    setVariants((prev) => {
      const existing = prev.find((v) => v.color === color && v.size === size)
      if (existing) {
        return prev.map((v) => (v === existing ? { ...v, stock_quantity: stock } : v))
      }
      return [
        ...prev,
        { color, size, stock_quantity: stock, sku: `${slug || 'sku'}-${color}-${size}`.toUpperCase().replace(/\s+/g, '') },
      ]
    })
  }

  async function handleSave(status: 'draft' | 'active') {
    setSaving(true)
    try {
      const input: ProductInput = {
        name,
        slug: slug || slugify(name),
        category_id: categoryId || null,
        description: description || null,
        base_price: parseFloat(basePrice) || 0,
        compare_at_price: saleOn && compareAtPrice ? parseFloat(compareAtPrice) : null,
        sku: null,
        status: status === 'active' && active ? 'active' : status,
        is_featured: featured,
      }

      let id = productId
      if (id) {
        await updateProduct(id, input)
      } else {
        id = await createProduct(input)
        setProductId(id)
      }

      for (const v of variants) {
        await upsertVariant({
          id: v.id,
          product_id: id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          stock_quantity: v.stock_quantity,
        })
      }

      onSaved()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    let id = productId
    if (!id) {
      id = await createProduct({
        name: name || 'Novo produto',
        slug: slug || slugify(name || 'novo-produto'),
        category_id: categoryId || null,
        description: description || null,
        base_price: parseFloat(basePrice) || 0,
        compare_at_price: null,
        sku: null,
        status: 'draft',
        is_featured: featured,
      })
      setProductId(id)
    }

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const path = await uploadProductImage(file, id)
        await addProductImage(id, path, images.length === 0)
        setImages((prev) => [...prev, { id: crypto.randomUUID(), storage_path: path, is_primary: prev.length === 0 }])
      }
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveImage(imgId: string) {
    await deleteProductImage(imgId)
    setImages((prev) => prev.filter((i) => i.id !== imgId))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="border-b border-hairline px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                DVISION / {product ? 'EDITAR' : 'NOVO'} PRODUTO
              </div>
              <DialogTitle className="mt-1 font-display text-2xl font-bold tracking-tight">
                {product ? product.name : 'Criar novo produto'}
              </DialogTitle>
            </div>
            <Badge className={active ? 'border-success/40 bg-success/10 text-success' : 'border-warning/40 bg-warning/10 text-warning'}>
              {active ? 'Ativo' : 'Rascunho'}
            </Badge>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={progress} className="flex-1" />
            <div className="font-mono text-[11px] text-muted-foreground">{Math.round(progress)}%</div>
          </div>
        </DialogHeader>

        <div className="mx-6 mt-4 flex flex-wrap gap-1 rounded-md bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium uppercase tracking-wider',
                tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          {tab === 'info' && (
            <Section title="Informação geral">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nome do produto" required>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: DV. Norte" />
                </Field>
                <Field label="Slug (URL)">
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder={slugify(name) || 'dv-norte'}
                    className="font-mono"
                  />
                </Field>
                <Field label="Categoria" required>
                  <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Selecionar...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Estado">
                  <div className="flex h-10 items-center justify-between rounded-md border border-hairline bg-surface px-3">
                    <span className="text-sm text-muted-foreground">Produto ativo (visível no site)</span>
                    <Switch checked={active} onCheckedChange={setActive} />
                  </div>
                </Field>
              </div>
              <Field label="Descrição">
                <Textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Storytelling completo do produto, materiais, inspiração…"
                />
              </Field>
            </Section>
          )}

          {tab === 'price' && (
            <Section title="Preço">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Preço de venda (€)" required>
                  <Input
                    type="number"
                    step="0.01"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="89.00"
                    className="font-mono"
                  />
                </Field>
                <Field label="Preço antigo (€)">
                  <Input
                    type="number"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="119.00"
                    className="font-mono"
                    disabled={!saleOn}
                  />
                </Field>
              </div>
              <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 p-4">
                <div>
                  <div className="font-display font-semibold">Ativar promoção</div>
                  <div className="text-xs text-muted-foreground">Aplica badge SALE e preço riscado.</div>
                </div>
                <Switch checked={saleOn} onCheckedChange={setSaleOn} />
              </div>
            </Section>
          )}

          {tab === 'stock' && (
            <Section title="Stock e variantes">
              <div>
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Cores</div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <span key={c} className="flex items-center gap-2 rounded-md border border-hairline bg-surface px-3 py-1.5 text-xs">
                      {c}
                      <button onClick={() => setColors((cs) => cs.filter((x) => x !== c))}>
                        <X className="h-3 w-3 text-muted-foreground hover:text-danger" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Nova cor"
                      className="h-8 w-32 text-xs"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    />
                    <Button size="sm" variant="outline" onClick={addColor}>
                      + cor
                    </Button>
                  </div>
                </div>
              </div>

              {colors.length > 0 && (
                <div className="mt-6 overflow-x-auto rounded-md border border-hairline">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-2">
                      <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <th className="p-3">Cor / Tamanho</th>
                        {SIZES.map((s) => (
                          <th key={s} className="p-3 text-center">
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline/60">
                      {colors.map((c) => (
                        <tr key={c} className="bg-surface">
                          <td className="p-3 text-xs font-medium">{c}</td>
                          {SIZES.map((s) => (
                            <td key={s} className="p-1.5 text-center">
                              <Input
                                type="number"
                                min={0}
                                value={variantFor(c, s)?.stock_quantity ?? ''}
                                onChange={(e) => setVariantStock(c, s, parseInt(e.target.value) || 0)}
                                className="h-8 w-16 text-center font-mono text-xs"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          )}

          {tab === 'media' && (
            <Section title="Imagens do produto">
              <label className="block cursor-pointer rounded-lg border-2 border-dashed border-hairline bg-surface/50 p-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-hairline bg-background text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="mt-4 font-display text-lg font-semibold">
                  {uploading ? 'A enviar...' : 'Arrastar e largar imagens'}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP. Clica para selecionar ficheiros.</div>
              </label>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {images.map((img) => (
                    <div key={img.id} className="group relative overflow-hidden rounded-md border border-hairline bg-surface">
                      <div className="aspect-[4/5] bg-surface-2">
                        <img src={productImageUrl(img.storage_path)} alt="" className="h-full w-full object-cover" />
                      </div>
                      {img.is_primary && (
                        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary-foreground">
                          <Star className="h-2.5 w-2.5 fill-current" /> Principal
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded bg-background/80 text-muted-foreground opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length === 0 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="h-4 w-4" /> Ainda sem imagens.
                </div>
              )}
            </Section>
          )}

          {tab === 'org' && (
            <Section title="Organização">
              <div className="flex items-center justify-between rounded-md border border-hairline bg-surface p-4">
                <div>
                  <div className="font-display font-semibold">Produto em destaque</div>
                  <div className="text-xs text-muted-foreground">Aparece na homepage como best seller.</div>
                </div>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </div>
            </Section>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-hairline bg-surface/50 px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" disabled={saving} onClick={() => handleSave('draft')}>
              Guardar rascunho
            </Button>
            <Button disabled={saving} onClick={() => handleSave('active')}>
              <Save className="h-4 w-4" /> Guardar produto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-4 w-1 rounded bg-primary" />
        <h3 className="font-display text-sm font-bold uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  )
}
