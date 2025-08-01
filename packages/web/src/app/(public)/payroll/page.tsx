'use client';

import { useState, useRef } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail,
  Zap,
  ArrowRight,
  Shield,
  Building
} from 'lucide-react';

// Import components
import { InteractiveDemo } from './components/interactive-demo';

export default function PublicPayrollPage() {
  const [showDemo, setShowDemo] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  const handleTryDemo = () => {
    setShowDemo(true);
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Invoice Management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Contractor Payment Vault
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Automatically detect and pay contractor invoices from your emails. 
            Syncs with QuickBooks for seamless accounting.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg" onClick={handleTryDemo}>
              Try Live Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>AI Invoice Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automatically extracts invoice data from your synced emails. No manual entry required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Building className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>QuickBooks Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Seamlessly syncs with QuickBooks to match vendors and update your accounting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Smart Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                First-time recipient warnings and configurable auto-pay rules keep your funds safe.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Demo Section */}
        {showDemo && (
          <div className="mb-12" ref={demoRef}>
            <h2 className="text-3xl font-bold text-center mb-8">Live Demo</h2>
            
            {/* Interactive Demo Component */}
            <InteractiveDemo />

          </div>
        )}

        {/* CTA Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Automate Your Invoice Payments?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of businesses saving time with AI-powered invoice management
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}