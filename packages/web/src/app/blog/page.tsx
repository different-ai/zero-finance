import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Startup Treasury & Finance Insights | 0 Finance',
  description:
    'Learn how to optimize your startup treasury, extend runway, and earn higher yields. Expert insights on startup finance and DeFi.',
  keywords:
    'startup finance blog, treasury management, runway optimization, DeFi for startups',
};

const blogPosts = [
  {
    slug: 'how-to-extend-startup-runway-without-raising',
    title: 'How to Extend Your Startup Runway Without Raising Capital',
    excerpt:
      'Discover 5 proven strategies to add 3-6 months to your runway, including optimizing treasury yield from 4% to 8%.',
    date: '2025-01-06',
    readTime: '5 min read',
    category: 'Runway Management',
  },
  {
    slug: 'startup-treasury-management-guide-2025',
    title: 'The Complete Guide to Startup Treasury Management in 2025',
    excerpt:
      'Everything founders need to know about managing cash: from yield optimization to multi-currency operations.',
    date: '2025-01-05',
    readTime: '8 min read',
    category: 'Treasury Management',
  },
  {
    slug: 'mercury-vs-brex-vs-0finance-comparison',
    title: 'Mercury vs Brex vs 0 Finance: Which is Best for Your Startup?',
    excerpt:
      'Detailed comparison of yields, features, and costs. See why startups are switching to 8% yields.',
    date: '2025-01-04',
    readTime: '6 min read',
    category: 'Comparisons',
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F6F5EF] border-b border-[#101010]/10 py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.18em] text-[12px] font-medium text-[#101010]/70">
            0 Finance Blog
          </p>
          <h1 className="mt-3 font-serif text-[36px] sm:text-[48px] lg:text-[56px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            Startup Finance Insights
          </h1>
          <p className="mt-4 text-[16px] leading-[1.5] text-[#222] max-w-[65ch]">
            Learn how to optimize your treasury, extend runway, and make better
            financial decisions for your startup.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-[#101010]/10 hover:border-[#1B29FF]/30 transition-colors"
              >
                <Link href={`/blog/${post.slug}`} className="block p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[#1B29FF]">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-[#101010]/40">•</span>
                    <span className="text-[11px] text-[#101010]/60">
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-[20px] sm:text-[24px] leading-[1.2] text-[#101010] mb-3">
                    {post.title}
                  </h2>

                  <p className="text-[14px] leading-[1.5] text-[#101010]/70 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex justify-between items-center">
                    <time className="text-[12px] text-[#101010]/60">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="text-[14px] text-[#1B29FF] hover:underline">
                      Read more →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center p-8 bg-[#F6F5EF] border border-[#101010]/10">
            <h2 className="font-serif text-[28px] text-[#101010] mb-3">
              Ready to Earn 8% on Your Treasury?
            </h2>
            <p className="text-[14px] text-[#101010]/70 mb-6 max-w-[50ch] mx-auto">
              Stop reading about optimization and start earning. Open your
              account in 5 minutes.
            </p>
            <Link
              href="/signin"
              className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
