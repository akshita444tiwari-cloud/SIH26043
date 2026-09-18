'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Toast {
  id: number
  title: string
  description?: string
  tone: 'success' | 'info'
}

let toasts: Toast[] = []
const listeners = new Set<() => void>()
let counter = 0

function emit() {
  toasts = [...toasts]
  listeners.forEach((l) => l())
}

/** Fire a toast from anywhere in the client. */
export function toast(title: string, description?: string, tone: Toast['tone'] = 'success') {
  const id = ++counter
  toasts = [...toasts, { id, title, description, tone }]
  listeners.forEach((l) => l())
  setTimeout(() => dismiss(id), 4500)
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id)
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Global toast viewport. Mount once near the app root. */
export function Toaster() {
  const items = useSyncExternalStore(
    subscribe,
    () => toasts,
    () => toasts,
  )

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[1000] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {items.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}

function ToastItem({ toast: t }: { toast: Toast }) {
  useEffect(() => {
    // no-op; kept for potential enter animation hooks
  }, [])
  const Icon = t.tone === 'success' ? CheckCircle2 : Info
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border bg-card px-4 py-3 card-shadow',
        'animate-in fade-in slide-in-from-bottom-4 duration-300',
        t.tone === 'success' ? 'border-primary/30' : 'border-secondary/30',
      )}
    >
      <span
        className={cn(
          'mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg',
          t.tone === 'success' ? 'bg-primary/12 text-primary' : 'bg-secondary/12 text-secondary',
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-forest-deep">{t.title}</p>
        {t.description && <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => dismiss(t.id)}
        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-forest-deep"
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
