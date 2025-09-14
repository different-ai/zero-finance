'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Copy,
  Check,
  Mail,
  DollarSign,
  UserPlus,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ContractorsClientPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );

  // Fetch user's companies
  const { data: userCompanies, isLoading: loadingCompanies } =
    api.company.getMyCompanies.useQuery();

  // Fetch company members (contractors) if a company is selected
  const { data: companyData, isLoading: loadingMembers } =
    api.company.getCompanyMembers.useQuery(
      { companyId: selectedCompanyId! },
      { enabled: !!selectedCompanyId },
    );

  // We no longer fetch invoices for stats to prevent data leakage
  // Stats should be calculated server-side with proper access control

  // Select first company by default
  React.useEffect(() => {
    if (userCompanies && userCompanies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(userCompanies[0].id);
    }
  }, [userCompanies, selectedCompanyId]);

  const copyInviteLink = (link: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${link}`);
    toast.success('Invite link copied!');
  };

  // Stats removed to prevent data leakage - should be calculated server-side

  if (loadingCompanies) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B29FF] mx-auto"></div>
          <p className="mt-4 text-[#101010]/60">Loading contractors...</p>
        </div>
      </div>
    );
  }

  if (!userCompanies || userCompanies.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to create a company first before managing contractors.
            <Link
              href="/dashboard/settings"
              className="ml-2 text-[#1B29FF] hover:underline"
            >
              Create Company →
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const selectedCompany = userCompanies.find(
    (c: any) => c.id === selectedCompanyId,
  );
  const members = companyData?.members || [];
  const inviteLinks = companyData?.inviteLinks || [];
  const activeInviteLink = inviteLinks.find((link: any) => link.token);

  // Separate contractors from owners (member and owner are the roles)
  const contractors = members.filter((m: any) => m.role === 'member');
  const activeContractors = contractors.filter((c: any) => c.joinedAt);
  const pendingContractors = contractors.filter((c: any) => !c.joinedAt);

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
                Manage contractors for {selectedCompany?.name || 'your company'}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {userCompanies.length > 1 && (
                <select
                  className="px-3 py-2 text-[14px] border border-[#101010]/10 rounded-md bg-white"
                  value={selectedCompanyId || ''}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                >
                  {userCompanies.map((company: any) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              )}
              <Link
                href={`/dashboard/settings?tab=company`}
                className="inline-flex items-center px-6 py-3 text-[15px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Team
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Link Card */}
      {activeInviteLink && (
        <div className="my-6 bg-blue-50 border border-[#1B29FF]/20 rounded-[12px] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#101010]">
                Contractor Invite Link
              </p>
              <p className="mt-1 text-[13px] text-[#101010]/60">
                Share this link with contractors to give them access to submit
                invoices
              </p>
              <div className="mt-3 flex items-center gap-3">
                <code className="px-3 py-1.5 bg-white border border-[#101010]/10 rounded text-[13px] font-mono text-[#101010]/80">
                  {window.location.origin}/invite/{activeInviteLink.token}
                </code>
                <Button
                  onClick={() => copyInviteLink(activeInviteLink.token)}
                  size="sm"
                  variant="ghost"
                  className="text-[#1B29FF] hover:text-[#1420CC]"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-[#101010]/50">
                Used {activeInviteLink.usedCount || 0} times • Expires{' '}
                {activeInviteLink.expiresAt
                  ? formatDistanceToNow(new Date(activeInviteLink.expiresAt), {
                      addSuffix: true,
                    })
                  : 'never'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats - Only show member counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  ACTIVE MEMBERS
                </p>
                <p className="mt-2 font-serif text-[24px] leading-[1.1] text-[#101010]">
                  {activeContractors.length}
                </p>
              </div>
              <Users className="h-5 w-5 text-[#101010]/40" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  PENDING INVITES
                </p>
                <p className="mt-2 font-serif text-[24px] leading-[1.1] text-orange-600">
                  {pendingContractors.length}
                </p>
              </div>
              <Mail className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contractors List */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-[#101010]/10">
          <CardTitle className="text-[16px] font-medium text-[#101010]">
            Team Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Building2 className="h-12 w-12 text-[#101010]/20 mx-auto mb-4" />
              <p className="text-[15px] text-[#101010]/60">
                No team members yet
              </p>
              <p className="text-[13px] text-[#101010]/40 mt-2">
                Invite contractors to start collaborating
              </p>
              <Link
                href="/dashboard/settings?tab=company"
                className="inline-flex items-center mt-4 px-4 py-2 text-[14px] font-medium text-[#1B29FF] hover:bg-[#1B29FF]/5 rounded-md transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Contractor
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#101010]/10">
              {members.map((member: any) => {
                return (
                  <div
                    key={member.id}
                    className="px-6 py-4 hover:bg-[#F7F7F2]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#1B29FF]/10 rounded-full flex items-center justify-center">
                          <span className="text-[14px] font-medium text-[#1B29FF]">
                            {(member.email || member.businessName || 'U')
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-[15px] font-medium text-[#101010]">
                            {member.businessName || member.email || 'Unknown'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[13px] text-[#101010]/60">
                              {member.email || 'No email'}
                            </span>
                            <span className="text-[11px] text-[#101010]/40">
                              •
                            </span>
                            <span className="text-[11px] uppercase tracking-wider text-[#101010]/40">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-[11px] uppercase tracking-wider rounded ${
                            member.joinedAt
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {member.joinedAt ? 'active' : 'invited'}
                        </span>
                        {member.role === 'member' && (
                          <Link
                            href={`/dashboard/invoices?contractor=${member.userPrivyDid}`}
                            className="text-[14px] text-[#101010]/60 hover:text-[#101010] px-3 py-1 hover:bg-[#F7F7F2] rounded transition-colors"
                          >
                            View Invoices
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
