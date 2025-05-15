export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Sky gradient background */}
      <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-b from-sky-200 via-sky-50 to-white" />
      {/* Subtle cloud mesh overlays */}
      <svg className="absolute top-[-60px] left-[-80px] w-[600px] h-[320px] opacity-30 blur-2xl -z-10" viewBox="0 0 600 320" fill="none">
        <ellipse cx="300" cy="160" rx="280" ry="120" fill="#e0e7ef" />
        <ellipse cx="400" cy="100" rx="120" ry="60" fill="#f1f5fa" />
      </svg>
      <svg className="absolute bottom-[-40px] right-[-60px] w-[400px] h-[180px] opacity-20 blur-2xl -z-10" viewBox="0 0 400 180" fill="none">
        <ellipse cx="200" cy="90" rx="180" ry="70" fill="#e0e7ef" />
        <ellipse cx="300" cy="60" rx="80" ry="40" fill="#f1f5fa" />
      </svg>
      {children}
    </div>
  );
}
