'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Consistent back navigation. Uses browser history when available and falls
 * back to an explicit route so the user is never trapped on a page.
 */
export function BackButton({
  label = 'Back',
  fallback,
  className,
}: {
  label?: string
  fallback?: string
  className?: string
}) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else if (fallback) {
      router.push(fallback)
    } else {
      router.push('/')
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-forest-deep transition-colors hover:border-secondary/40 hover:bg-primary/5',
        className,
      )}
    >
      <ArrowLeft className="size-4" /> {label}
    </button>
  )
}
