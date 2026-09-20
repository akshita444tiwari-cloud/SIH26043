'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogIn, Menu, UserPlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { JharkhandEmblem } from '@/components/cultural/motifs'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Platform' },
  { href: '/challenges', label: 'Browse Challenges' },
  { href: '/impact', label: 'Impact Dashboard' },
  { href: '/partnerships', label: 'Partnerships' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <JharkhandEmblem className="size-12 md:size-14" />

          <div className="leading-tight">
            <div className="text-sm font-medium text-foreground/80 md:text-[0.95rem]">
              Department of Information Technology &amp; e-Governance
            </div>

            <div className="font-serif text-base font-bold text-forest-deep md:text-lg">
              Government of Jharkhand
            </div>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(n.href)
                  ? 'text-secondary'
                  : 'text-foreground/70 hover:text-forest-deep',
              )}
            >
              {n.label}

              {isActive(n.href) && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-secondary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {/* SIGN UP */}
          <Link
            href="/signup"
            className="hidden items-center gap-1.5 rounded-full border border-forest/40 px-4 py-2 text-sm font-medium text-forest-deep transition-colors hover:bg-primary/10 sm:inline-flex"
          >
            <UserPlus className="size-4" />
            Sign Up
          </Link>

          {/* LOGIN */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-brick"
          >
            <LogIn className="size-4" />
            Login
          </Link>

          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-border text-forest-deep lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-cream px-4 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={cn(
                'block rounded-lg px-3 py-2.5 text-sm font-medium',
                isActive(n.href)
                  ? 'bg-primary/10 text-secondary'
                  : 'text-foreground/75',
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}