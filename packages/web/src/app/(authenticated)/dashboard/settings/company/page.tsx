'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamTab } from './team-tab';
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
    paymentTerms: '',
  });
  const [workspaceName, setWorkspaceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);

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
  // Mutations
  const createCompany = api.company.create.useMutation();
  const updateCompany = api.company.update.useMutation();
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
        paymentTerms: settings.paymentTerms || '',
      });
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
          settings: {
            paymentTerms: companyData.paymentTerms,
          },
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
              { value: 'team', label: 'Team' },
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Tab Content */}
        {tab === 'team' && <TeamTab companyId={company?.id} />}
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
