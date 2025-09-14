'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { X, DollarSign, ArrowRight } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
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
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Virtual ACH Account Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800 flex items-center gap-2">
              <span className="font-semibold">⚠️ Demo Mode:</span> This is a
              demonstration account. Do not send real funds.
            </p>
          </div>

          <div className="bg-[#0050ff]/5 rounded-lg p-4 border border-[#0050ff]/20">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-[#0050ff] flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#0050ff]" />
              </div>
              <ArrowRight className="w-5 h-5 text-[#0050ff]" />
              <div className="w-12 h-12 bg-[#0050ff] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ξ</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-700">
              Fiat deposits{' '}
              <span className="font-semibold text-[#0050ff]">
                automatically convert
              </span>{' '}
              to USDC
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Wire to this account:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Routing Number:</span>
                <span className="font-mono font-semibold text-[#0050ff]">
                  021000021
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Account Number:</span>
                <span className="font-mono font-semibold text-[#0050ff]">
                  1234567890
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Account Name:</span>
                <span className="font-semibold">Your Company LLC</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.brandfetch.io/idEaF8VndV/idbs4VrGxp.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                  alt="Gnosis Safe"
                  className="h-5 w-auto"
                />
                <span className="text-sm font-medium text-gray-700">
                  Gnosis Safe
                </span>
              </div>
              <button className="text-xs text-[#0050ff] hover:text-[#0050ff]/80 font-medium">
                Change
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="self-custody"
                  name="custody"
                  defaultChecked
                  className="text-[#0050ff] focus:ring-[#0050ff]"
                />
                <label htmlFor="self-custody" className="text-sm text-gray-700">
                  Self-custodial Safe (You control the keys)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="managed"
                  name="custody"
                  className="text-[#0050ff] focus:ring-[#0050ff]"
                />
                <label htmlFor="managed" className="text-sm text-gray-700">
                  0.finance managed (We handle security)
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Safe Address: <span className="font-mono">0x742d...b7d</span>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> USD sent to this ACH account
              instantly converts to USDC in your Gnosis Safe. You maintain full
              control of your funds.
            </p>
          </div>

          <Link
            href="/signin?source=crypto"
            className="block w-full py-3 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-center font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
          >
            Sign Up →
          </Link>
        </div>
      </div>
    </div>
  );
}
