import { cn } from '@/lib/utils'

/** Horizontal bar list — used for domain distribution and rankings. */
export function BarList({
  data,
  className,
  suffix = '%',
}: {
  data: { label: string; value: number; hint?: string }[]
  className?: string
  suffix?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className={cn('grid gap-3', className)}>
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-foreground/80">{d.label}</span>
            <span className="font-semibold text-forest-deep">
              {d.value}
              {suffix}
              {d.hint && <span className="ml-1 font-normal text-muted-foreground">{d.hint}</span>}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-secondary transition-all"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Funnel / pipeline visualization from wide to narrow. */
export function Funnel({
  data,
  className,
}: {
  data: { stage: string; value: number }[]
  className?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className={cn('grid gap-2', className)}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100
        const shade = 0.32 + (i / Math.max(data.length - 1, 1)) * 0.12
        return (
          <div key={d.stage} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-right text-xs font-medium text-muted-foreground">{d.stage}</span>
            <div className="flex-1">
              <div
                className="flex h-9 items-center justify-end rounded-lg px-3 text-sm font-semibold text-cream transition-all"
                style={{ width: `${Math.max(pct, 12)}%`, background: `oklch(${shade} 0.06 150)` }}
              >
                {d.value.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Dual-line trend chart (reported vs resolved) rendered as an SVG. */
export function TrendChart({
  data,
  className,
}: {
  data: { month: string; reported: number; resolved: number }[]
  className?: string
}) {
  const w = 560
  const h = 220
  const pad = { top: 16, right: 16, bottom: 28, left: 36 }
  const innerW = w - pad.left - pad.right
  const innerH = h - pad.top - pad.bottom
  const max = Math.max(...data.map((d) => Math.max(d.reported, d.resolved))) * 1.1
  const x = (i: number) => pad.left + (i / Math.max(data.length - 1, 1)) * innerW
  const y = (v: number) => pad.top + innerH - (v / max) * innerH
  const line = (key: 'reported' | 'resolved') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ')
  const area = (key: 'reported' | 'resolved') =>
    `${line(key)} L${x(data.length - 1).toFixed(1)},${(pad.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(
      pad.top + innerH
    ).toFixed(1)} Z`

  return (
    <div className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Reported vs resolved challenges trend">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const gy = pad.top + innerH - t * innerH
          return (
            <g key={t}>
              <line x1={pad.left} y1={gy} x2={w - pad.right} y2={gy} stroke="var(--border)" strokeWidth="1" />
              <text x={pad.left - 6} y={gy + 3} textAnchor="end" className="fill-muted-foreground" style={{ fontSize: 9 }}>
                {Math.round(t * max)}
              </text>
            </g>
          )
        })}
        <path d={area('reported')} fill="var(--secondary)" fillOpacity={0.08} />
        <path d={area('resolved')} fill="var(--primary)" fillOpacity={0.1} />
        <path d={line('reported')} fill="none" stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={line('resolved')} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={d.month}>
            <circle cx={x(i)} cy={y(d.reported)} r="3" fill="var(--secondary)" />
            <circle cx={x(i)} cy={y(d.resolved)} r="3" fill="var(--primary)" />
            <text x={x(i)} y={h - 8} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>
              {d.month}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-center gap-5 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-secondary" /> Reported
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" /> Resolved
        </span>
      </div>
    </div>
  )
}

/** Simple donut chart with a legend. */
export function DonutChart({
  data,
  className,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number }[]
  className?: string
  centerLabel?: string
  centerValue?: string
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const colors = [
    'oklch(0.5 0.13 150)',
    'oklch(0.55 0.14 45)',
    'oklch(0.7 0.12 75)',
    'oklch(0.62 0.08 200)',
    'oklch(0.6 0.12 20)',
    'oklch(0.68 0.1 300)',
    'oklch(0.72 0.09 130)',
    'oklch(0.58 0.06 260)',
  ]
  const r = 42
  const c = 2 * Math.PI * r
  let acc = 0
  return (
    <div className={cn('flex flex-col items-center gap-5 sm:flex-row sm:items-center', className)}>
      <div className="relative grid shrink-0 place-items-center" style={{ width: 160, height: 160 }}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="12" />
          {data.map((d, i) => {
            const frac = d.value / total
            const dash = frac * c
            const seg = (
              <circle
                key={d.label}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth="12"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-acc * c}
              />
            )
            acc += frac
            return seg
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute flex flex-col items-center">
            {centerValue && <span className="font-serif text-2xl font-bold text-forest-deep">{centerValue}</span>}
            {centerLabel && (
              <span className="text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>
      <ul className="grid flex-1 gap-1.5">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-foreground/80">
              <span className="size-2.5 rounded-sm" style={{ background: colors[i % colors.length] }} />
              {d.label}
            </span>
            <span className="font-semibold text-forest-deep">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
