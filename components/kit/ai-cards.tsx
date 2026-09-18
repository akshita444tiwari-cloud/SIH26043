'use client'

import { useState, type ReactNode } from 'react'
import { Building2, ChevronDown, GraduationCap, MapPin, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EarlyWarning, IndustryMatch, UniversityMatch } from '@/lib/types'
import { Card } from './primitives'
import { AiLabel } from './section-heading'
import { Progress } from './primitives'

export function AIInsightCard({
  label = 'AI Insight',
  title,
  children,
  className,
}: {
  label?: string
  title: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('border-primary/20 bg-primary/[0.04]', className)}>
      <div className="p-5">
        <AiLabel>{label}</AiLabel>
        <h3 className="mt-2 font-serif text-lg font-semibold text-forest-deep">{title}</h3>
        <div className="mt-2 text-sm text-foreground/75">{children}</div>
      </div>
    </Card>
  )
}

export function UniversityMatchCard({ match }: { match: UniversityMatch }) {
  const [open, setOpen] = useState(false)
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-forest-deep">{match.name}</h3>
              <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {match.district}
              </p>
            </div>
            <div className="text-right">
              <div className="font-serif text-2xl font-bold text-secondary">{match.matchScore}%</div>
              <div className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">Match</div>
            </div>
          </div>
          <ul className="mt-3 grid gap-1.5">
            {match.reasons.slice(0, open ? match.reasons.length : 3).map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-foreground/75">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-t border-border bg-muted/40 px-5 py-2.5 text-sm font-medium text-forest-deep transition-colors hover:bg-muted"
        aria-expanded={open}
      >
        How was this match calculated?
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="grid gap-3 border-t border-border p-5">
          {match.factors.map((f) => (
            <div key={f.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-foreground/80">{f.label}</span>
                <span className="font-semibold text-forest-deep">{f.score}</span>
              </div>
              <Progress value={f.score} barClassName="bg-primary" />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function IndustryMatchCard({ match }: { match: IndustryMatch }) {
  return (
    <Card>
      <div className="flex items-start gap-3 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary/12 text-secondary">
          <Building2 className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-forest-deep">{match.name}</h3>
              <p className="text-xs text-muted-foreground">{match.sector}</p>
            </div>
            <div className="text-right">
              <div className="font-serif text-2xl font-bold text-secondary">{match.matchScore}%</div>
              <div className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">Resource match</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {match.provides.map((p) => (
              <span key={p} className="rounded-md bg-accent px-2 py-0.5 text-[0.7rem] font-medium text-accent-foreground">
                {p}
              </span>
            ))}
          </div>
          <ul className="mt-3 grid gap-1">
            {match.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-foreground/70">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

const riskTone: Record<EarlyWarning['risk'], string> = {
  Moderate: 'bg-gold/25 text-[oklch(0.42_0.09_65)]',
  Elevated: 'bg-secondary/18 text-secondary',
  High: 'bg-destructive/15 text-destructive',
}

export function EarlyWarningCard({ warning }: { warning: EarlyWarning }) {
  return (
    <Card className="border-secondary/25">
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <AiLabel className="bg-secondary">Early Warning</AiLabel>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', riskTone[warning.risk])}>
            {warning.risk} risk
          </span>
        </div>
        <h3 className="mt-2 flex items-center gap-2 font-serif text-lg font-semibold text-forest-deep">
          <TriangleAlert className="size-4.5 text-secondary" />
          {warning.title}
        </h3>
        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" /> {warning.district} · {warning.domain}
        </p>

        <div className="mt-3 grid gap-2">
          {warning.signals.map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5 text-sm">
              <span className="text-foreground/75">{s.label}</span>
              <span className="font-semibold text-secondary">{s.delta}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{warning.relatedReports} related reports</span>
          <span className="text-muted-foreground">Confidence {warning.confidence}%</span>
        </div>
        <Progress value={warning.confidence} className="mt-1.5" barClassName="bg-secondary" />

        <div className="mt-3 rounded-lg border border-dashed border-secondary/30 bg-secondary/[0.05] p-3 text-sm text-foreground/75">
          <span className="font-semibold text-forest-deep">Recommended action: </span>
          {warning.recommendation}
        </div>
      </div>
    </Card>
  )
}
