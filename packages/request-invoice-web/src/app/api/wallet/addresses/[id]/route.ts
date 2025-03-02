import { NextRequest, NextResponse } from 'next/server';

// Reference to the addresses array from the parent route
// In a real app, this would be in a database
import { addresses } from '../../addresses-store';

// DELETE handler to remove an address
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the address to be deleted
    const addressToDelete = addresses.find(a => a.id === id);
    
    if (!addressToDelete) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }
    
    // Prevent deleting default addresses
    if (addressToDelete.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete a default address' },
        { status: 400 }
      );
    }
    
    // Remove the address
    const index = addresses.findIndex(a => a.id === id);
    if (index !== -1) {
      addresses.splice(index, 1);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Address deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}