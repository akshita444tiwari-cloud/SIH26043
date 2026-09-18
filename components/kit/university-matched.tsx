'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, CheckCircle2, MapPin, Users2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Challenge } from '@/lib/types'
import {
  acceptChallenge,
  createTeam,
  useAcceptedChallenges,
  useTeams,
  type TeamMember,
} from '@/lib/client-store'
import { toast } from '@/components/kit/toast'
import { Modal } from '@/components/kit/modal'
import { Card, Badge, SeverityBadge } from './primitives'
import { DashSection } from '@/components/dashboard/dashboard-shell'

const STUDENTS: TeamMember[] = [
  { name: 'Aarav Sharma', department: 'Computer Science', skills: ['AI/ML', 'Data Science'], year: '3rd Year', availability: 'Available' },
  { name: 'Priya Singh', department: 'Geoinformatics', skills: ['GIS', 'Remote Sensing'], year: '4th Year', availability: 'Available' },
  { name: 'Rahul Kumar', department: 'Electronics', skills: ['IoT', 'Embedded'], year: '2nd Year', availability: 'Limited' },
  { name: 'Ananya Das', department: 'Design', skills: ['Frontend Development', 'UX'], year: '3rd Year', availability: 'Available' },
  { name: 'Vikram Oraon', department: 'Civil Engineering', skills: ['Structural Design', 'Surveying'], year: '4th Year', availability: 'Available' },
  { name: 'Neha Kujur', department: 'Environmental Eng.', skills: ['Water Analytics', 'GIS'], year: '3rd Year', availability: 'Available' },
  { name: 'Sohan Mahto', department: 'Electrical Eng.', skills: ['Energy Systems', 'IoT'], year: '2nd Year', availability: 'Limited' },
  { name: 'Ishita Roy', department: 'Data Science', skills: ['Data Science', 'Visualization'], year: '4th Year', availability: 'Available' },
]

const MENTORS = [
  { name: 'Dr. A. Mahato', expertise: 'Environmental Engineering · Water treatment & filtration' },
  { name: 'Prof. S. Kujur', expertise: 'Civil Engineering · Accessibility & structures' },
  { name: 'Dr. R. Prasad', expertise: 'Electrical & Instrumentation · Energy systems, IoT' },
  { name: 'Dr. M. Bhengra', expertise: 'Computer Science & AI · ML and data systems' },
]

export function UniversityMatched({ incoming }: { incoming: Challenge[] }) {
  const [acceptTarget, setAcceptTarget] = useState<Challenge | null>(null)
  const [teamTarget, setTeamTarget] = useState<Challenge | null>(null)
  const accepted = useAcceptedChallenges()
  const teams = useTeams()

  return (
    <>
      <DashSection
        id="matched"
        title="Matched Challenges"
        description="Challenges routed to your institution with explainable match scores."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {incoming.map((c) => {
            const isAccepted = accepted.includes(c.id)
            return (
              <Card key={c.id} className="flex flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {80 + (c.impactScore % 15)}% match
                  </span>
                  <SeverityBadge severity={c.severity} />
                </div>
                <h3 className="mt-3 line-clamp-2 font-serif text-base font-semibold text-forest-deep">{c.title}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {c.district} · {c.domain}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.aiTags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-accent px-2 py-0.5 text-[0.7rem] font-medium text-accent-foreground">
                      {t}
                    </span>
                  ))}
                </div>

                {isAccepted ? (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary/12 px-4 py-2 text-sm font-semibold text-primary">
                      <CheckCircle2 className="size-4" /> Accepted by University
                    </span>
                    <button
                      type="button"
                      onClick={() => setTeamTarget(c)}
                      className="rounded-full bg-forest-deep px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-forest"
                    >
                      Form Team
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAcceptTarget(c)}
                      className="flex-1 rounded-full bg-forest-deep px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-forest"
                    >
                      Accept Challenge
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeamTarget(c)}
                      className="flex-1 rounded-full border border-forest/40 px-4 py-2 text-sm font-semibold text-forest-deep transition-colors hover:bg-primary/10"
                    >
                      Form Team
                    </button>
                    <Link
                      href={`/challenges/${c.id}`}
                      className="rounded-full border border-border p-2 text-forest-deep transition-colors hover:bg-muted"
                      aria-label="View challenge"
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </DashSection>

      {teams.length > 0 && (
        <DashSection id="formed-teams" title="Teams You Formed" description="Multidisciplinary teams created for accepted challenges.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((t) => (
              <Card key={t.id} className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-semibold text-forest-deep">{t.name}</h3>
                    {t.challengeTitle && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{t.challengeTitle}</p>}
                  </div>
                  <Badge tone="forest" className="shrink-0">
                    {t.members.length} members
                  </Badge>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {t.members.map((m) => (
                    <li key={m.name} className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-forest-deep">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.skills[0]}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users2 className="size-3.5" /> Mentor: {t.mentor}
                  </span>
                </p>
              </Card>
            ))}
          </div>
        </DashSection>
      )}

      <AcceptChallengeModal challenge={acceptTarget} onClose={() => setAcceptTarget(null)} onForm={(c) => setTeamTarget(c)} />
      <FormTeamModal challenge={teamTarget} onClose={() => setTeamTarget(null)} />
    </>
  )
}

function AcceptChallengeModal({
  challenge,
  onClose,
  onForm,
}: {
  challenge: Challenge | null
  onClose: () => void
  onForm: (c: Challenge) => void
}) {
  const handleConfirm = () => {
    if (!challenge) return
    acceptChallenge(challenge.id)
    toast('Challenge Accepted', `${challenge.title} is now an academic project.`)
    onClose()
  }

  return (
    <Modal
      open={!!challenge}
      onClose={onClose}
      title="Accept this societal challenge?"
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
              Confirm &amp; Accept
            </button>
          </div>
        )
      }
    >
      {challenge && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Impact Score', value: String(challenge.impactScore) },
              { label: 'Affected Population', value: challenge.affectedPeople.toLocaleString('en-IN') },
              { label: 'Domain', value: challenge.domain },
              { label: 'Location', value: `${challenge.locality}, ${challenge.district}` },
              { label: 'Community Verification', value: `${challenge.verifiedCitizens} citizens` },
              { label: 'AI University Match', value: `${80 + (challenge.impactScore % 15)}%` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/50 p-3">
                <div className="text-[0.7rem] text-muted-foreground">{s.label}</div>
                <div className="text-sm font-semibold text-forest-deep">{s.value}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Accepting this challenge assigns it to your institution as an academic project. You can then form a
            multidisciplinary student team and begin work with the community and district administration.
          </p>
          <button
            type="button"
            onClick={() => {
              onForm(challenge)
              onClose()
            }}
            className="text-sm font-semibold text-secondary hover:underline"
          >
            Or jump straight to forming a team →
          </button>
        </div>
      )}
    </Modal>
  )
}

function FormTeamModal({ challenge, onClose }: { challenge: Challenge | null; onClose: () => void }) {
  const [teamName, setTeamName] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [mentor, setMentor] = useState('')
  const [created, setCreated] = useState(false)

  const filtered = useMemo(
    () =>
      STUDENTS.filter(
        (s) =>
          !query ||
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.department.toLowerCase().includes(query.toLowerCase()) ||
          s.skills.some((k) => k.toLowerCase().includes(query.toLowerCase())),
      ),
    [query],
  )

  const toggle = (name: string) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))

  const mentorExpertise = MENTORS.find((m) => m.name === mentor)?.expertise
  const canCreate = teamName.trim().length > 1 && selected.length > 0 && !!mentor

  const reset = () => {
    setTeamName('')
    setQuery('')
    setSelected([])
    setMentor('')
    setCreated(false)
  }

  const handleClose = () => {
    onClose()
    setTimeout(reset, 200)
  }

  const handleCreate = () => {
    if (!canCreate) return
    const members = STUDENTS.filter((s) => selected.includes(s.name))
    createTeam({
      name: teamName,
      members,
      mentor,
      mentorExpertise,
      challengeId: challenge?.id,
      challengeTitle: challenge?.title,
    })
    setCreated(true)
    toast('Team Created Successfully', `${teamName} · ${members.length} members`)
  }

  return (
    <Modal
      open={!!challenge}
      onClose={handleClose}
      size="lg"
      title="Create Multidisciplinary Project Team"
      description={challenge?.title}
      footer={
        !created && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{selected.length} students selected</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-forest-deep transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!canCreate}
                className="rounded-full bg-forest-deep px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-forest disabled:opacity-40"
              >
                Create Team
              </button>
            </div>
          </div>
        )
      }
    >
      {created ? (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary/12 text-primary">
            <CheckCircle2 className="size-9" />
          </span>
          <h3 className="mt-4 font-serif text-xl font-bold text-forest-deep">Team Created Successfully</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            <span className="font-semibold text-forest-deep">{teamName}</span> is now attached to this project and
            visible under <span className="font-semibold text-forest-deep">Teams You Formed</span>.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-6 rounded-full bg-forest-deep px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-forest"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-forest-deep">Team name</span>
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Team JalRakshak"
              className={inputCls}
            />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-forest-deep">Select students</span>
              {selected.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {selected.join(', ')}
                </span>
              )}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, department, or skill…"
              className={cn(inputCls, 'mt-2')}
            />
            <div className="mt-2 grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {filtered.map((s) => {
                const isSel = selected.includes(s.name)
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => toggle(s.name)}
                    className={cn(
                      'flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors',
                      isSel ? 'border-secondary bg-secondary/10' : 'border-border hover:border-secondary/40',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid size-4 shrink-0 place-items-center rounded border',
                        isSel ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-muted-foreground/40',
                      )}
                    >
                      {isSel && <Check className="size-3" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-forest-deep">{s.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {s.department} · {s.year}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1">
                        {s.skills.map((k) => (
                          <span key={k} className="rounded bg-accent px-1.5 py-0.5 text-[0.65rem] font-medium text-accent-foreground">
                            {k}
                          </span>
                        ))}
                      </span>
                      <span
                        className={cn(
                          'mt-1 inline-block text-[0.65rem] font-medium',
                          s.availability === 'Available' ? 'text-primary' : 'text-gold',
                        )}
                      >
                        {s.availability}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-forest-deep">Faculty mentor</span>
            <select value={mentor} onChange={(e) => setMentor(e.target.value)} className={inputCls}>
              <option value="">Select mentor…</option>
              {MENTORS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            {mentorExpertise && <p className="mt-1.5 text-xs text-muted-foreground">{mentorExpertise}</p>}
          </label>
        </div>
      )}
    </Modal>
  )
}

const inputCls =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-secondary'
