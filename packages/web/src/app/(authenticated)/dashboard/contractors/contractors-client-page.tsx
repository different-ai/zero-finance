'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Copy, Check, Mail, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock data for contractors
const mockContractors = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    status: 'active',
    totalPaid: 45000,
    pending: 5000,
    lastInvoice: '2024-01-15',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'pending',
    totalPaid: 0,
    pending: 0,
    lastInvoice: null,
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike@example.com',
    status: 'active',
    totalPaid: 120000,
    pending: 15000,
    lastInvoice: '2024-01-10',
  },
];

export function ContractorsClientPage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const inviteCode = 'ZERO-CTR-2024-ABC123';

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    toast.success('Invite code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="border-b border-[#101010]/10 bg-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                TEAM MANAGEMENT
              </p>
              <h1 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Contractors
              </h1>
              <p className="mt-2 text-[14px] text-[#101010]/70">
                Manage your contractors and their access to invoice submission.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={copyInviteCode}
                variant="outline"
                className="inline-flex items-center px-4 py-2 text-[14px] border-[#101010]/10"
              >
                {copiedCode ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copiedCode ? 'Copied!' : 'Copy Invite Code'}
              </Button>
              <button className="inline-flex items-center px-6 py-3 text-[15px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                Invite Contractor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Code Card */}
      <div className="my-6 bg-blue-50 border border-[#1B29FF]/20 rounded-[12px] p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[14px] font-medium text-[#101010]">
              Contractor Invite Code
            </p>
            <p className="mt-1 text-[13px] text-[#101010]/70">
              Share this code with contractors to give them access to submit
              invoices
            </p>
            <div className="mt-3 flex items-center gap-3">
              <code className="px-3 py-1.5 bg-white border border-[#101010]/10 rounded text-[14px] font-mono">
                {inviteCode}
              </code>
              <Button
                onClick={copyInviteCode}
                size="sm"
                variant="ghost"
                className="text-[#1B29FF] hover:text-[#1420CC]"
              >
                {copiedCode ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                ACTIVE
              </p>
              <p className="mt-2 font-serif text-[24px] leading-[1.1] text-[#101010]">
                3
              </p>
            </div>
            <Users className="h-5 w-5 text-[#101010]/40" />
          </div>
        </div>

        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                PENDING
              </p>
              <p className="mt-2 font-serif text-[24px] leading-[1.1] text-orange-600">
                1
              </p>
            </div>
            <Mail className="h-5 w-5 text-orange-600" />
          </div>
        </div>

        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                TOTAL PAID
              </p>
              <p className="mt-2 font-serif text-[24px] leading-[1.1] text-green-600">
                $165k
              </p>
            </div>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                PENDING
              </p>
              <p className="mt-2 font-serif text-[24px] leading-[1.1] text-[#1B29FF]">
                $20k
              </p>
            </div>
            <DollarSign className="h-5 w-5 text-[#1B29FF]" />
          </div>
        </div>
      </div>

      {/* Contractors List */}
      <div className="bg-white border border-[#101010]/10 rounded-[12px] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#101010]/10">
          <h2 className="text-[16px] font-medium text-[#101010]">
            All Contractors
          </h2>
        </div>

        <div className="divide-y divide-[#101010]/10">
          {mockContractors.map((contractor) => (
            <div
              key={contractor.id}
              className="px-6 py-4 hover:bg-[#F7F7F2]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1B29FF]/10 rounded-full flex items-center justify-center">
                    <span className="text-[14px] font-medium text-[#1B29FF]">
                      {contractor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#101010]">
                      {contractor.name}
                    </p>
                    <p className="text-[13px] text-[#101010]/60">
                      {contractor.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[13px] text-[#101010]/60">Total Paid</p>
                    <p className="text-[15px] font-medium text-[#101010]">
                      ${(contractor.totalPaid / 1000).toFixed(0)}k
                    </p>
                  </div>

                  {contractor.pending > 0 && (
                    <div className="text-right">
                      <p className="text-[13px] text-[#101010]/60">Pending</p>
                      <p className="text-[15px] font-medium text-orange-600">
                        ${(contractor.pending / 1000).toFixed(0)}k
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2 py-1 text-[11px] uppercase tracking-wider rounded',
                        contractor.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700',
                      )}
                    >
                      {contractor.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#101010]/60 hover:text-[#101010]"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
