'use client';

import React, { useEffect, ReactNode } from 'react';

interface ClientDragPreventionProps {
  children: ReactNode;
}

export function ClientDragPrevention({ children }: ClientDragPreventionProps) {
  // Prevent browser default behavior for drag and drop events at the page level
  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      // Don't stop propagation - this allows the event to reach our upload component
    };

    // Add event listeners to prevent default behaviors
    document.addEventListener('dragenter', preventDefaults, false);
    document.addEventListener('dragover', preventDefaults, false);
    document.addEventListener('dragleave', preventDefaults, false);
    document.addEventListener('drop', preventDefaults, false);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('dragenter', preventDefaults);
      document.removeEventListener('dragover', preventDefaults);
      document.removeEventListener('dragleave', preventDefaults);
      document.removeEventListener('drop', preventDefaults);
    };
  }, []);
  
  return <>{children}</>;
}
