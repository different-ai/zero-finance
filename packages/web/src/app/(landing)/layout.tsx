export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[rgb(249 247 243/1)]">
      {children}
    </div>
  );
}
