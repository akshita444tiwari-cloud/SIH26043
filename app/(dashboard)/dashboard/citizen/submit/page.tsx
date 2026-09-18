'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  ImagePlus,
  MapPin,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Severity } from '@/lib/types'
import { predictCategory, estimateImpactScore } from '@/lib/services'
import { DISTRICTS } from '@/lib/mock-data'
import { Card, Badge, Progress, SeverityBadge } from '@/components/kit/primitives'
import { AiLabel } from '@/components/kit/section-heading'
import { ImpactRing } from '@/components/kit/impact-score'

const SEVERITIES: Severity[] = ['Low', 'Medium', 'High', 'Critical']
const STEPS = ['Describe', 'Location & Impact', 'AI Review', 'Submitted']

export default function SubmitChallengePage() {
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [district, setDistrict] = useState(DISTRICTS[0])
  const [locality, setLocality] = useState('')
  const [severity, setSeverity] = useState<Severity>('High')
  const [affected, setAffected] = useState(500)
  const [photos, setPhotos] = useState<{ id: string; url: string; name: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addPhotos = (files: FileList | null) => {
    if (!files) return
    const next = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ id: `${f.name}-${f.size}-${crypto.randomUUID()}`, url: URL.createObjectURL(f), name: f.name }))
    if (next.length) setPhotos((prev) => [...prev, ...next])
  }

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((p) => p.id !== id)
    })
  }

  const prediction = useMemo(() => {
    const text = `${title} ${description}`.trim()
    if (text.length < 4) return null
    return predictCategory(text)
  }, [title, description])

  const estimatedScore = useMemo(() => estimateImpactScore(affected, severity), [affected, severity])

  const canContinue = step === 0 ? title.length > 4 && description.length > 12 : step === 1 ? locality.length > 1 : true

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/citizen"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-forest-deep"
        >
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
        <h1 className="mt-3 font-serif text-2xl font-bold text-forest-deep">Report a Community Problem</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Our AI assists with categorization, deduplication, and impact scoring as you type.
        </p>
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold',
                i < step && 'border-primary bg-primary text-primary-foreground',
                i === step && 'border-secondary bg-secondary/15 text-secondary',
                i > step && 'border-border bg-card text-muted-foreground',
              )}
            >
              {i < step ? <CheckCircle2 className="size-4" /> : i + 1}
            </span>
            <span className={cn('hidden text-xs font-medium sm:inline', i === step ? 'text-forest-deep' : 'text-muted-foreground')}>
              {s}
            </span>
            {i < STEPS.length - 1 && <span className={cn('h-0.5 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-border')} />}
          </li>
        ))}
      </ol>

      {/* Step 0 — describe */}
      {step === 0 && (
        <Card className="space-y-5 p-6">
          <div>
            <label htmlFor="title" className="text-sm font-semibold text-forest-deep">
              Problem title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Contaminated drinking water from community handpump"
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-secondary"
            />
          </div>
          <div>
            <label htmlFor="desc" className="text-sm font-semibold text-forest-deep">
              Describe the problem
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Explain what’s happening, who is affected, and how long it has persisted…"
              className="mt-1.5 w-full resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-secondary"
            />
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                addPhotos(e.target.files)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-secondary/40 hover:text-forest-deep"
            >
              <ImagePlus className="size-4.5" />
              {photos.length ? 'Add more photos or evidence' : 'Add photos or evidence (optional)'}
            </button>

            {photos.length > 0 && (
              <>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {photos.map((p) => (
                    <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url || '/placeholder.svg'} alt={p.name} className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-forest-deep/70 text-cream backdrop-blur transition-colors hover:bg-secondary"
                        aria-label={`Remove ${p.name}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  <CheckCircle2 className="size-3.5" /> {photos.length} evidence photo{photos.length > 1 ? 's' : ''} attached
                </p>
              </>
            )}
          </div>

          {prediction && (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
              <AiLabel>
                <Cpu className="size-3" /> Live AI Categorization
              </AiLabel>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-foreground/75">Detected domain:</span>
                <Badge tone="forest">{prediction.domain}</Badge>
                <span className="text-xs text-muted-foreground">{prediction.confidence}% confidence</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {prediction.tags.map((t) => (
                  <span key={t} className="rounded-md bg-accent px-2 py-0.5 text-[0.7rem] font-medium text-accent-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Step 1 — location & impact */}
      {step === 1 && (
        <Card className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="district" className="text-sm font-semibold text-forest-deep">
                District
              </label>
              <div className="relative mt-1.5">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-secondary"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="locality" className="text-sm font-semibold text-forest-deep">
                Locality / Block
              </label>
              <input
                id="locality"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Kathikund Block"
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-secondary"
              />
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-forest-deep">Severity</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={cn('rounded-full border px-3 py-1.5 transition-colors', severity === s ? 'border-secondary bg-secondary/10' : 'border-border hover:bg-muted')}
                >
                  <SeverityBadge severity={s} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="affected" className="flex items-center justify-between text-sm font-semibold text-forest-deep">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" /> Estimated people affected
              </span>
              <span className="font-serif text-lg text-secondary">{affected.toLocaleString('en-IN')}</span>
            </label>
            <input
              id="affected"
              type="range"
              min={50}
              max={50000}
              step={50}
              value={affected}
              onChange={(e) => setAffected(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--secondary)]"
            />
          </div>
        </Card>
      )}

      {/* Step 2 — AI review */}
      {step === 2 && (
        <Card className="p-6">
          <AiLabel>
            <Sparkles className="size-3" /> AI Pre-submission Review
          </AiLabel>
          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-forest-deep">{title || 'Untitled challenge'}</h3>
              <div className="flex flex-wrap items-center gap-2">
                {prediction && <Badge tone="forest">{prediction.domain}</Badge>}
                <SeverityBadge severity={severity} />
                <Badge tone="outline">
                  <MapPin className="size-3" /> {locality || '—'}, {district}
                </Badge>
              </div>
              <p className="text-sm text-foreground/75">
                Estimated <span className="font-semibold text-forest-deep">{affected.toLocaleString('en-IN')}</span> people
                affected. This preliminary impact score will be refined by community verification and evidence.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ImpactRing score={estimatedScore} />
              <span className="mt-2 text-xs font-medium text-muted-foreground">Preliminary impact</span>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-border pt-5">
            {[
              { label: 'Duplicate check', value: 'No exact duplicate found — 3 related reports nearby', ok: true },
              photos.length > 0
                ? { label: 'Evidence quality', value: `${photos.length} photo${photos.length > 1 ? 's' : ''} attached — strengthens verification`, ok: true }
                : { label: 'Evidence quality', value: 'Add photos to strengthen verification', ok: false },
              { label: 'Routing', value: `Will be routed to ${district} district administration`, ok: true },
            ].map((r) => (
              <div key={r.label} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className={cn('mt-0.5 size-4.5 shrink-0', r.ok ? 'text-primary' : 'text-gold')} />
                <div>
                  <span className="font-semibold text-forest-deep">{r.label}: </span>
                  <span className="text-foreground/75">{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Step 3 — submitted */}
      {step === 3 && (
        <Card className="flex flex-col items-center p-10 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-primary/12 text-primary">
            <CheckCircle2 className="size-9" />
          </span>
          <h2 className="mt-4 font-serif text-2xl font-bold text-forest-deep">Challenge submitted</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Your report has entered community verification. You’ll be notified as it gets verified, deduplicated, and
            matched with universities and partners.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge tone="outline" className="font-mono text-[0.7rem]">
              CH-JH-2026-{String(Math.floor(1000 + Math.random() * 8999))}
            </Badge>
            <Badge tone="gold">Under Verification</Badge>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard/citizen"
              className="rounded-full bg-forest-deep px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-forest"
            >
              Go to dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep(0)
                setTitle('')
                setDescription('')
                setLocality('')
              }}
              className="rounded-full border border-forest/40 px-5 py-2.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-primary/10"
            >
              Report another
            </button>
          </div>
        </Card>
      )}

      {/* Nav */}
      {step < 3 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-forest-deep transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick disabled:opacity-40"
          >
            {step === 2 ? 'Submit challenge' : 'Continue'} <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
