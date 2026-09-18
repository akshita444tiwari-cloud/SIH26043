import Link from 'next/link'
import { ArrowUpRight, Award, FlaskConical, FolderKanban, GraduationCap, MapPin, TrendingUp, Users2 } from 'lucide-react'
import { DashSection } from '@/components/dashboard/dashboard-shell'
import { Card, Badge, Progress, SeverityBadge } from '@/components/kit/primitives'
import { MetricCard } from '@/components/kit/metric-card'
import { AIInsightCard } from '@/components/kit/ai-cards'
import { LifecycleTracker } from '@/components/kit/lifecycle-tracker'
import { BarList } from '@/components/kit/charts'
import { UniversityMatched } from '@/components/kit/university-matched'
import { getChallenges, getProjects } from '@/lib/services'

export const metadata = { title: 'University Innovation Workspace' }

const teams = [
  {
    name: 'Team JalRakshak',
    department: 'Environmental Engineering',
    faculty: 'Dr. A. Mahato',
    challenge: 'Smart Rural Water Monitoring',
    members: 5,
    stage: 'Pilot',
    progress: 72,
    skills: ['IoT', 'Water Analytics', 'Cloud'],
  },
  {
    name: 'Team AccessAbility',
    department: 'Civil Engineering',
    faculty: 'Prof. S. Kujur',
    challenge: 'Barrier-free Block Hospital',
    members: 4,
    stage: 'Solution Developed',
    progress: 58,
    skills: ['Structural Design', 'Accessibility', 'GIS'],
  },
  {
    name: 'Team GreenGrid',
    department: 'Electrical & Instrumentation',
    faculty: 'Dr. R. Prasad',
    challenge: 'Clinic Cold-chain Solar Backup',
    members: 6,
    stage: 'Team Formed',
    progress: 34,
    skills: ['Energy Systems', 'IoT', 'Embedded'],
  },
]

const impactByDomain = [
  { label: 'Water', value: 4, hint: 'projects' },
  { label: 'Healthcare', value: 3, hint: 'projects' },
  { label: 'Energy', value: 2, hint: 'projects' },
  { label: 'Education', value: 2, hint: 'projects' },
]

export default async function UniversityDashboard() {
  const incoming = (await getChallenges()).slice(0, 4)
  const projects = getProjects()
  const departmentLoad = [
    { label: 'Civil & Environmental Eng.', value: 8, hint: 'projects' },
    { label: 'Electrical & Instrumentation', value: 6, hint: 'projects' },
    { label: 'Computer Science & AI', value: 5, hint: 'projects' },
    { label: 'Public Health Engineering', value: 4, hint: 'projects' },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <DashSection
        id="overview"
        title="BIT Mesra — Innovation Workspace"
        description="Review AI-matched challenges, form teams, and manage live projects with communities and industry."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={GraduationCap} value="12" label="Matched challenges" tone="pink" />
          <MetricCard icon={FolderKanban} value="9" label="Active projects" tone="sage" />
          <MetricCard icon={Users2} value="47" label="Students engaged" tone="peach" />
          <MetricCard icon={FlaskConical} value="4" label="Pilots deployed" tone="cream" />
        </div>
      </DashSection>

      {/* Incoming matched challenges + accept + form team */}
      <UniversityMatched incoming={incoming} />

      {/* Active projects */}
      <DashSection id="projects" title="Active Projects" description="Faculty-supervised teams solving verified community challenges.">
        {projects.map((p) => (
          <Card key={p.id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge tone="terracotta">{p.status}</Badge>
                <h3 className="mt-2 font-serif text-xl font-bold text-forest-deep">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.team} · {p.faculty}
                </p>
              </div>
              <Badge tone="outline" className="font-mono text-[0.7rem]">
                {p.id}
              </Badge>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <LifecycleTracker steps={p.timeline} compact />
              <div className="space-y-2">
                {p.milestones.map((m) => (
                  <div key={m.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <span className="text-sm font-semibold text-forest-deep">{m.name}</span>
                      <p className="text-xs text-muted-foreground">{m.due} · {m.owner}</p>
                    </div>
                    <Badge tone={m.status === 'Done' ? 'forest' : m.status === 'In Progress' ? 'terracotta' : 'neutral'}>
                      {m.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </DashSection>

      {/* Department capacity + AI */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <DashSection id="capacity" title="Department Capacity" description="Distribution of active projects across departments.">
          <Card className="p-6">
            <BarList data={departmentLoad} suffix="" />
          </Card>
        </DashSection>
        <DashSection id="ai" title="AI Recommendations">
          <AIInsightCard title="Under-utilised expertise detected">
            Your <span className="font-semibold text-forest-deep">Renewable Energy Lab</span> matches 3 unassigned
            Energy challenges in Palamu & Latehar. Assigning a team could raise your institutional impact score by ~6
            points this quarter.
          </AIInsightCard>
        </DashSection>
      </div>

      {/* Student teams */}
      <DashSection id="teams" title="Student Teams" description="Faculty-mentored teams currently building solutions for matched challenges.">
        <div className="grid gap-4 lg:grid-cols-3">
          {teams.map((t) => (
            <Card key={t.name} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif text-base font-semibold text-forest-deep">{t.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.department}</p>
                </div>
                <Badge tone="terracotta">{t.stage}</Badge>
              </div>
              <p className="mt-3 text-sm text-foreground/80">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Users2 className="size-3.5" /> {t.members} students · {t.faculty}
                </span>
              </p>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-forest-deep">{t.challenge}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.skills.map((s) => (
                  <span key={s} className="rounded-md bg-accent px-2 py-0.5 text-[0.7rem] font-medium text-accent-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Project progress</span>
                  <span className="font-semibold text-forest-deep">{t.progress}%</span>
                </div>
                <Progress value={t.progress} barClassName="bg-secondary" />
              </div>
            </Card>
          ))}
        </div>
      </DashSection>

      {/* Institutional impact */}
      <DashSection id="impact" title="Institutional Impact" description="Outcomes generated by your teams across communities and domains.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={TrendingUp} value="12,400+" label="People impacted" tone="pink" />
          <MetricCard icon={FlaskConical} value="4" label="Pilots deployed" tone="sage" />
          <MetricCard icon={Award} value="82" label="Institutional impact score" tone="peach" />
          <MetricCard icon={GraduationCap} value="6" label="Publications & patents" tone="cream" />
        </div>
        <Card className="mt-4 p-6">
          <h3 className="mb-4 font-serif text-base font-semibold text-forest-deep">Active projects by domain</h3>
          <BarList data={impactByDomain} suffix="" />
        </Card>
      </DashSection>
    </div>
  )
}
