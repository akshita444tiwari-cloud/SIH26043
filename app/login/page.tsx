import Link from 'next/link'
import LoginForm from '@/components/LoginForm'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  GraduationCap,
  Info,
  Landmark,
  Users,
  UserSquare2,
} from 'lucide-react'
import {
  JharkhandEmblem,
  CornerMandala,
  FolkBorder,
} from '@/components/cultural/motifs'
import type { Role } from '@/lib/types'

export const metadata = {
  title: 'Login',
  description:
    'Choose a role to explore the Jharkhand societal innovation platform prototype.',
}

const roles: {
  role: Role
  icon: typeof Users
  title: string
  desc: string
  tone: string
}[] = [
  {
    role: 'citizen',
    icon: Users,
    title: 'Citizen',
    desc: 'Report problems, add evidence, and vote to prioritize challenges in your community.',
    tone: 'bg-pink/40',
  },
  {
    role: 'student',
    icon: UserSquare2,
    title: 'Student',
    desc: 'Discover matched challenges, join teams, and build solutions with real social impact.',
    tone: 'bg-accent',
  },
  {
    role: 'university',
    icon: GraduationCap,
    title: 'University',
    desc: 'Adopt challenges as academic projects and manage student innovation teams.',
    tone: 'bg-peach/50',
  },
  {
    role: 'industry',
    icon: Building2,
    title: 'Industry',
    desc: 'Sponsor high-impact challenges through CSR and co-develop scalable pilots.',
    tone: 'bg-gold/30',
  },
  {
    role: 'government',
    icon: Landmark,
    title: 'Government',
    desc: 'Monitor the state GIS command centre and drive challenges to resolution.',
    tone: 'bg-primary/10',
  },
]

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden paper-bg">
      <CornerMandala className="pointer-events-none absolute -left-20 -top-16 size-80 opacity-60" />
      <CornerMandala className="pointer-events-none absolute -bottom-24 -right-20 size-96 opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-forest-deep"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        <div className="mt-8 flex flex-col items-center text-center">
          <JharkhandEmblem className="size-16" />

          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/8 px-3 py-1 text-xs font-semibold text-secondary">
            Secure Role-Based Access
          </span>

          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-forest-deep text-balance md:text-4xl">
            Choose your role to continue
          </h1>

          <p className="mt-3 max-w-xl text-foreground/70">
            Every stakeholder gets a purpose-built workspace. Select a role
            below to explore its dashboard.
          </p>
        </div>

        <div className="mt-10 grid flex-1 content-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div
              key={r.role}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 card-shadow transition-all hover:-translate-y-0.5 hover:border-secondary/40"
            >
              <span
                className={`grid size-12 place-items-center rounded-2xl ${r.tone}`}
              >
                <r.icon className="size-6 text-forest-deep" />
              </span>

              <h2 className="mt-4 font-serif text-lg font-semibold text-forest-deep">
                {r.title}
              </h2>

              <p className="mt-1 flex-1 text-sm text-foreground/70">
                {r.desc}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                Login to enter
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          ))}
        </div>

        {/* Login form */}
        <div className="mx-auto mt-8 w-full max-w-md">
          <LoginForm />
        </div>

        <div className="mt-8 flex items-start gap-2 rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />

          <p>
            Select your role to enter its dedicated workspace. Each
            stakeholder sees the tools, data, and actions relevant to their
            part of the collaborative problem-solving journey.
          </p>
        </div>
      </div>

      <FolkBorder className="opacity-60" />
    </main>
  )
}