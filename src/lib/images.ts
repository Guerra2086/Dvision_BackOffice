import { supabase } from './supabase'

export function productImageUrl(storagePath: string): string {
  if (
    storagePath.startsWith('http://') ||
    storagePath.startsWith('https://') ||
    storagePath.startsWith('/')
  ) {
    return storagePath
  }
  return supabase.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl
}

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${productId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(path, file)
  if (error) throw error
  return path
}
