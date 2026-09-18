import Link from 'next/link'
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Lightbulb,
  Rocket,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { PageBanner } from '@/components/site/page-banner'
import { SectionHeading } from '@/components/kit/section-heading'
import { Card } from '@/components/kit/primitives'
import { MetricCard } from '@/components/kit/metric-card'
import { CornerMandala } from '@/components/cultural/motifs'
import { impactStats } from '@/lib/mock-data'

export const metadata = {
  title: 'Partnerships',
  description:
    'Partner with the Government of Jharkhand — universities adopt real challenges and industry sponsors fund high-impact solutions through CSR.',
}

const universityBenefits = [
  'Adopt verified, real-world challenges as academic and capstone projects',
  'Give students measurable social impact for their portfolios',
  'Access CSR-backed funding and industry mentorship',
  'Publish applied research with demonstrable field outcomes',
  'Recognition on the state Impact Dashboard and leaderboards',
]

const industryBenefits = [
  'Direct CSR spend to verified, high-impact grassroots challenges',
  'Co-develop scalable pilots with university innovation teams',
  'Transparent, measurable ROI tracked against the lifecycle',
  'Access a pipeline of vetted talent and prototypes',
  'Brand association with tangible social good in Jharkhand',
]

const steps = [
  {
    icon: Target,
    title: 'Express Interest',
    body: 'Register as a university or industry partner and share your domains of strength and capacity.',
  },
  {
    icon: Lightbulb,
    title: 'Get Matched',
    body: 'Our explainable engine recommends challenges that fit your expertise, resources, and location.',
  },
  {
    icon: Rocket,
    title: 'Adopt & Build',
    body: 'Form teams, commit resources, and co-develop solutions against a transparent milestone plan.',
  },
  {
    icon: TrendingUp,
    title: 'Measure Impact',
    body: 'Track pilots to deployment and see verified impact reflected on the state dashboard.',
  },
]

const tiers = [
  {
    icon: HeartHandshake,
    name: 'Community Supporter',
    scope: 'Single challenge',
    features: ['Sponsor one verified challenge', 'Mentorship & in-kind support', 'Impact report on resolution'],
    tone: 'bg-accent',
  },
  {
    icon: Award,
    name: 'Impact Partner',
    scope: 'District programme',
    features: ['Sponsor a district challenge cluster', 'Dedicated student teams', 'Quarterly impact reviews', 'Dashboard recognition'],
    tone: 'bg-peach/50',
    featured: true,
  },
  {
    icon: HandCoins,
    name: 'Strategic Collaborator',
    scope: 'Statewide',
    features: ['Multi-district CSR programme', 'Co-branded innovation challenges', 'Priority talent pipeline', 'Executive impact council seat'],
    tone: 'bg-pink/40',
  },
]

export default function PartnershipsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Partnerships"
        title="Partner with Jharkhand to solve challenges that matter"
        description="Universities bring rigor and talent. Industry brings resources and scale. Together, they turn verified community challenges into deployed, measurable impact."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick"
          >
            <GraduationCap className="size-4" /> University Access
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-forest-deep px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest"
          >
            <Building2 className="size-4" /> Industry Sponsorship
          </Link>
        </div>
      </PageBanner>

      {/* Impact strip */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={GraduationCap} value={`${impactStats.universityProjects}`} label="University projects underway" tone="sage" />
          <MetricCard icon={Building2} value={`${impactStats.industryPartnerships}`} label="Active industry partnerships" tone="peach" />
          <MetricCard icon={Rocket} value={`${impactStats.innovations}`} label="Innovations developed" tone="pink" />
          <MetricCard icon={Users} value={impactStats.peopleImpacted} label="People impacted statewide" tone="accent" />
        </div>
      </section>

      {/* Two audiences */}
      <section className="border-y border-border bg-forest-deep/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:grid-cols-2 md:px-6">
          <Card className="flex flex-col p-6">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent">
              <GraduationCap className="size-6 text-forest-deep" />
            </span>
            <h3 className="mt-4 font-serif text-2xl font-bold text-forest-deep">For Universities</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Transform coursework into contribution. Adopt real challenges, mentor student teams, and turn research
              into field-tested solutions.
            </p>
            <ul className="mt-5 grid flex-1 gap-2.5">
              {universityBenefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brick"
            >
              Register your university <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Card>

          <Card className="flex flex-col p-6">
            <span className="grid size-12 place-items-center rounded-2xl bg-peach/50">
              <Building2 className="size-6 text-forest-deep" />
            </span>
            <h3 className="mt-4 font-serif text-2xl font-bold text-forest-deep">For Industry</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Make CSR count. Fund verified challenges, co-build with universities, and see transparent, measurable
              returns on social investment.
            </p>
            <ul className="mt-5 grid flex-1 gap-2.5">
              {industryBenefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-brick"
            >
              Become a sponsor <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Card>
        </div>
      </section>

      {/* How partnership works */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <SectionHeading
          align="center"
          eyebrow="How It Works"
          title="From interest to measurable impact"
          description="A simple, transparent onboarding designed to get partners solving real challenges quickly."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Card key={s.title} className="relative p-5">
              <span className="absolute right-4 top-4 font-serif text-3xl font-bold text-muted-foreground/25">
                {i + 1}
              </span>
              <span className="grid size-11 place-items-center rounded-xl bg-forest-deep text-cream">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-serif text-base font-semibold text-forest-deep">{s.title}</h3>
              <p className="mt-1.5 text-sm text-foreground/70">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="relative overflow-hidden border-t border-border bg-forest-deep/[0.03]">
        <CornerMandala className="pointer-events-none absolute -right-16 -top-16 size-72 opacity-60" />
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <SectionHeading
            align="center"
            eyebrow="Partnership Tiers"
            title="Choose how you want to make an impact"
            description="Every tier plugs into the same transparent lifecycle — scale your commitment from a single challenge to a statewide programme."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {tiers.map((t) => (
              <Card
                key={t.name}
                className={`flex flex-col p-6 ${t.featured ? 'ring-2 ring-secondary' : ''}`}
              >
                {t.featured && (
                  <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-secondary-foreground">
                    Most popular
                  </span>
                )}
                <span className={`grid size-12 place-items-center rounded-2xl ${t.tone}`}>
                  <t.icon className="size-6 text-forest-deep" />
                </span>
                <h3 className="mt-4 font-serif text-xl font-bold text-forest-deep">{t.name}</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.scope}</p>
                <ul className="mt-4 grid flex-1 gap-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    t.featured
                      ? 'bg-secondary text-secondary-foreground hover:bg-brick'
                      : 'border border-forest/40 text-forest-deep hover:bg-primary/10'
                  }`}
                >
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
