'use client'

import { useMemo, useState } from 'react'
import { Accessibility, Building2, Bus, Check, Landmark, Minus, School, Trees, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AccessibilityAudit, AccessibilityStatus, FacilityType } from '@/lib/types'
import { Card, Badge, Progress } from './primitives'
import { BarList } from './charts'
import { AIInsightCard } from './ai-cards'

const TYPE_ICON: Record<FacilityType, typeof Accessibility> = {
  Hospital: Building2,
  School: School,
  'Transport Hub': Bus,
  'Govt Office': Landmark,
  'Public Space': Trees,
}

const FILTERS: Array<'All' | FacilityType> = [
  'All',
  'Hospital',
  'School',
  'Transport Hub',
  'Govt Office',
  'Public Space',
]

const statusIcon: Record<AccessibilityStatus, typeof Check> = {
  Present: Check,
  Partial: Minus,
  Absent: X,
}

const statusCls: Record<AccessibilityStatus, string> = {
  Present: 'bg-primary/12 text-primary',
  Partial: 'bg-gold/25 text-[oklch(0.42_0.09_65)]',
  Absent: 'bg-destructive/12 text-destructive',
}

const complianceTone: Record<AccessibilityAudit['compliance'], 'forest' | 'gold' | 'terracotta'> = {
  Compliant: 'forest',
  Partial: 'gold',
  'Non-compliant': 'terracotta',
}

function scoreBar(score: number) {
  if (score >= 75) return 'bg-primary'
  if (score >= 50) return 'bg-gold'
  return 'bg-secondary'
}

export function AccessibilityMap({ audits }: { audits: AccessibilityAudit[] }) {
  const [filter, setFilter] = useState<'All' | FacilityType>('All')

  const filtered = useMemo(
    () => (filter === 'All' ? audits : audits.filter((a) => a.type === filter)),
    [audits, filter],
  )

  const summary = useMemo(() => {
    const compliant = audits.filter((a) => a.compliance === 'Compliant').length
    const barriers = audits.reduce(
      (n, a) => n + a.criteria.filter((c) => c.status === 'Absent').length,
      0,
    )
    const avg = Math.round(audits.reduce((n, a) => n + a.score, 0) / audits.length)
    return { compliant, barriers, avg, total: audits.length }
  }, [audits])

  const byDistrict = useMemo(() => {
    const map = new Map<string, number[]>()
    for (const a of audits) {
      map.set(a.district, [...(map.get(a.district) ?? []), a.score])
    }
    return [...map.entries()]
      .map(([label, scores]) => ({
        label,
        value: Math.round(scores.reduce((n, s) => n + s, 0) / scores.length),
        hint: `${scores.length} audited`,
      }))
      .sort((a, b) => a.value - b.value)
  }, [audits])

  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: summary.total, label: 'Facilities audited' },
          { value: summary.compliant, label: 'Fully compliant' },
          { value: `${summary.avg}/100`, label: 'Avg. accessibility score' },
          { value: summary.barriers, label: 'Barriers logged' },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="font-serif text-3xl font-bold text-forest-deep">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* District accessibility ranking */}
        <Card className="p-6">
          <h3 className="mb-1 font-serif text-base font-semibold text-forest-deep">
            District accessibility scores
          </h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Average barrier-free score across audited public facilities. Lower scores need priority retrofits.
          </p>
          <BarList data={byDistrict} suffix="/100" />
        </Card>

        <AIInsightCard title="Priority retrofit recommendation" className="self-start">
          Audited facilities in <span className="font-semibold text-forest-deep">West Singhbhum</span> and{' '}
          <span className="font-semibold text-forest-deep">Palamu</span> score below 50/100, with ramps and accessible
          toilets most commonly absent. Routing these as{' '}
          <span className="font-semibold text-forest-deep">Accessibility</span> challenges to matched universities could
          convert 6 facilities to barrier-free within a single academic cycle.
        </AIInsightCard>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
              filter === f
                ? 'border-transparent bg-forest-deep text-cream'
                : 'border-border bg-card text-muted-foreground hover:border-secondary/40 hover:text-forest-deep',
            )}
            aria-pressed={filter === f}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Facility audit cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((a) => {
          const Icon = TYPE_ICON[a.type]
          return (
            <Card key={a.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-semibold text-forest-deep">{a.facility}</h3>
                    <p className="text-xs text-muted-foreground">
                      {a.type} · {a.locality}, {a.district}
                    </p>
                  </div>
                </div>
                <Badge tone={complianceTone[a.compliance]} className="shrink-0">
                  {a.compliance}
                </Badge>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Accessibility className="size-3.5" /> Accessibility score
                  </span>
                  <span className="font-semibold text-forest-deep">{a.score}/100</span>
                </div>
                <Progress value={a.score} barClassName={scoreBar(a.score)} />
              </div>

              <ul className="mt-4 grid gap-1.5">
                {a.criteria.map((c) => {
                  const S = statusIcon[c.status]
                  return (
                    <li key={c.label} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-foreground/80">{c.label}</span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-medium',
                          statusCls[c.status],
                        )}
                      >
                        <S className="size-3" /> {c.status}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
