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

export const metadata = { title: 'Community Impact Hub' }

const notifIcon = {
  verify: CheckCircle2,
  ai: TrendingUp,
  match: Users,
  industry: Users,
  milestone: Bell,
  impact: TrendingUp,
}

export default function CitizenDashboard() {
  const primary = getChallengeById('CH-JH-2026-00482') ?? challenges[0]
  const myChallenges = challenges.slice(0, 3)
  const cluster = getDuplicateCluster()
  const notifications = getNotifications()
  const votingQueue = challenges.slice(3, 7)

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
            <PlusCircle className="size-4" /> Report a Problem
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={FileText}
            value="6"
            label="Challenges reported"
            tone="pink"
          />
          <MetricCard
            icon={CheckCircle2}
            value="3"
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

      {/* Featured tracked challenge */}
      <DashSection
        id="my-challenges"
        title="My Challenges"
        description="Live status of the problems you reported."
      >
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={primary.status} />
              <SeverityBadge severity={primary.severity} />
              <Badge
                tone="outline"
                className="ml-auto font-mono text-[0.7rem]"
              >
                {primary.id}
              </Badge>
            </div>

            <h3 className="mt-3 font-serif text-xl font-bold text-forest-deep">
              {primary.title}
            </h3>

            <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {primary.locality},{' '}
              {primary.district}
            </p>

            <p className="mt-3 text-sm text-foreground/75">
              {primary.description}
            </p>

            <div className="mt-5 border-t border-border pt-5">
              <LifecycleTracker steps={primary.lifecycle} />
            </div>

            <Link
              href={`/challenges/${primary.id}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
            >
              View full challenge <ArrowUpRight className="size-4" />
            </Link>
          </Card>

          <div className="space-y-5">
            <Card className="flex flex-col items-center p-6 text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Impact score
              </span>

              <ImpactRing score={primary.impactScore} className="mt-3" />

              <p className="mt-3 text-sm text-foreground/70">
                Ranked in the top priority band for {primary.domain}{' '}
                challenges in {primary.district}.
              </p>
            </Card>

            <AIInsightCard
              label="AI Deduplication"
              title={`${cluster.reports.length} similar reports clustered`}
            >
              Your report was automatically grouped with{' '}
              {cluster.reports.length} others in {cluster.district},
              strengthening community verification and boosting its priority
              score.
            </AIInsightCard>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myChallenges.map((c) => (
            <Link key={c.id} href={`/challenges/${c.id}`}>
              <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-secondary/40">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={c.status} />
                  <SeverityBadge severity={c.severity} />
                </div>

                <h4 className="mt-3 line-clamp-2 font-serif text-base font-semibold text-forest-deep">
                  {c.title}
                </h4>

                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {c.district}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.communitySupport} supporters</span>
                  <span className="font-semibold text-forest-deep">
                    Impact {c.impactScore}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </DashSection>

      {/* Community voting */}
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
              <div key={n.id} className="flex items-start gap-3 p-4">
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