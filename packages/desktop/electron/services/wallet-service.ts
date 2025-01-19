import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { AddressEntry } from '../../frontend/components/payment-config';

export class WalletService {
  private addressesPath: string;

  constructor() {
    this.addressesPath = path.join(app.getPath('userData'), 'addresses.json');
  }

  private loadAddresses(): AddressEntry[] {
    try {
      if (fs.existsSync(this.addressesPath)) {
        return JSON.parse(fs.readFileSync(this.addressesPath, 'utf8'));
      }
    } catch (error) {
      console.error('0xHypr', 'Error loading addresses:', error);
    }
    return [];
  }

  private saveAddresses(addresses: AddressEntry[]): void {
    try {
      fs.writeFileSync(this.addressesPath, JSON.stringify(addresses, null, 2));
    } catch (error) {
      console.error('0xHypr', 'Error saving addresses:', error);
      throw error;
    }
  }

  getAddresses(): AddressEntry[] {
    return this.loadAddresses();
  }

  setDefaultAddress(addressId: string): { success: boolean } {
    try {
      const addresses = this.loadAddresses();
      addresses.forEach(a => {
        a.isDefault = a.id === addressId;
      });
      this.saveAddresses(addresses);
      return { success: true };
    } catch (error) {
      console.error('0xHypr', 'Error setting default address:', error);
      return { success: false };
    }
  }

  addAddress(address: AddressEntry): { success: boolean } {
    try {
      const addresses = this.loadAddresses();
      if (addresses.length === 0) {
        address.isDefault = true;
      }
      addresses.push(address);
      this.saveAddresses(addresses);
      return { success: true };
    } catch (error) {
      console.error('0xHypr', 'Error adding address:', error);
      return { success: false };
    }
  }

  removeAddress(addressId: string): { success: boolean } {
    try {
      const addresses = this.loadAddresses();
      const filtered = addresses.filter(a => a.id !== addressId);
      if (filtered.length > 0 && addresses.find(a => a.id === addressId)?.isDefault) {
        filtered[0].isDefault = true;
      }
      this.saveAddresses(filtered);
      return { success: true };
    } catch (error) {
      console.error('0xHypr', 'Error removing address:', error);
      return { success: false };
    }
  }
} 