import React from 'react';
import { ContractorsClientPage } from './contractors-client-page';

export const metadata = {
  title: 'Contractors | Zero Finance',
  description: 'Manage your contractors and invite new ones',
};

export default function ContractorsPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      <div className="max-w-[1200px] mx-auto">
        <ContractorsClientPage />
      </div>
    </div>
  );
}
