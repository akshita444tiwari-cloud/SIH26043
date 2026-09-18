'use client'

import { useSyncExternalStore } from 'react'

/**
 * Lightweight client-side state store for the prototype.
 *
 * Every mutation here is a clean seam that can later be swapped for a real
 * API / Supabase call without touching the UI components that read it. The
 * store keeps interaction state (votes, joined challenges, accepted challenges,
 * teams, collaboration offers) that must survive navigation within a session.
 */

export type VoteChoice = 'experience' | 'verify' | 'unsure'

export interface TeamMember {
  name: string
  department: string
  skills: string[]
  year: string
  availability: string
}

export interface Team {
  id: string
  name: string
  members: TeamMember[]
  mentor: string
  mentorExpertise?: string
  challengeId?: string
  challengeTitle?: string
  createdAt: string
}

export type OfferStatus = 'Pending' | 'Matched' | 'Accepted' | 'Active' | 'Completed'

export interface CollaborationOffer {
  id: string
  resources: string[]
  description: string
  capacity: string
  domain: string
  duration: string
  location: string
  contact: string
  fundingRange?: string
  mentorExpertise?: string
  labCapability?: string
  equipmentDetails?: string
  notes?: string
  projectTitle?: string
  status: OfferStatus
  createdAt: string
}

interface AppState {
  votes: Record<string, VoteChoice>
  voteBoost: Record<string, number>
  joinedChallenges: string[]
  acceptedChallenges: string[]
  teams: Team[]
  offers: CollaborationOffer[]
}

let state: AppState = {
  votes: {},
  voteBoost: {},
  joinedChallenges: [],
  acceptedChallenges: [],
  teams: [],
  offers: [],
}

const listeners = new Set<() => void>()

function emit() {
  state = { ...state }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return state
}

function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  )
}

/* ---------------------------------- votes --------------------------------- */

export function castVote(challengeId: string, choice: VoteChoice) {
  if (state.votes[challengeId]) return // one vote per session
  state.votes = { ...state.votes, [challengeId]: choice }
  if (choice !== 'unsure') {
    state.voteBoost = { ...state.voteBoost, [challengeId]: (state.voteBoost[challengeId] ?? 0) + 1 }
  }
  emit()
}

export function useVote(challengeId: string) {
  return useStore((s) => s.votes[challengeId])
}

export function useVoteBoost(challengeId: string) {
  return useStore((s) => s.voteBoost[challengeId] ?? 0)
}

/* ---------------------------- joined challenges --------------------------- */

export function joinChallenge(id: string) {
  if (state.joinedChallenges.includes(id)) return
  state.joinedChallenges = [...state.joinedChallenges, id]
  emit()
}

export function useJoinedChallenges() {
  return useStore((s) => s.joinedChallenges)
}

/* --------------------------- accepted challenges -------------------------- */

export function acceptChallenge(id: string) {
  if (state.acceptedChallenges.includes(id)) return
  state.acceptedChallenges = [...state.acceptedChallenges, id]
  emit()
}

export function useAcceptedChallenges() {
  return useStore((s) => s.acceptedChallenges)
}

/* ---------------------------------- teams --------------------------------- */

export function createTeam(team: Omit<Team, 'id' | 'createdAt'>) {
  const id = `TEAM-JH-2026-${String(state.teams.length + 214).padStart(3, '0')}`
  const full: Team = { ...team, id, createdAt: new Date().toISOString() }
  state.teams = [full, ...state.teams]
  emit()
  return full
}

export function useTeams() {
  return useStore((s) => s.teams)
}

/* --------------------------- collaboration offers ------------------------- */

export function submitOffer(offer: Omit<CollaborationOffer, 'id' | 'createdAt' | 'status'>) {
  const id = `COLLAB-JH-2026-${String(state.offers.length + 18).padStart(3, '0')}`
  const full: CollaborationOffer = { ...offer, id, status: 'Pending', createdAt: new Date().toISOString() }
  state.offers = [full, ...state.offers]
  emit()
  return full
}

export function useOffers() {
  return useStore((s) => s.offers)
}
