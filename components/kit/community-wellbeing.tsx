'use client'

import { useMemo } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, HeartPulse, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EarlyWarning, WellbeingSignal } from '@/lib/types'
import { Card, Badge, Progress } from './primitives'
import { EarlyWarningCard, AIInsightCard } from './ai-cards'

const trendMeta: Record<
  WellbeingSignal['trend'],
  { icon: typeof ArrowUpRight; tone: 'forest' | 'gold' | 'terracotta'; bar: string }
> = {
  Improving: { icon: ArrowUpRight, tone: 'forest', bar: 'bg-primary' },
  Stable: { icon: ArrowRight, tone: 'gold', bar: 'bg-gold' },
  Declining: { icon: ArrowDownRight, tone: 'terracotta', bar: 'bg-secondary' },
}

function indexBar(index: number) {
  if (index >= 70) return 'bg-primary'
  if (index >= 60) return 'bg-gold'
  return 'bg-secondary'
}

export function CommunityWellbeing({
  signals,
  warnings,
}: {
  signals: WellbeingSignal[]
  warnings: EarlyWarning[]
}) {
  const summary = useMemo(() => {
    const avgIndex = Math.round(signals.reduce((n, s) => n + s.index, 0) / signals.length)
    const avgCoverage = Math.round(
      signals.reduce((n, s) => n + s.supportCoverage, 0) / signals.length,
    )
    const declining = signals.filter((s) => s.trend === 'Declining').length
    return { avgIndex, avgCoverage, declining, tracked: signals.length }
  }, [signals])

  const ranked = useMemo(
    () => [...signals].sort((a, b) => a.index - b.index),
    [signals],
  )

  return (
    <div className="space-y-6">
      {/* Privacy assurance */}
      <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] p-3.5 text-sm text-foreground/75">
        <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-primary" />
        <p>
          All signals are <span className="font-semibold text-forest-deep">aggregated at the community level</span> and
          privacy-preserving. This system flags where support resources may be needed — it never identifies or diagnoses
          individuals.
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: `${summary.avgIndex}/100`, label: 'Avg. wellbeing index' },
          { value: `${summary.avgCoverage}%`, label: 'Avg. support coverage' },
          { value: summary.declining, label: 'Districts trending down' },
          { value: summary.tracked, label: 'Districts monitored' },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="font-serif text-3xl font-bold text-forest-deep">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* District wellbeing index */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <HeartPulse className="size-4.5" />
            </span>
            <div>
              <h3 className="font-serif text-base font-semibold text-forest-deep">
                Community wellbeing index
              </h3>
              <p className="text-xs text-muted-foreground">
                Composite index &amp; support-resource reach by district.
              </p>
            </div>
          </div>

          <ul className="grid gap-3">
            {ranked.map((s) => {
              const meta = trendMeta[s.trend]
              const TrendIcon = meta.icon
              return (
                <li key={s.district} className="rounded-xl bg-muted/50 p-3.5">
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-forest-deep">{s.district}</span>
                    <Badge tone={meta.tone} className="shrink-0">
                      <TrendIcon className="size-3" /> {s.trend}
                    </Badge>
                  </div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Wellbeing index</span>
                    <span className="font-semibold text-forest-deep">{s.index}/100</span>
                  </div>
                  <Progress value={s.index} barClassName={indexBar(s.index)} />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Support-resource coverage</span>
                    <span className="font-semibold text-secondary">{s.supportCoverage}%</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <AIInsightCard title="Where to pre-position support" className="self-start">
          <span className="font-semibold text-forest-deep">{ranked[0]?.district}</span> and{' '}
          <span className="font-semibold text-forest-deep">{ranked[1]?.district}</span> show the lowest wellbeing index
          with support coverage under 40%. These districts also carry the strongest declining signals — routing
          tele-counselling capacity and NGO peer-support here now can ease pressure before it escalates into acute,
          harder-to-resolve needs.
        </AIInsightCard>
      </div>

      {/* Early-warning cards */}
      <div>
        <h3 className="mb-3 font-serif text-base font-semibold text-forest-deep">
          Wellbeing early-warning signals
        </h3>
        <div className="grid gap-4 lg:grid-cols-3">
          {warnings.map((w) => (
            <EarlyWarningCard key={w.id} warning={w} />
          ))}
        </div>
      </div>
    </div>
  )
}
