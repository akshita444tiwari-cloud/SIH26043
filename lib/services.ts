/**
 * Mock service layer. Every function here is a clean boundary that can later be
 * replaced with a real REST / Supabase call without touching UI components.
 * All data is prototype/demo data for the SIH 2026 prototype.
 */
import {
  accessibilityAudits,
  challenges,
  districtStats,
  duplicateCluster,
  earlyWarnings,
  industryMatches,
  notifications,
  projects,
  studentMatches,
  universityMatches,
  wellbeingSignals,
  wellbeingWarnings,
} from './mock-data'
import type { Challenge, Domain, Role } from './types'
import { supabase } from './supabase/client'

export async function getChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching challenges:', error)
    return []
  }

  return (data ?? []).map((p): Challenge => ({
    id: p.id,
    title: p.title,
    description: p.description,
    domain: p.category as Domain,
    district: p.district,
    locality: p.location_name || p.village || p.block || p.district,
    severity:
      p.priority === 'Critical'
        ? 'Critical'
        : p.priority === 'High'
          ? 'High'
          : p.priority === 'Low'
            ? 'Low'
            : 'Medium',
    status:
      p.status === 'Resolved'
        ? 'Resolved'
        : p.status === 'In Progress'
          ? 'In Progress'
          : p.status === 'Matched'
            ? 'Matched'
            : p.status === 'Verified'
              ? 'Verified'
              : p.status === 'Under Verification'
                ? 'Under Verification'
                : 'Submitted',
    stage: 'Reported',
    impactScore: 0,
    impactBreakdown: {
      affectedPopulation: 0,
      severity: 0,
      communitySupport: 0,
      evidenceQuality: 0,
      recurrence: 0,
      urgency: 0,
    },
    verifiedCitizens: 0,
    communitySupport: 0,
    evidenceCount: p.image_url ? 1 : 0,
    affectedPeople: 0,
    daysUnresolved: 0,
    aiTags: p.subcategory ? [p.subcategory] : [],
    supportingReports: 0,
    createdAt: p.created_at,
    lifecycle: [
      {
        stage: 'Reported',
        status: 'active',
        date: p.created_at,
      },
    ],
  }))
}

  export async function getChallengeById(id: string): Promise<Challenge | undefined> {
  const challenges = await getChallenges()
  return challenges.find((c) => c.id === id)
}

export function getDistrictStats() {
  return districtStats
}
export function getUniversityMatches() {
  return universityMatches
}

export function getIndustryMatches() {
  return industryMatches
}

export function getDuplicateCluster() {
  return duplicateCluster
}

export function getEarlyWarnings() {
  return earlyWarnings
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('solutions')
    .select(`
      id,
      title,
      description,
      estimated_cost,
      timeline,
      status,
      universities (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return (data ?? []).map((s: any) => ({
    id: s.id,
    title: s.title,
    status: s.status,
    university: s.universities?.name ?? 'University',
    team: 'Student Innovation Team',
    timeline: [
      {
        stage: 'Solution Developed',
        status: 'active',
      },
    ],
  }))
}

export function getNotifications() {
  return notifications
}

export function getStudentMatches() {
  return studentMatches
}

export function getAccessibilityAudits() {
  return accessibilityAudits
}

export function getWellbeingSignals() {
  return wellbeingSignals
}

export function getWellbeingWarnings() {
  return wellbeingWarnings
}

/** Simulates AI classification of a free-text problem description. */
export function predictCategory(text: string): { domain: Domain; confidence: number; tags: string[] } {
  const t = text.toLowerCase()
  const rules: { keys: string[]; domain: Domain; tags: string[] }[] = [
    { keys: ['water', 'handpump', 'drinking', 'well', 'tap'], domain: 'Water', tags: ['Water Quality', 'Public Health'] },
    { keys: ['school', 'teacher', 'student', 'education', 'classroom'], domain: 'Education', tags: ['School Infrastructure', 'Retention'] },
    { keys: ['hospital', 'clinic', 'doctor', 'health', 'medicine', 'anm'], domain: 'Healthcare', tags: ['Healthcare Access', 'Last-mile Care'] },
    { keys: ['crop', 'farm', 'irrigation', 'paddy', 'soil'], domain: 'Agriculture', tags: ['Irrigation', 'Farm Yield'] },
    { keys: ['ramp', 'wheelchair', 'accessible', 'disabled', 'tactile'], domain: 'Accessibility', tags: ['Barrier-free', 'Accessibility'] },
    { keys: ['waste', 'garbage', 'toilet', 'sewage', 'drain'], domain: 'Sanitation', tags: ['Solid Waste', 'Urban Sanitation'] },
    { keys: ['power', 'electricity', 'solar', 'grid'], domain: 'Energy', tags: ['Rural Electrification'] },
    { keys: ['forest', 'pollution', 'tree', 'river', 'catchment'], domain: 'Environment', tags: ['Ecology'] },
  ]
  for (const r of rules) {
    if (r.keys.some((k) => t.includes(k))) {
      return { domain: r.domain, confidence: 88 + Math.floor(Math.random() * 8), tags: r.tags }
    }
  }
  return { domain: 'Public Administration', confidence: 71, tags: ['Service Delivery'] }
}

/** Simulates a preliminary impact score for a new submission. */
export function estimateImpactScore(affected: number, severity: string): number {
  const sev = { Low: 40, Medium: 62, High: 80, Critical: 92 }[severity] ?? 60
  const pop = Math.min(95, 40 + Math.log10(Math.max(affected, 1)) * 15)
  return Math.round(sev * 0.55 + pop * 0.45)
}

export const ROLE_LABELS: Record<Role, string> = {
  citizen: 'Citizen',
  student: 'Student',
  university: 'University',
  government: 'Government',
  industry: 'Industry',
}

export const DASHBOARD_TITLES: Record<Role, string> = {
  citizen: 'Community Impact Hub',
  student: 'Student Innovation Hub',
  university: 'University Innovation Workspace',
  government: 'Jharkhand Societal Impact Command Centre',
  industry: 'Industry Partnership Hub',
}

/** Production-style account display names shown in the dashboard chrome. */
export const ROLE_DISPLAY: Record<Role, string> = {
  citizen: 'Anita Devi',
  student: 'Aarav Sharma',
  university: 'BIT Mesra, Ranchi',
  government: 'District Cell — Ranchi',
  industry: 'AgriSense Technologies',
}
