'use client';

import React from 'react';
import { PartyInfo, extractAddress } from './types';

interface PartyDisplayProps {
  label: string;
  party: PartyInfo | undefined;
  fallbackName: string;
}

const PartyDisplay: React.FC<PartyDisplayProps> = ({
  label,
  party,
  fallbackName,
}) => {
  const name = party?.businessName || fallbackName;
  const email = party?.email;
  const address = extractAddress(party?.address);
  const city = party?.city;
  const postalCode = party?.postalCode;
  const country = party?.country;

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
        {label}
      </h3>
      <p className="font-semibold text-lg text-neutral-900 dark:text-white">
        {name}
      </p>
      {email && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {email}
        </p>
      )}
      {address && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {address}
        </p>
      )}
      {(city || postalCode) && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {city}
          {city && postalCode && ', '}
          {postalCode}
        </p>
      )}
      {country && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {country}
        </p>
      )}
    </div>
  );
};

interface InvoicePartiesProps {
  sellerInfo?: PartyInfo;
  buyerInfo?: PartyInfo;
}

export const InvoiceParties: React.FC<InvoicePartiesProps> = ({
  sellerInfo,
  buyerInfo,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <PartyDisplay label="From" party={sellerInfo} fallbackName="Seller" />
      <PartyDisplay label="To" party={buyerInfo} fallbackName="Client" />
    </div>
  );
};

InvoiceParties.displayName = 'InvoiceParties';
