import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          A verificar sessão...
        </p>
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/login" replace />

  return <>{children}</>
}
