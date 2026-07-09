import type { ReactNode } from 'react'
import { TopBar } from './TopBar'

export function PageShell({
  title,
  eyebrow,
  description,
  actions,
  children,
}: {
  title: string
  eyebrow?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background bg-noise">
      <TopBar />
      <main className="mx-auto max-w-[1600px] px-4 py-8 md:px-6">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
            )}
            <h1 className="truncate font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
            {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
        {children}
      </main>
    </div>
  )
}
