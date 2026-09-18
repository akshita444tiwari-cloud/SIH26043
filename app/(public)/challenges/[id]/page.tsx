import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Layers,
  MapPin,
  ThumbsUp,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { getChallengeById, getChallenges, getDuplicateCluster } from '@/lib/services'
import { challenges } from '@/lib/mock-data'
import { Card } from '@/components/kit/primitives'
import { Badge, SeverityBadge, StatusBadge } from '@/components/kit/primitives'
import { SectionHeading, AiLabel } from '@/components/kit/section-heading'
import { ImpactRing, ImpactBreakdownList } from '@/components/kit/impact-score'
import { LifecycleTracker } from '@/components/kit/lifecycle-tracker'
import { AIInsightCard } from '@/components/kit/ai-cards'
import { ChallengeCard } from '@/components/kit/challenge-card'
import { agingLevel } from '@/components/kit/challenge-card'
import { FolkBorder } from '@/components/cultural/motifs'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return challenges.map((c) => ({ id: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const challenge = getChallengeById(id)
  if (!challenge) return { title: 'Challenge not found' }
  return {
    title: `${challenge.title} · ${challenge.id}`,
    description: challenge.description,
  }
}

export default async function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const challenge = getChallengeById(id)
  if (!challenge) notFound()

  const cluster = getDuplicateCluster()
  const showCluster = cluster.primaryChallengeId === challenge.id
  const all = await getChallenges()
  const related = all
    .filter((c) => c.id !== challenge.id && c.domain === challenge.domain)
    .slice(0, 3)
  const aging = agingLevel(challenge.daysUnresolved)

  const stats = [
    { icon: Users, label: 'People affected', value: challenge.affectedPeople.toLocaleString('en-IN') },
    { icon: ThumbsUp, label: 'Community support', value: challenge.communitySupport.toLocaleString('en-IN') },
    { icon: CheckCircle2, label: 'Verified citizens', value: challenge.verifiedCitizens },
    { icon: FileText, label: 'Evidence items', value: challenge.evidenceCount },
  ]

  return (
    <>
      <section className="border-b border-border bg-forest-deep/[0.04] paper-bg">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 md:px-6">
          <Link
            href="/challenges"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-forest-deep"
          >
            <ArrowLeft className="size-4" /> Back to all challenges
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="forest">{challenge.domain}</Badge>
            <StatusBadge status={challenge.status} />
            <SeverityBadge severity={challenge.severity} />
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                aging.tone,
              )}
            >
              {aging.label}
            </span>
            <span className="ml-auto text-xs font-medium text-muted-foreground">{challenge.id}</span>
          </div>

          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight text-forest-deep text-balance md:text-4xl">
            {challenge.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {challenge.locality}, {challenge.district}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" /> Reported {challenge.createdAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="size-4" /> {challenge.supportingReports} supporting reports
            </span>
          </div>
        </div>
        <FolkBorder className="opacity-50" />
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main column */}
        <div className="space-y-8">
          <section>
            <SectionHeading title="Problem description" className="mb-3" />
            <p className="text-foreground/80 leading-relaxed">{challenge.description}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <Card key={s.label} className="p-4">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="size-4.5" />
                  </span>
                  <div className="mt-3 font-serif text-2xl font-bold leading-none text-forest-deep">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* AI classification */}
          <section>
            <AIInsightCard label="AI Classification" title={`Classified as ${challenge.domain}`}>
              <p>
                This report was automatically classified and tagged by the AI engine to make it structured and
                searchable across the platform.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {challenge.aiTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-card px-2 py-0.5 text-xs font-medium text-forest-deep ring-1 ring-primary/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </AIInsightCard>
          </section>

          {/* Dedup cluster */}
          {showCluster && (
            <section>
              <SectionHeading
                eyebrow="AI Deduplication"
                title="Similar reports merged into this challenge"
                description={`Semantic clustering detected ${cluster.reports.length} reports across ${cluster.district} describing the same issue.`}
                className="mb-4"
              />
              <Card className="overflow-hidden">
                <div className="divide-y divide-border">
                  {cluster.reports.map((r) => (
                    <div key={r.id} className="flex flex-wrap items-center gap-3 p-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
                        {r.similarity}%
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-forest-deep">{r.locality}</div>
                        <div className="text-xs text-muted-foreground">Reported {r.date}</div>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="size-3.5" /> {r.support}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="size-3.5" /> {r.evidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Collaboration */}
          {(challenge.university || challenge.industry) && (
            <section>
              <SectionHeading title="Collaboration" className="mb-3" />
              <div className="grid gap-3 sm:grid-cols-2">
                {challenge.university && (
                  <Card className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      University partner
                    </div>
                    <div className="mt-1 font-serif text-lg font-semibold text-forest-deep">
                      {challenge.university}
                    </div>
                    <p className="mt-1 text-sm text-foreground/70">
                      Adopted this challenge as an academic project and formed a student team.
                    </p>
                  </Card>
                )}
                {challenge.industry && (
                  <Card className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Industry partner
                    </div>
                    <div className="mt-1 font-serif text-lg font-semibold text-forest-deep">{challenge.industry}</div>
                    <p className="mt-1 text-sm text-foreground/70">
                      Providing resources, funding, and mentorship to scale the solution.
                    </p>
                  </Card>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar column */}
        <aside className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <ImpactRing score={challenge.impactScore} />
              <h3 className="mt-3 font-serif text-lg font-semibold text-forest-deep">Impact Score</h3>
              <p className="text-xs text-muted-foreground">
                Weighted across six factors to prioritize resolution.
              </p>
            </div>
            <div className="mt-5 border-t border-border pt-5">
              <ImpactBreakdownList breakdown={challenge.impactBreakdown} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-forest-deep">Lifecycle progress</h3>
            <LifecycleTracker steps={challenge.lifecycle} />
          </Card>

          <Card className="border-secondary/25 p-5">
            <AiLabel className="bg-secondary">Take action</AiLabel>
            <h3 className="mt-2 flex items-center gap-2 font-serif text-base font-semibold text-forest-deep">
              <TriangleAlert className="size-4 text-secondary" /> Support this challenge
            </h3>
            <p className="mt-1 text-sm text-foreground/70">
              Vote, add evidence, or adopt this challenge as a university or industry partner.
            </p>
            <div className="mt-4 grid gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick"
              >
                <ThumbsUp className="size-4" /> Vote to prioritize
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/40 px-4 py-2.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-primary/10"
              >
                Adopt as a partner
              </Link>
            </div>
          </Card>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-forest-deep/[0.03]">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
            <SectionHeading
              eyebrow="Related"
              title={`More ${challenge.domain} challenges`}
              className="mb-6"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <ChallengeCard key={c.id} challenge={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
