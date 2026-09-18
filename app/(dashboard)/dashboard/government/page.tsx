import Link from 'next/link'
import { AlertTriangle, ArrowUpRight, Building2, GaugeCircle, Handshake, Layers, ShieldCheck, Timer } from 'lucide-react'
import { DashSection } from '@/components/dashboard/dashboard-shell'
import { Card, Badge, Progress } from '@/components/kit/primitives'
import { KpiCard } from '@/components/kit/metric-card'
import { EarlyWarningCard, AIInsightCard } from '@/components/kit/ai-cards'
import { AccessibilityMap } from '@/components/kit/accessibility-map'
import { CommunityWellbeing } from '@/components/kit/community-wellbeing'
import { JharkhandMap } from '@/components/kit/jharkhand-map'
import { BarList, Funnel, TrendChart, DonutChart } from '@/components/kit/charts'
import { SectionHeading } from '@/components/kit/section-heading'
import {
  getEarlyWarnings,
  getDuplicateCluster,
  getAccessibilityAudits,
  getWellbeingSignals,
  getWellbeingWarnings,
} from '@/lib/services'
import { domainDistribution, pipeline, resolutionTrend, districtStats, impactStats, universityMatches, industryMatches } from '@/lib/mock-data'

export const metadata = { title: 'Societal Impact Command Centre' }

export default function GovernmentDashboard() {
  const warnings = getEarlyWarnings()
  const cluster = getDuplicateCluster()
  const accessibilityAudits = getAccessibilityAudits()
  const wellbeingSignals = getWellbeingSignals()
  const wellbeingWarnings = getWellbeingWarnings()

  const topDistricts = [...districtStats]
    .sort((a, b) => b.activeChallenges - a.activeChallenges)
    .slice(0, 6)
    .map((d) => ({ label: d.name, value: d.activeChallenges, hint: `${d.highPriority} high` }))

  const domainData = domainDistribution.map((d) => ({ label: d.domain, value: d.value }))

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <DashSection
        id="overview"
        title="Jharkhand Societal Impact Command Centre"
        description="Real-time, AI-augmented view of community challenges across all 24 districts — for evidence-based governance."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={Layers} value={impactStats.received.toLocaleString('en-IN')} label="Challenges received" delta="+248 this month" deltaTone="up" />
          <KpiCard icon={ShieldCheck} value={impactStats.resolved} label="Resolved" delta="+34 this month" deltaTone="up" />
          <KpiCard icon={Timer} value="41" label="Avg. days to resolve" delta="-9 vs last qtr" deltaTone="up" />
          <KpiCard icon={GaugeCircle} value={`${impactStats.districts}/24`} label="Districts active" delta="+2 onboarded" deltaTone="up" />
        </div>
      </DashSection>

      {/* GIS map */}
      <DashSection
        id="gis"
        title="GIS Command Map"
        description="Toggle domain layers to see challenge density and priority hotspots. Select a district for details."
      >
        <JharkhandMap defaultDistrict="Ranchi" />
      </DashSection>

      {/* Pipeline + trend */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashSection id="pipeline" title="Resolution Pipeline" description="From citizen report to implemented solution.">
          <Card className="p-6">
            <Funnel data={pipeline} />
          </Card>
        </DashSection>
        <DashSection id="trend" title="Reported vs Resolved" description="Six-month trend across the platform.">
          <Card className="p-6">
            <TrendChart data={resolutionTrend} />
          </Card>
        </DashSection>
      </div>

      {/* Domain distribution + hotspots */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashSection id="domains" title="Challenges by Domain">
          <Card className="p-6">
            <DonutChart data={domainData} centerLabel="Domains" centerValue={String(domainData.length)} />
          </Card>
        </DashSection>
        <DashSection id="hotspots" title="District Hotspots" description="Districts with the most active challenges.">
          <Card className="p-6">
            <BarList data={topDistricts} suffix="" />
          </Card>
        </DashSection>
      </div>

      {/* Predictive early warnings */}
      <DashSection
        id="warnings"
        title="Predictive Early-Warning System"
        description="Aggregated, community-level signals that flag emerging issues before they escalate. No individual diagnosis."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {warnings.map((w) => (
            <EarlyWarningCard key={w.id} warning={w} />
          ))}
        </div>
      </DashSection>

      {/* Accessibility mapping */}
      <DashSection
        id="accessibility"
        title="Accessibility Mapping"
        description="Barrier-free audits of public facilities across districts — surfacing where ramps, accessible toilets, and tactile guidance are missing."
      >
        <AccessibilityMap audits={accessibilityAudits} />
      </DashSection>

      {/* Community wellbeing early warning */}
      <DashSection
        id="wellbeing"
        title="Community Wellbeing Early Warning"
        description="Privacy-preserving, aggregated signals that flag districts where community support resources may be needed before issues escalate."
      >
        <CommunityWellbeing signals={wellbeingSignals} warnings={wellbeingWarnings} />
      </DashSection>

      {/* AI deduplication cluster */}
      <DashSection
        id="dedup"
        title="AI Deduplication"
        description="Similar reports are automatically clustered to reveal the true scale of an issue and prevent duplicate effort."
      >
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge tone="terracotta">
                <AlertTriangle className="size-3" /> {cluster.reports.length} reports clustered
              </Badge>
              <h3 className="mt-2 font-serif text-xl font-bold text-forest-deep">{cluster.clusterTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {cluster.district} district · primary challenge {cluster.primaryChallengeId}
              </p>
            </div>
            <Link
              href={`/challenges/${cluster.primaryChallengeId}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest/40 px-4 py-2 text-sm font-semibold text-forest-deep transition-colors hover:bg-primary/10"
            >
              View primary challenge <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-2">
            {cluster.reports.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <span className="w-32 shrink-0 text-sm font-medium text-forest-deep">{r.locality}</span>
                <div className="flex-1">
                  <Progress value={r.similarity} barClassName="bg-secondary" />
                </div>
                <span className="w-14 shrink-0 text-right text-sm font-semibold text-secondary">{r.similarity}%</span>
                <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:inline">
                  {r.support} support
                </span>
                <span className="hidden w-16 shrink-0 text-right text-xs text-muted-foreground sm:inline">
                  {r.date}
                </span>
              </div>
            ))}
          </div>

          <AIInsightCard className="mt-5" label="AI Insight" title="Consolidated impact">
            These {cluster.reports.length} reports represent a single systemic issue affecting an estimated{' '}
            <span className="font-semibold text-forest-deep">440+ households</span>. Addressing it at the block level is
            far more cost-effective than resolving each report individually.
          </AIInsightCard>
        </Card>
      </DashSection>

      {/* Impact summary */}
      <DashSection id="impact" title="Impact Summary" description="Cumulative outcomes powered by the four-way collaboration model.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5 text-center">
            <div className="font-serif text-3xl font-bold text-forest-deep">{impactStats.peopleImpacted}</div>
            <div className="mt-1 text-sm text-muted-foreground">People impacted</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="font-serif text-3xl font-bold text-forest-deep">{impactStats.universityProjects}</div>
            <div className="mt-1 text-sm text-muted-foreground">University projects</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="font-serif text-3xl font-bold text-forest-deep">{impactStats.industryPartnerships}</div>
            <div className="mt-1 text-sm text-muted-foreground">Industry partnerships</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="font-serif text-3xl font-bold text-forest-deep">{impactStats.deployed}</div>
            <div className="mt-1 text-sm text-muted-foreground">Solutions deployed</div>
          </Card>
        </div>
      </DashSection>

      {/* Engaged partners */}
      <DashSection
        id="partners"
        title="Ecosystem Partners"
        description="Universities and industry organizations actively solving verified community challenges."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-4.5" />
              </span>
              <h3 className="font-serif text-base font-semibold text-forest-deep">University partners</h3>
            </div>
            <ul className="space-y-2">
              {universityMatches.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-forest-deep">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.district}</div>
                  </div>
                  <Badge tone="forest" className="shrink-0">
                    {u.matchScore}% match
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary/12 text-secondary">
                <Handshake className="size-4.5" />
              </span>
              <h3 className="font-serif text-base font-semibold text-forest-deep">Industry partners</h3>
            </div>
            <ul className="space-y-2">
              {industryMatches.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-forest-deep">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.sector}</div>
                  </div>
                  <Badge tone="terracotta" className="shrink-0">
                    {i.matchScore}% fit
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </DashSection>
    </div>
  )
}
