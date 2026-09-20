import Link from 'next/link'
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  FileText,
  MapPin,
  PlusCircle,
  ThumbsUp,
  TrendingUp,
  Users,
} from 'lucide-react'

import { DashSection } from '@/components/dashboard/dashboard-shell'
import CitizenWelcome from '@/components/dashboard/CitizenWelcome'
import {
  Card,
  Badge,
  SeverityBadge,
  StatusBadge,
} from '@/components/kit/primitives'
import { MetricCard } from '@/components/kit/metric-card'
import { AIInsightCard } from '@/components/kit/ai-cards'
import { CommunityVoting } from '@/components/kit/community-voting'
import { LifecycleTracker } from '@/components/kit/lifecycle-tracker'
import { ImpactRing } from '@/components/kit/impact-score'

import {
  getChallengeById,
  getDuplicateCluster,
  getNotifications,
} from '@/lib/services'

import { challenges } from '@/lib/mock-data'
import { supabase } from '@/lib/supabase'

export const metadata = { title: 'Community Impact Hub' }

const notifIcon = {
  verify: CheckCircle2,
  ai: TrendingUp,
  match: Users,
  industry: Users,
  milestone: Bell,
  impact: TrendingUp,
}

type RealProblem = {
  id: string
  title: string
  description: string
  category: string | null
  district: string | null
  block: string | null
  location_name: string | null
  priority: string | null
  status: string | null
  created_at: string | null
}

export default async function CitizenDashboard() {
  // Mock data - kept for demo/fallback
  const primaryMock =
    getChallengeById('CH-JH-2026-00482') ?? challenges[0]

  const mockChallenges = challenges.slice(0, 3)

  const cluster = getDuplicateCluster()
  const notifications = getNotifications()
  const votingQueue = challenges.slice(3, 7)

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get real problems submitted by this user
  let realProblems: RealProblem[] = []

  if (user) {
    const { data, error } = await supabase
      .from('problems')
      .select(
        'id, title, description, category, district, block, location_name, priority, status, created_at'
      )
      .eq('submitted_by', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(
        'Citizen problems fetch error:',
        error.message
      )
    } else {
      realProblems = (data ?? []) as RealProblem[]
    }
  }

  const hasRealProblems = realProblems.length > 0

  const challengesReported = hasRealProblems
    ? realProblems.length
    : 6

  const verifiedCount = hasRealProblems
    ? realProblems.filter(
        (problem) =>
          problem.status?.toLowerCase() === 'validated' ||
          problem.status?.toLowerCase() === 'verified'
      ).length
    : 3

  const primaryReal = hasRealProblems
    ? realProblems[0]
    : null

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* Overview */}
      <DashSection
        id="overview"
        title={<CitizenWelcome />}
        description="Track the problems you’ve reported and see how your community is driving change."
        action={
          <Link
            href="/dashboard/citizen/submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick"
          >
            <PlusCircle className="size-4" />
            Report a Problem
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={FileText}
            value={challengesReported.toString()}
            label="Challenges reported"
            tone="pink"
          />

          <MetricCard
            icon={CheckCircle2}
            value={verifiedCount.toString()}
            label="Verified by community"
            tone="sage"
          />

          <MetricCard
            icon={ThumbsUp}
            value="248"
            label="Votes contributed"
            tone="peach"
          />

          <MetricCard
            icon={Users}
            value="1,420"
            label="People reached"
            tone="cream"
          />
        </div>
      </DashSection>

      {/* My Challenges */}
      <DashSection
        id="my-challenges"
        title="My Challenges"
        description="Live status of the problems you reported."
      >
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            {primaryReal ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="outline">
                    {primaryReal.status || 'submitted'}
                  </Badge>

                  <Badge tone="terracotta">
                    {primaryReal.priority || 'medium'}
                  </Badge>

                  <Badge
                    tone="outline"
                    className="ml-auto font-mono text-[0.7rem]"
                  >
                    {primaryReal.id}
                  </Badge>
                </div>

                <h3 className="mt-3 font-serif text-xl font-bold text-forest-deep">
                  {primaryReal.title}
                </h3>

                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {primaryReal.location_name ||
                    primaryReal.block ||
                    'Location not specified'}
                  , {primaryReal.district || 'District not specified'}
                </p>

                <p className="mt-3 text-sm text-foreground/75">
                  {primaryReal.description}
                </p>

                <div className="mt-5 border-t border-border pt-5">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-medium text-forest-deep">
                      Current status
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your problem has been submitted successfully.
                      Its status will update as it moves through
                      validation and resolution.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/challenges/${primaryReal.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
                >
                  View full challenge
                  <ArrowUpRight className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={primaryMock.status} />
                  <SeverityBadge severity={primaryMock.severity} />

                  <Badge
                    tone="outline"
                    className="ml-auto font-mono text-[0.7rem]"
                  >
                    {primaryMock.id}
                  </Badge>
                </div>

                <h3 className="mt-3 font-serif text-xl font-bold text-forest-deep">
                  {primaryMock.title}
                </h3>

                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {primaryMock.locality}, {primaryMock.district}
                </p>

                <p className="mt-3 text-sm text-foreground/75">
                  {primaryMock.description}
                </p>

                <div className="mt-5 border-t border-border pt-5">
                  <LifecycleTracker steps={primaryMock.lifecycle} />
                </div>

                <Link
                  href={`/challenges/${primaryMock.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
                >
                  View full challenge
                  <ArrowUpRight className="size-4" />
                </Link>
              </>
            )}
          </Card>

          <div className="space-y-5">
            <Card className="flex flex-col items-center p-6 text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Impact score
              </span>

              <ImpactRing
                score={primaryReal ? 60 : primaryMock.impactScore}
                className="mt-3"
              />

              <p className="mt-3 text-sm text-foreground/70">
                {primaryReal
                  ? `Your ${primaryReal.category || 'community'} problem is now part of the challenge platform.`
                  : `Ranked in the top priority band for ${primaryMock.domain} challenges in ${primaryMock.district}.`}
              </p>
            </Card>

            <AIInsightCard
              label="AI Deduplication"
              title={`${cluster.reports.length} similar reports clustered`}
            >
              Your report was automatically grouped with{' '}
              {cluster.reports.length} others in {cluster.district},
              strengthening community verification and boosting its
              priority score.
            </AIInsightCard>
          </div>
        </div>

        {/* Challenge cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasRealProblems
            ? realProblems.map((problem) => (
                <Link
                  key={problem.id}
                  href={`/challenges/${problem.id}`}
                >
                  <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-secondary/40">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="outline">
                        {problem.status || 'submitted'}
                      </Badge>

                      <Badge tone="terracotta">
                        {problem.priority || 'medium'}
                      </Badge>
                    </div>

                    <h4 className="mt-3 line-clamp-2 font-serif text-base font-semibold text-forest-deep">
                      {problem.title}
                    </h4>

                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {problem.district || 'District not specified'}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {problem.category || 'Other'}
                      </span>

                      <span className="font-semibold text-forest-deep">
                        Submitted
                      </span>
                    </div>
                  </Card>
                </Link>
              ))
            : mockChallenges.map((c) => (
                <Link
                  key={c.id}
                  href={`/challenges/${c.id}`}
                >
                  <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-secondary/40">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={c.status} />
                      <SeverityBadge severity={c.severity} />
                    </div>

                    <h4 className="mt-3 line-clamp-2 font-serif text-base font-semibold text-forest-deep">
                      {c.title}
                    </h4>

                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {c.district}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {c.communitySupport} supporters
                      </span>

                      <span className="font-semibold text-forest-deep">
                        Impact {c.impactScore}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
        </div>
      </DashSection>

      {/* Community Voting */}
      <DashSection
        id="voting"
        title="Community Voting"
        description="Vote to help prioritize the challenges that matter most in your district."
      >
        <CommunityVoting challenges={votingQueue} />
      </DashSection>

      {/* Notifications */}
      <DashSection
        id="notifications"
        title="Notifications"
        description="Updates on your challenges and community activity."
      >
        <Card className="divide-y divide-border">
          {notifications.map((n) => {
            const Icon = notifIcon[n.type] ?? Bell

            return (
              <div
                key={n.id}
                className="flex items-start gap-3 p-4"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-forest-deep">
                      {n.title}
                    </h4>

                    {n.unread && (
                      <span
                        className="size-2 shrink-0 rounded-full bg-secondary"
                        aria-label="Unread"
                      />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {n.detail}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {n.time}
                </span>
              </div>
            )
          })}
        </Card>
      </DashSection>
    </div>
  )
}