import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      {eyebrow && (
        <div className={cn('flex items-center gap-2', align === 'center' && 'justify-center')}>
          <span className="h-px w-6 bg-secondary" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</span>
          <span className="h-px w-6 bg-secondary" />
        </div>
      )}
      <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-forest-deep text-balance md:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-muted-foreground text-balance">{description}</p>}
    </div>
  )
}

export function AiLabel({ children = 'AI Insight', className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md bg-forest-deep px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-cream',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
      </svg>
      {children}
    </span>
  )
}
