import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyById, getCompanies } from '@/lib/data';
import Script from 'next/script';
import { StartupPageClient } from './StartupPageClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getCompanies().map((company) => ({
    slug: company.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyById(slug);

  if (!company) {
    return {
      title: 'Startup Not Found',
    };
  }

  const yearlyDifference =
    company.funding.amount * 0.08 - company.funding.amount * 0.04;
  const formattedSavings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(yearlyDifference);

  return {
    title: `${company.name} - ${company.tagline}`,
    description: company.description,
    keywords: [
      company.name,
      company.category,
      company.tagline,
      ...company.founders.map((f) => f.name),
      'AI automation',
      'startup',
      'funding',
    ],
    authors: company.founders.map((f) => ({ name: f.name })),
    openGraph: {
      title: `${company.name} - ${company.tagline}`,
      description: company.description,
      url: `https://weloveyourstartup.com/startups/${slug}`,
      siteName: company.name,
      images: [
        {
          url: `https://weloveyourstartup.com/api/og?company=${slug}`,
          width: 1200,
          height: 630,
          alt: `${company.name}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company.name} - ${company.tagline}`,
      description: company.description,
      images: [`https://weloveyourstartup.com/api/og?company=${slug}`],
    },
    alternates: {
      canonical: `https://weloveyourstartup.com/startups/${slug}`,
    },
  };
}

export default async function StartupPage({ params }: PageProps) {
  const { slug } = await params;
  const company = getCompanyById(slug);

  if (!company) {
    notFound();
  }

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: company.description,
    url: company.website,
    logo: company.founders[0]?.avatar,
    founders: company.founders.map((founder) => ({
      '@type': 'Person',
      name: founder.name,
      jobTitle: founder.role,
      url: founder.twitter,
      image: founder.avatar,
    })),
    funding: {
      '@type': 'MonetaryAmount',
      value: company.funding.amount,
      currency: 'USD',
    },
    sameAs: [
      company.twitter,
      company.website,
      ...company.founders.map((f) => f.twitter),
    ].filter(Boolean),
  };

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StartupPageClient company={company} />
    </>
  );
}
