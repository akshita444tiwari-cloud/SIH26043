import {
  Brain,
  Building2,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Layers,
  LineChart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Vote,
} from 'lucide-react'
import { PageBanner } from '@/components/site/page-banner'
import { SectionHeading, AiLabel } from '@/components/kit/section-heading'
import { Card } from '@/components/kit/primitives'
import { LifecycleTracker } from '@/components/kit/lifecycle-tracker'
import { FlowerAccent, WarliCluster } from '@/components/cultural/motifs'
import { LIFECYCLE_STAGES } from '@/lib/mock-data'
import type { LifecycleStep } from '@/lib/types'

export const metadata = {
  title: 'About the Platform',
  description:
    'How Jharkhand’s societal innovation platform connects citizen voice, academic rigor, and industry power to solve grassroots challenges.',
}

const pillars = [
  {
    icon: Users,
    title: 'Citizens & Community',
    body: 'Report local problems, add evidence, and vote to prioritize what matters most — giving grassroots voices a direct line to decision-makers.',
    tone: 'bg-pink/40',
  },
  {
    icon: GraduationCap,
    title: 'Universities & Students',
    body: 'Adopt real challenges as academic projects, form skilled student teams, and apply research to solutions with measurable social value.',
    tone: 'bg-accent',
  },
  {
    icon: Building2,
    title: 'Industry Partners',
    body: 'Sponsor high-impact challenges through CSR, provide funding, hardware, and mentorship, and co-develop scalable pilots.',
    tone: 'bg-peach/50',
  },
  {
    icon: Landmark,
    title: 'Government',
    body: 'Monitor district-level signals on a GIS command centre, prioritize resources, and drive verified challenges to resolution.',
    tone: 'bg-primary/10',
  },
]

const aiCapabilities = [
  {
    icon: Layers,
    title: 'Deduplication & Clustering',
    body: 'Semantic clustering merges duplicate reports into a single prioritized challenge, revealing the true scale of an issue.',
  },
  {
    icon: Brain,
    title: 'Auto-Classification',
    body: 'Free-text reports are automatically classified into domains and tagged, so every submission is structured and searchable.',
  },
  {
    icon: Sparkles,
    title: 'Explainable Matching',
    body: 'Universities and industry partners are matched to challenges with transparent, factor-by-factor scoring you can inspect.',
  },
  {
    icon: LineChart,
    title: 'Early-Warning Signals',
    body: 'Aggregated, anonymous trends surface emerging district-level risks before they escalate into crises.',
  },
]

const principles = [
  {
    icon: ShieldCheck,
    title: 'Community-verified',
    body: 'Every challenge crosses a community verification threshold before it enters the resolution pipeline.',
  },
  {
    icon: Vote,
    title: 'Priority by the people',
    body: 'Weighted community voting ensures the most pressing problems rise to the top of the queue.',
  },
  {
    icon: MapPin,
    title: 'Rooted in Jharkhand',
    body: 'Built around all 23 districts, tribal livelihoods, and the state’s unique geographic and cultural context.',
  },
]

function buildFullLifecycle(): LifecycleStep[] {
  const owners: Record<string, string> = {
    Reported: 'Citizen',
    Verified: 'Community',
    'AI Classified': 'AI Engine',
    Prioritized: 'District Cell',
    'University Matched': 'Matching Engine',
    'Team Formed': 'University',
    'Industry Partnered': 'Industry Partner',
    'Solution Developed': 'Student Team',
    Pilot: 'University + Govt',
    Implemented: 'District Administration',
    'Impact Measured': 'Impact Cell',
    Resolved: 'Government of Jharkhand',
  }
  return LIFECYCLE_STAGES.map((stage) => ({
    stage,
    status: 'done',
    owner: owners[stage],
  }))
}

export default function AboutPage() {
  const lifecycle = buildFullLifecycle()

  return (
    <>
      <PageBanner
        eyebrow="About the Platform"
        title="Turning citizen voice into verified, measurable impact"
        description="A digital public infrastructure that connects the people who face Jharkhand’s challenges with the academic and industry capacity to solve them — transparently, and at scale."
      />

      {/* Mission */}
      <section className="relative overflow-hidden">
        <WarliCluster className="pointer-events-none absolute -right-6 top-8 hidden h-64 opacity-60 lg:block" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Our Mission"
              title="Solving societal challenges through collective innovation"
            />
            <div className="mt-4 space-y-4 text-foreground/75">
              <p>
                Jharkhand’s most urgent problems — unsafe water, gaps in healthcare access, fragile school
                infrastructure, and rural livelihoods — are best understood by the communities living them. Yet the
                expertise and resources to solve them often sit far away, in universities and industry.
              </p>
              <p>
                This platform closes that gap. Citizens report and prioritize challenges, AI structures and verifies
                them, universities adopt them as real projects, and industry partners fund and scale the solutions —
                all monitored by government through a live GIS command centre.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {principles.map((p) => (
                <Card key={p.title} className="p-4">
                  <span className="grid size-9 place-items-center rounded-lg bg-forest-deep text-cream">
                    <p.icon className="size-4.5" />
                  </span>
                  <h3 className="mt-3 font-serif text-sm font-semibold text-forest-deep">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.body}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden bg-forest-deep/[0.03] p-6 paper-bg">
            <FlowerAccent className="absolute -right-2 -top-2 size-14" />
            <AiLabel>Why it matters</AiLabel>
            <h3 className="mt-3 font-serif text-2xl font-bold text-forest-deep text-balance">
              One shared pipeline from problem to proof
            </h3>
            <p className="mt-3 text-sm text-foreground/75">
              Instead of scattered complaints and disconnected CSR efforts, every stakeholder works from the same
              verified record — with full transparency from the first report to measured impact.
            </p>
            <ul className="mt-5 grid gap-2.5">
              {[
                'Every challenge is community-verified before action',
                'AI removes duplicates and reveals true scale',
                'Matches are explainable and factor-scored',
                'Progress is tracked against a public lifecycle',
                'Impact is measured, not just promised',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Four pillars */}
      <section className="border-y border-border bg-forest-deep/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <SectionHeading
            align="center"
            eyebrow="The Model"
            title="Four stakeholders, one collaborative loop"
            description="Each participant contributes a distinct strength — the platform orchestrates them into a single accountable workflow."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <Card key={p.title} className="flex flex-col p-5">
                <span className={`grid size-12 place-items-center rounded-2xl ${p.tone}`}>
                  <p.icon className="size-6 text-forest-deep" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-forest-deep">{p.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{p.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Challenge Lifecycle"
              title="From a single report to resolved impact"
              description="Every challenge moves through the same transparent 12-stage journey — with a clear owner accountable at each step."
            />
            <div className="mt-6 grid gap-3">
              <Card className="p-4">
                <div className="font-serif text-3xl font-bold text-secondary">12</div>
                <div className="text-sm text-muted-foreground">Accountable lifecycle stages</div>
              </Card>
              <Card className="p-4">
                <div className="font-serif text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Publicly trackable progress</div>
              </Card>
            </div>
          </div>
          <Card className="p-6">
            <LifecycleTracker steps={lifecycle} />
          </Card>
        </div>
      </section>
    </>
  )
}
