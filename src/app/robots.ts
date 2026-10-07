import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prime-home-kanpur.netlify.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/landlord/', '/api/', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
