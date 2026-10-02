import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PropertyDetailClient from '@/components/properties/PropertyDetailClient'
import { getPropertyBySlug, getProperties } from '@/lib/data/properties'
import { notFound } from 'next/navigation'

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const property = await getPropertyBySlug(resolvedParams.slug)

  if (!property) {
    notFound()
  }

  const allProperties = await getProperties()
  const similarProperties = allProperties
    .filter((p) => p.slug !== property.slug)
    .slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />
      <main>
        <PropertyDetailClient
          property={property}
          similarProperties={similarProperties}
        />
      </main>
      <Footer />
    </div>
  )
}
