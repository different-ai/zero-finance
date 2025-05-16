import React from 'react';

// Mock SVG icons (replace with real ones later)
const BankingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="url(#banking-gradient)" filter="url(#shadow)" />
    <rect x="12" y="18" width="16" height="8" rx="2" fill="#fff" />
    <defs>
      <radialGradient id="banking-gradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop stopColor="#6A8DFF" />
        <stop offset="1" stopColor="#3B47F5" />
      </radialGradient>
      <filter id="shadow" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6A8DFF" floodOpacity="0.3" />
      </filter>
    </defs>
  </svg>
);

const AllocationsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="url(#allocations-gradient)" filter="url(#shadow)" />
    <path d="M20 12v8l6 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <radialGradient id="allocations-gradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop stopColor="#B16DFF" />
        <stop offset="1" stopColor="#7B3BF5" />
      </radialGradient>
      <filter id="shadow" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#B16DFF" floodOpacity="0.3" />
      </filter>
    </defs>
  </svg>
);

const InvoicingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="url(#invoicing-gradient)" filter="url(#shadow)" />
    <rect x="15" y="15" width="10" height="12" rx="2" fill="#fff" />
    <rect x="17" y="19" width="6" height="2" rx="1" fill="#B6F5C3" />
    <defs>
      <radialGradient id="invoicing-gradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop stopColor="#6DFFB1" />
        <stop offset="1" stopColor="#3BF57B" />
      </radialGradient>
      <filter id="shadow" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6DFFB1" floodOpacity="0.3" />
      </filter>
    </defs>
  </svg>
);

const features = [
  {
    icon: <BankingIcon />,
    title: 'Global Banking',
    description:
      'Receive USD and EUR payments from anywhere in the world. One account, multiple currencies, zero complexity.',
    bullets: [
      'US bank account with routing number',
      'European IBAN for EUR payments',
      'Instant conversion to stablecoins',
    ],
    cardGradient: 'from-[#e0eaff] via-[#f5f8ff] to-[#e0eaff]',
    shadow: 'shadow-[0_8px_32px_0_rgba(106,141,255,0.15)]',
    border: 'border-blue-200',
  },
  {
    icon: <AllocationsIcon />,
    title: 'Smart Allocations',
    description:
      'Automatically set aside money for taxes and expenses. Never be caught short when tax season comes.',
    bullets: [
      'Automatic tax reservations',
      'Custom allocation percentages',
      'Full control over transfers',
    ],
    cardGradient: 'from-[#f3e0ff] via-[#f8f5ff] to-[#f3e0ff]',
    shadow: 'shadow-[0_8px_32px_0_rgba(177,109,255,0.15)]',
    border: 'border-purple-200',
  },
  {
    icon: <InvoicingIcon />,
    title: 'Invoicing',
    description:
      'Create, send and track professional invoices with multiple payment options including crypto and fiat.',
    bullets: [
      'Professional invoice templates',
      'Multiple currency support',
      'Payment tracking & notifications',
    ],
    cardGradient: 'from-[#e0fff3] via-[#f5fffa] to-[#e0fff3]',
    shadow: 'shadow-[0_8px_32px_0_rgba(109,255,177,0.15)]',
    border: 'border-green-200',
  },
];

export default function FeatureHero() {
  return (
    <div
      className="relative w-full"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <section
        className="relative py-20 px-4 sm:px-8 md:px-16  overflow-hidden min-h-[80vh] flex flex-col items-center justify-center border border-zinc-200"
      >
        {/* Dimensional background blobs */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-[#6A8DFF]/30 to-[#B16DFF]/10 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-gradient-to-tr from-[#6DFFB1]/30 to-[#3BF57B]/10 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight ">
            Smarter banking
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 text-center max-w-2xl font-medium">
            Everything you need to run your business efficiently and save more, with none of the complexity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`relative group  border bg-gradient-to-br bg-opacity-80 p-8 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:z-20`}
              >
                <div className="mb-6 flex items-center justify-center">
                  <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center drop-shadow-sm">
                  {feature.title}
                </h2>
                <p className="text-gray-700 text-center mb-4 font-medium">
                  {feature.description}
                </p>
                <ul className="space-y-2 w-full max-w-xs mx-auto">
                  {feature.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-800">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#6A8DFF] via-[#B16DFF] to-[#6DFFB1] animate-pulse" />
                      <span className="text-base font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 