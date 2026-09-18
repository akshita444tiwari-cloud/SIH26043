import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Brain, HeartHandshake, Landmark, ThumbsUp, Timer, Users } from 'lucide-react'
import { CornerMandala, FlowerAccent, WarliCluster } from '@/components/cultural/motifs'
import { MetricCard } from '@/components/kit/metric-card'
import { platformMetrics } from '@/lib/mock-data'

const features = [
  { icon: Users, title: 'Community Voting', sub: 'Priority-based voting', tone: 'terracotta' },
  { icon: Brain, title: 'AI Deduplication', sub: 'Finding similar issues', tone: 'forest' },
  { icon: Timer, title: 'Lifecycle & SLA', sub: 'Real-time tracking', tone: 'pink' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden paper-bg">
      <CornerMandala className="pointer-events-none absolute -left-16 top-24 size-72 opacity-70" />
      <WarliCluster className="pointer-events-none absolute bottom-8 left-4 hidden h-56 md:block" />
      <FlowerAccent className="pointer-events-none absolute right-1/2 top-10 size-12 opacity-60" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/8 px-3 py-1 text-xs font-semibold text-secondary">
            <FlowerAccent className="size-4" /> Digital Jharkhand · Societal Innovation
          </span>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight text-forest-deep text-balance md:text-5xl lg:text-[3.4rem]">
            A Digital Platform to{' '}
            <span className="text-secondary">Crowdsource &amp; Solve Jharkhand&apos;s Societal Challenges</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-foreground/75">
            Connecting Citizen Voice with Academic Rigor and Industry Power for Sustainable Grassroots Impact.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex items-center justify-between gap-4 rounded-xl bg-secondary px-5 py-4 text-left text-secondary-foreground transition-colors hover:bg-brick"
            >
              <span className="flex items-center gap-3">
                <Users className="size-6" />
                <span>
                  <span className="block font-semibold">Submit a Challenge</span>
                  <span className="block text-xs text-secondary-foreground/80">(Citizens)</span>
                </span>
              </span>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="group inline-flex items-center justify-between gap-4 rounded-xl bg-forest-deep px-5 py-4 text-left text-cream transition-colors hover:bg-forest"
            >
              <span className="flex items-center gap-3">
                <HeartHandshake className="size-6" />
                <span>
                  <span className="block font-semibold">Partner &amp; Solve</span>
                  <span className="block text-xs text-cream/80">(Universities &amp; Industry)</span>
                </span>
              </span>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-card/70 p-3 card-shadow"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-forest-deep text-cream">
                  <f.icon className="size-4.5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-forest-deep">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border card-shadow">
            <Image
              src="/images/hero-jharkhand.png"
              alt="Illustration of Jharkhand tribal community members with traditional temple architecture and waterfalls"
              width={720}
              height={720}
              priority
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-forest-deep/30 to-transparent" />
          </div>
          <FlowerAccent className="absolute -right-4 -top-4 size-16" />
        </div>
      </div>

      {/* metrics strip */}
      <div className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Users} value={platformMetrics.activeChallenges} label="Active Societal Challenges" tone="pink" />
          <MetricCard icon={Landmark} value={platformMetrics.universities} label="Adopting Universities" tone="sage" />
          <MetricCard icon={ThumbsUp} value={platformMetrics.industry} label="Industry Sponsors" tone="peach" />
          <MetricCard icon={HeartHandshake} value={platformMetrics.resources} label="Impact Resources Deployed" tone="accent" />
        </div>
      </div>
    </section>
  )
}
