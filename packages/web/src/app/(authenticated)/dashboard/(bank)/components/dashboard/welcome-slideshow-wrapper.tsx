'use client';

import { useState, useEffect } from 'react';
import { WelcomeSlideshow } from '@/components/welcome-slideshow';

export function WelcomeSlideshowWrapper() {
  const [showSlideshow, setShowSlideshow] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome slideshow
    const hasSeenWelcome = localStorage.getItem('zero-welcome-completed');
    
    if (!hasSeenWelcome) {
      // Small delay to ensure smooth page load
      setTimeout(() => {
        setShowSlideshow(true);
      }, 500);
    }
  }, []);

  if (!showSlideshow) {
    return null;
  }

  return (
    <WelcomeSlideshow 
      onComplete={() => setShowSlideshow(false)}
      showCloseButton={true}
    />
  );
} 