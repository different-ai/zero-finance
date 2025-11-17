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
              backgroundColor: '#000000',
              fontFamily: 'monospace',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '3px solid #00FF00',
                padding: '60px',
              }}
            >
              {zeroLogo && (
                <img
                  src={zeroLogo}
                  width={60}
                  height={60}
                  style={{ marginBottom: 30, border: '2px solid #00FFFF' }}
                />
              )}
              <div style={{ fontSize: 16, color: '#00FF00', marginBottom: 20, letterSpacing: 2 }}>
                [ SYSTEM: STARTUP_DIRECTORY ]
              </div>
              <h1
                style={{
                  fontSize: 80,
                  fontWeight: 'bold',
                  color: '#00FFFF',
                  lineHeight: 1,
                  marginBottom: 30,
                  textTransform: 'uppercase',
                  letterSpacing: 3,
                }}
              >
                WE_LOVE_YOUR_STARTUP
              </h1>
              <p style={{ fontSize: 24, color: '#FFFFFF', opacity: 0.9, textAlign: 'center', maxWidth: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                {HERO_ONE_LINER.toUpperCase()}
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
            backgroundColor: '#000000',
            padding: '60px',
            fontFamily: 'monospace',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: '40px',
              borderBottom: '2px solid #00FF00',
              paddingBottom: '20px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                color: '#FF00FF',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: 'bold',
              }}
            >
              {'>> STARTUP_PROFILE'}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#00FF00',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              WE_LOVE_YOUR_STARTUP
            </span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '48px',
                width: '100%',
                maxWidth: '1040px',
                alignItems: 'flex-start',
              }}
            >
              {/* Left Column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                  flex: '1 1 560px',
                  maxWidth: '560px',
                }}
              >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <div style={{
                  fontSize: '14px',
                  color: '#00FF00',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  border: '2px solid #00FF00',
                  padding: '8px 16px',
                  display: 'flex',
                  maxWidth: 'fit-content',
                }}>
                  CATEGORY: {company.category.toUpperCase()}
                </div>

                {companyLogo && (
                  <img
                    src={companyLogo}
                    width={60}
                    height={60}
                    style={{
                      border: '2px solid #00FFFF',
                    }}
                  />
                )}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <h1
                    style={{
                      fontSize: '72px',
                      fontWeight: 'bold',
                      color: '#00FFFF',
                      lineHeight: 1,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                    }}
                  >
                    {company.name.toUpperCase()}
                  </h1>
                  <span
                    style={{
                      fontSize: '22px',
                      color: '#FFFFFF',
                      opacity: 0.9,
                      maxWidth: '500px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    // {headline.toUpperCase()}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#000000',
                  padding: '28px',
                  border: '3px solid #FFFF00',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '420px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: '#FFFF00',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontWeight: 'bold',
                  }}
                >
                  [ DATA: FUNDING_AMOUNT ]
                </span>
                <span
                  style={{
                    fontSize: '56px',
                    fontWeight: 'bold',
                    color: '#FFFF00',
                    lineHeight: 1,
                  }}
                >
                  {formattedFunding}
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    color: '#FFFF00',
                    opacity: 0.7,
                    marginTop: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {company.funding.round.toUpperCase()} / {company.funding.date}
                </span>
              </div>
              </div>

              {/* Right Column - Founders */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  flex: '1 1 320px',
                  maxWidth: '360px',
                  width: '100%',
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
                    flexDirection: 'column',
                    gap: '12px',
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
                          gap: '12px',
                          backgroundColor: 'white',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '2px solid #1B29FF15',
                          width: '100%',
                          boxShadow: '0 6px 18px rgba(27, 41, 255, 0.05)',
                        }}
                      >
                        {founderAvatar?.avatar ? (
                          <img
                            src={founderAvatar.avatar}
                            width={56}
                            height={56}
                            style={{
                              borderRadius: '50%',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '56px',
                              height: '56px',
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
                                fontSize: '18px',
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
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '16px',
                              color: '#101010',
                              fontWeight: '600',
                            }}
                          >
                            {founder.name}
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              color: '#101010',
                              opacity: 0.6,
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
