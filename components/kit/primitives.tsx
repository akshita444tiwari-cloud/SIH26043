import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { ChallengeStatus, Severity } from '@/lib/types'

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card text-card-foreground card-shadow',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1 p-5', className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 className={cn('font-serif text-lg font-semibold tracking-tight', className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number
  className?: string
  barClassName?: string
}) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn('h-full rounded-full bg-primary transition-all', barClassName)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function Badge({
  children,
  className,
  tone = 'neutral',
}: {
  children: ReactNode
  className?: string
  tone?: 'neutral' | 'forest' | 'terracotta' | 'gold' | 'sage' | 'outline'
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-muted text-muted-foreground',
    forest: 'bg-primary/12 text-primary',
    terracotta: 'bg-secondary/15 text-secondary',
    gold: 'bg-gold/20 text-[oklch(0.45_0.09_70)]',
    sage: 'bg-accent text-accent-foreground',
    outline: 'border border-border bg-transparent text-foreground',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}

const severityTone: Record<Severity, string> = {
  Low: 'bg-accent text-accent-foreground',
  Medium: 'bg-gold/25 text-[oklch(0.42_0.09_65)]',
  High: 'bg-secondary/18 text-secondary',
  Critical: 'bg-destructive/15 text-destructive',
}

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', severityTone[severity], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {severity}
    </span>
  )
}

const statusTone: Record<ChallengeStatus, string> = {
  Submitted: 'bg-muted text-muted-foreground',
  'Under Verification': 'bg-gold/20 text-[oklch(0.42_0.09_65)]',
  Verified: 'bg-accent text-accent-foreground',
  Matched: 'bg-primary/12 text-primary',
  'In Progress': 'bg-secondary/15 text-secondary',
  Resolved: 'bg-primary text-primary-foreground',
}

export function StatusBadge({ status, className }: { status: ChallengeStatus; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', statusTone[status], className)}>
      {status}
    </span>
  )
}
