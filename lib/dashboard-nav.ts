import {
  Accessibility,
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  HeartPulse,
  FileText,
  FolderKanban,
  Gauge,
  GraduationCap,
  HandCoins,
  Handshake,
  LayoutDashboard,
  type LucideIcon,
  MapPinned,
  PlusCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Vote,
} from 'lucide-react'
import type { Role } from './types'

export interface NavItem {
  label: string
  icon: LucideIcon
  /** Anchor (in-page section) or absolute route. */
  href: string
}

/**
 * Per-role dashboard navigation. Anchor links (#id) jump to sections within
 * the role's single dashboard page; absolute routes navigate to sub-pages.
 */
export const DASHBOARD_NAV: Record<Role, NavItem[]> = {
  citizen: [
    { label: 'Overview', icon: LayoutDashboard, href: '#overview' },
    { label: 'My Challenges', icon: FileText, href: '#my-challenges' },
    { label: 'Submit Challenge', icon: PlusCircle, href: '/dashboard/citizen/submit' },
    { label: 'Community Voting', icon: Vote, href: '#voting' },
    { label: 'Notifications', icon: Bell, href: '#notifications' },
  ],
  student: [
    { label: 'Overview', icon: LayoutDashboard, href: '#overview' },
    { label: 'Matched Challenges', icon: Sparkles, href: '#matches' },
    { label: 'My Projects', icon: FolderKanban, href: '#projects' },
    { label: 'Skills & Profile', icon: GraduationCap, href: '#skills' },
    { label: 'Notifications', icon: Bell, href: '#notifications' },
  ],
  university: [
    { label: 'Overview', icon: LayoutDashboard, href: '#overview' },
    { label: 'Recommended Challenges', icon: Target, href: '#matched' },
    { label: 'Active Projects', icon: FolderKanban, href: '#projects' },
    { label: 'Student Teams', icon: Users, href: '#teams' },
    { label: 'Impact', icon: TrendingUp, href: '#impact' },
  ],
  industry: [
    { label: 'Overview', icon: LayoutDashboard, href: '#overview' },
    { label: 'Opportunities', icon: Target, href: '#opportunities' },
    { label: 'My Sponsorships', icon: HandCoins, href: '#sponsorships' },
    { label: 'CSR Impact', icon: TrendingUp, href: '#impact' },
    { label: 'Partnerships', icon: Handshake, href: '#partnerships' },
  ],
  government: [
    { label: 'Command Centre', icon: Gauge, href: '#overview' },
    { label: 'GIS Map', icon: MapPinned, href: '#gis' },
    { label: 'Early Warnings', icon: AlertTriangle, href: '#warnings' },
    { label: 'Accessibility', icon: Accessibility, href: '#accessibility' },
    { label: 'Wellbeing', icon: HeartPulse, href: '#wellbeing' },
    { label: 'Resolution Pipeline', icon: Activity, href: '#pipeline' },
    { label: 'Partners', icon: Building2, href: '#partners' },
  ],
}

export const ROLE_ICON: Record<Role, LucideIcon> = {
  citizen: Users,
  student: GraduationCap,
  university: GraduationCap,
  government: MapPinned,
  industry: Building2,
}

export const ROLES: Role[] = ['citizen', 'student', 'university', 'government', 'industry']
