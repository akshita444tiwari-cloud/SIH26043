import type { DistrictStat } from './types'
import { districtStats } from './mock-data'

/** GIS map layer options shown in the layer/filter control. */
export const GIS_LAYERS = [
  'Overall Challenges',
  'Healthcare',
  'Water',
  'Education',
  'Agriculture',
  'Environment',
  'Infrastructure',
  'Accessibility',
  'Community Wellbeing',
] as const

export type GisLayer = (typeof GIS_LAYERS)[number]

/** Maps a display layer to the underlying data key in DistrictStat.layers. */
const LAYER_KEY: Record<GisLayer, string> = {
  'Overall Challenges': '__density',
  Healthcare: 'Healthcare',
  Water: 'Water',
  Education: 'Education',
  Agriculture: 'Agriculture',
  Environment: 'Environment',
  Infrastructure: 'Urban Infrastructure',
  Accessibility: 'Accessibility',
  'Community Wellbeing': 'Community Wellbeing',
}

/** Normalize district names so GeoJSON ("Saraikela-Kharsawan") and app data
 * ("Seraikela Kharsawan") reconcile reliably. */
export function normKey(name: string) {
  return name
    .toLowerCase()
    .replace(/seraikela|saraikela/g, 'saraikela')
    .replace(/[^a-z]/g, '')
}

const statByKey = new Map<string, DistrictStat>(districtStats.map((d) => [normKey(d.name), d]))

/** Deterministic pseudo-value (0-100) for layers/districts without seeded data. */
function fallbackValue(name: string, salt: string) {
  let h = 0
  const s = name + salt
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return 28 + (h % 60)
}

/** Returns a DistrictStat for any district name, synthesizing one deterministically
 * for districts that are on the map but not in the seed data. */
export function getStatFor(name: string): DistrictStat {
  const existing = statByKey.get(normKey(name))
  if (existing) return existing
  const base = fallbackValue(name, 'base')
  return {
    name,
    x: 0,
    y: 0,
    activeChallenges: 20 + (base % 45),
    highPriority: 4 + (base % 12),
    verifiedReports: 30 + (base % 90),
    agingProblems: 2 + (base % 10),
    projectsActive: 2 + (base % 6),
    impactScore: 55 + (base % 25),
    layers: {},
  }
}

const maxActive = Math.max(...districtStats.map((d) => d.activeChallenges), 96)

/** Value 0-100 for a district under the given layer. */
export function layerValue(name: string, layer: GisLayer): number {
  const stat = getStatFor(name)
  if (layer === 'Overall Challenges') {
    return Math.min(100, Math.round((stat.activeChallenges / maxActive) * 100))
  }
  const key = LAYER_KEY[layer]
  const seeded = stat.layers[key]
  if (typeof seeded === 'number') return seeded
  return fallbackValue(name, layer)
}

/** Warm 5-step choropleth ramp (sage -> gold -> terracotta -> brick). */
export function heatColor(value: number): string {
  const v = Math.max(0, Math.min(100, value))
  if (v < 25) return '#cde0c0'
  if (v < 45) return '#e7cd8b'
  if (v < 65) return '#e0a25c'
  if (v < 82) return '#cf7440'
  return '#a4482a'
}

export const HEAT_STOPS = [
  { label: 'Low', color: '#cde0c0' },
  { label: '', color: '#e7cd8b' },
  { label: 'Med', color: '#e0a25c' },
  { label: '', color: '#cf7440' },
  { label: 'High', color: '#a4482a' },
]
