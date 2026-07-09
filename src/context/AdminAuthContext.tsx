import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AdminAuthContextValue {
  session: Session | null
  user: User | null
  isAdmin: boolean
  loading: boolean
  fullName: string | null
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [fullName, setFullName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!newSession) {
        setIsAdmin(false)
        setFullName(null)
        setLoading(false)
      }
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) return
    let cancelled = false
    setLoading(true)

    async function checkAdmin() {
      const userId = session!.user.id
      const [{ data: profile }, { data: adminRow }] = await Promise.all([
        supabase.from('profiles').select('role, full_name').eq('id', userId).maybeSingle(),
        supabase.from('admin_users').select('is_active').eq('id', userId).maybeSingle(),
      ])

      if (cancelled) return
      setIsAdmin(profile?.role === 'admin' && adminRow?.is_active === true)
      setFullName(profile?.full_name ?? null)
      setLoading(false)
    }

    checkAdmin()
    return () => {
      cancelled = true
    }
  }, [session])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AdminAuthContext.Provider
      value={{ session, user: session?.user ?? null, isAdmin, loading, fullName, signIn, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
