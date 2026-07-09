import { createContext, useEffect, useRef, useState, type ReactNode } from 'react'
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
  const checkIdRef = useRef(0)

  useEffect(() => {
    async function applySession(newSession: Session | null) {
      const checkId = ++checkIdRef.current

      // Set session + loading in the same synchronous tick so no render can
      // ever observe "session present but loading already false".
      setSession(newSession)

      if (!newSession?.user) {
        setIsAdmin(false)
        setFullName(null)
        setLoading(false)
        return
      }

      setLoading(true)

      const [profileRes, adminRes] = await Promise.all([
        supabase.from('profiles').select('role, full_name').eq('id', newSession.user.id).maybeSingle(),
        supabase.rpc('is_admin'),
      ])

      if (checkIdRef.current !== checkId) return // a newer auth event superseded this one

      setIsAdmin(adminRes.data === true)
      setFullName(profileRes.data?.full_name ?? null)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => applySession(data.session))

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      applySession(newSession)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

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
