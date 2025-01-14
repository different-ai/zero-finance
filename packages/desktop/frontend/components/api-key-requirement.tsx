import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiKeyStore } from '@/stores/api-key-store';

export function ApiKeyRequirement() {
  const { setApiKey } = useApiKeyStore();
  const [tempApiKey, setTempApiKey] = useState('');

  const handleSaveApiKey = () => {
    if (!tempApiKey.trim()) return;
    setApiKey(tempApiKey);
    setTempApiKey('');
  };

  return (
    <div className="flex flex-col h-full border-l border-gray-200">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Key className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-semibold mb-2">
              OpenAI API Key Required
            </h2>
            <p className="text-gray-600">
              Please enter your OpenAI API key to continue
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleSaveApiKey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!tempApiKey.trim()}
            >
              Save API Key
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 