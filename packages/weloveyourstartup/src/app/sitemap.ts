import { MetadataRoute } from 'next';
import { getCompanies } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://weloveyourstartup.com';
  const companies = getCompanies();

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Individual startup pages
  companies.forEach((company) => {
    routes.push({
      url: `${baseUrl}/startups/${company.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  return routes;
}
