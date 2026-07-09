import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-hairline bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
        className,
      )}
      {...props}
    />
  )
}
