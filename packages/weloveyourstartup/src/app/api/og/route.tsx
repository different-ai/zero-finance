import { ImageResponse } from 'next/og';
import { getCompanyById } from '@/lib/data';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company');

    if (!companyId) {
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
                'linear-gradient(to bottom right, #F7F7F2, #F6F5EF)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: 80,
                  fontWeight: 'bold',
                  background:
                    'linear-gradient(to bottom right, #1B29FF, #101010)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  lineHeight: 1,
                  marginBottom: 20,
                }}
              >
                We Love Your Startup
              </h1>
              <p style={{ fontSize: 30, color: '#101010', opacity: 0.8 }}>
                By Zero Finance - 8% APY for Startups
              </p>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }

    const company = getCompanyById(companyId);

    if (!company) {
      return new Response('Company not found', { status: 404 });
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
            padding: 60,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontSize: 24,
                color: '#101010',
                opacity: 0.6,
                letterSpacing: '0.1em',
              }}
            >
              WE LOVE YOUR STARTUP
            </p>
            <p style={{ fontSize: 20, color: '#1B29FF' }}>Zero Finance</p>
          </div>

          {/* Company Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#101010',
                lineHeight: 1,
                marginBottom: 20,
              }}
            >
              {company.name}
            </h1>

            <p
              style={{
                fontSize: 28,
                color: '#101010',
                opacity: 0.8,
                marginBottom: 40,
                lineHeight: 1.3,
              }}
            >
              {company.tagline || company.description.substring(0, 100)}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 60 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p
                  style={{
                    fontSize: 18,
                    color: '#101010',
                    opacity: 0.6,
                    marginBottom: 8,
                  }}
                >
                  FUNDING
                </p>
                <p
                  style={{ fontSize: 40, color: '#1B29FF', fontWeight: 'bold' }}
                >
                  {formattedFunding}
                </p>
                <p style={{ fontSize: 16, color: '#101010', opacity: 0.6 }}>
                  {company.funding.round} • {company.funding.date}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p
                  style={{
                    fontSize: 18,
                    color: '#101010',
                    opacity: 0.6,
                    marginBottom: 8,
                  }}
                >
                  COULD SAVE/YEAR
                </p>
                <p
                  style={{ fontSize: 40, color: '#1B29FF', fontWeight: 'bold' }}
                >
                  {formattedSavings}
                </p>
                <p style={{ fontSize: 16, color: '#101010', opacity: 0.6 }}>
                  with 8% APY
                </p>
              </div>
            </div>

            {/* Founders */}
            <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
              {company.founders.slice(0, 3).map((founder) => (
                <div
                  key={founder.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#1B29FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}
                  >
                    {founder.name.charAt(0)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p
                      style={{
                        fontSize: 16,
                        color: '#101010',
                        fontWeight: 500,
                      }}
                    >
                      {founder.name}
                    </p>
                    <p style={{ fontSize: 14, color: '#101010', opacity: 0.6 }}>
                      {founder.role}
                    </p>
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
              marginTop: 40,
            }}
          >
            <p style={{ fontSize: 18, color: '#101010', opacity: 0.8 }}>
              Your idle cash could be earning 8% APY
            </p>
            <p style={{ fontSize: 18, color: '#1B29FF' }}>0.finance</p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
