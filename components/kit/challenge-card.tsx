import Link from 'next/link'
import { CheckCircle2, Clock, MapPin, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Challenge } from '@/lib/types'
import { Badge, SeverityBadge, StatusBadge } from './primitives'

export function agingLevel(days: number): { label: string; tone: string } {
  if (days === 0) return { label: 'Resolved', tone: 'bg-primary/12 text-primary' }
  if (days <= 15) return { label: 'Recently reported', tone: 'bg-accent text-accent-foreground' }
  if (days <= 35) return { label: 'Aging', tone: 'bg-gold/25 text-[oklch(0.42_0.09_65)]' }
  if (days <= 50) return { label: 'Attention required', tone: 'bg-secondary/18 text-secondary' }
  return { label: 'Critical aging', tone: 'bg-destructive/15 text-destructive' }
}

export function ChallengeCard({ challenge, className }: { challenge: Challenge; className?: string }) {
  const aging = agingLevel(challenge.daysUnresolved)
  return (
    <Link
      href={`/challenges/${challenge.id}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-border bg-card p-5 card-shadow transition-all hover:-translate-y-0.5 hover:border-secondary/40',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge tone="forest">{challenge.domain}</Badge>
        <StatusBadge status={challenge.status} />
      </div>

      <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-forest-deep group-hover:text-secondary">
        {challenge.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" /> {challenge.locality}, {challenge.district}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" /> {challenge.affectedPeople.toLocaleString('en-IN')} affected
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-foreground/70">{challenge.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {challenge.aiTags.slice(0, 3).map((t) => (
          <span key={t} className="rounded-md bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
            <span className="font-serif text-sm font-bold text-primary">{challenge.impactScore}</span>
          </div>
          <div className="text-[0.7rem] leading-tight text-muted-foreground">
            Impact
            <br />
            Score
          </div>
        </div>
        <div className="flex flex-col items-end justify-center gap-1">
          <SeverityBadge severity={challenge.severity} />
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold', aging.tone)}>
            <Clock className="size-3" />
            {challenge.daysUnresolved === 0 ? 'Resolved' : `${challenge.daysUnresolved} days`}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="size-3.5 text-primary" />
          {challenge.verifiedCitizens} verified
        </span>
        <span>{challenge.supportingReports} supporting reports</span>
      </div>
    </Link>
  )
}
