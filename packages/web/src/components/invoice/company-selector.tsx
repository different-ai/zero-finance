'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Info } from 'lucide-react';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CompanySelectorProps {
  selectedCompanyId: string;
  onCompanySelect: (companyId: string) => void;
}

export function CompanySelector({ selectedCompanyId, onCompanySelect }: CompanySelectorProps) {
  const router = useRouter();
  
  // Fetch user's companies
  const { data: companies = [] } = api.company.getMyCompanies.useQuery();
  
  // Get selected company details
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5" />
          Company Selection
        </CardTitle>
        <CardDescription>
          Choose which company this invoice is for
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="company">Select Company</Label>
          <Select value={selectedCompanyId || "none"} onValueChange={(value) => onCompanySelect(value === "none" ? "" : value)}>
            <SelectTrigger id="company" className="w-full">
              <SelectValue placeholder="Choose a company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">No company (manual entry)</span>
                </div>
              </SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{company.name}</span>
                    {company.role === 'owner' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                        Owner
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCompany && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-1">
                <p className="font-medium">{selectedCompany.name}</p>
                <p className="text-xs">{selectedCompany.email}</p>
                {(selectedCompany.settings as any)?.address && (
                  <p className="text-xs">{(selectedCompany.settings as any).address}</p>
                )}
                <p className="text-xs mt-2 text-blue-600">
                  Company details will be auto-filled in the invoice
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {companies.length === 0 && (
          <Alert>
            <AlertDescription>
              <p className="text-sm mb-2">No companies found.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/settings/company')}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Company
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {(!selectedCompanyId || selectedCompanyId === "") && companies.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Select a company to auto-fill business details, or leave empty to enter manually.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}