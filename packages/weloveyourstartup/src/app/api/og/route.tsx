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
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
              marginBottom: '32px',
            }}
          >
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
                  gap: '28px',
                  flex: '1 1 560px',
                  maxWidth: '560px',
                }}
              >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <h1
                      style={{
                        fontSize: '64px',
                        fontWeight: 'bold',
                        color: '#101010',
                        lineHeight: 1,
                        margin: 0,
                      }}
                    >
                      {company.name}
                    </h1>
                    <span
                      style={{
                        fontSize: '28px',
                        color: '#101010',
                        opacity: 0.75,
                        fontWeight: 500,
                        maxWidth: '420px',
                      }}
                    >
                      {headline}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '18px',
                      color: '#1B29FF',
                    }}
                  >
                    {company.category}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid #1B29FF20',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '420px',
                  boxShadow: '0 10px 30px rgba(27, 41, 255, 0.08)',
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
