import React from 'react';
// Removed Image import as it's no longer used for background

// Mock SVG icons (replace with real ones later or use themed versions)
// For now, let's assume the primary blue is #2663FF
const ThemedIconBase = ({ children }: { children: React.ReactNode }) => (
  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#2663FF] group-hover:scale-110 transition-transform duration-300">
    {children}
  </div>
);

const BankingIcon = () => (
  <ThemedIconBase>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="9" width="14" height="6" rx="1" fill="white" />
    </svg>
  </ThemedIconBase>
);

const AllocationsIcon = () => (
  <ThemedIconBase>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7v5l3 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5" />
    </svg>
  </ThemedIconBase>
);

const InvoicingIcon = () => (
  <ThemedIconBase>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="6" width="8" height="10" rx="1" fill="white" />
      <rect x="9.5" y="10" width="5" height="1.5" rx="0.5" fill="#A0C4FF" />
    </svg>
  </ThemedIconBase>
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
    // Removed cardGradient, shadow, border specific to dark theme
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
    // Removed cardGradient, shadow, border specific to dark theme
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
    // Removed cardGradient, shadow, border specific to dark theme
  },
];

export default function FeatureHero() {
  return (
    // Removed relative positioning and background Image related elements
    <div className="w-full">
      {/* Removed background Image and overlay */}
      {/* Removed animated blur divs */}

      <section
        // Adjusted padding, removed min-h-[80vh] as it might conflict with new layout rhythm
        className="relative z-10 py-16 px-4 sm:px-8 md:px-16 overflow-hidden flex flex-col items-center justify-center border-none"
      >
        {/* Removed absolute positioned blur elements from here too */}
        
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-800 mb-4 tracking-tight">
            Smarter banking
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-12 text-center max-w-2xl font-medium">
            Everything you need to run your business efficiently and save more, with none of the complexity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                // Updated card styling for light theme: light background, subtle border and shadow
                className={`relative group bg-white border border-gray-200 p-8 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:z-20 rounded-xl shadow-md hover:shadow-lg`}
              >
                <div className="mb-6 flex items-center justify-center">
                  {/* Icon container already handles hover scale within ThemedIconBase */}
                  {feature.icon}
                </div>
                <h2 className="text-2xl font-medium mb-2 text-center text-neutral-800 drop-shadow-sm">
                  {feature.title}
                </h2>
                <p className="text-neutral-600 text-center mb-4 font-normal">
                  {feature.description}
                </p>
                <ul className="space-y-2 w-full max-w-xs mx-auto">
                  {feature.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-2 text-neutral-700">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2663FF] animate-pulse" />
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