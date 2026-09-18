import { cn } from '@/lib/utils'

/**
 * Official Government of Jharkhand state emblem.
 */
export function JharkhandEmblem({ className }: { className?: string }) {
  return (
    <img
      src="/images/jharkhand-emblem.jpg"
      alt="Government of Jharkhand emblem"
      className={cn('shrink-0 rounded-full object-contain', className)}
    />
  )
}

/** Warli / Sohrai inspired horizontal border strip. */
export function FolkBorder({ className, tone = 'terracotta' }: { className?: string; tone?: 'terracotta' | 'cream' | 'forest' }) {
  const stroke = tone === 'cream' ? 'var(--cream)' : tone === 'forest' ? 'var(--forest)' : 'var(--terracotta)'
  return (
    <div className={cn('w-full overflow-hidden', className)} aria-hidden="true">
      <svg viewBox="0 0 240 24" preserveAspectRatio="xMidYMid meet" className="h-6 w-full" style={{ minWidth: '100%' }}>
        <defs>
          <pattern id="folk-strip" width="40" height="24" patternUnits="userSpaceOnUse">
            {/* triangles row */}
            <path d="M0 18 L10 6 L20 18 Z M20 18 L30 6 L40 18 Z" fill="none" stroke={stroke} strokeWidth="1.2" />
            {/* dots */}
            <circle cx="10" cy="21" r="1" fill={stroke} />
            <circle cx="30" cy="21" r="1" fill={stroke} />
            {/* sun figure */}
            <circle cx="20" cy="6" r="2" fill="none" stroke={stroke} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="240" height="24" fill="url(#folk-strip)" />
      </svg>
    </div>
  )
}

/** Decorative Warli-style figures cluster, used as subtle background accents. */
export function WarliCluster({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={cn('text-terracotta/40', className)} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* dancing figures around a circle */}
      <circle cx="60" cy="80" r="30" strokeDasharray="3 4" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 6 - Math.PI / 2
        const cx = 60 + Math.cos(a) * 48
        const cy = 80 + Math.sin(a) * 48
        return (
          <g key={i} transform={`translate(${cx - 6}, ${cy - 12})`}>
            <circle cx="6" cy="3" r="3" />
            <path d="M6 6 L6 14 M0 9 L12 9 M6 14 L1 22 M6 14 L11 22" />
          </g>
        )
      })}
      {/* flowering vine */}
      <path d="M10 150 C 30 130, 20 120, 40 110" className="text-forest/40" />
      <circle cx="10" cy="150" r="2.5" className="text-terracotta/50" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Corner mandala flourish. */
export function CornerMandala({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={cn('text-terracotta/25', className)} aria-hidden="true" fill="none" stroke="currentColor">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 12
        return (
          <ellipse
            key={i}
            cx="0"
            cy="0"
            rx="14"
            ry="52"
            strokeWidth="1"
            transform={`translate(80 80) rotate(${(a * 180) / Math.PI})`}
          />
        )
      })}
      <circle cx="80" cy="80" r="10" strokeWidth="1.2" className="text-forest/30" />
      <circle cx="80" cy="80" r="70" strokeWidth="0.8" strokeDasharray="2 5" />
    </svg>
  )
}

/** A soft blooming-flower accent (Sohrai style). */
export function FlowerAccent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={cn('text-secondary/50', className)} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 8
        return <ellipse key={i} cx="30" cy="30" rx="5" ry="16" transform={`rotate(${(a * 180) / Math.PI} 30 30)`} />
      })}
      <circle cx="30" cy="30" r="5" fill="var(--gold)" stroke="none" />
    </svg>
  )
}
