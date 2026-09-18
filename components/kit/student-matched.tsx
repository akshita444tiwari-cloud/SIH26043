'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, MapPin, Sparkles } from 'lucide-react'
import type { StudentMatch } from '@/lib/types'
import { joinChallenge, useJoinedChallenges } from '@/lib/client-store'
import { toast } from '@/components/kit/toast'
import { Modal } from '@/components/kit/modal'
import { Card, SeverityBadge } from './primitives'
import { DashSection } from '@/components/dashboard/dashboard-shell'

export function StudentMatched({ matches }: { matches: StudentMatch[] }) {
  const [joinTarget, setJoinTarget] = useState<StudentMatch | null>(null)
  const joined = useJoinedChallenges()

  return (
    <>
      <DashSection
        id="matches"
        title="AI-Matched Challenges"
        description="Ranked by fit with your skills, coursework, and interests — with transparent reasons."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {matches.map((m) => {
            const isJoined = joined.includes(m.id)
            return (
              <Card key={m.id} className="flex flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    <Sparkles className="size-3.5" /> {m.matchPercent}% match
                  </span>
                  <SeverityBadge severity={m.severity} />
                </div>
                <h3 className="mt-3 line-clamp-2 font-serif text-base font-semibold text-forest-deep">{m.title}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {m.district} · {m.domain}
                </p>
                <div className="mt-3 space-y-1.5">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    Why you match
                  </span>
                  <ul className="grid gap-1">
                    {m.matchReasons.slice(0, 3).map((r) => (
                      <li key={r} className="flex items-start gap-1.5 text-xs text-foreground/75">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {isJoined ? (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary/12 px-4 py-2 text-sm font-semibold text-primary">
                      <CheckCircle2 className="size-4" /> Joined
                    </span>
                    <Link
                      href={`/challenges/${m.id}`}
                      className="rounded-full border border-border p-2 text-forest-deep transition-colors hover:bg-muted"
                      aria-label="View challenge"
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setJoinTarget(m)}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-forest-deep px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-forest"
                  >
                    Join this challenge <ArrowUpRight className="size-4" />
                  </button>
                )}
              </Card>
            )
          })}
        </div>
      </DashSection>

      {joined.length > 0 && (
        <DashSection
          id="joined"
          title="Challenges You Joined"
          description="You’ll be notified when a faculty mentor forms a team and work begins."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches
              .filter((m) => joined.includes(m.id))
              .map((m) => (
                <Card key={m.id} className="flex flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-bold text-primary">
                      <CheckCircle2 className="size-3.5" /> Joined
                    </span>
                    <SeverityBadge severity={m.severity} />
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-serif text-base font-semibold text-forest-deep">{m.title}</h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {m.district} · {m.domain}
                  </p>
                  <Link
                    href={`/challenges/${m.id}`}
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-secondary hover:underline"
                  >
                    View challenge <ArrowUpRight className="size-4" />
                  </Link>
                </Card>
              ))}
          </div>
        </DashSection>
      )}

      <JoinChallengeModal challenge={joinTarget} onClose={() => setJoinTarget(null)} />
    </>
  )
}

function JoinChallengeModal({ challenge, onClose }: { challenge: StudentMatch | null; onClose: () => void }) {
  const handleConfirm = () => {
    if (!challenge) return
    joinChallenge(challenge.id)
    toast('Joined Challenge', `You’re now part of ${challenge.title}.`)
    onClose()
  }

  return (
    <Modal
      open={!!challenge}
      onClose={onClose}
      title="Join this challenge?"
      description={challenge?.title}
      footer={
        challenge && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-forest-deep transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-full bg-forest-deep px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-forest"
            >
              Confirm &amp; Join
            </button>
          </div>
        )
      }
    >
      {challenge && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Match Score', value: `${challenge.matchPercent}%` },
              { label: 'Impact Score', value: String(challenge.impactScore) },
              { label: 'Domain', value: challenge.domain },
              { label: 'Location', value: `${challenge.locality}, ${challenge.district}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/50 p-3">
                <div className="text-[0.7rem] text-muted-foreground">{s.label}</div>
                <div className="text-sm font-semibold text-forest-deep">{s.value}</div>
              </div>
            ))}
          </div>
          <div>
            <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
              Why you match
            </span>
            <ul className="mt-2 grid gap-1">
              {challenge.matchReasons.map((r) => (
                <li key={r} className="flex items-start gap-1.5 text-sm text-foreground/75">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Joining registers your interest with your faculty. When a mentor forms a team for this challenge, you’ll be
            included and notified to begin work with the community.
          </p>
        </div>
      )}
    </Modal>
  )
}
