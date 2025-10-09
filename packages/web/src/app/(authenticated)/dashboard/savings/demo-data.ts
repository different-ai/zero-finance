export const demoFundingSources = [
  {
    id: 'demo-ach-1',
    accountTier: 'starter' as const,
    sourceAccountType: 'us_ach' as const,
    sourceBankName: 'JPMorgan Chase',
    sourceCurrency: 'USD',
    sourceAccountNumber: '****5678',
    sourceRoutingNumber: '021000021',
    sourceBankBeneficiaryName: 'Demo Company Inc.',
    sourceIban: null,
    sourceBicSwift: null,
    destinationCurrency: 'USDC',
    destinationPaymentRail: 'Base',
  },
  {
    id: 'demo-iban-1',
    accountTier: 'starter' as const,
    sourceAccountType: 'iban' as const,
    sourceBankName: 'Deutsche Bank',
    sourceCurrency: 'EUR',
    sourceAccountNumber: null,
    sourceRoutingNumber: null,
    sourceIban: 'DE89 3704 0044 0532 0130 00',
    sourceBicSwift: 'DEUTDEFF',
    sourceBankBeneficiaryName: 'Bridge Building Sp.z.o.o.',
    sourceBankAddress: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany',
    destinationCurrency: 'USDC',
    destinationPaymentRail: 'Base',
  },
];

export const demoUserData = {
  firstName: 'John',
  lastName: 'Doe',
  companyName: 'Demo Company Inc.',
};

export const getRecipientName = (source: any, userData: any) => {
  if (source.sourceAccountType === 'iban') {
    return 'Bridge Building Sp.z.o.o.';
  }
  if (source.sourceAccountType === 'us_ach') {
    if (userData?.companyName) return userData.companyName;
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    if (source.sourceBankBeneficiaryName) {
      return source.sourceBankBeneficiaryName;
    }
    return 'Account Holder';
  }
  return source.sourceBankBeneficiaryName || 'Account Holder';
};

export const ZERO_LOGO_SRC = '/images/new-logo-bluer.png';
export const INSURANCE_CONTACT = {
  email: 'raghav@0.finance',
  scheduleUrl: 'https://cal.com/team/0finance/30',
};
export const INSURED_VAULT_IDS = new Set<string>();

export const insuredPillAnimation = `
  @keyframes insuredShine {
    0%, 55% {
      transform: translateX(-160%);
      opacity: 0;
    }
    60% {
      opacity: 0.85;
    }
    64% {
      transform: translateX(160%);
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .insured-pill {
    position: relative;
    overflow: hidden;
    isolation: isolate;
  }

  .insured-pill::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-160%);
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%);
    mix-blend-mode: screen;
    opacity: 0;
    pointer-events: none;
    animation: insuredShine 6s ease-in-out infinite;
  }
`;
