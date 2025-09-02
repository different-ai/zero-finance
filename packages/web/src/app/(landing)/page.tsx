'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/landing/footer';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { DashboardDemo } from './DashboardDemo';
import { WhatYouGetSection } from './WhatYouGetSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialSection } from './TestimonialSection';
import { FinalCTASection } from './FinalCTASection';
import { DepositModal } from './DepositModal';
import { TransferModal } from './TransferModal';

export default function CryptoLandingPage() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff]">
      <Header />
      <HeroSection />
      <DashboardDemo
        onDepositClick={() => setShowDepositModal(true)}
        onTransferClick={() => setShowTransferModal(true)}
      />
      <WhatYouGetSection />
      <HowItWorksSection />
      <TestimonialSection />
      <FinalCTASection />

      <Footer />

    </div>
  );
}
