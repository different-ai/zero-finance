// Simulated data store for wallet addresses
// In a real app, this would be in a database

export const addresses = [
  {
    id: '1',
    label: 'Main Business Wallet',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    network: 'ethereum',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Euro Payment Address',
    address: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    network: 'gnosis',
    isDefault: true,
  },
];