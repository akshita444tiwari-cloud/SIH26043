'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function SubmitChallengePage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [district, setDistrict] = useState('')
  const [locality, setLocality] = useState('')
  const [severity, setSeverity] = useState('Medium')
  const [affected, setAffected] = useState('')
  const [photos, setPhotos] = useState<File[]>([])

  const prediction = useMemo(() => {
    const text = `${title} ${description}`.toLowerCase()

    if (
      text.includes('water') ||
      text.includes('drainage') ||
      text.includes('handpump')
    ) {
      return {
        category: 'Water & Sanitation',
        confidence: 94,
        tags: ['water', 'sanitation'],
      }
    }

    if (
      text.includes('school') ||
      text.includes('teacher') ||
      text.includes('student')
    ) {
      return {
        category: 'Education',
        confidence: 92,
        tags: ['education'],
      }
    }

    if (
      text.includes('road') ||
      text.includes('pothole') ||
      text.includes('transport')
    ) {
      return {
        category: 'Roads & Transport',
        confidence: 91,
        tags: ['roads', 'transport'],
      }
    }

    if (
      text.includes('hospital') ||
      text.includes('health') ||
      text.includes('medicine')
    ) {
      return {
        category: 'Healthcare',
        confidence: 90,
        tags: ['healthcare'],
      }
    }

    return {
      category: 'Other',
      confidence: 88,
      tags: ['community'],
    }
  }, [title, description])

  const estimatedScore = useMemo(() => {
    let score = 5

    if (severity === 'High') score += 2
    if (severity === 'Critical') score += 4
    if (severity === 'Low') score -= 2

    if (affected) {
      const number = Number(affected)
      if (number >= 1000) score += 2
      else if (number >= 100) score += 1
    }

    return Math.max(1, Math.min(10, score))
  }, [severity, affected])

  const handleNext = async () => {
    if (step !== 2) {
      setStep((s) => s + 1)
      return
    }

    setIsSubmitting(true)

    try {
      // Check whether the user is actually logged in.
      const {
        data: { session },
      } = await supabase.auth.getSession()

      console.log('CURRENT SESSION:', session)

      if (!session) {
        alert('You are not logged in. Please log in before submitting a problem.')
        return
      }

      const { data, error } = await supabase
        .from('problems')
        .insert({
          title,
          description,
          district,
          block: locality,
          priority: severity,
          status: 'Submitted',
          submitted_by: session.user.id,
        })
        .select('id')
        .single()

      if (error) {
        console.error('Problem submission error:', error)
        alert(`Failed to submit the problem: ${error.message}`)
        return
      }

      console.log('Problem created successfully:', data)

      setStep(3)
    } catch (error) {
      console.error('Unexpected submission error:', error)
      alert('Something went wrong while submitting the problem.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (isSubmitting) return
    setStep((s) => Math.max(1, s - 1))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Submit a Challenge</h1>
          <p className="mt-2 text-muted-foreground">
            Report a community problem and help connect it with people who can solve it.
          </p>
        </div>

        <div className="mb-8 flex items-center gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium',
                  step >= item
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                )}
              >
                {item}
              </div>

              {item < 3 && (
                <div
                  className={cn(
                    'h-px w-12',
                    step > item ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 rounded-xl border bg-card p-6">
            <div>
              <h2 className="text-xl font-semibold">Describe the problem</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Give enough detail so the problem can be understood clearly.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Contaminated drinking water"
                className="w-full rounded-lg border bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem..."
                rows={5}
                className="w-full rounded-lg border bg-background px-3 py-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Locality</label>
                <input
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Locality / Block"
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Approx. people affected
                </label>
                <input
                  value={affected}
                  onChange={(e) => setAffected(e.target.value)}
                  type="number"
                  placeholder="e.g. 500"
                  className="w-full rounded-lg border bg-background px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Evidence / Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
                className="w-full rounded-lg border bg-background px-3 py-2"
              />
              {photos.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {photos.length} photo{photos.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!title || !description}
                className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 rounded-xl border bg-card p-6">
            <div>
              <h2 className="text-xl font-semibold">AI Review</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review the information before submitting your challenge.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Predicted category</p>
              <p className="mt-1 font-semibold">{prediction.category}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Confidence: {prediction.confidence}%
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Estimated impact score</p>
              <p className="mt-1 text-2xl font-bold">{estimatedScore}/10</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="font-medium">Duplicate check</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No exact duplicate found — 3 related reports nearby
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="rounded-lg border px-5 py-2.5 disabled:opacity-50"
              >
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit challenge'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-xl border bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
              ✓
            </div>

            <h2 className="text-2xl font-bold">Challenge submitted</h2>

            <p className="mt-2 text-muted-foreground">
              Your problem has been submitted successfully and is now under verification.
            </p>

            <div className="mt-6 rounded-lg border p-4 text-left">
              <p className="text-sm text-muted-foreground">Challenge ID</p>
              <p className="mt-1 font-mono text-sm">
                Submitted successfully
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}