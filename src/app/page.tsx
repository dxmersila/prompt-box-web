import { listItems } from '@/lib/api/itemService'
import HeroSection from '@/components/home/HeroSection'
import LatestItemsSection from '@/components/home/LatestItemsSection'
import SubscriptionPromoSection from '@/components/home/SubscriptionPromoSection'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const itemsResponse = await listItems({
    sort: 'latest',
    page: 1,
  })

  const latestItems = itemsResponse.data

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-1 pt-10 sm:px-6 lg:pb-2 lg:pt-16">
      <HeroSection items={latestItems.slice(0, 3)} />

      {latestItems.length > 0 && (
        <LatestItemsSection items={latestItems} />
      )}

      <SubscriptionPromoSection />
    </main>
  )
}
