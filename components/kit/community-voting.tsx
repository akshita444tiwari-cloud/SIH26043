'use client'

import { Check, MapPin, ThumbsUp } from 'lucide-react'
import type { Challenge } from '@/lib/types'
import { castVote, useVote, useVoteBoost } from '@/lib/client-store'
import { toast } from '@/components/kit/toast'
import { Card, Progress } from './primitives'

export function CommunityVoting({ challenges }: { challenges: Challenge[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {challenges.map((c) => (
        <VoteCard key={c.id} challenge={c} />
      ))}
    </div>
  )
}

function VoteCard({ challenge: c }: { challenge: Challenge }) {
  const vote = useVote(c.id)
  const boost = useVoteBoost(c.id)
  const voted = !!vote

  const total = c.communitySupport + boost
  const pct = Math.min(100, Math.round((total / 400) * 100))

  const handleVote = () => {
    if (voted) return
    castVote(c.id, 'experience')
    toast('Vote counted', `You helped prioritize “${c.title}”.`)
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="line-clamp-1 font-serif text-base font-semibold text-forest-deep">{c.title}</h4>
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> {c.district} · {c.domain}
          </p>
        </div>
        <button
          type="button"
          onClick={handleVote}
          disabled={voted}
          aria-pressed={voted}
          className={
            voted
              ? 'inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 text-sm font-semibold text-primary'
              : 'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-forest/40 px-3 py-1.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-primary/10'
          }
        >
          {voted ? (
            <>
              <Check className="size-4" /> Voted
            </>
          ) : (
            <>
              <ThumbsUp className="size-4" /> Vote
            </>
          )}
        </button>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Community support</span>
          <span className="font-semibold text-forest-deep">{total} votes</span>
        </div>
        <Progress value={pct} barClassName="bg-secondary" />
      </div>
    </Card>
  )
}
