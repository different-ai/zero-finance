'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { TeamTab } from './team-tab';

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
  const [isSaving, setIsSaving] = useState(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Company Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your company information and invite contractors and team
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Company Info</TabsTrigger>
          <TabsTrigger value="shared">Shared Data</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="invites">Invite Links</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                This information will be used in invoices and shared with team
                members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
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
                  />
                </div>
                <div>
                  <Label htmlFor="email">Company Email</Label>
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
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Street Address</Label>
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
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
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
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
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
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
                  />
                </div>
                <div>
                  <Label htmlFor="paymentTerms">Default Payment Terms</Label>
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
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paymentAddress">Crypto Payment Address</Label>
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
                />
                <p className="text-xs text-gray-500 mt-1">
                  This address will be used as the default payment address for
                  crypto invoices
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared">
          <Card>
            <CardHeader>
              <CardTitle>Shared Data</CardTitle>
              <CardDescription>
                Additional information that will be available to contractors
                when creating invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      className="w-1/3"
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
                      className="flex-1"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setSharedData((prev) => {
                          const newData = { ...prev };
                          delete newData[key];
                          return newData;
                        });
                      }}
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
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contractors">
          <div className="space-y-6">
            {/* Statistics Cards */}
            {membersData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {membersData.stats.totalMembers}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Contractors
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {membersData.stats.totalInvites}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Invites Sent
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {membersData.stats.totalInviteUses}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Successful Joins
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Active Contractors */}
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Active Contractors
                  </CardTitle>
                  <CardDescription>
                    External contractors who can create invoices using your
                    company data.
                    <span className="block mt-1 text-xs text-gray-500">
                      Contractors see “Bill to:{' '}
                      {company?.name || 'your company'}”. They fill “Bill from”
                      with their details.
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateInviteLink}>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite contractor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/create-invoice')}
                  >
                    Pay a contractor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {membersData?.members.length ? (
                  <div className="space-y-3">
                    {membersData.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {member.businessName ||
                                  member.email ||
                                  'Unknown User'}
                              </span>
                              {member.email && (
                                <span className="text-xs text-gray-600">
                                  {member.email}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                member.role === 'owner'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {member.role}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined{' '}
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {member.role !== 'owner' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={removeMember.isPending}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No contractors yet. Create invite links to add contractors.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Pending Invitations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  Invite links that haven't been used yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inviteLinks.length ? (
                  <div className="space-y-3">
                    {inviteLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono">
                              {window.location.origin}/signin?invite=
                              {link.token.slice(0, 8)}...
                            </span>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              {link.usedCount || 0} uses
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
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
                          >
                            {copiedLink === link.token ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteInviteLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No pending invitations. Create invite links to add
                    contractors.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab Content */}
        <TabsContent value="team">
          <TeamTab companyId={company?.id} />
        </TabsContent>

        <TabsContent value="invites">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Invite Links Management
              </CardTitle>
              <CardDescription>
                Generate and manage links to invite contractors to join your
                company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <h3 className="font-medium text-blue-900">
                    How Invite Links Work
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Share these links with contractors. When they sign in,
                    they'll automatically join your company.
                  </p>
                </div>
                <Button onClick={handleCreateInviteLink} disabled={!company}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Link
                </Button>
              </div>

              <div className="space-y-4">
                {inviteLinks.map((link) => (
                  <div
                    key={link.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Active
                          </span>
                          <span className="text-xs text-gray-500">
                            Created{' '}
                            {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-sm font-mono break-all">
                            {window.location.origin}/signin?invite={link.token}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
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
                          className="flex items-center gap-1"
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
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteInviteLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {inviteLinks.length === 0 && (
                  <div className="text-center py-12">
                    <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No invite links yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Create your first invite link to start adding contractors
                      to your company.
                    </p>
                    <Button
                      onClick={handleCreateInviteLink}
                      disabled={!company}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Invite Link
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-between">
        <Button
          variant="destructive"
          onClick={handleDeleteCompany}
          disabled={deleteCompany.isPending}
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
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
