import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Inbox,
  Lightbulb,
  MapPinned,
  Rocket,
  Users,
} from 'lucide-react'
import { PageBanner } from '@/components/site/page-banner'
import { SectionHeading } from '@/components/kit/section-heading'
import { Card } from '@/components/kit/primitives'
import { KpiCard } from '@/components/kit/metric-card'
import { JharkhandMap } from '@/components/kit/jharkhand-map'
import { BarList, DonutChart, Funnel, TrendChart } from '@/components/kit/charts'
import { impactStats, domainDistribution, pipeline, resolutionTrend } from '@/lib/mock-data'

export const metadata = {
  title: 'Impact Dashboard',
  description:
    'A transparent, statewide view of societal challenges reported, matched, and resolved across all 23 districts of Jharkhand.',
}

const kpis = [
  { icon: Inbox, value: impactStats.received.toLocaleString('en-IN'), label: 'Challenges received', delta: '+248 this month' },
  { icon: CheckCircle2, value: impactStats.resolved.toLocaleString('en-IN'), label: 'Challenges resolved', delta: '+34 this month' },
  { icon: Users, value: impactStats.peopleImpacted, label: 'People impacted', delta: 'across 23 districts', deltaTone: 'flat' as const },
  { icon: MapPinned, value: impactStats.districts, label: 'Districts active', delta: 'statewide coverage', deltaTone: 'flat' as const },
  { icon: GraduationCap, value: impactStats.universityProjects, label: 'University projects', delta: '+12 this month' },
  { icon: Building2, value: impactStats.industryPartnerships, label: 'Industry partnerships', delta: '+3 this month' },
  { icon: Lightbulb, value: impactStats.innovations, label: 'Innovations developed', delta: '+8 this month' },
  { icon: Rocket, value: impactStats.deployed, label: 'Solutions deployed', delta: '+9 this month' },
]

const resolutionRate = Math.round((impactStats.resolved / impactStats.received) * 100)

export default function ImpactPage() {
  return (
    <>
      <PageBanner
        eyebrow="Impact Dashboard"
        title="Transparent, statewide societal impact"
        description="A public, real-time view of how Jharkhand’s challenges move from report to resolution — measured across every district, domain, and partner."
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 md:px-6">
        {/* KPIs */}
        <section>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <KpiCard
                key={k.label}
                icon={k.icon}
                value={k.value}
                label={k.label}
                delta={k.delta}
                deltaTone={k.deltaTone ?? 'up'}
              />
            ))}
          </div>
        </section>

        {/* Map */}
        <section>
          <SectionHeading
            eyebrow="GIS Overview"
            title="District-level challenge intensity"
            description="Explore challenge density, priority, and impact across all 23 districts. Select a district for a detailed breakdown."
            className="mb-6"
          />
          <JharkhandMap />
        </section>

        {/* Trend + pipeline */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <SectionHeading title="Reported vs resolved" description="Last 6 months" className="mb-5" />
            <TrendChart data={resolutionTrend} />
          </Card>
          <Card className="p-6">
            <SectionHeading
              title="Resolution pipeline"
              description={`${resolutionRate}% of received challenges resolved to date`}
              className="mb-5"
            />
            <Funnel data={pipeline} />
          </Card>
        </section>

        {/* Domain distribution */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <SectionHeading title="Challenges by domain" description="Share of all reported challenges" className="mb-5" />
            <DonutChart
              data={domainDistribution.map((d) => ({ label: d.domain, value: d.value }))}
              centerValue={impactStats.received.toLocaleString('en-IN')}
              centerLabel="Total"
            />
          </Card>
          <Card className="p-6">
            <SectionHeading title="Domain intensity" description="Relative volume by domain" className="mb-5" />
            <BarList data={domainDistribution.map((d) => ({ label: d.domain, value: d.value }))} />
          </Card>
        </section>
      </div>
    </>
  )
}
