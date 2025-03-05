import { NextRequest, NextResponse } from 'next/server';

// Import the shared addresses store
import { addresses } from '../addresses-store';

// GET handler to retrieve all addresses
export async function GET() {
  try {
    return NextResponse.json({ 
      addresses, 
      success: true 
    });
  } catch (error) {
    console.error('Error getting addresses:', error);
    return NextResponse.json(
      { error: 'Failed to get addresses' },
      { status: 500 }
    );
  }
}

// POST handler to add a new address
export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    
    if (!address || !address.label || !address.address || !address.network) {
      return NextResponse.json(
        { error: 'Invalid address data' },
        { status: 400 }
      );
    }
    
    // Generate an ID if not provided
    if (!address.id) {
      address.id = Math.random().toString(36).substring(2, 9);
    }
    
    // If this is the first address for this network, make it default
    const networkAddresses = addresses.filter(a => a.network === address.network);
    if (networkAddresses.length === 0) {
      address.isDefault = true;
    }
    
    // If setting as default, update other addresses of the same network
    if (address.isDefault) {
      console.log('Setting default address for network:', address.network);
      // Clear isDefault for other addresses of the same network
      for (let i = 0; i < addresses.length; i++) {
        if (addresses[i].network === address.network) {
          addresses[i].isDefault = false;
        }
      }
    }
    
    // Add the new address
    addresses.push(address);
    
    return NextResponse.json({ 
      success: true, 
      address 
    });
    
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    );
  }
}