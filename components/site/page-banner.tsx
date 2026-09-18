import type { ReactNode } from 'react'
import { CornerMandala, FolkBorder } from '@/components/cultural/motifs'

export function PageBanner({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-forest-deep/[0.04] paper-bg">
      <CornerMandala className="pointer-events-none absolute -right-12 -top-12 size-64 opacity-60" />
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</span>
        <h1 className="mt-2 max-w-3xl font-serif text-3xl font-bold tracking-tight text-forest-deep text-balance md:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-3 max-w-2xl text-foreground/75">{description}</p>}
        {children}
      </div>
      <FolkBorder className="opacity-50" />
    </section>
  )
}
