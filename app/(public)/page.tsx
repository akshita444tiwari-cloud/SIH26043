import Link from 'next/link'
import {
  ArrowRight,
  Brain,
  Building2,
  CheckCircle2,
  Gauge,
  GitBranch,
  GraduationCap,
  Landmark,
  Map,
  ShieldCheck,
  Users,
  Vote,
} from 'lucide-react'
import { Hero } from '@/components/site/landing/hero'
import { SectionHeading } from '@/components/kit/section-heading'
import { Card } from '@/components/kit/primitives'
import { FolkBorder } from '@/components/cultural/motifs'

export const metadata = {
  title: 'Home',
}

const steps = [
  { icon: Users, title: 'Citizens Report', text: 'Residents submit verified societal challenges from their locality, with evidence and location.' },
  { icon: Vote, title: 'Community Verifies', text: 'Neighbours vote and confirm, and AI clusters duplicate reports into a single prioritized issue.' },
  { icon: Gauge, title: 'AI Prioritizes', text: 'A transparent impact score ranks challenges by affected population, severity, and urgency.' },
  { icon: GraduationCap, title: 'Universities Adopt', text: 'Explainable matching connects each challenge to the best-fit university and student team.' },
  { icon: Building2, title: 'Industry Powers', text: 'Industry partners contribute funding, hardware, mentorship, and infrastructure resources.' },
  { icon: CheckCircle2, title: 'Impact Delivered', text: 'Solutions move through pilot to implementation, with measured, tracked grassroots impact.' },
]

const features = [
  { icon: Brain, title: 'AI-Powered Deduplication', text: 'Semantic clustering detects similar reports across localities and merges them, surfacing the true scale of each problem.' },
  { icon: Vote, title: 'Community Voting & Verification', text: 'Priority-based community voting and multi-citizen verification keep the pipeline credible and grassroots-driven.' },
  { icon: Gauge, title: 'Transparent Impact Scoring', text: 'Every challenge gets an explainable 0–100 score across six weighted factors — no black boxes.' },
  { icon: Map, title: 'GIS Impact Mapping', text: 'District-level heatmaps with layered views for healthcare, water, education and more across all 23 districts.' },
  { icon: GitBranch, title: 'Lifecycle & Problem-Aging SLA', text: 'Track each issue through 12 lifecycle stages with real-time aging and SLA alerts on unresolved problems.' },
  { icon: ShieldCheck, title: 'Explainable Matching', text: 'University and industry matches always show why — expertise, past projects, infrastructure, and geography.' },
]

const stakeholders = [
  { icon: Users, title: 'Citizens', text: 'Report challenges, vote, and track resolution.', tone: 'bg-pink/40' },
  { icon: GraduationCap, title: 'Students', text: 'Find matched real-world problems to solve.', tone: 'bg-accent' },
  { icon: Landmark, title: 'Universities', text: 'Adopt challenges and form solving teams.', tone: 'bg-peach/50' },
  { icon: Building2, title: 'Industry', text: 'Sponsor, fund, and mentor solutions.', tone: 'bg-sage/60' },
  { icon: ShieldCheck, title: 'Government', text: 'Monitor, prioritize, and drive policy.', tone: 'bg-gold/25' },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <FolkBorder className="opacity-60" />

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="From a citizen's voice to measurable impact"
          description="A structured pipeline that turns grassroots problems into collaborative, funded, and tracked solutions."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title} className="relative p-5">
              <span className="absolute right-4 top-4 font-serif text-3xl font-bold text-muted">0{i + 1}</span>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-forest-deep">{s.title}</h3>
              <p className="mt-1.5 text-sm text-foreground/70">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-forest-deep/[0.03] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            align="center"
            eyebrow="Platform capabilities"
            title="Built for transparency, scale, and trust"
            description="Every feature is designed to keep the process credible, explainable, and rooted in real community need."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="p-5">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary/12 text-secondary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-forest-deep">{f.title}</h3>
                <p className="mt-1.5 text-sm text-foreground/70">{f.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <SectionHeading
          align="center"
          eyebrow="One platform, five stakeholders"
          title="Everyone has a role in the solution"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stakeholders.map((s) => (
            <div key={s.title} className={`rounded-2xl border border-border p-5 ${s.tone}`}>
              <span className="grid size-11 place-items-center rounded-xl bg-forest-deep text-cream">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-forest-deep">{s.title}</h3>
              <p className="mt-1 text-sm text-foreground/75">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 md:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-forest-deep px-6 py-14 text-center text-cream md:px-12">
          <FolkBorder tone="cream" className="absolute inset-x-0 top-0 opacity-30" />
          <h2 className="font-serif text-3xl font-bold text-balance md:text-4xl">
            Be part of Jharkhand&apos;s grassroots innovation movement
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-cream/80">
            Whether you are a citizen with a problem, a student with a solution, or a partner with resources — your
            contribution drives measurable change.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-brick">
              Get Started <ArrowRight className="size-4" />
            </Link>
            <Link href="/challenges" className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 font-semibold text-cream transition-colors hover:bg-cream/10">
              Browse Challenges
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
