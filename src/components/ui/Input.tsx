import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-hairline bg-surface px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary',
        className,
      )}
      {...props}
    />
  )
}
