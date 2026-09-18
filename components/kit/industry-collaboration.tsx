'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Boxes,
  Check,
  CheckCircle2,
  HandCoins,
  Handshake,
  MapPin,
  Sparkles,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Challenge } from '@/lib/types'
import { DOMAINS } from '@/lib/mock-data'
import {
  submitOffer,
  useOffers,
  type CollaborationOffer,
  type OfferStatus,
} from '@/lib/client-store'
import { toast } from '@/components/kit/toast'
import { Modal } from '@/components/kit/modal'
import { Card, Badge } from './primitives'
import { DashSection } from '@/components/dashboard/dashboard-shell'

const RESOURCE_OPTIONS = [
  'Funding',
  'Industry Mentor',
  'Technical Expertise',
  'Laboratory / Testing Facility',
  'Prototyping Support',
  'Manufacturing Support',
  'Cloud / Computing Resources',
  'Hardware / Equipment',
  'Software / Technology',
  'Data / Datasets',
  'Pilot Implementation',
  'Field Testing',
  'CSR Support',
  'Incubation Support',
  'Other',
]

interface ResourceProject {
  id: string
  title: string
  district: string
  domain: string
  needs: string[]
  match: number
}

const RESOURCE_PROJECTS: ResourceProject[] = [
  {
    id: 'CH-JH-2026-00482',
    title: 'Smart Rural Water Monitoring',
    district: 'Dumka',
    domain: 'Water',
    needs: ['₹8L Funding', 'IoT Hardware', 'Technical Mentor', 'Testing Facility'],
    match: 94,
  },
  {
    id: 'CH-JH-2026-00419',
    title: 'Clinic Cold-chain Solar Backup',
    district: 'Gumla',
    domain: 'Energy',
    needs: ['Solar Hardware', 'Installation Crew', 'Maintenance Training'],
    match: 89,
  },
  {
    id: 'CH-JH-2026-00448',
    title: 'Lift-Irrigation Revival for Paddy',
    district: 'Palamu',
    domain: 'Agriculture',
    needs: ['₹12L Funding', 'Pump Sensors', 'Field Testing', 'Domain Mentor'],
    match: 86,
  },
]

const SEED_OFFERS: CollaborationOffer[] = [
  {
    id: 'COLLAB-JH-2026-016',
    resources: ['Funding', 'IoT Hardware'],
    description: 'Pilot funding and sensor hardware for rural water monitoring.',
    capacity: '20 sensor nodes',
    domain: 'Water',
    duration: '6 months',
    location: 'Dumka',
    contact: 'R. Verma',
    fundingRange: '₹8L',
    projectTitle: 'Smart Rural Water Monitoring',
    status: 'Active',
    createdAt: '',
  },
  {
    id: 'COLLAB-JH-2026-017',
    resources: ['Industry Mentor', 'Cloud / Computing Resources'],
    description: 'Domain mentorship and cloud credits for the analytics dashboard.',
    capacity: '2 mentors, ₹1L cloud credits',
    domain: 'Healthcare',
    duration: '4 months',
    location: 'Sahibganj',
    contact: 'S. Nag',
    mentorExpertise: 'Health data systems',
    projectTitle: 'Maternal Care Last-mile',
    status: 'Matched',
    createdAt: '',
  },
]

const STATUS_TABS: (OfferStatus | 'All')[] = ['All', 'Pending', 'Matched', 'Accepted', 'Active', 'Completed']

const statusTone: Record<OfferStatus, 'neutral' | 'gold' | 'forest' | 'terracotta'> = {
  Pending: 'gold',
  Matched: 'terracotta',
  Accepted: 'forest',
  Active: 'forest',
  Completed: 'neutral',
}

export function IndustryHub({ opportunities }: { opportunities: Challenge[] }) {
  const [offerOpen, setOfferOpen] = useState(false)
  const [presetDomain, setPresetDomain] = useState<string | undefined>()
  const [presetProject, setPresetProject] = useState<string | undefined>()
  const [viewProject, setViewProject] = useState<ResourceProject | null>(null)
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'All'>('All')

  const liveOffers = useOffers()
  const allOffers = useMemo(() => [...liveOffers, ...SEED_OFFERS], [liveOffers])
  const visibleOffers =
    statusFilter === 'All' ? allOffers : allOffers.filter((o) => o.status === statusFilter)

  const openOffer = (domain?: string, project?: string) => {
    setPresetDomain(domain)
    setPresetProject(project)
    setOfferOpen(true)
  }

  return (
    <>
      {/* CSR-aligned opportunities */}
      <DashSection
        id="opportunities"
        title="CSR-Aligned Opportunities"
        description="Verified challenges where your resources and expertise create measurable impact."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {opportunities.map((c) => (
            <Card key={c.id} className="flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <Badge tone="terracotta">{c.domain}</Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/12 px-2.5 py-1 text-xs font-bold text-secondary">
                  {78 + (c.impactScore % 18)}% fit
                </span>
              </div>
              <h3 className="mt-3 line-clamp-2 font-serif text-base font-semibold text-forest-deep">{c.title}</h3>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {c.district} · {c.affectedPeople.toLocaleString('en-IN')} people affected
              </p>
              <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  Suggested contribution
                </span>
                <p className="mt-0.5 text-foreground/80">Pilot funding, IoT hardware, or domain mentorship</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openOffer(c.domain, c.title)}
                  className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick"
                >
                  Offer collaboration
                </button>
                <Link
                  href={`/challenges/${c.id}`}
                  className="rounded-full border border-border p-2 text-forest-deep transition-colors hover:bg-muted"
                  aria-label="View challenge"
                >
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </DashSection>

      {/* Projects that need your resources */}
      <DashSection
        id="resource-matching"
        title="Projects That Need Your Resources"
        description="AI-matched projects whose resource gaps align with what your organization can provide."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {RESOURCE_PROJECTS.map((p) => (
            <Card key={p.id} className="flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <Badge tone="forest">{p.domain}</Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  <Sparkles className="size-3.5" /> {p.match}% match
                </span>
              </div>
              <h3 className="mt-3 font-serif text-base font-semibold text-forest-deep">{p.title}</h3>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {p.district}
              </p>
              <div className="mt-3">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Needs</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.needs.map((n) => (
                    <span key={n} className="rounded-md bg-accent px-2 py-0.5 text-[0.7rem] font-medium text-accent-foreground">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewProject(p)}
                  className="flex-1 rounded-full border border-forest/40 px-4 py-2 text-sm font-semibold text-forest-deep transition-colors hover:bg-primary/10"
                >
                  View Project
                </button>
                <button
                  type="button"
                  onClick={() => openOffer(p.domain, p.title)}
                  className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick"
                >
                  Offer Collaboration
                </button>
              </div>
            </Card>
          ))}
        </div>
      </DashSection>

      {/* My collaboration offers */}
      <DashSection
        id="my-offers"
        title="My Collaboration Offers"
        description="Track every resource offer from submission through to active collaboration."
        action={
          <button
            type="button"
            onClick={() => openOffer()}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest-deep px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-forest"
          >
            <HandCoins className="size-4" /> New Offer
          </button>
        }
      >
        <div className="mb-4 flex flex-wrap gap-1.5">
          {STATUS_TABS.map((s) => {
            const count = s === 'All' ? allOffers.length : allOffers.filter((o) => o.status === s).length
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  statusFilter === s
                    ? 'border-transparent bg-forest-deep text-cream'
                    : 'border-border bg-card text-muted-foreground hover:text-forest-deep',
                )}
              >
                {s} <span className="opacity-70">({count})</span>
              </button>
            )
          })}
        </div>

        {visibleOffers.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No offers in this stage yet. Submit a collaboration offer to get started.
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleOffers.map((o) => (
              <Card key={o.id} className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Badge tone={statusTone[o.status]}>{o.status}</Badge>
                    <h4 className="mt-2 font-serif text-base font-semibold text-forest-deep">
                      {o.projectTitle || o.domain + ' collaboration'}
                    </h4>
                  </div>
                  <Badge tone="outline" className="shrink-0 font-mono text-[0.65rem]">
                    {o.id}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {o.resources.slice(0, 4).map((r) => (
                    <span key={r} className="rounded-md bg-muted px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
                      {r}
                    </span>
                  ))}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{o.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-muted-foreground">
                  {o.capacity && <span>Capacity: {o.capacity}</span>}
                  {o.duration && <span>Duration: {o.duration}</span>}
                  {o.location && <span>Location: {o.location}</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </DashSection>

      {/* Modals */}
      <OfferCollaborationModal
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        presetDomain={presetDomain}
        presetProject={presetProject}
      />
      <ViewProjectModal project={viewProject} onClose={() => setViewProject(null)} onOffer={openOffer} />
    </>
  )
}

function ViewProjectModal({
  project,
  onClose,
  onOffer,
}: {
  project: ResourceProject | null
  onClose: () => void
  onOffer: (domain?: string, project?: string) => void
}) {
  return (
    <Modal
      open={!!project}
      onClose={onClose}
      title={project?.title ?? ''}
      description={project ? `${project.district} · ${project.domain}` : ''}
      footer={
        project && (
          <div className="flex justify-end gap-2">
            <Link
              href={`/challenges/${project.id}`}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-forest-deep transition-colors hover:bg-muted"
            >
              Open full challenge
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose()
                onOffer(project.domain, project.title)
              }}
              className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick"
            >
              Offer Collaboration
            </button>
          </div>
        )
      }
    >
      {project && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" /> {project.match}% AI resource match
            </span>
            <Badge tone="outline" className="font-mono text-[0.65rem]">
              {project.id}
            </Badge>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-forest-deep">Resource gaps</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.needs.map((n) => (
                <span key={n} className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: HandCoins, label: 'Stage', value: 'Pilot' },
              { icon: Target, label: 'Match', value: `${project.match}%` },
              { icon: Handshake, label: 'Partners', value: 'Seeking' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/50 p-3">
                <s.icon className="size-4 text-secondary" />
                <div className="mt-1 text-[0.7rem] text-muted-foreground">{s.label}</div>
                <div className="text-sm font-semibold text-forest-deep">{s.value}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            This project has been verified by the community and prioritized for collaboration. Offering resources
            connects your organization directly with the university team and district administration driving it.
          </p>
        </div>
      )}
    </Modal>
  )
}

function OfferCollaborationModal({
  open,
  onClose,
  presetDomain,
  presetProject,
}: {
  open: boolean
  onClose: () => void
  presetDomain?: string
  presetProject?: string
}) {
  const [resources, setResources] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [capacity, setCapacity] = useState('')
  const [domain, setDomain] = useState(presetDomain ?? 'Any')
  const [duration, setDuration] = useState('')
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')
  const [notes, setNotes] = useState('')
  const [fundingRange, setFundingRange] = useState('')
  const [mentorExpertise, setMentorExpertise] = useState('')
  const [labCapability, setLabCapability] = useState('')
  const [equipmentDetails, setEquipmentDetails] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)

  // keep preset domain in sync when opening from a specific card
  useEffect(() => {
    if (open && presetDomain) setDomain(presetDomain)
  }, [open, presetDomain])

  const toggle = (r: string) =>
    setResources((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]))

  const has = (r: string) => resources.includes(r)
  const canSubmit = resources.length > 0 && description.trim().length > 4 && contact.trim().length > 1

  const reset = () => {
    setResources([])
    setDescription('')
    setCapacity('')
    setDomain(presetDomain ?? 'Any')
    setDuration('')
    setLocation('')
    setContact('')
    setNotes('')
    setFundingRange('')
    setMentorExpertise('')
    setLabCapability('')
    setEquipmentDetails('')
    setSubmitted(null)
  }

  const handleClose = () => {
    onClose()
    setTimeout(reset, 200)
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    const offer = submitOffer({
      resources,
      description,
      capacity,
      domain,
      duration,
      location,
      contact,
      notes,
      fundingRange: has('Funding') ? fundingRange : undefined,
      mentorExpertise: has('Industry Mentor') ? mentorExpertise : undefined,
      labCapability: has('Laboratory / Testing Facility') ? labCapability : undefined,
      equipmentDetails: has('Hardware / Equipment') ? equipmentDetails : undefined,
      projectTitle: presetProject,
    })
    setSubmitted(offer.id)
    toast('Collaboration Offer Submitted', `Reference ${offer.id}`)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title="Offer Industry Collaboration"
      description={
        presetProject ? `Contributing to: ${presetProject}` : 'Choose what your organization can provide.'
      }
      footer={
        !submitted && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {resources.length} resource{resources.length === 1 ? '' : 's'} selected
            </span>
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
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick disabled:opacity-40"
              >
                Submit Collaboration Offer
              </button>
            </div>
          </div>
        )
      }
    >
      {submitted ? (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary/12 text-primary">
            <CheckCircle2 className="size-9" />
          </span>
          <h3 className="mt-4 font-serif text-xl font-bold text-forest-deep">Collaboration Offer Submitted</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Your offer is now pending review and AI matching with prioritized projects. You can track it under{' '}
            <span className="font-semibold text-forest-deep">My Collaboration Offers</span>.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge tone="outline" className="font-mono text-sm">
              {submitted}
            </Badge>
            <Badge tone="gold">Pending</Badge>
          </div>
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
          <div>
            <span className="text-sm font-semibold text-forest-deep">What can you provide?</span>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {RESOURCE_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggle(r)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors',
                    has(r)
                      ? 'border-secondary bg-secondary/10 text-forest-deep'
                      : 'border-border text-muted-foreground hover:border-secondary/40',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-4 shrink-0 place-items-center rounded border',
                      has(r) ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-muted-foreground/40',
                    )}
                  >
                    {has(r) && <Check className="size-3" />}
                  </span>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional fields */}
          {has('Funding') && (
            <Field label="Funding amount / range">
              <input
                value={fundingRange}
                onChange={(e) => setFundingRange(e.target.value)}
                placeholder="e.g. ₹5L – ₹10L pilot funding"
                className={inputCls}
              />
            </Field>
          )}
          {has('Industry Mentor') && (
            <Field label="Mentor expertise">
              <input
                value={mentorExpertise}
                onChange={(e) => setMentorExpertise(e.target.value)}
                placeholder="e.g. IoT systems, water analytics"
                className={inputCls}
              />
            </Field>
          )}
          {has('Laboratory / Testing Facility') && (
            <Field label="Lab / testing capability">
              <input
                value={labCapability}
                onChange={(e) => setLabCapability(e.target.value)}
                placeholder="e.g. Water quality testing lab, NABL certified"
                className={inputCls}
              />
            </Field>
          )}
          {has('Hardware / Equipment') && (
            <Field label="Equipment details">
              <input
                value={equipmentDetails}
                onChange={(e) => setEquipmentDetails(e.target.value)}
                placeholder="e.g. 20 IoT sensor kits, gateways"
                className={inputCls}
              />
            </Field>
          )}

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what you are offering and how it helps…"
              className={cn(inputCls, 'resize-none')}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Available quantity / capacity">
              <input
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 20 units / 2 mentors"
                className={inputCls}
              />
            </Field>
            <Field label="Preferred project / domain">
              <select value={domain} onChange={(e) => setDomain(e.target.value)} className={inputCls}>
                <option value="Any">Any domain</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Duration">
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 6 months"
                className={inputCls}
              />
            </Field>
            <Field label="Location">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ranchi / Remote"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Contact person">
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Name & designation"
              className={inputCls}
            />
          </Field>

          <Field label="Additional requirements (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any conditions, expectations, or reporting needs…"
              className={cn(inputCls, 'resize-none')}
            />
          </Field>
        </div>
      )}
    </Modal>
  )
}

const inputCls =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-secondary'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-forest-deep">{label}</span>
      {children}
    </label>
  )
}
