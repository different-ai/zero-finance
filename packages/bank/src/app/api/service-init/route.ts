/**
 * API Route: /api/service-init
 * 
 * Initializes background services when the server starts.
 * This route is called during server initialization or can be manually triggered.
 */

import { NextRequest, NextResponse } from 'next/server';
import { startDepositChecker } from '@/server/deposit-checker';

// Track if services have been initialized
let servicesInitialized = false;

// Initialize services
const initializeServices = () => {
  if (servicesInitialized) {
    console.log('Services already initialized');
    return;
  }
  
  console.log('Initializing background services...');
  
  // Start the deposit checker with a 2-minute interval (120000ms)
  // For production, you might want to increase this to 5-10 minutes
  startDepositChecker(120000);
  
  servicesInitialized = true;
  console.log('Services initialized successfully');
};

// Initialize services when the module is loaded
initializeServices();

/**
 * GET handler for /api/service-init
 * Returns the status of service initialization
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    initialized: servicesInitialized
  });
}

/**
 * POST handler for /api/service-init
 * Manually triggers service initialization
 */
export async function POST() {
  try {
    // Initialize services
    initializeServices();
    
    return NextResponse.json({
      success: true,
      message: 'Services initialization triggered',
      initialized: servicesInitialized
    });
  } catch (error) {
    console.error('Error initializing services:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize services' 
      },
      { status: 500 }
    );
  }
} 