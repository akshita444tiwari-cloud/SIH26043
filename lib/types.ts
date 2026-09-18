export type Role = 'citizen' | 'student' | 'university' | 'government' | 'industry'

export type Domain =
  | 'Education'
  | 'Healthcare'
  | 'Agriculture'
  | 'Water'
  | 'Sanitation'
  | 'Environment'
  | 'Energy'
  | 'Urban Infrastructure'
  | 'Accessibility'
  | 'Public Administration'
  | 'Rural Livelihoods'
  | 'Mental Health'

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

export type LifecycleStage =
  | 'Reported'
  | 'Verified'
  | 'AI Classified'
  | 'Prioritized'
  | 'University Matched'
  | 'Team Formed'
  | 'Industry Partnered'
  | 'Solution Developed'
  | 'Pilot'
  | 'Implemented'
  | 'Impact Measured'
  | 'Resolved'

export type ChallengeStatus =
  | 'Submitted'
  | 'Under Verification'
  | 'Verified'
  | 'Matched'
  | 'In Progress'
  | 'Resolved'

export interface ImpactBreakdown {
  affectedPopulation: number
  severity: number
  communitySupport: number
  evidenceQuality: number
  recurrence: number
  urgency: number
}

export interface LifecycleStep {
  stage: LifecycleStage
  status: 'done' | 'active' | 'pending'
  date?: string
  owner?: string
  note?: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  domain: Domain
  district: string
  locality: string
  severity: Severity
  status: ChallengeStatus
  stage: LifecycleStage
  impactScore: number
  impactBreakdown: ImpactBreakdown
  verifiedCitizens: number
  communitySupport: number
  evidenceCount: number
  affectedPeople: number
  daysUnresolved: number
  aiTags: string[]
  supportingReports: number
  university?: string
  industry?: string
  createdAt: string
  lifecycle: LifecycleStep[]
}

export interface DistrictStat {
  name: string
  /** relative grid position on the stylized map (0-100) */
  x: number
  y: number
  activeChallenges: number
  highPriority: number
  verifiedReports: number
  agingProblems: number
  projectsActive: number
  impactScore: number
  /** density values per domain layer 0-100 */
  layers: Record<string, number>
}

export interface MatchFactor {
  label: string
  score: number
}

export interface UniversityMatch {
  id: string
  name: string
  district: string
  matchScore: number
  reasons: string[]
  factors: MatchFactor[]
}

export interface IndustryMatch {
  id: string
  name: string
  sector: string
  matchScore: number
  provides: string[]
  reasons: string[]
}

export interface DuplicateReport {
  id: string
  locality: string
  date: string
  similarity: number
  support: number
  evidence: number
}

export interface Cluster {
  clusterTitle: string
  district: string
  primaryChallengeId: string
  reports: DuplicateReport[]
}

export interface Milestone {
  name: string
  due: string
  status: 'Done' | 'In Progress' | 'Upcoming'
  owner: string
  deliverables: string[]
}

export interface Project {
  id: string
  title: string
  status: LifecycleStage
  domain: Domain
  district: string
  problem: string
  community: string
  university: string
  team: string
  faculty: string
  industry: string
  department: string
  timeline: LifecycleStep[]
  milestones: Milestone[]
}

export interface Notification {
  id: string
  title: string
  detail: string
  time: string
  type: 'verify' | 'match' | 'ai' | 'industry' | 'milestone' | 'impact'
  unread: boolean
}

export interface EarlyWarning {
  id: string
  title: string
  domain: Domain
  district: string
  risk: 'Elevated' | 'Moderate' | 'High'
  confidence: number
  signals: { label: string; delta: string }[]
  relatedReports: number
  recommendation: string
}

export interface StudentMatch extends Challenge {
  matchPercent: number
  matchReasons: string[]
}

export type AccessibilityStatus = 'Present' | 'Partial' | 'Absent'

export type FacilityType =
  | 'Hospital'
  | 'School'
  | 'Transport Hub'
  | 'Govt Office'
  | 'Public Space'

export interface AccessibilityAudit {
  id: string
  facility: string
  type: FacilityType
  district: string
  locality: string
  /** Composite accessibility score 0-100 (higher = more barrier-free). */
  score: number
  compliance: 'Compliant' | 'Partial' | 'Non-compliant'
  criteria: { label: string; status: AccessibilityStatus }[]
}

export interface WellbeingSignal {
  district: string
  /** Composite community wellbeing index 0-100 (higher = better). */
  index: number
  trend: 'Improving' | 'Stable' | 'Declining'
  /** % of population within reach of a support resource. */
  supportCoverage: number
}
