'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Bell, ChevronLeft, ExternalLink, Globe, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@/lib/types'
import { DASHBOARD_TITLES, ROLE_DISPLAY, ROLE_LABELS, getNotifications } from '@/lib/services'
import { DASHBOARD_NAV, ROLE_ICON } from '@/lib/dashboard-nav'
import { JharkhandEmblem } from '@/components/cultural/motifs'
import { Toaster } from '@/components/kit/toast'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const segments = pathname.split('/').filter(Boolean)
  const role = (segments[1] as Role) ?? 'citizen'
  const nav = DASHBOARD_NAV[role] ?? []
  const RoleIcon = ROLE_ICON[role]
  const title = DASHBOARD_TITLES[role]
  const isSubPage = segments.length > 2
  const unread = getNotifications().filter((n) => n.unread).length

  return (
    <div className="min-h-screen bg-cream/40 lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-cream transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
          <JharkhandEmblem className="size-10" />
          <div className="leading-tight">
            <div className="font-serif text-sm font-bold text-forest-deep">Jharkhand</div>
            <div className="text-[0.7rem] text-muted-foreground">Societal Innovation</div>
          </div>
          <button
            type="button"
            className="ml-auto grid size-8 place-items-center rounded-lg text-muted-foreground lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-forest-deep/[0.06] p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-forest-deep text-cream">
              <RoleIcon className="size-4.5" />
            </span>
            <div className="min-w-0">
              <div className="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                {ROLE_LABELS[role]}
              </div>
              <div className="truncate text-sm font-semibold text-forest-deep">{ROLE_DISPLAY[role]}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="grid gap-1">
            {nav.map((item, i) => {
              const active = item.href.startsWith('/') ? pathname === item.href : !isSubPage && i === 0
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-forest-deep text-cream'
                        : 'text-foreground/75 hover:bg-primary/10 hover:text-forest-deep',
                    )}
                  >
                    <item.icon className="size-4.5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-primary/10 hover:text-forest-deep"
          >
            <Globe className="size-4.5" /> Public Site
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-secondary/10"
          >
            <LogOut className="size-4.5" /> Switch Role
          </Link>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-forest-deep/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-cream/85 px-4 py-3 backdrop-blur-md md:px-6">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-border text-forest-deep lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          {isSubPage ? (
            <Link
              href={`/dashboard/${role}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-forest-deep"
            >
              <ChevronLeft className="size-4" /> Back to dashboard
            </Link>
          ) : (
            <h1 className="truncate font-serif text-base font-bold text-forest-deep md:text-lg">{title}</h1>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="relative grid size-9 place-items-center rounded-lg border border-border text-forest-deep transition-colors hover:bg-primary/10"
              aria-label={`Notifications (${unread} unread)`}
            >
              <Bell className="size-4.5" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid size-4.5 min-w-4.5 place-items-center rounded-full bg-secondary px-1 text-[0.6rem] font-bold text-secondary-foreground">
                  {unread}
                </span>
              )}
            </button>
            <span className="hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 sm:inline-flex">
              <span className="grid size-7 place-items-center rounded-full bg-forest-deep text-cream">
                <RoleIcon className="size-4" />
              </span>
              <span className="text-xs font-semibold text-forest-deep">{ROLE_LABELS[role]}</span>
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>

      <Toaster />
    </div>
  )
}

/** Section wrapper with an id anchor + heading used across dashboards. */
export function DashSection({
  id,
  title,
  description,
  action,
  children,
  className,
}: {
  id?: string
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-20', className)}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-forest-deep">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export { ExternalLink }
