import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  icon: ComponentType<{ className?: string }>
  value: ReactNode
  label: string
  tone?: 'pink' | 'sage' | 'peach' | 'accent' | 'cream'
  className?: string
  sub?: ReactNode
}

const tones: Record<string, string> = {
  pink: 'bg-pink/50 border-pink',
  sage: 'bg-accent border-accent',
  peach: 'bg-peach/50 border-peach',
  accent: 'bg-accent/70 border-accent',
  cream: 'bg-card border-border',
}

export function MetricCard({ icon: Icon, value, label, tone = 'cream', className, sub }: MetricCardProps) {
  return (
    <div className={cn('flex items-center gap-3 rounded-2xl border p-4', tones[tone], className)}>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-deep text-cream">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <div className="font-serif text-2xl font-bold leading-none text-forest-deep">{value}</div>
        <div className="mt-1 text-xs font-medium text-foreground/70">{label}</div>
        {sub}
      </div>
    </div>
  )
}

interface KpiCardProps {
  icon: ComponentType<{ className?: string }>
  value: ReactNode
  label: string
  delta?: string
  deltaTone?: 'up' | 'down' | 'flat'
  className?: string
}

export function KpiCard({ icon: Icon, value, label, delta, deltaTone = 'up', className }: KpiCardProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-4 card-shadow', className)}>
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
        {delta && (
          <span
            className={cn(
              'text-xs font-semibold',
              deltaTone === 'up' && 'text-primary',
              deltaTone === 'down' && 'text-destructive',
              deltaTone === 'flat' && 'text-muted-foreground',
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="mt-3 font-serif text-2xl font-bold leading-none text-forest-deep">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
