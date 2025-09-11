'use client';

import { useState } from 'react';
import { Combobox } from '@/components/ui/combo-box';

const testCountries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'JP', label: 'Japan' },
  { value: 'AU', label: 'Australia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
];

export default function TestComboboxPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">ComboBox Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select a Country
          </label>
          <Combobox
            options={testCountries}
            value={selectedCountry}
            onChange={setSelectedCountry}
            placeholder="Select a country..."
            searchPlaceholder="Search countries..."
            emptyPlaceholder="No country found."
          />
        </div>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm">
            <strong>Selected value:</strong> {selectedCountry || 'None'}
          </p>
          <p className="text-sm">
            <strong>Selected label:</strong>{' '}
            {testCountries.find((c) => c.value === selectedCountry)?.label || 'None'}
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Test Instructions:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>1. Click the dropdown - it should open</li>
            <li>2. Type to search for a country</li>
            <li>3. Click on a country or press Enter to select</li>
            <li>4. The selected value should appear above</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
