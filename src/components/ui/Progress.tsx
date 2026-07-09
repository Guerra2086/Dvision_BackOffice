export function Progress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1 overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div className="h-full bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}
