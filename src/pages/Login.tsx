import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function Login() {
  const { signIn, signOut, session, isAdmin, loading } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading) return
    if (isAdmin) {
      navigate('/')
    } else if (session) {
      setError('Esta conta não tem permissões de administrador.')
      signOut()
    }
  }, [loading, isAdmin, session, navigate, signOut])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(error)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background bg-noise px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-sm bg-primary text-primary-foreground shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <span className="font-display text-lg font-black">D</span>
          </div>
          <div className="mt-3 font-display text-xl font-bold tracking-tight">DVISION</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Admin Backoffice
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-hairline bg-surface p-6 space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dvision.pt"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'A entrar...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Acesso restrito a administradores DVISION.
        </p>
      </div>
    </div>
  )
}
