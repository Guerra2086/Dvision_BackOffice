import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full resize-none rounded-md border border-hairline bg-surface p-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary',
        className,
      )}
      {...props}
    />
  )
}
