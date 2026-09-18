import {
  Award,
  Bell,
  FolderKanban,
  MapPin,
  Target,
  Users,
} from 'lucide-react'
import { DashSection } from '@/components/dashboard/dashboard-shell'
import { Card, Badge, Progress } from '@/components/kit/primitives'
import { MetricCard } from '@/components/kit/metric-card'
import { AIInsightCard } from '@/components/kit/ai-cards'
import { LifecycleTracker } from '@/components/kit/lifecycle-tracker'
import { StudentMatched } from '@/components/kit/student-matched'
import { getStudentMatches, getProjects, getNotifications } from '@/lib/services'
import { STUDENT_SKILLS } from '@/lib/mock-data'

export const metadata = { title: 'Student Innovation Hub' }

export default function StudentDashboard() {
  const matches = getStudentMatches()
  const projects = getProjects()
  const notifications = getNotifications().slice(0, 4)

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <DashSection
        id="overview"
        title="Your innovation journey"
        description="AI-matched challenges aligned to your skills, and the real-world projects you’re building."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Target} value={matches.length} label="Matched challenges" tone="peach" />
          <MetricCard icon={FolderKanban} value={projects.length} label="Active projects" tone="sage" />
          <MetricCard icon={Award} value="92%" label="Top match score" tone="pink" />
          <MetricCard icon={Users} value="5" label="Team members" tone="cream" />
        </div>
      </DashSection>

      {/* Matched challenges + join flow */}
      <StudentMatched matches={matches} />

      {/* Projects */}
      <DashSection id="projects" title="My Projects" description="Track milestones and collaborate with your team, faculty, and industry mentors.">
        {projects.map((p) => (
          <Card key={p.id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge tone="terracotta">{p.status}</Badge>
                <h3 className="mt-2 font-serif text-xl font-bold text-forest-deep">{p.title}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {p.district} · {p.domain}
                </p>
              </div>
              <Badge tone="outline" className="font-mono text-[0.7rem]">
                {p.id}
              </Badge>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl bg-muted/50 p-4 text-sm">
                <div className="font-semibold text-forest-deep">Team</div>
                <p className="mt-1 text-muted-foreground">{p.team}</p>
                <p className="mt-1 text-muted-foreground">{p.faculty}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-sm">
                <div className="font-semibold text-forest-deep">Partners</div>
                <p className="mt-1 text-muted-foreground">{p.university}</p>
                <p className="mt-1 text-muted-foreground">{p.industry}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-sm">
                <div className="font-semibold text-forest-deep">Government</div>
                <p className="mt-1 text-muted-foreground">{p.department}</p>
                <p className="mt-1 text-muted-foreground">{p.community}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div>
                <h4 className="mb-3 text-sm font-semibold text-forest-deep">Lifecycle</h4>
                <LifecycleTracker steps={p.timeline} compact />
              </div>
              <div>
                <h4 className="mb-3 text-sm font-semibold text-forest-deep">Milestones</h4>
                <div className="space-y-2">
                  {p.milestones.map((m) => (
                    <div key={m.name} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-forest-deep">{m.name}</span>
                        <Badge
                          tone={m.status === 'Done' ? 'forest' : m.status === 'In Progress' ? 'terracotta' : 'neutral'}
                        >
                          {m.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.due} · {m.owner}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </DashSection>

      {/* Skills + notifications */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <DashSection id="skills" title="Skills & Profile" description="Your skills drive the AI matching engine.">
          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              {STUDENT_SKILLS.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/25 bg-primary/[0.06] px-3 py-1.5 text-sm font-medium text-forest-deep"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Profile completeness', value: 86 },
                { label: 'Skill-challenge alignment', value: 92 },
                { label: 'Team readiness', value: 78 },
              ].map((r) => (
                <div key={r.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground/80">{r.label}</span>
                    <span className="font-semibold text-forest-deep">{r.value}%</span>
                  </div>
                  <Progress value={r.value} />
                </div>
              ))}
            </div>
            <AIInsightCard className="mt-5" label="AI Recommendation" title="Boost your match rate">
              Adding a short portfolio project on <span className="font-semibold text-forest-deep">GIS mapping</span> could
              unlock 4 more high-impact challenges in Agriculture and Environment.
            </AIInsightCard>
          </Card>
        </DashSection>

        <DashSection id="notifications" title="Notifications">
          <Card className="divide-y divide-border">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Bell className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-forest-deep">{n.title}</h4>
                    {n.unread && <span className="size-2 shrink-0 rounded-full bg-secondary" aria-label="Unread" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.detail}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
              </div>
            ))}
          </Card>
        </DashSection>
      </div>
    </div>
  )
}
