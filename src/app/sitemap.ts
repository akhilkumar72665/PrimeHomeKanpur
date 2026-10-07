import { MetadataRoute } from 'next'
import { getProperties } from '@/lib/data/properties'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prime-home-kanpur.netlify.app'

  const staticPages = [
    '',
    '/about',
    '/rentals',
    '/agents',
    '/services',
    '/faq',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
    '/refund-policy',
    '/verification-policy',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  const localities = [
    'kakadeo',
    'swaroop-nagar',
    'civil-lines',
    'kalyanpur',
    'shyam-nagar',
    'kidwai-nagar',
    'tilak-nagar',
    'gurudev-chauraha',
    'barra',
    'awas-vikas',
    'govind-nagar',
    'vijay-nagar',
    'vikas-nagar',
  ].map((slug) => ({
    url: `${baseUrl}/rentals/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  const properties = await getProperties()
  const propertyPages = properties.map((p) => ({
    url: `${baseUrl}/rentals/${p.slug}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...localities, ...propertyPages]
}
