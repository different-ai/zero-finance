import { NextRequest, NextResponse } from 'next/server';

// Import the shared addresses store
import { addresses } from '../../../addresses-store';

// PUT handler to set an address as default
export async function PUT(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const { id } = params;
    
    // Find the address to set as default
    const addressToSetDefault = addresses.find(a => a.id === id);
    
    if (!addressToSetDefault) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }
    
    // Get the network of the address being set as default
    const { network } = addressToSetDefault;
    
    // Update all addresses in the same network to not be default
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].network === network) {
        addresses[i].isDefault = addresses[i].id === id;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Default address updated successfully' 
    });
    
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    );
  }
}