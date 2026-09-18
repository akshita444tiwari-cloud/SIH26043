'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { Activity, Layers, MapPin, ShieldCheck, TrendingUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GIS_LAYERS, getStatFor, HEAT_STOPS, layerValue, normKey, type GisLayer } from '@/lib/gis'
import { challenges } from '@/lib/mock-data'
import { Card, SeverityBadge } from './primitives'

const GisMapInner = dynamic(() => import('./gis-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-sage/20">
      <span className="text-sm text-muted-foreground">Loading map…</span>
    </div>
  ),
})

export function JharkhandMap({
  className,
  defaultDistrict,
}: {
  className?: string
  defaultDistrict?: string
}) {
  const [layer, setLayer] = useState<GisLayer>('Overall Challenges')
  const [selectedName, setSelectedName] = useState<string | null>(defaultDistrict ?? null)

  const selected = selectedName ? getStatFor(selectedName) : null

  const districtChallenges = useMemo(() => {
    if (!selectedName) return []
    return challenges
      .filter((c) => normKey(c.district) === normKey(selectedName))
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 4)
  }, [selectedName])

  const communitySupport = useMemo(() => {
    if (!selectedName) return 0
    const sum = challenges
      .filter((c) => normKey(c.district) === normKey(selectedName))
      .reduce((n, c) => n + c.communitySupport, 0)
    return sum || (selected ? selected.verifiedReports * 14 : 0)
  }, [selectedName, selected])

  return (
    <div className={cn('grid gap-4 lg:grid-cols-[1fr_320px]', className)}>
      <Card className="relative overflow-hidden">
        {/* Layer / filter control */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 p-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest-deep">
            <Layers className="size-3.5" /> Map Layers
          </span>
          <div className="flex flex-wrap gap-1.5">
            {GIS_LAYERS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayer(l)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                  layer === l
                    ? 'border-transparent bg-forest-deep text-cream'
                    : 'border-border bg-card text-muted-foreground hover:border-secondary/40 hover:text-forest-deep',
                )}
                aria-pressed={layer === l}
              >
                <span
                  className={cn(
                    'size-2 rounded-full border',
                    layer === l ? 'border-cream bg-cream' : 'border-muted-foreground/50',
                  )}
                  aria-hidden
                />
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Map surface */}
        <div className="relative">
          <div className="h-[300px] w-full bg-sage/15 sm:h-[460px]">
            <GisMapInner
              layer={layer}
              selectedName={selectedName ?? undefined}
              onSelect={(name) => setSelectedName(name)}
            />
          </div>

          {/* Legend */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex items-center gap-2 rounded-lg border border-border bg-card/95 px-3 py-1.5 text-[0.65rem] text-muted-foreground backdrop-blur">
            <span>Low</span>
            <span className="flex h-2.5 w-28 overflow-hidden rounded-full">
              {HEAT_STOPS.map((s, i) => (
                <span key={i} className="flex-1" style={{ background: s.color }} />
              ))}
            </span>
            <span>High</span>
          </div>

          {/* Layer badge */}
          <div className="pointer-events-none absolute right-3 top-3 z-[500] rounded-lg border border-border bg-card/95 px-3 py-1.5 text-xs font-semibold text-forest-deep backdrop-blur">
            {layer}
          </div>
        </div>
      </Card>

      {/* Detail panel */}
      <Card className="flex flex-col p-4">
        {selected ? (
          <div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" />
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-bold text-forest-deep">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">District · Jharkhand</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedName(null)}
                className="grid size-7 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-forest-deep"
                aria-label="Close district details"
              >
                <X className="size-4" />
              </button>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'Active Challenges', value: selected.activeChallenges },
                { label: 'High Impact', value: selected.highPriority },
                { label: 'Aging Issues', value: selected.agingProblems },
                { label: 'Verified Reports', value: selected.verifiedReports },
                { label: 'Active Projects', value: selected.projectsActive },
                { label: 'Community Support', value: communitySupport.toLocaleString('en-IN') },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-muted/50 p-2.5">
                  <dt className="text-[0.7rem] text-muted-foreground">{s.label}</dt>
                  <dd className="font-serif text-xl font-bold text-forest-deep">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 grid gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Activity className="size-3.5 text-primary" /> {layer}: {layerValue(selected.name, layer)}/100
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" /> {selected.verifiedReports} community-verified reports
              </span>
              <span className="inline-flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-secondary" /> {selected.projectsActive} active collaborative projects
              </span>
            </div>

            {districtChallenges.length > 0 && (
              <div className="mt-4 border-t border-border pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Key challenges here
                </h4>
                <ul className="mt-2 space-y-2">
                  {districtChallenges.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`/challenges/${c.id}`}
                        className="block rounded-lg border border-border p-2.5 transition-colors hover:border-secondary/40 hover:bg-primary/5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="line-clamp-1 text-sm font-medium text-forest-deep">{c.title}</span>
                          <SeverityBadge severity={c.severity} className="shrink-0" />
                        </div>
                        <span className="text-[0.7rem] text-muted-foreground">
                          {c.domain} · Impact {c.impactScore}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="grid flex-1 place-items-center py-12 text-center">
            <div>
              <MapPin className="mx-auto size-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Select a district on the map to view its challenge profile.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
