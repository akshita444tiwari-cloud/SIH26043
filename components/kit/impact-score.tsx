import { cn } from '@/lib/utils'
import type { ImpactBreakdown } from '@/lib/types'
import { Progress } from './primitives'

export function ImpactRing({ score, size = 120, className }: { score: number; size?: number; className?: string }) {
  const r = 46
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div className={cn('relative grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-serif text-3xl font-bold leading-none text-forest-deep">{score}</span>
        <span className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}

const factorLabels: { key: keyof ImpactBreakdown; label: string }[] = [
  { key: 'affectedPopulation', label: 'Affected Population' },
  { key: 'severity', label: 'Severity' },
  { key: 'communitySupport', label: 'Community Support' },
  { key: 'evidenceQuality', label: 'Evidence Quality' },
  { key: 'recurrence', label: 'Recurrence' },
  { key: 'urgency', label: 'Urgency' },
]

export function ImpactBreakdownList({ breakdown }: { breakdown: ImpactBreakdown }) {
  return (
    <div className="grid gap-3">
      {factorLabels.map((f) => (
        <div key={f.key}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-foreground/80">{f.label}</span>
            <span className="font-semibold text-forest-deep">{breakdown[f.key]}</span>
          </div>
          <Progress value={breakdown[f.key]} barClassName="bg-secondary" />
        </div>
      ))}
    </div>
  )
}
