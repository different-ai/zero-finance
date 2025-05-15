export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f7f9fb] bg-gradient-to-br from-sky-500 to-sky-100">
      {children}
    </div>
  );
}
