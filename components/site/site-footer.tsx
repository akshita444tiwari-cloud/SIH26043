import Link from 'next/link'
import { JharkhandEmblem, FolkBorder } from '@/components/cultural/motifs'

const COLS = [
  {
    title: 'Platform',
    links: [
      { href: '/about', label: 'About Platform' },
      { href: '/challenges', label: 'Browse Challenges' },
      { href: '/impact', label: 'Impact Dashboard' },
      { href: '/partnerships', label: 'Partnerships' },
    ],
  },
  {
    title: 'Participate',
    links: [
      { href: '/login', label: 'Submit a Challenge' },
      { href: '/login', label: 'Partner & Solve' },
      { href: '/login', label: 'University Access' },
      { href: '/login', label: 'Industry Sponsorship' },
    ],
  },
  {
    title: 'Government',
    links: [
      { href: '/', label: 'Dept. of IT & e-Governance' },
      { href: '/', label: 'Digital Jharkhand' },
      { href: '/', label: 'Grievance Redressal' },
      { href: '/', label: 'RTI & Transparency' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-forest-deep text-cream/90">
      <FolkBorder tone="cream" className="opacity-40" />
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <JharkhandEmblem className="size-14" />
              <div className="leading-tight">
                <div className="font-serif text-lg font-bold text-cream">Government of Jharkhand</div>
                <div className="text-sm text-cream/70">Dept. of IT &amp; e-Governance</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-cream/70">
              A digital platform to crowdsource and solve Jharkhand&apos;s societal challenges — connecting citizen
              voice with academic rigor and industry power for sustainable grassroots impact.
            </p>
            <p className="mt-4 text-xs text-cream/50">
              Prototype for Smart India Hackathon 2026. Demonstration data only.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wide text-gold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-cream/75 transition-colors hover:text-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream/15 pt-6 text-xs text-cream/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Government of Jharkhand. All rights reserved.</span>
          <span className="flex gap-4">
            <Link href="/" className="hover:text-cream">Privacy Policy</Link>
            <Link href="/" className="hover:text-cream">Terms of Use</Link>
            <Link href="/" className="hover:text-cream">Accessibility</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
