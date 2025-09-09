import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  keywords?: string;
}

export function SEOHead({
  title = '0 Finance - 8% Yield for Your Startup Treasury',
  description = 'Earn 8% on your startup treasury with smart contract insurance. No minimums, instant withdrawals, full banking features.',
  canonical,
  ogImage = 'https://0.finance/og-image.png',
  noindex = false,
  keywords = 'startup treasury, high yield savings, 8% APY, startup banking, DeFi for startups',
}: SEOHeadProps) {
  const fullTitle = title.includes('0 Finance')
    ? title
    : `${title} | 0 Finance`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="0 Finance" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@0finance" />
      <meta name="twitter:creator" content="@0finance" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO Tags */}
      <meta name="author" content="0 Finance" />
      <meta name="publisher" content="0 Finance" />
      <meta
        name="google-site-verification"
        content="YOUR_GOOGLE_VERIFICATION_CODE"
      />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    </Head>
  );
}
