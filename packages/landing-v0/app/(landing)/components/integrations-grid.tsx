interface Integration {
  name: string;
  status: 'active' | 'coming-soon';
  description: string;
  icon?: string;
}

interface IntegrationsGridProps {
  title: string;
  subtitle: string;
  integrations: Integration[];
}

export function IntegrationsGrid({ title, subtitle, integrations }: IntegrationsGridProps) {
  return (
    <section className="mb-24 relative integrations-grid">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 " data-text={title}>{title}</h2>
        <p className="text-xl text-secondary max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="p-6 rounded-xl border framed-content digital-effect border-primary/30 bg-white text-center relative hover:shadow-lg transition-all duration-200 w-full max-w-[280px]"
          >
            {integration.icon && (
              <div className="h-16 flex items-center justify-center mb-4">
                <img 
                  src={integration.icon} 
                  alt={integration.name} 
                  className="max-h-full max-w-[120px] object-contain"
                />
              </div>
            )}
            <span className="font-medium block mb-2 text-gray-800 text-lg">{integration.name}</span>
            <span className="text-sm text-secondary">{integration.description}</span>
          </div>
        ))}
      </div>
      <div className="section-divider mt-16"></div>
    </section>
  );
} 