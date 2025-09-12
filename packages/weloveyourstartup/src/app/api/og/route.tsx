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
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'linear-gradient(135deg, #F7F7F2 0%, #F6F5EF 50%, #F7F7F2 100%)',
              opacity: 1,
            }}
          />

          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(27, 41, 255, 0.1) 0%, transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -150,
              left: -150,
              width: 500,
              height: 500,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(27, 41, 255, 0.08) 0%, transparent 70%)',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '60px',
              height: '100%',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '48px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#1B29FF',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    0
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#101010',
                    letterSpacing: '-0.5px',
                  }}
                >
                  finance
                </div>
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#101010',
                  opacity: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: '500',
                }}
              >
                We Love Your Startup
              </div>
            </div>

            {/* Main Content */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                gap: '60px',
                alignItems: 'center',
              }}
            >
              {/* Left Column */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                }}
              >
                {/* Company Name with Logo */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  {company.logo && (
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      {/* Using first letter as fallback since we can't load external SVG */}
                      <div
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          background:
                            'linear-gradient(135deg, #1B29FF, #0A1A8C)',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        M
                      </div>
                    </div>
                  )}
                  <div>
                    <h1
                      style={{
                        fontSize: '56px',
                        fontWeight: 'bold',
                        color: '#101010',
                        lineHeight: 1,
                        margin: 0,
                        letterSpacing: '-1px',
                      }}
                    >
                      {company.name}
                    </h1>
                    <p
                      style={{
                        fontSize: '18px',
                        color: '#1B29FF',
                        marginTop: '4px',
                        fontWeight: '500',
                      }}
                    >
                      {company.category}
                    </p>
                  </div>
                </div>

                {/* Tagline */}
                <p
                  style={{
                    fontSize: '22px',
                    color: '#101010',
                    opacity: 0.8,
                    lineHeight: 1.4,
                    fontWeight: '400',
                  }}
                >
                  {company.tagline || company.description.substring(0, 100)}
                </p>

                {/* Founders */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  {company.founders.slice(0, 3).map((founder) => (
                    <div
                      key={founder.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: 'white',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background:
                            'linear-gradient(135deg, #1B29FF, #4A5FFF)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
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
                            fontSize: '14px',
                            color: '#101010',
                            fontWeight: '600',
                          }}
                        >
                          {founder.name}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#101010',
                            opacity: 0.5,
                          }}
                        >
                          {founder.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Stats */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {/* Funding Card */}
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '28px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    border: '2px solid rgba(27, 41, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#101010',
                      opacity: 0.5,
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: '600',
                    }}
                  >
                    💰 Raised
                  </div>
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #1B29FF, #0A1A8C)',
                      backgroundClip: 'text',
                      color: 'transparent',
                      lineHeight: 1,
                      letterSpacing: '-1px',
                    }}
                  >
                    {formattedFunding}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#101010',
                      opacity: 0.6,
                      marginTop: '6px',
                    }}
                  >
                    {company.funding.round} • {company.funding.date}
                  </div>
                </div>

                {/* Savings Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #1B29FF, #0A1A8C)',
                    borderRadius: '20px',
                    padding: '28px',
                    boxShadow: '0 8px 24px rgba(27, 41, 255, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'white',
                      opacity: 0.9,
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: '600',
                    }}
                  >
                    📈 Could Save/Year
                  </div>
                  <div
                    style={{
                      fontSize: '48px',
                      color: 'white',
                      fontWeight: 'bold',
                      lineHeight: 1,
                      letterSpacing: '-1px',
                    }}
                  >
                    +{formattedSavings}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'white',
                      opacity: 0.9,
                      marginTop: '6px',
                    }}
                  >
                    with Zero's 8% APY
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '2px solid rgba(16, 16, 16, 0.08)',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  color: '#101010',
                  opacity: 0.7,
                  fontWeight: '500',
                }}
              >
                Your idle cash could be earning 8% APY
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#1B29FF',
                  fontWeight: '600',
                }}
              >
                0.finance
              </div>
            </div>
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
