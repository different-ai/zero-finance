'use client';

import React, { useState } from 'react';
import { Header } from './header';
import { HeroSection } from './hero-section';
import { WhatYouGetSection } from './what-you-get-section';
import { FinalCTASection } from './final-cta-section';
import { DepositModal } from './deposit-modal';
import { TransferModal } from './transfer-modal';

export default function CryptoLandingPage() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <Header />
      <HeroSection />
      <WhatYouGetSection />
      {/* <TestimonialSection /> */}
      <FinalCTASection />

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
    </div>
  );
}
