import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LifecycleStep } from '@/lib/types'

export function LifecycleTracker({ steps, compact = false }: { steps: LifecycleStep[]; compact?: boolean }) {
  return (
    <ol className={cn('relative', compact ? 'space-y-0' : 'space-y-1')}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <li key={step.stage} className="relative flex gap-3 pb-4 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  'absolute left-[11px] top-6 h-full w-0.5',
                  step.status === 'done' ? 'bg-primary' : 'bg-border',
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                'z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 text-[0.6rem] font-bold',
                step.status === 'done' && 'border-primary bg-primary text-primary-foreground',
                step.status === 'active' && 'border-secondary bg-secondary/15 text-secondary',
                step.status === 'pending' && 'border-border bg-card text-muted-foreground',
              )}
            >
              {step.status === 'done' ? <Check className="size-3.5" /> : i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2">
                <span
                  className={cn(
                    'text-sm font-semibold',
                    step.status === 'pending' ? 'text-muted-foreground' : 'text-forest-deep',
                  )}
                >
                  {step.stage}
                </span>
                {step.status === 'active' && (
                  <span className="rounded-full bg-secondary/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-secondary">
                    In progress
                  </span>
                )}
                {step.date && <span className="text-xs text-muted-foreground">· {step.date}</span>}
              </div>
              {!compact && step.owner && (
                <div className="text-xs text-muted-foreground">Owner: {step.owner}</div>
              )}
              {!compact && step.note && <div className="mt-0.5 text-xs text-secondary">{step.note}</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
