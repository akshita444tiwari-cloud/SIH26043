import { Layers } from 'lucide-react'
import { getChallenges, getDuplicateCluster } from '@/lib/services'
import { ChallengeBrowser } from '@/components/site/challenge-browser'
import { SectionHeading, AiLabel } from '@/components/kit/section-heading'
import { Card } from '@/components/kit/primitives'
import { PageBanner } from '@/components/site/page-banner'

export const metadata = {
  title: 'Browse Challenges',
  description: 'Explore verified societal challenges across all 23 districts of Jharkhand.',
}

export default async function ChallengesPage() {
  const challenges = await getChallenges()
  const cluster = getDuplicateCluster()

  return (
    <>
      <PageBanner
        eyebrow="Browse Challenges"
        title="Verified societal challenges across Jharkhand"
        description="Every challenge is community-verified, AI-classified, and impact-scored. Explore, filter, and follow issues from all 23 districts."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {/* AI dedup highlight */}
        <Card className="mb-8 border-primary/20 bg-primary/[0.04]">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <AiLabel>AI Deduplication</AiLabel>
              <h3 className="mt-2 flex items-center gap-2 font-serif text-lg font-semibold text-forest-deep">
                <Layers className="size-5 text-primary" /> {cluster.reports.length} similar reports merged: {cluster.clusterTitle}
              </h3>
              <p className="mt-1 text-sm text-foreground/70">
                Semantic clustering detected {cluster.reports.length} reports across {cluster.district} describing the same
                issue and merged them into one prioritized challenge — revealing the true scale.
              </p>
            </div>
            <div className="flex shrink-0 gap-2 overflow-x-auto">
              {cluster.reports.slice(0, 4).map((r) => (
                <div key={r.id} className="w-28 shrink-0 rounded-xl border border-border bg-card p-3 text-center">
                  <div className="font-serif text-lg font-bold text-secondary">{r.similarity}%</div>
                  <div className="text-[0.65rem] text-muted-foreground">{r.locality}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <SectionHeading title="All challenges" description="Filter by domain, district, and status." className="mb-6" />
        <ChallengeBrowser challenges={challenges} />
      </div>
    </>
  )
}
