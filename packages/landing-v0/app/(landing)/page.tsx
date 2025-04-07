import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Demo } from './demo/demo';
import { BiosContainer } from './components/bios-container';
import { WaitlistForm } from './components/waitlist-form';

export const metadata: Metadata = {
  title: 'hyprsqrl - AI Banking',
  description:
    'Building an AI-connected bank to automate the financial stack for crypto freelancers.',
  openGraph: {
    title: 'hyprsqrl - AI Banking',
    description:
      'Building an AI-connected bank to automate the financial stack for crypto freelancers.',
  },
};

function MainContent() {
  const yieldAppLink =
    process.env.NODE_ENV === 'production'
      ? 'https://y.hyprsqrl.com'
      : 'http://localhost:3060';
  const invoiceAppLink =
    process.env.NODE_ENV === 'production'
      ? 'https://i.hyprsqrl.com'
      : 'http://localhost:3050';

  // Simple demo view URL (this would be a static page route)
  const demoFullViewUrl = '/demo-view';

  return (
    <>
      {/* Latest Updates Section - Modern Style */}
      <div
        className="latest-updates-section"
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 20px 20px',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '36px',
            color: '#333',
            textAlign: 'center',
            marginBottom: '40px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            position: 'relative',
            padding: '0 0 15px',
          }}
        >
          <span
            style={{
              color: '#0000AA',
              position: 'relative',
            }}
          >
            Latest Updates
            <div
              style={{
                position: 'absolute',
                height: '3px',
                width: '60%',
                background: 'linear-gradient(to right, #0000AA, transparent)',
                bottom: '-10px',
                left: '20%',
              }}
            ></div>
          </span>
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', width: '100%', maxWidth: '1200px' }}>
          <div style={{ 
            flex: '1 1 350px', 
            padding: '25px', 
            borderRadius: '12px', 
            backgroundColor: '#f8f9fa', 
            boxShadow: '0 4px 12px rgba(0,0,170,0.08)',
            border: '1px solid rgba(0,0,170,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', backgroundColor: '#0000AA' }}></div>
            <h3 style={{ fontSize: '16px', color: '#0000AA', marginBottom: '5px', fontFamily: 'Inter, sans-serif' }}>APRIL 3, 2024</h3>
            <h4 style={{ fontSize: '20px', marginBottom: '15px', fontFamily: 'Inter, sans-serif' }}>Released AI Yield Finder</h4>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>
              AI chat to instantly discover yield opportunities
            </p>
            <Link 
              href={yieldAppLink}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#0000AA',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              Try It Now
            </Link>
          </div>
          
          <div style={{ 
            flex: '1 1 350px', 
            padding: '25px', 
            borderRadius: '12px', 
            backgroundColor: '#f8f9fa', 
            boxShadow: '0 4px 12px rgba(0,0,170,0.08)',
            border: '1px solid rgba(0,0,170,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', backgroundColor: '#0000AA' }}></div>
            <h3 style={{ fontSize: '16px', color: '#0000AA', marginBottom: '5px', fontFamily: 'Inter, sans-serif' }}>MARCH 15, 2024</h3>
            <h4 style={{ fontSize: '20px', marginBottom: '15px', fontFamily: 'Inter, sans-serif' }}>Released Crypto Invoicing</h4>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>
              Invoice clients and receive crypto payments
            </p>
            <Link 
              href={invoiceAppLink}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#0000AA',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              Try It Now
            </Link>
          </div>
        </div>
      </div>

      {/* How it works Section - Modern Style */}
      <div
        className="how-it-works-section"
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '20px auto 0',
          padding: '40px 20px',
          backgroundColor: '#fff',
        }}
      >
        <h2
          style={{
            fontSize: '36px',
            color: '#333',
            textAlign: 'center',
            marginBottom: '40px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            position: 'relative',
            padding: '0 0 15px',
          }}
        >
          <span
            style={{
              color: '#0000AA',
              position: 'relative',
            }}
          >
            How it works
            <div
              style={{
                position: 'absolute',
                height: '3px',
                width: '60%',
                background: 'linear-gradient(to right, #0000AA, transparent)',
                bottom: '-10px',
                left: '20%',
              }}
            ></div>
          </span>
        </h2>
        
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto', 
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0,0,170,0.08)',
          border: '1px solid rgba(0,0,170,0.1)',
        }}>
          <p style={{ 
            fontSize: '18px', 
            color: '#333', 
            marginBottom: '25px', 
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}>
            hyprsqrl uses AI agents within your account to automatically handle:
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ 
              padding: '15px', 
              borderLeft: '3px solid #0000AA', 
              backgroundColor: 'white', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: '0 8px 8px 0',
            }}>
              <h4 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Tax Management</h4>
              <p style={{ fontSize: '14px', color: '#555', fontFamily: 'Inter, sans-serif' }}>Setting aside money for taxes</p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              borderLeft: '3px solid #0000AA', 
              backgroundColor: 'white', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: '0 8px 8px 0',
            }}>
              <h4 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Liquidity Planning</h4>
              <p style={{ fontSize: '14px', color: '#555', fontFamily: 'Inter, sans-serif' }}>Managing liquidity for short-term expenses</p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              borderLeft: '3px solid #0000AA', 
              backgroundColor: 'white', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: '0 8px 8px 0',
            }}>
              <h4 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Yield Optimization</h4>
              <p style={{ fontSize: '14px', color: '#555', fontFamily: 'Inter, sans-serif' }}>Optimizing idle cash into yield opportunities</p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              borderLeft: '3px solid #0000AA', 
              backgroundColor: 'white', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: '0 8px 8px 0',
            }}>
              <h4 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Invoicing</h4>
              <p style={{ fontSize: '14px', color: '#555', fontFamily: 'Inter, sans-serif' }}>Creating invoices and tracking payments</p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              borderLeft: '3px solid #0000AA', 
              backgroundColor: 'white', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: '0 8px 8px 0',
              gridColumn: '1 / -1',
              maxWidth: '300px',
              margin: '0 auto',
            }}>
              <h4 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Compliance</h4>
              <p style={{ fontSize: '14px', color: '#555', fontFamily: 'Inter, sans-serif' }}>Ensuring financial compliance and reporting</p>
            </div>
          </div>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#333', 
            margin: '30px 0 0', 
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}>
            Spend less time on financial admin. hyprsqrl handles it automatically.
          </p>
        </div>
      </div>

      {/* Demo Component Section - Modern Sleek Design */}
      <div
        className="full-width-demo"
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 20px',
          backgroundColor: '#fff',
        }}
      >
        <h2
          style={{
            fontSize: '36px',
            color: '#333',
            textAlign: 'center',
            marginBottom: '40px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            position: 'relative',
            padding: '0 0 15px',
          }}
        >
          <span
            style={{
              color: '#0000AA',
              position: 'relative',
            }}
          >
            See it in action
           <div
              style={{
                position: 'absolute',
                height: '3px',
                width: '60%',
                background: 'linear-gradient(to right, #0000AA, transparent)',
                bottom: '-10px',
                left: '20%',
              }}
            ></div>
          </span>
        </h2>

        <p
          style={{
            textAlign: 'center',
            margin: '0 auto 40px',
            maxWidth: '800px',
            color: '#555',
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            lineHeight: '1.6',
          }}
        >
          Experience the hyprsqrl dashboard with automated treasury management,
          crypto wallets, and AI agents working together to streamline your
          finances.
        </p>

        {/* Waitlist Signup Form */}
        <div style={{ marginBottom: '50px' }}>
          <WaitlistForm />
        </div>

        <div
          style={{
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <a
            href={demoFullViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', width: '100%' }}
          >
            <div style={{ width: '100%' }}>
              <Demo />
            </div>
          </a>
        </div>

     {/* Gradient transition */}
     <div
        style={{
          height: '80px',
          // invert
          background: 'linear-gradient(to bottom, #ffffff, #aaaaaa)',
          width: '100%',
        }}
      ></div>


      <BiosContainer />

        <p
          style={{
            textAlign: 'center',
            margin: '20px 0 0',
            color: '#666',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          }}
        >
          Automated treasury management, crypto wallets, and AI agents - all in
          one dashboard
        </p>
      </div>
    </>
  );
}

export default function RootPage() {
  return (
    <Suspense>
      <MainContent />
      <div
        className="bios-footer"
        style={{
          backgroundColor: '#0000aa',
          color: 'white',
          textAlign: 'center',
          padding: '8px',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}
      >
        <div className="copyright">
          © 2025 HYPRSQRL • OPEN SOURCE • CRYPTO BANKING
        </div>
      </div>
    </Suspense>
  );
}
