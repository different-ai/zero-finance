'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { WhatYouGetSection } from './WhatYouGetSection';
import { TestimonialSection } from './TestimonialSection';
import { FinalCTASection } from './FinalCTASection';
import { DepositModal } from './DepositModal';
import { TransferModal } from './TransferModal';

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
