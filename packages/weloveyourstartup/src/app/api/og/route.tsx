import { ImageResponse } from 'next/og';
import { getCompanyById } from '@/lib/data';

export const runtime = 'edge';

const HERO_ONE_LINER =
  "A curated directory of founders we admire. See how much their idle cash could be earning with Zero Finance's 8% APY savings accounts.";

// Helper to load images
async function loadImage(
  url: string,
  baseUrl?: string,
): Promise<string | null> {
  try {
    const resolvedUrl =
      url.startsWith('http') || url.startsWith('data:')
        ? url
        : baseUrl
          ? new URL(url, baseUrl).toString()
          : url;
    const response = await fetch(resolvedUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/png';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error loading image:', url, error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company');
    const { origin } = new URL(request.url);

    // Load Zero logo - using the hosted version for edge runtime
    const zeroLogoUrl = 'https://weloveyourstartup.com/images/new-logo-bluer.png';
    const zeroLogo = await loadImage(zeroLogoUrl, origin);

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
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {zeroLogo && (
                <img
                  src={zeroLogo}
                  width={60}
                  height={60}
                  style={{ marginBottom: 20 }}
                />
              )}
              {/* make sure this goes to the right */}
              <h1
                style={{
                  fontSize: 80,
                  fontWeight: 'bold',
                  color: '#1B29FF',
                  lineHeight: 1,
                  marginBottom: 20,
                }}
              >
                We Love Your Startup
              </h1>
              <p style={{ fontSize: 30, color: '#101010', opacity: 0.8 }}>
                {HERO_ONE_LINER}
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

    // Load company logo and founder avatars
    const companyLogo = company.logo
      ? await loadImage(company.logo, origin)
      : null;
    const founderAvatars = await Promise.all(
      company.founders.slice(0, 3).map(async (founder) => {
        if (founder.avatar) {
          return {
            id: founder.id,
            avatar: await loadImage(founder.avatar, origin),
          };
        }
        return { id: founder.id, avatar: null };
      }),
    );

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

    const headline = company.tagline || company.description.substring(0, 80);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F7F7F2',
            padding: '60px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '48px',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            

            {/* Tagline */}
            <span
              style={{
                fontSize: '14px',
                color: '#101010',
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              We Love Your Startup
            </span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              gap: '60px',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Left Column */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {/* Company Name */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    width={72}
                    height={72}
                    style={{
                      borderRadius: '16px',
                      backgroundColor: 'white',
                      border: '2px solid #1B29FF20',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #1B29FF20',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#1B29FF',
                      }}
                    >
                      {company.name[0]}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h1
                    style={{
                      fontSize: '66px',
                      fontWeight: 'bold',
                      color: '#101010',
                      lineHeight: 1,
                      margin: 0,
                    }}
                  >
                    {company.name}
                  </h1>
                  <p
                    style={{
                      fontSize: '18px',
                      color: '#1B29FF',
                      marginTop: '4px',
                    }}
                  >
                    {company.category}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p
                style={{
                  fontSize: '48px',
                  color: '#101010',
                  opacity: 0.8,
                  lineHeight: 1.4,
                }}
              >
                {company.tagline || company.description.substring(0, 100)}
              </p>

             
            </div>

            {/* Right Column - Stats */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* Funding Card */}
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid #1B29FF20',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: '#101010',
                    opacity: 0.5,
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  💰 Raised
                </span>
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#1B29FF',
                    lineHeight: 1,
                  }}
                >
                  {formattedFunding}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#101010',
                    opacity: 0.6,
                    marginTop: '6px',
                  }}
                >
                  {company.funding.round} • {company.funding.date}
                </span>
              </div>
               {/* Founders */}
               <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  // wrap

                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: '#101010',
                    opacity: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Founders
                </span>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  {company.founders.slice(0, 3).map((founder) => {
                    const founderAvatar = founderAvatars.find(
                      (fa) => fa.id === founder.id,
                    );
                    return (
                      <div

                        key={founder.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'white',
                          padding: '8px 12px',
                          borderRadius: '8px',
                        }}
                      >
                        {founderAvatar?.avatar ? (
                          <img
                            src={founderAvatar.avatar}
                            width={96}
                            height={96}
                            style={{
                              borderRadius: '50%',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: '#1B29FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span
                              style={{
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              {founder.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                        )}
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span
                            style={{
                              fontSize: '14px',
                              color: '#101010',
                              fontWeight: '600',
                            }}
                          >
                            {founder.name}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#101010',
                              opacity: 0.5,
                            }}
                          >
                            {founder.role}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
              paddingTop: '20px',
              borderTop: '2px solid #10101010',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                color: '#101010',
                opacity: 0.7,
                maxWidth: '460px',
              }}
            >
              {HERO_ONE_LINER}
            </span>
            {/* Zero Finance Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {zeroLogo ? (
                <img
                  src={zeroLogo}
                  width={32}
                  height={32}
                  style={{
                    borderRadius: '8px',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#1B29FF',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    0
                  </span>
                </div>
              )}
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#101010',
                }}
              >
                finance
              </span>
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
