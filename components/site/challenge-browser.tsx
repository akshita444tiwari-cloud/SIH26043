'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { Challenge, Domain } from '@/lib/types'
import { DISTRICTS, DOMAINS } from '@/lib/mock-data'
import { ChallengeCard } from '@/components/kit/challenge-card'
import { cn } from '@/lib/utils'

type Sort = 'impact' | 'aging' | 'support' | 'recent'

export function ChallengeBrowser({ challenges }: { challenges: Challenge[] }) {
  const [q, setQ] = useState('')
  const [domain, setDomain] = useState<Domain | 'All'>('All')
  const [district, setDistrict] = useState<string>('All')
  const [status, setStatus] = useState<string>('All')
  const [sort, setSort] = useState<Sort>('impact')

  const filtered = useMemo(() => {
    let list = challenges.filter((c) => {
      const matchesQ =
        !q ||
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.description.toLowerCase().includes(q.toLowerCase()) ||
        c.aiTags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
      const matchesDomain = domain === 'All' || c.domain === domain
      const matchesDistrict = district === 'All' || c.district === district
      const matchesStatus = status === 'All' || c.status === status
      return matchesQ && matchesDomain && matchesDistrict && matchesStatus
    })
    list = [...list].sort((a, b) => {
      if (sort === 'impact') return b.impactScore - a.impactScore
      if (sort === 'aging') return b.daysUnresolved - a.daysUnresolved
      if (sort === 'support') return b.communitySupport - a.communitySupport
      return 0
    })
    return list
  }, [challenges, q, domain, district, status, sort])

  const statuses = ['All', 'Submitted', 'Under Verification', 'Verified', 'Matched', 'In Progress', 'Resolved']

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-4 card-shadow">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search challenges by title, description, or tag…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <Select label="Domain" value={domain} onChange={(v) => setDomain(v as Domain | 'All')} options={['All', ...DOMAINS]} />
          <Select label="District" value={district} onChange={setDistrict} options={['All', ...DISTRICTS]} />
          <Select label="Status" value={status} onChange={setStatus} options={statuses} />
          <Select label="Sort by" value={sort} onChange={(v) => setSort(v as Sort)} options={['impact', 'aging', 'support', 'recent']} labels={{ impact: 'Highest impact', aging: 'Most aging', support: 'Most support', recent: 'Most recent' }} />
        </div>

        {/* domain quick chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <SlidersHorizontal className="size-3.5" /> Quick filter:
          </span>
          {(['All', 'Water', 'Healthcare', 'Education', 'Agriculture', 'Accessibility'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomain(d as Domain | 'All')}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                domain === d ? 'bg-forest-deep text-cream' : 'bg-muted text-muted-foreground hover:text-forest-deep',
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-forest-deep">{filtered.length}</span> of {challenges.length} challenges
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No challenges match your filters. Try broadening your search.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      )}
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  labels?: Record<string, string>
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-secondary"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labels?.[o] ?? o}
          </option>
        ))}
      </select>
    </label>
  )
}
