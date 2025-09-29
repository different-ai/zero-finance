'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import {
  Building2,
  Calendar,
  Users,
  Mail,
  ExternalLink,
  Crown,
  Trash2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function MyCompaniesPage() {
  // Fetch user's companies
  const {
    data: companies = [],
    isLoading,
    refetch,
  } = api.company.getMyCompanies.useQuery();

  // Delete mutation
  const deleteCompany = api.company.deleteCompany.useMutation({
    onSuccess: () => {
      toast.success('Company deleted successfully');
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete company');
    },
  });

  const handleDeleteCompany = async (company: any) => {
    if (
      !confirm(
        `Are you sure you want to delete ${company.name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    await deleteCompany.mutateAsync({ id: company.id });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Company Profiles
        </h1>
        <p className="text-gray-600 mt-2">
          Company profiles for invoicing. These are used as "Bill To" or "Bill
          From" information when creating invoices.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Note: This is different from your workspace, which is your
          team/organization.
        </p>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No company profiles yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create a company profile to use for invoicing. You can have
              multiple profiles for different clients or businesses.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard/settings/company">
                <Button>
                  <Building2 className="h-4 w-4 mr-2" />
                  Create Company Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {companies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {company.name}
                        {company.role === 'owner' && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {company.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={company.role === 'owner' ? 'default' : 'secondary'}
                  >
                    {company.role === 'owner' ? 'Owner' : 'Member'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Company Details */}
                  {(company.settings as any)?.address && (
                    <div>
                      <p className="text-sm text-gray-600">
                        {(company.settings as any).address}
                      </p>
                    </div>
                  )}

                  {/* Stats and Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(company.createdAt).toLocaleDateString()}
                    </div>
                    {(company.settings as any)?.taxId && (
                      <div>Tax ID: {(company.settings as any).taxId}</div>
                    )}
                    {(company.settings as any)?.paymentTerms && (
                      <div>Terms: {(company.settings as any).paymentTerms}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    {company.role === 'owner' && (
                      <>
                        <Link href="/dashboard/settings/company">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Manage Company
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCompany(company)}
                          disabled={deleteCompany.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary Card */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {companies.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Profiles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {companies.filter((c) => c.role === 'owner').length}
                  </p>
                  <p className="text-sm text-gray-600">Profiles Owned</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {companies.filter((c) => c.role === 'member').length}
                  </p>
                  <p className="text-sm text-gray-600">Client Profiles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
