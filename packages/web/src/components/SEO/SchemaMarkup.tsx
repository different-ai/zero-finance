export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '0 Finance',
    alternateName: 'Zero Finance',
    url: 'https://0.finance',
    logo: 'https://0.finance/new-logo-bluer.png',
    description:
      '8% yield savings account for startups with smart contract insurance',
    sameAs: [
      'https://twitter.com/0finance',
      'https://linkedin.com/company/0finance',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FinancialServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: '0 Finance High Yield Savings',
    provider: {
      '@type': 'Organization',
      name: '0 Finance',
    },
    description:
      '8% APY savings account for startups with smart contract insurance, no minimums, instant withdrawals',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Startup Treasury Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'High Yield Savings Account',
          description: '8% target APY with smart contract insurance',
          price: '0',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          name: 'Corporate Cards',
          description: 'Visa cards with customizable spend limits',
          price: '0',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          name: 'Multi-Currency Support',
          description: 'Hold and transact in USD, EUR, and USDC',
          price: '0',
          priceCurrency: 'USD',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: '0 Finance Treasury Management',
    description: 'High yield savings account for startups with 8% APY',
    brand: {
      '@type': 'Brand',
      name: '0 Finance',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://0.finance/signin',
      priceCurrency: 'USD',
      price: '0',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '50',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
