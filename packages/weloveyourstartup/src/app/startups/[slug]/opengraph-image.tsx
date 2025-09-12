import { ImageResponse } from 'next/og';
import { getCompanyById } from '@/lib/data';

export const runtime = 'edge';

export const alt = 'We Love Your Startup';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  try {
    const company = getCompanyById(params.slug);

    if (!company) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F7F7F2',
              backgroundImage:
                'linear-gradient(135deg, #F7F7F2 0%, #F6F5EF 100%)',
            }}
          >
            <h1 style={{ fontSize: 60, color: '#101010' }}>
              Startup Not Found
            </h1>
          </div>
        ),
        { ...size },
      );
    }

    const savings =
      company.funding.amount * 0.08 - company.funding.amount * 0.04;
    const formattedSavings = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(savings);

    const formattedFunding =
      company.funding.amount >= 1000000
        ? `$${(company.funding.amount / 1000000).toFixed(1)}M`
        : `$${(company.funding.amount / 1000).toFixed(0)}K`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F7F7F2',
            backgroundImage:
              'linear-gradient(135deg, #F7F7F2 0%, #F6F5EF 100%)',
            padding: '48px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                color: '#101010',
                opacity: 0.6,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: '500',
              }}
            >
              We Love Your Startup
            </div>
            <div
              style={{
                fontSize: '18px',
                color: '#1B29FF',
                fontWeight: '600',
              }}
            >
              Zero Finance
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {/* Company Name with Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginBottom: '16px',
              }}
            >
              {company.logo && (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(16, 16, 16, 0.1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#1B29FF',
                    }}
                  >
                    M
                  </div>
                </div>
              )}
              <h1
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: '#101010',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {company.name}
              </h1>
            </div>

            {/* Tagline */}
            <p
              style={{
                fontSize: '26px',
                color: '#101010',
                opacity: 0.8,
                marginBottom: '48px',
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {company.tagline || company.description.substring(0, 100)}
            </p>

            {/* Stats Grid */}
            <div
              style={{
                display: 'flex',
                gap: '48px',
                marginBottom: '48px',
              }}
            >
              {/* Funding */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#101010',
                    opacity: 0.6,
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  💰 Funding
                </div>
                <div
                  style={{
                    fontSize: '42px',
                    color: '#1B29FF',
                    fontWeight: 'bold',
                    lineHeight: 1,
                  }}
                >
                  {formattedFunding}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#101010',
                    opacity: 0.6,
                    marginTop: '4px',
                  }}
                >
                  {company.funding.round} • {company.funding.date}
                </div>
              </div>

              {/* Savings */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#101010',
                    opacity: 0.6,
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  📈 Could Save/Year
                </div>
                <div
                  style={{
                    fontSize: '42px',
                    color: '#1B29FF',
                    fontWeight: 'bold',
                    lineHeight: 1,
                  }}
                >
                  +{formattedSavings}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#101010',
                    opacity: 0.6,
                    marginTop: '4px',
                  }}
                >
                  with 8% APY
                </div>
              </div>
            </div>

            {/* Founders Row */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              {company.founders.slice(0, 3).map((founder) => (
                <div
                  key={founder.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 16, 16, 0.1)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#1B29FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {founder.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        fontSize: '15px',
                        color: '#101010',
                        fontWeight: '600',
                      }}
                    >
                      {founder.name}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#101010',
                        opacity: 0.6,
                      }}
                    >
                      {founder.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '32px',
              width: '100%',
              paddingTop: '24px',
              borderTop: '1px solid rgba(16, 16, 16, 0.1)',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                color: '#101010',
                opacity: 0.8,
              }}
            >
              Your idle cash could be earning 8% APY
            </div>
            <div
              style={{
                fontSize: '18px',
                color: '#1B29FF',
                fontWeight: '600',
              }}
            >
              0.finance
            </div>
          </div>
        </div>
      ),
      { ...size },
    );
  } catch (e: any) {
    console.error('OG Image Generation Error:', e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
