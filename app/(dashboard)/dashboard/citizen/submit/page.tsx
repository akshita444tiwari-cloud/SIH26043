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

import {
  predictCategory,
  estimateImpactScore,
} from '@/lib/services'

import { DISTRICTS } from '@/lib/mock-data'

import {
  Card,
  Badge,
  SeverityBadge,
} from '@/components/kit/primitives'

import { AiLabel } from '@/components/kit/section-heading'

import { ImpactRing } from '@/components/kit/impact-score'

import { supabase } from '@/lib/supabase'

const SEVERITIES: Severity[] = [
  'Low',
  'Medium',
  'High',
  'Critical',
]

const STEPS = [
  'Describe',
  'Location & Impact',
  'AI Review',
  'Submitted',
]

type DuplicateResult = {
  success?: boolean
  is_duplicate?: boolean
  similarity?: number
  message?: string
  matched_problem?: {
    id?: string
    title?: string
    description?: string
  }
  matches?: unknown[]
}

type UniversityRecommendation = {
  university_id?: string
  university_name?: string
  district?: string
  description?: string
  expertise?: string
  match_score?: number
}

type AnalysisResult = {
  category?: string
  subcategory?: string
  department?: string
  priority?: string
  impact_score?: number
  summary?: string
}

export default function SubmitChallengePage() {
  const [step, setStep] = useState(0)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [district, setDistrict] = useState(
    DISTRICTS[0],
  )

  const [locality, setLocality] = useState('')

  const [severity, setSeverity] =
    useState<Severity>('High')

  const [affected, setAffected] =
    useState(500)

  const [photos, setPhotos] = useState<
    {
      id: string
      url: string
      name: string
    }[]
  >([])

  const [submitting, setSubmitting] =
    useState(false)

  const [submitError, setSubmitError] =
    useState('')

  const [workflowWarning, setWorkflowWarning] =
    useState('')

  const [problemId, setProblemId] =
    useState<string | null>(null)

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null)

  const [duplicateResult, setDuplicateResult] =
    useState<DuplicateResult | null>(null)

  const [
    universityRecommendations,
    setUniversityRecommendations,
  ] = useState<UniversityRecommendation[]>([])

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        URL.revokeObjectURL(photo.url)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -----------------------------
  // PHOTO HANDLING
  // -----------------------------

  const addPhotos = (
    files: FileList | null,
  ) => {
    if (!files) return

    const next = Array.from(files)
      .filter((file) =>
        file.type.startsWith('image/'),
      )
      .map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }))

    if (next.length) {
      setPhotos((prev) => [
        ...prev,
        ...next,
      ])
    }
  }

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find(
        (photo) => photo.id === id,
      )

      if (target) {
        URL.revokeObjectURL(target.url)
      }

      return prev.filter(
        (photo) => photo.id !== id,
      )
    })
  }

  // -----------------------------
  // LOCAL CATEGORY PREVIEW
  // -----------------------------

  const prediction = useMemo(() => {
    const text =
      `${title} ${description}`.trim()

    if (text.length < 4) {
      return null
    }

    return predictCategory(text)
  }, [title, description])

  // -----------------------------
  // LOCAL IMPACT PREVIEW
  // -----------------------------

  const estimatedScore = useMemo(
    () =>
      estimateImpactScore(
        affected,
        severity,
      ),
    [affected, severity],
  )

  // -----------------------------
  // STEP VALIDATION
  // -----------------------------

  const canContinue =
    step === 0
      ? title.length > 4 &&
        description.length > 12
      : step === 1
        ? locality.length > 1
        : true

  // -----------------------------
  // COMPLETE SUBMISSION WORKFLOW
  // -----------------------------

  async function handleSubmit() {
    if (submitting) return

    setSubmitting(true)
    setSubmitError('')
    setWorkflowWarning('')

    setProblemId(null)
    setAnalysisResult(null)
    setDuplicateResult(null)
    setUniversityRecommendations([])

    try {
      // --------------------------------------------------
      // 1. Get logged-in user
      // --------------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setSubmitError(
          'You must be logged in to submit a problem.',
        )

        return
      }

      console.log(
        'Submitting problem for user:',
        user.id,
      )

      // --------------------------------------------------
      // 2. Insert problem into problems table
      // --------------------------------------------------

      const {
        data: problem,
        error: insertError,
      } = await supabase
        .from('problems')
        .insert({
          title: title,

          description: description,

          category:
            prediction?.domain ?? 'Other',

          district: district,

          block: locality,

          location_name: locality,

          priority:
            severity.toLowerCase(),

          status: 'submitted',

          submitted_by: user.id,
        })
        .select('id')
        .single()

      if (insertError) {
        console.error(
          'Problem submission error:',
          insertError,
        )

        setSubmitError(
          insertError.message,
        )

        return
      }

      if (!problem?.id) {
        setSubmitError(
          'Problem was created, but no problem ID was returned.',
        )

        return
      }

      const newProblemId = problem.id

      setProblemId(newProblemId)

      console.log(
        'Problem created successfully:',
        newProblemId,
      )

      const warnings: string[] = []

      // --------------------------------------------------
      // 3. AI ANALYSIS
      //
      // This function:
      // - categorizes the problem
      // - determines subcategory
      // - determines department
      // - determines AI priority
      // - determines impact score
      // - generates embedding
      // - stores result in problem_ai
      // --------------------------------------------------

      const {
        data: analysisData,
        error: analysisError,
      } = await supabase.functions.invoke(
        'analyze-complaint',
        {
          body: {
            problem_id: newProblemId,
          },
        },
      )

      if (
        analysisError ||
        !analysisData ||
        analysisData.success === false
      ) {
        console.error(
          'AI analysis error:',
          analysisError ?? analysisData,
        )

        warnings.push(
          `AI analysis failed: ${
            analysisError?.message ??
            analysisData?.error ??
            'Unknown error'
          }`,
        )
      } else {
        console.log(
          'AI analysis completed:',
          analysisData,
        )

        setAnalysisResult(
          analysisData.ai_result ?? null,
        )

        // ------------------------------------------------
        // 4. DUPLICATE DETECTION
        //
        // This runs only after analyze-complaint because
        // check-duplicate needs the generated embedding.
        // ------------------------------------------------

        const {
          data: duplicateData,
          error: duplicateError,
        } = await supabase.functions.invoke(
          'check-duplicate',
          {
            body: {
              problem_id: newProblemId,
            },
          },
        )

        if (
          duplicateError ||
          !duplicateData ||
          duplicateData.success === false
        ) {
          console.error(
            'Duplicate detection error:',
            duplicateError ?? duplicateData,
          )

          warnings.push(
            `Duplicate detection failed: ${
              duplicateError?.message ??
              duplicateData?.error ??
              'Unknown error'
            }`,
          )
        } else {
          console.log(
            'Duplicate detection completed:',
            duplicateData,
          )

          setDuplicateResult(
            duplicateData,
          )
        }

        // ------------------------------------------------
        // 5. UNIVERSITY RECOMMENDATIONS
        //
        // This runs after analyze-complaint because
        // recommend-universities reads problem_ai.
        // ------------------------------------------------

        const {
          data: recommendationData,
          error: recommendationError,
        } = await supabase.functions.invoke(
          'recommend-universities',
          {
            body: {
              problem_id: newProblemId,
            },
          },
        )

        if (
          recommendationError ||
          !recommendationData ||
          recommendationData.success === false
        ) {
          console.error(
            'University recommendation error:',
            recommendationError ??
              recommendationData,
          )

          warnings.push(
            `University recommendations failed: ${
              recommendationError?.message ??
              recommendationData?.error ??
              'Unknown error'
            }`,
          )
        } else {
          console.log(
            'University recommendations completed:',
            recommendationData,
          )

          setUniversityRecommendations(
            recommendationData.recommendations ?? [],
          )
        }
      }

      // --------------------------------------------------
      // 6. Show final result
      //
      // Even if an AI secondary step fails, the problem
      // itself has already been created successfully.
      // --------------------------------------------------

      if (warnings.length > 0) {
        setWorkflowWarning(
          warnings.join(' '),
        )
      }

      console.log(
        'Problem submission workflow completed:',
        newProblemId,
      )

      setStep(3)
    } catch (error) {
      console.error(
        'Unexpected submission error:',
        error,
      )

      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while submitting the problem.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* HEADER */}

      <div>
        <Link
          href="/dashboard/citizen"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-forest-deep"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <h1 className="mt-3 font-serif text-2xl font-bold text-forest-deep">
          Report a Community Problem
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Our AI assists with categorization,
          deduplication, and impact scoring during
          the submission process.
        </p>
      </div>

      {/* STEPPER */}

      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className="flex flex-1 items-center gap-2"
          >
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold',
                i < step &&
                  'border-primary bg-primary text-primary-foreground',
                i === step &&
                  'border-secondary bg-secondary/15 text-secondary',
                i > step &&
                  'border-border bg-card text-muted-foreground',
              )}
            >
              {i < step ? (
                <CheckCircle2 className="size-4" />
              ) : (
                i + 1
              )}
            </span>

            <span
              className={cn(
                'hidden text-xs font-medium sm:inline',
                i === step
                  ? 'text-forest-deep'
                  : 'text-muted-foreground',
              )}
            >
              {s}
            </span>

            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  'h-0.5 flex-1 rounded-full',
                  i < step
                    ? 'bg-primary'
                    : 'bg-border',
                )}
              />
            )}
          </li>
        ))}
      </ol>

      {/* STEP 0 */}

      {step === 0 && (
        <Card className="space-y-5 p-6">

          <div>
            <label
              htmlFor="title"
              className="text-sm font-semibold text-forest-deep"
            >
              Problem title
            </label>

            <input
              id="title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Contaminated drinking water from community handpump"
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-secondary"
            />
          </div>

          <div>
            <label
              htmlFor="desc"
              className="text-sm font-semibold text-forest-deep"
            >
              Describe the problem
            </label>

            <textarea
              id="desc"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              placeholder="Explain what’s happening, who is affected, and how long it has persisted…"
              className="mt-1.5 w-full resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-secondary"
            />
          </div>

          {/* PHOTOS */}

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
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-secondary/40 hover:text-forest-deep"
            >
              <ImagePlus className="size-4.5" />

              {photos.length
                ? 'Add more photos or evidence'
                : 'Add photos or evidence (optional)'}
            </button>

            {photos.length > 0 && (
              <>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          photo.url ||
                          '/placeholder.svg'
                        }
                        alt={photo.name}
                        className="size-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removePhoto(photo.id)
                        }
                        className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-forest-deep/70 text-cream backdrop-blur transition-colors hover:bg-secondary"
                        aria-label={`Remove ${photo.name}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  <CheckCircle2 className="size-3.5" />

                  {photos.length} evidence photo
                  {photos.length > 1 ? 's' : ''}{' '}
                  attached
                </p>
              </>
            )}
          </div>

          {/* AI CATEGORY */}

          {prediction && (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">

              <AiLabel>
                <Cpu className="size-3" />
                Category Preview
              </AiLabel>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-foreground/75">
                  Detected domain:
                </span>

                <Badge tone="forest">
                  {prediction.domain}
                </Badge>

                <span className="text-xs text-muted-foreground">
                  {prediction.confidence}% confidence
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {prediction.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-accent px-2 py-0.5 text-[0.7rem] font-medium text-accent-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* STEP 1 */}

      {step === 1 && (
        <Card className="space-y-5 p-6">

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="district"
                className="text-sm font-semibold text-forest-deep"
              >
                District
              </label>

              <div className="relative mt-1.5">

                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <select
                  id="district"
                  value={district}
                  onChange={(e) =>
                    setDistrict(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-secondary"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d}>
                      {d}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            <div>
              <label
                htmlFor="locality"
                className="text-sm font-semibold text-forest-deep"
              >
                Locality / Block
              </label>

              <input
                id="locality"
                value={locality}
                onChange={(e) =>
                  setLocality(e.target.value)
                }
                placeholder="e.g. Kathikund Block"
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-secondary"
              />
            </div>

          </div>

          {/* SEVERITY */}

          <div>
            <span className="text-sm font-semibold text-forest-deep">
              Severity
            </span>

            <div className="mt-2 flex flex-wrap gap-2">

              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setSeverity(s)
                  }
                  className={cn(
                    'rounded-full border px-3 py-1.5 transition-colors',
                    severity === s
                      ? 'border-secondary bg-secondary/10'
                      : 'border-border hover:bg-muted',
                  )}
                >
                  <SeverityBadge
                    severity={s}
                  />
                </button>
              ))}

            </div>
          </div>

          {/* AFFECTED PEOPLE */}

          <div>

            <label
              htmlFor="affected"
              className="flex items-center justify-between text-sm font-semibold text-forest-deep"
            >
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" />
                Estimated people affected
              </span>

              <span className="font-serif text-lg text-secondary">
                {affected.toLocaleString(
                  'en-IN',
                )}
              </span>
            </label>

            <input
              id="affected"
              type="range"
              min={50}
              max={50000}
              step={50}
              value={affected}
              onChange={(e) =>
                setAffected(
                  Number(e.target.value),
                )
              }
              className="mt-2 w-full accent-[var(--secondary)]"
            />

          </div>

        </Card>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <Card className="p-6">

          <AiLabel>
            <Sparkles className="size-3" />
            AI Pre-submission Review
          </AiLabel>

          <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">

            <div className="space-y-3">

              <h3 className="font-serif text-lg font-bold text-forest-deep">
                {title ||
                  'Untitled challenge'}
              </h3>

              <div className="flex flex-wrap items-center gap-2">

                {prediction && (
                  <Badge tone="forest">
                    {prediction.domain}
                  </Badge>
                )}

                <SeverityBadge
                  severity={severity}
                />

                <Badge tone="outline">
                  <MapPin className="size-3" />
                  {locality || '—'}, {district}
                </Badge>

              </div>

              <p className="text-sm text-foreground/75">
                Estimated{' '}
                <span className="font-semibold text-forest-deep">
                  {affected.toLocaleString(
                    'en-IN',
                  )}
                </span>{' '}
                people affected. The final AI
                impact assessment will be generated
                when you submit.
              </p>

            </div>

            <div className="flex flex-col items-center">

              <ImpactRing
                score={estimatedScore}
              />

              <span className="mt-2 text-xs font-medium text-muted-foreground">
                Preliminary impact
              </span>

            </div>

          </div>

          <div className="mt-5 space-y-3 border-t border-border pt-5">

            <div className="flex items-start gap-2.5 text-sm">

              <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-primary" />

              <div>
                <span className="font-semibold text-forest-deep">
                  Categorization:
                </span>{' '}

                <span className="text-foreground/75">
                  AI analysis will run after
                  submission.
                </span>
              </div>

            </div>

            <div className="flex items-start gap-2.5 text-sm">

              <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-primary" />

              <div>
                <span className="font-semibold text-forest-deep">
                  Duplicate check:
                </span>{' '}

                <span className="text-foreground/75">
                  The submitted problem will be
                  checked against existing complaints
                  using semantic similarity.
                </span>
              </div>

            </div>

            <div className="flex items-start gap-2.5 text-sm">

              <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-primary" />

              <div>
                <span className="font-semibold text-forest-deep">
                  University matching:
                </span>{' '}

                <span className="text-foreground/75">
                  Relevant universities will be
                  recommended from their expertise.
                </span>
              </div>

            </div>

          </div>

          {/* SUBMISSION ERROR */}

          {submitError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

        </Card>
      )}

      {/* STEP 3 */}

      {step === 3 && (
        <Card className="flex flex-col items-center p-10 text-center">

          <span className="grid size-16 place-items-center rounded-full bg-primary/12 text-primary">
            <CheckCircle2 className="size-9" />
          </span>

          <h2 className="mt-4 font-serif text-2xl font-bold text-forest-deep">
            Challenge submitted
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Your report has been submitted successfully.
            The AI processing results are shown below.
          </p>

          {/* PROBLEM ID */}

          {problemId && (
            <div className="mt-5 w-full rounded-xl border border-border p-4 text-left">

              <p className="text-xs font-medium text-muted-foreground">
                Problem ID
              </p>

              <p className="mt-1 break-all font-mono text-sm">
                {problemId}
              </p>

            </div>
          )}

          {/* AI ANALYSIS */}

          {analysisResult && (
            <div className="mt-4 w-full rounded-xl border border-border p-4 text-left">

              <p className="font-semibold text-forest-deep">
                AI analysis
              </p>

              <div className="mt-3 grid gap-2 text-sm">

                {analysisResult.category && (
                  <p>
                    <span className="font-semibold">
                      Category:
                    </span>{' '}
                    {analysisResult.category}
                  </p>
                )}

                {analysisResult.subcategory && (
                  <p>
                    <span className="font-semibold">
                      Subcategory:
                    </span>{' '}
                    {analysisResult.subcategory}
                  </p>
                )}

                {analysisResult.department && (
                  <p>
                    <span className="font-semibold">
                      Department:
                    </span>{' '}
                    {analysisResult.department}
                  </p>
                )}

                {analysisResult.priority && (
                  <p>
                    <span className="font-semibold">
                      AI priority:
                    </span>{' '}
                    {analysisResult.priority}
                  </p>
                )}

                {typeof analysisResult.impact_score ===
                  'number' && (
                  <p>
                    <span className="font-semibold">
                      AI impact score:
                    </span>{' '}
                    {analysisResult.impact_score}/10
                  </p>
                )}

                {analysisResult.summary && (
                  <p>
                    <span className="font-semibold">
                      Summary:
                    </span>{' '}
                    {analysisResult.summary}
                  </p>
                )}

              </div>
            </div>
          )}

          {/* DUPLICATE RESULT */}

          {duplicateResult && (
            <div className="mt-4 w-full rounded-xl border border-border p-4 text-left">

              <p className="font-semibold text-forest-deep">
                Duplicate analysis
              </p>

              {duplicateResult.is_duplicate ? (
                <div className="mt-2 space-y-1 text-sm">

                  <p>
                    A similar complaint was found.
                  </p>

                  {typeof duplicateResult.similarity ===
                    'number' && (
                    <p>
                      <span className="font-semibold">
                        Similarity:
                      </span>{' '}
                      {(
                        duplicateResult.similarity *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  )}

                  {duplicateResult.matched_problem
                    ?.title && (
                    <p>
                      <span className="font-semibold">
                        Matched problem:
                      </span>{' '}
                      {
                        duplicateResult
                          .matched_problem
                          .title
                      }
                    </p>
                  )}

                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No sufficiently similar complaint
                  was found.
                </p>
              )}

            </div>
          )}

          {/* UNIVERSITY RECOMMENDATIONS */}

          {universityRecommendations.length > 0 && (
            <div className="mt-4 w-full rounded-xl border border-border p-4 text-left">

              <p className="font-semibold text-forest-deep">
                Recommended universities
              </p>

              <div className="mt-3 space-y-2">

                {universityRecommendations.map(
                  (university, index) => (
                    <div
                      key={
                        university.university_id ??
                        index
                      }
                      className="rounded-lg bg-muted/50 p-3"
                    >

                      <p className="font-medium">
                        {university.university_name ??
                          `University ${index + 1}`}
                      </p>

                      {university.district && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          District:{' '}
                          {university.district}
                        </p>
                      )}

                      {university.expertise && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Expertise:{' '}
                          {university.expertise}
                        </p>
                      )}

                      {typeof university.match_score ===
                        'number' && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Matching expertise:{' '}
                          {university.match_score}
                        </p>
                      )}

                    </div>
                  ),
                )}

              </div>

            </div>
          )}

          {/* WORKFLOW WARNING */}

          {workflowWarning && (
            <div className="mt-4 w-full rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-left text-sm text-yellow-800">

              <p className="font-semibold">
                Processing notice
              </p>

              <p className="mt-1">
                {workflowWarning}
              </p>

            </div>
          )}

          {/* ACTIONS */}

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

                setSeverity('High')

                setAffected(500)

                setSubmitError('')

                setWorkflowWarning('')

                setProblemId(null)

                setAnalysisResult(null)

                setDuplicateResult(null)

                setUniversityRecommendations([])

                setPhotos([])
              }}
              className="rounded-full border border-forest/40 px-5 py-2.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-primary/10"
            >
              Report another
            </button>

          </div>

        </Card>
      )}

      {/* NAVIGATION */}

      {step < 3 && (
        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              setStep((current) =>
                Math.max(
                  0,
                  current - 1,
                ),
              )
            }
            disabled={
              step === 0 ||
              submitting
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-forest-deep transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              if (step === 2) {
                handleSubmit()
              } else {
                setStep(
                  (current) =>
                    current + 1,
                )
              }
            }}
            disabled={
              !canContinue ||
              submitting
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick disabled:opacity-40"
          >

            {step === 2
              ? submitting
                ? 'Submitting...'
                : 'Submit challenge'
              : 'Continue'}

            {!submitting && (
              <ArrowRight className="size-4" />
            )}

          </button>

        </div>
      )}

    </div>
  )
}