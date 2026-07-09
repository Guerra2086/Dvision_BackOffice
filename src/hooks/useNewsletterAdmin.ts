import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface SubscriberRow {
  id: string
  email: string
  is_active: boolean
  subscribed_at: string
}

export function useNewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('newsletter_subscribers')
      .select('id, email, is_active, subscribed_at')
      .order('subscribed_at', { ascending: false })
      .then(({ data }) => {
        setSubscribers(data ?? [])
        setLoading(false)
      })
  }, [])

  return { subscribers, loading }
}
