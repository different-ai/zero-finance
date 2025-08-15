import { describe, it, expect } from 'vitest';

function validatePaymentDetails(formData: {
  paymentMethod: string;
  paymentAddress: string;
  bankAccountHolder?: string;
  bankIban?: string;
  bankAccountNumber?: string;
}) {
  const isCryptoPayment = formData.paymentMethod !== 'fiat' && 
                         formData.paymentMethod !== 'ach' && 
                         formData.paymentMethod !== 'sepa';
  const hasBankDetails = formData.bankAccountHolder || 
                        formData.bankIban || 
                        formData.bankAccountNumber;
  
  if (isCryptoPayment && !formData.paymentAddress && !hasBankDetails) {
    return { valid: false, error: 'Payment address is required for crypto payments, or provide bank account details.' };
  }
  
  return { valid: true };
}

describe('Invoice Payment Validation', () => {
  it('should accept crypto payment with payment address only', () => {
    const result = validatePaymentDetails({
      paymentMethod: 'crypto',
      paymentAddress: '0x1234567890123456789012345678901234567890'
    });
    expect(result.valid).toBe(true);
  });

  it('should accept fiat payment with bank details only', () => {
    const result = validatePaymentDetails({
      paymentMethod: 'ach',
      paymentAddress: '',
      bankAccountHolder: 'John Doe'
    });
    expect(result.valid).toBe(true);
  });

  it('should accept crypto payment with bank details instead of payment address', () => {
    const result = validatePaymentDetails({
      paymentMethod: 'crypto',
      paymentAddress: '',
      bankAccountHolder: 'John Doe'
    });
    expect(result.valid).toBe(true);
  });

  it('should reject crypto payment without payment address or bank details', () => {
    const result = validatePaymentDetails({
      paymentMethod: 'crypto',
      paymentAddress: ''
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Payment address is required');
  });

  it('should accept crypto payment with IBAN instead of payment address', () => {
    const result = validatePaymentDetails({
      paymentMethod: 'crypto',
      paymentAddress: '',
      bankIban: 'DE89370400440532013000'
    });
    expect(result.valid).toBe(true);
  });

  it('should accept crypto payment with account number instead of payment address', () => {
    const result = validatePaymentDetails({
      paymentMethod: 'crypto',
      paymentAddress: '',
      bankAccountNumber: '1234567890'
    });
    expect(result.valid).toBe(true);
  });

  it('should accept SEPA payment without crypto address', () => {
    const result = validatePaymentDetails({
      paymentMethod: 'sepa',
      paymentAddress: '',
      bankAccountHolder: 'John Doe'
    });
    expect(result.valid).toBe(true);
  });
});
