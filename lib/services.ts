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

export async function getChallenges(): Promise<Challenge[]> {
  return challenges
}

export function getChallengeById(id: string): Challenge | undefined {
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

export function getProjects() {
  return projects
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
export function predictCategory(
  text: string
): {
  domain: Domain
  confidence: number
  tags: string[]
} {
  const t = text.toLowerCase()

  const rules: {
    keys: string[]
    domain: Domain
    tags: string[]
  }[] = [
    {
      keys: ['water', 'handpump', 'drinking', 'well', 'tap'],
      domain: 'Water',
      tags: ['Water Quality', 'Public Health'],
    },
    {
      keys: ['school', 'teacher', 'student', 'education', 'classroom'],
      domain: 'Education',
      tags: ['School Infrastructure', 'Retention'],
    },
    {
      keys: ['hospital', 'clinic', 'doctor', 'health', 'medicine', 'anm'],
      domain: 'Healthcare',
      tags: ['Healthcare Access', 'Last-mile Care'],
    },
    {
      keys: ['crop', 'farm', 'irrigation', 'paddy', 'soil'],
      domain: 'Agriculture',
      tags: ['Irrigation', 'Farm Yield'],
    },
    {
      keys: ['ramp', 'wheelchair', 'accessible', 'disabled', 'tactile'],
      domain: 'Accessibility',
      tags: ['Barrier-free', 'Accessibility'],
    },
    {
      keys: ['waste', 'garbage', 'toilet', 'sewage', 'drain'],
      domain: 'Sanitation',
      tags: ['Solid Waste', 'Urban Sanitation'],
    },
    {
      keys: ['power', 'electricity', 'solar', 'grid'],
      domain: 'Energy',
      tags: ['Rural Electrification'],
    },
    {
      keys: ['forest', 'pollution', 'tree', 'river', 'catchment'],
      domain: 'Environment',
      tags: ['Ecology'],
    },
  ]

  for (const r of rules) {
    if (r.keys.some((k) => t.includes(k))) {
      return {
        domain: r.domain,
        confidence: 88 + Math.floor(Math.random() * 8),
        tags: r.tags,
      }
    }
  }

  return {
    domain: 'Public Administration',
    confidence: 71,
    tags: ['Service Delivery'],
  }
}

/** Simulates a preliminary impact score for a new submission. */
export function estimateImpactScore(
  affected: number,
  severity: string
): number {
  const sev = {
    Low: 40,
    Medium: 62,
    High: 80,
    Critical: 92,
  }[severity] ?? 60

  const pop = Math.min(
    95,
    40 + Math.log10(Math.max(affected, 1)) * 15
  )

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

/**
 * Default role labels.
 * Actual logged-in user names should be fetched from
 * Supabase profiles.full_name instead of being hardcoded here.
 */
export const ROLE_DISPLAY: Record<Role, string> = {
  citizen: 'Citizen',
  student: 'Student',
  university: 'University',
  government: 'Government',
  industry: 'Industry',
}