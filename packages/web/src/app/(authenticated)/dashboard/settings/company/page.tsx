'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import {
  Building2,
  Save,
  Users,
  Link,
  Copy,
  Check,
  Plus,
  Trash2,
  UserMinus,
  Mail,
  Calendar,
  BarChart3,
  Shield,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamTab } from './team-tab';
import { AccountOwnersTab } from './account-owners-tab';
import { cn } from '@/lib/utils';

export default function CompanySettingsPage() {
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    taxId: '',
    paymentAddress: '',
    paymentTerms: '',
  });
  const [sharedData, setSharedData] = useState<Record<string, string>>({});
  const [workspaceName, setWorkspaceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Tab routing
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [tab, setTab] = useState<string>('info');

  useEffect(() => {
    const t = searchParams?.get('tab');
    if (t && t !== tab) setTab(t);
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setTab(value);
    const sp = new URLSearchParams(searchParams?.toString());
    sp.set('tab', value);
    router.replace(`${pathname}?${sp.toString()}`);
  };

  // Fetch workspace data
  const { data: currentWorkspace, refetch: refetchWorkspace } =
    api.workspace.getOrCreateWorkspace.useQuery();
  const { data: workspace } = api.workspace.getWorkspace.useQuery(
    { workspaceId: currentWorkspace?.workspaceId || '' },
    { enabled: !!currentWorkspace?.workspaceId },
  );

  // Fetch company data
  const {
    data: company,
    isLoading,
    refetch,
  } = api.company.getMyCompany.useQuery();
  const { data: inviteLinks = [], refetch: refetchLinks } =
    api.company.getInviteLinks.useQuery();

  // Fetch company members and stats
  const { data: membersData, refetch: refetchMembers } =
    api.company.getCompanyMembers.useQuery(
      { companyId: company?.id || '' },
      { enabled: !!company?.id },
    );

  // Mutations
  const createCompany = api.company.create.useMutation();
  const updateCompany = api.company.update.useMutation();
  const updateSharedData = api.company.updateSharedData.useMutation();
  const createInviteLink = api.company.createInviteLink.useMutation();
  const deleteInviteLink = api.company.deleteInviteLink.useMutation();
  const removeMember = api.company.removeMember.useMutation();
  const deleteCompany = api.company.deleteCompany.useMutation();
  const renameWorkspace = api.workspace.renameWorkspace.useMutation();

  useEffect(() => {
    if (company) {
      const settings = (company.settings as any) || {};
      setCompanyData({
        name: company.name,
        email: company.email,
        address: company.address || '',
        city: company.city || '',
        postalCode: company.postalCode || '',
        country: company.country || '',
        taxId: company.taxId || '',
        paymentAddress: company.paymentAddress || '',
        paymentTerms: settings.paymentTerms || '',
      });

      // Load shared data
      if (company.sharedData) {
        const sharedDataMap: Record<string, string> = {};
        company.sharedData.forEach((item) => {
          sharedDataMap[item.dataKey] = item.dataValue;
        });
        setSharedData(sharedDataMap);
      }
    }
  }, [company]);

  useEffect(() => {
    if (workspace) {
      setWorkspaceName(workspace.name);
    }
  }, [workspace]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!company) {
        // Create new company
        await createCompany.mutateAsync({
          name: companyData.name,
          email: companyData.email,
          address: companyData.address,
          city: companyData.city,
          postalCode: companyData.postalCode,
          country: companyData.country,
          taxId: companyData.taxId,
          paymentAddress: companyData.paymentAddress,
          settings: {
            paymentTerms: companyData.paymentTerms,
          },
        });
      } else {
        // Update existing company
        await updateCompany.mutateAsync({
          id: company.id,
          name: companyData.name,
          email: companyData.email,
          address: companyData.address,
          city: companyData.city,
          postalCode: companyData.postalCode,
          country: companyData.country,
          taxId: companyData.taxId,
          paymentAddress: companyData.paymentAddress,
          settings: {
            paymentTerms: companyData.paymentTerms,
          },
        });

        // Update shared data
        await updateSharedData.mutateAsync({
          companyId: company.id,
          data: Object.entries(sharedData).map(([key, value]) => ({
            key,
            value,
          })),
        });
      }

      toast.success('Company settings saved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to save company settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateInviteLink = async () => {
    if (!company) {
      toast.error('Please save company settings first');
      return;
    }

    try {
      await createInviteLink.mutateAsync({ companyId: company.id });
      toast.success('Invite link created');
      refetchLinks();
    } catch (error) {
      toast.error('Failed to create invite link');
    }
  };

  const handleDeleteInviteLink = async (linkId: string) => {
    try {
      await deleteInviteLink.mutateAsync({ id: linkId });
      toast.success('Invite link deleted');
      refetchLinks();
    } catch (error) {
      toast.error('Failed to delete invite link');
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/signin?invite=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(token);
    toast.success('Invite link copied to clipboard');
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!company) return;

    try {
      await removeMember.mutateAsync({
        companyId: company.id,
        memberId,
      });
      toast.success('Contractor removed successfully');
      refetchMembers();
    } catch (error) {
      toast.error('Failed to remove contractor');
    }
  };

  const handleDeleteCompany = async () => {
    if (!company) return;

    if (
      !confirm(
        `Are you sure you want to delete ${company.name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteCompany.mutateAsync({ id: company.id });
      toast.success('Company deleted successfully');
      // Redirect to companies page or dashboard
      window.location.href = '/dashboard/settings/companies';
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleSaveWorkspace = async () => {
    if (!currentWorkspace?.workspaceId || !workspaceName.trim()) {
      toast.error('Workspace name is required');
      return;
    }

    setIsSavingWorkspace(true);
    try {
      await renameWorkspace.mutateAsync({
        workspaceId: currentWorkspace.workspaceId,
        name: workspaceName.trim(),
      });
      toast.success('Workspace renamed successfully');
      refetchWorkspace();
    } catch (error) {
      toast.error('Failed to rename workspace');
    } finally {
      setIsSavingWorkspace(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F2]">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mr-3">
            Settings
          </p>
          <h1 className="font-serif text-[28px] sm:text-[32px] leading-[1] text-[#101010] tracking-[-0.02em]">
            Company
          </h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="ghost"
              className="text-[#101010]/60 hover:text-[#101010]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#1B29FF] text-white hover:bg-[#1B29FF]/90 border-0"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-[60px] z-30 bg-[#F7F7F2]/80 backdrop-blur border-b border-[#101010]/10">
        <div className="h-[48px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <div className="flex gap-1">
            {[
              { value: 'info', label: 'Workspace & Company' },
              { value: 'shared', label: 'Shared Data' },
              { value: 'team', label: 'Team' },
              { value: 'owners', label: 'Account Owners' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => handleTabChange(item.value)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  tab === item.value
                    ? 'bg-[#101010] text-white'
                    : 'text-[#101010]/60 hover:text-[#101010] hover:bg-[#101010]/5',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
        {/* Company Info Tab */}
        {tab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            <div className="lg:col-span-8 space-y-5 sm:space-y-6">
              {/* Workspace Settings */}
              <div className="bg-white border border-[#101010]/10 rounded-lg shadow-sm">
                <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
                  <h2 className="font-serif text-[20px] sm:text-[24px] text-[#101010] tracking-[-0.02em]">
                    Workspace Settings
                  </h2>
                  <p className="text-sm text-[#666666] mt-1">
                    Your workspace name and settings
                  </p>
                </div>
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <Label
                      htmlFor="workspaceName"
                      className="text-sm font-medium text-[#101010]"
                    >
                      Workspace Name
                    </Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="workspaceName"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="My Workspace"
                        className="flex-1 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                      />
                      <Button
                        onClick={handleSaveWorkspace}
                        disabled={
                          isSavingWorkspace ||
                          !workspaceName.trim() ||
                          workspaceName === workspace?.name
                        }
                        className="bg-[#1B29FF] text-white hover:bg-[#1B29FF]/90 border-0"
                      >
                        {isSavingWorkspace ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                    <p className="text-xs text-[#666666] mt-1">
                      This is the name of your workspace, visible to you and
                      your team members
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-white border border-[#101010]/10 rounded-lg shadow-sm">
                <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
                  <h2 className="font-serif text-[20px] sm:text-[24px] text-[#101010] tracking-[-0.02em]">
                    Company Information
                  </h2>
                  <p className="text-sm text-[#666666] mt-1">
                    This information will be used in invoices and shared with
                    team members
                  </p>
                </div>
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-[#101010]"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="name"
                        value={companyData.name}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Acme Corp"
                        className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-[#101010]"
                      >
                        Company Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={companyData.email}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="billing@acme.com"
                        className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-[#101010]"
                    >
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      value={companyData.address}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="123 Main St, Suite 100"
                      className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="city"
                        className="text-sm font-medium text-[#101010]"
                      >
                        City
                      </Label>
                      <Input
                        id="city"
                        value={companyData.city}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        placeholder="San Francisco"
                        className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="postalCode"
                        className="text-sm font-medium text-[#101010]"
                      >
                        Postal Code
                      </Label>
                      <Input
                        id="postalCode"
                        value={companyData.postalCode}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            postalCode: e.target.value,
                          }))
                        }
                        placeholder="94105"
                        className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-[#101010]"
                    >
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={companyData.country}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      placeholder="United States"
                      className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="taxId"
                        className="text-sm font-medium text-[#101010]"
                      >
                        Tax ID / EIN
                      </Label>
                      <Input
                        id="taxId"
                        value={companyData.taxId}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            taxId: e.target.value,
                          }))
                        }
                        placeholder="12-3456789"
                        className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="paymentTerms"
                        className="text-sm font-medium text-[#101010]"
                      >
                        Default Payment Terms
                      </Label>
                      <Input
                        id="paymentTerms"
                        value={companyData.paymentTerms}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            paymentTerms: e.target.value,
                          }))
                        }
                        placeholder="Net 30"
                        className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="paymentAddress"
                      className="text-sm font-medium text-[#101010]"
                    >
                      Crypto Payment Address
                    </Label>
                    <Input
                      id="paymentAddress"
                      value={companyData.paymentAddress}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          paymentAddress: e.target.value,
                        }))
                      }
                      placeholder="Your wallet address for receiving payments"
                      className="mt-1.5 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                    />
                    <p className="text-xs text-[#666666] mt-1">
                      This address will be used as the default payment address
                      for crypto invoices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shared Data Tab */}
        {tab === 'shared' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            <div className="lg:col-span-8">
              <div className="bg-white border border-[#101010]/10 rounded-lg shadow-sm">
                <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
                  <h2 className="font-serif text-[20px] sm:text-[24px] text-[#101010] tracking-[-0.02em]">
                    Shared Data
                  </h2>
                  <p className="text-sm text-[#666666] mt-1">
                    Additional information that will be available to contractors
                    when creating invoices
                  </p>
                </div>
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="space-y-3">
                    {Object.entries(sharedData).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <Input
                          value={key}
                          onChange={(e) => {
                            const newKey = e.target.value;
                            setSharedData((prev) => {
                              const newData = { ...prev };
                              delete newData[key];
                              newData[newKey] = value;
                              return newData;
                            });
                          }}
                          placeholder="Field name"
                          className="w-1/3 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                        />
                        <Input
                          value={value}
                          onChange={(e) =>
                            setSharedData((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          placeholder="Field value"
                          className="flex-1 border-[#E5E5E5] focus:border-[#1B29FF] focus:ring-[#1B29FF]"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSharedData((prev) => {
                              const newData = { ...prev };
                              delete newData[key];
                              return newData;
                            });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setSharedData((prev) => ({
                        ...prev,
                        [`field_${Object.keys(prev).length + 1}`]: '',
                      }))
                    }
                    className="w-full border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF]/5"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contractors Tab */}
        {tab === 'contractors' && (
          <div className="space-y-5 sm:space-y-6">
            {/* Statistics Cards */}
            {membersData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[32px] font-serif text-[#101010] tracking-[-0.02em] tabular-nums">
                        {membersData.stats.totalMembers}
                      </p>
                      <p className="text-sm text-[#666666] mt-1">
                        Total Contractors
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#1B29FF]" />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[32px] font-serif text-[#101010] tracking-[-0.02em] tabular-nums">
                        {membersData.stats.totalInvites}
                      </p>
                      <p className="text-sm text-[#666666] mt-1">
                        Invites Sent
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[32px] font-serif text-[#101010] tracking-[-0.02em] tabular-nums">
                        {membersData.stats.totalInviteUses}
                      </p>
                      <p className="text-sm text-[#666666] mt-1">
                        Successful Joins
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Contractors */}
            <div className="bg-white border border-[#101010]/10 rounded-lg shadow-sm">
              <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-[20px] sm:text-[24px] text-[#101010] tracking-[-0.02em]">
                    Active Contractors
                  </h2>
                  <p className="text-sm text-[#666666] mt-1">
                    External contractors who can create invoices using your
                    company data
                  </p>
                  <p className="text-xs text-[#999999] mt-1">
                    Contractors see "Bill to: {company?.name || 'your company'}
                    ". They fill "Bill from" with their details.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateInviteLink}
                    className="bg-[#1B29FF] text-white hover:bg-[#1B29FF]/90 border-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Invite contractor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/create-invoice')}
                    className="border-[#101010]/20 text-[#101010] hover:bg-[#101010]/5"
                  >
                    Pay a contractor
                  </Button>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                {membersData?.members.length ? (
                  <div className="space-y-3">
                    {membersData.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border border-[#101010]/10 rounded-lg hover:bg-[#F7F7F2]/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex flex-col">
                              <span className="font-medium text-[#101010]">
                                {member.businessName ||
                                  member.email ||
                                  'Unknown User'}
                              </span>
                              {member.email && (
                                <span className="text-xs text-[#666666]">
                                  {member.email}
                                </span>
                              )}
                            </div>
                            <span
                              className={cn(
                                'text-xs px-2 py-1 rounded-full',
                                member.role === 'owner'
                                  ? 'bg-[#1B29FF]/10 text-[#1B29FF]'
                                  : 'bg-[#101010]/5 text-[#101010]',
                              )}
                            >
                              {member.role}
                            </span>
                          </div>
                          <p className="text-xs text-[#999999] flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined{' '}
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {member.role !== 'owner' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={removeMember.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#666666] py-8">
                    No contractors yet. Create invite links to add contractors.
                  </p>
                )}
              </div>
            </div>

            {/* Pending Invitations */}
            <div className="bg-white border border-[#101010]/10 rounded-lg shadow-sm">
              <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
                <h2 className="font-serif text-[20px] sm:text-[24px] text-[#101010] tracking-[-0.02em]">
                  Pending Invitations
                </h2>
                <p className="text-sm text-[#666666] mt-1">
                  Invite links that haven't been used yet
                </p>
              </div>
              <div className="p-5 sm:p-6">
                {inviteLinks.length ? (
                  <div className="space-y-3">
                    {inviteLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-4 border border-[#101010]/10 rounded-lg hover:bg-[#F7F7F2]/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-[#101010]">
                              {window.location.origin}/signin?invite=
                              {link.token.slice(0, 8)}...
                            </span>
                            <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                              {link.usedCount || 0} uses
                            </span>
                          </div>
                          <p className="text-xs text-[#999999] flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created{' '}
                            {new Date(link.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyInviteLink(link.token)}
                            className="border-[#101010]/20 text-[#101010] hover:bg-[#101010]/5"
                          >
                            {copiedLink === link.token ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInviteLink(link.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#666666] py-8">
                    No pending invitations. Create invite links to add
                    contractors.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Tab Content */}
        {tab === 'team' && <TeamTab companyId={company?.id} />}

        {/* Account Owners Tab Content */}
        {tab === 'owners' && <AccountOwnersTab companyId={company?.id} />}

        {/* Invite Links Tab */}
        {tab === 'invites' && (
          <div className="bg-white border border-[#101010]/10 rounded-lg shadow-sm">
            <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
              <h2 className="font-serif text-[20px] sm:text-[24px] text-[#101010] tracking-[-0.02em]">
                Invite Links Management
              </h2>
              <p className="text-sm text-[#666666] mt-1">
                Generate and manage links to invite contractors to join your
                company
              </p>
            </div>
            <div className="p-5 sm:p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#1B29FF]/5 rounded-lg border border-[#1B29FF]/20">
                <div>
                  <h3 className="font-medium text-[#101010]">
                    How Invite Links Work
                  </h3>
                  <p className="text-sm text-[#666666] mt-1">
                    Share these links with contractors. When they sign in,
                    they'll automatically join your company.
                  </p>
                </div>
                <Button
                  onClick={handleCreateInviteLink}
                  disabled={!company}
                  className="bg-[#1B29FF] text-white hover:bg-[#1B29FF]/90 border-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Link
                </Button>
              </div>

              <div className="space-y-4">
                {inviteLinks.map((link) => (
                  <div
                    key={link.id}
                    className="border border-[#101010]/10 rounded-lg p-4 space-y-3 hover:bg-[#F7F7F2]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                            Active
                          </span>
                          <span className="text-xs text-[#999999]">
                            Created{' '}
                            {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="bg-[#F7F7F2] p-3 rounded border border-[#101010]/10">
                          <p className="text-sm font-mono break-all text-[#101010]">
                            {window.location.origin}/signin?invite={link.token}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[#999999]">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            Used {link.usedCount || 0} times
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Never expires
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyInviteLink(link.token)}
                          className="flex items-center gap-1 border-[#101010]/20 text-[#101010] hover:bg-[#101010]/5"
                        >
                          {copiedLink === link.token ? (
                            <>
                              <Check className="h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInviteLink(link.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {inviteLinks.length === 0 && (
                  <div className="text-center py-12">
                    <Link className="h-12 w-12 text-[#101010]/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#101010] mb-2">
                      No invite links yet
                    </h3>
                    <p className="text-[#666666] mb-4">
                      Create your first invite link to start adding contractors
                      to your company.
                    </p>
                    <Button
                      onClick={handleCreateInviteLink}
                      disabled={!company}
                      className="bg-[#1B29FF] text-white hover:bg-[#1B29FF]/90 border-0"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Invite Link
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <div className="px-4 sm:px-6 pb-6 sm:pb-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleDeleteCompany}
            disabled={deleteCompany.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {deleteCompany.isPending ? (
              <>Deleting...</>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Company
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
