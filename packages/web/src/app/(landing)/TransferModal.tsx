'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, DollarSign, Globe, Wallet } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [transferDestination, setTransferDestination] = useState<
    'us' | 'eu' | 'crypto'
  >('us');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Transfer Funds
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Send to</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTransferDestination('us')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  transferDestination === 'us'
                    ? 'border-[#0050ff] bg-[#0050ff]/5 text-[#0050ff]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <DollarSign className="w-5 h-5 mx-auto mb-1" />
                <p className="text-sm font-medium">US Bank</p>
              </button>
              <button
                onClick={() => setTransferDestination('eu')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  transferDestination === 'eu'
                    ? 'border-[#0050ff] bg-[#0050ff]/5 text-[#0050ff]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Globe className="w-5 h-5 mx-auto mb-1" />
                <p className="text-sm font-medium">EU SEPA</p>
              </button>
              <button
                onClick={() => setTransferDestination('crypto')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  transferDestination === 'crypto'
                    ? 'border-[#0050ff] bg-[#0050ff]/5 text-[#0050ff]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Wallet className="w-5 h-5 mx-auto mb-1" />
                <p className="text-sm font-medium">Crypto</p>
              </button>
            </div>
          </div>

          {transferDestination === 'us' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Recipient Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Routing Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Account Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
              />
            </div>
          )}

          {transferDestination === 'eu' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Recipient Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
              />
              <input
                type="text"
                placeholder="IBAN"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
              />
              <input
                type="text"
                placeholder="BIC/SWIFT"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
              />
            </div>
          )}

          {transferDestination === 'crypto' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Wallet Address (0x...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent">
                <option>Ethereum</option>
                <option>Base</option>
                <option>Arbitrum</option>
                <option>Polygon</option>
              </select>
            </div>
          )}

          <input
            type="text"
            placeholder="Amount (USD)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
          />

          <button className="w-full py-3 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25">
            Send Transfer
          </button>

          <p className="text-xs text-gray-500 text-center">
            Your USDC will{' '}
            <span className="font-semibold italic text-orange-600">
              convert automatically
            </span>{' '}
            to the destination currency
          </p>
        </div>
      </div>
    </div>
  );
}
