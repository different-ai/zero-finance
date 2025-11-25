'use client';

import { api } from '@/trpc/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatUnits } from 'viem';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { Separator } from '@/components/ui/separator';

interface WorkspaceDetailsDialogProps {
  workspace: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspaceDetailsDialog({
  workspace,
  isOpen,
  onClose,
}: WorkspaceDetailsDialogProps) {
  const { data: workspaceDetails, isLoading: isLoadingDetails } =
    api.admin.getWorkspaceDetails.useQuery(
      {
        workspaceId: workspace?.id || '',
      },
      {
        enabled: !!workspace && isOpen,
        retry: false,
      },
    );

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{workspace?.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>Workspace ID: {workspace?.id}</span>
            <CopyButton value={workspace?.id || ''} />
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="py-8 text-center">Loading workspace details...</div>
        ) : workspaceDetails ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workspace Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Workspace Name
                    </div>
                    <div className="font-medium">{workspace.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Workspace Type
                    </div>
                    <div className="font-medium">
                      {workspaceDetails.workspace.workspaceType || 'business'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      KYC Status
                    </div>
                    <Badge
                      className={getKycStatusColor(
                        workspaceDetails.workspace.kycStatus || 'none',
                      )}
                      variant="outline"
                    >
                      {workspaceDetails.workspace.kycStatus || 'none'}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Beneficiary Type
                    </div>
                    <div className="font-medium">
                      {workspaceDetails.workspace.beneficiaryType || 'N/A'}
                    </div>
                  </div>
                  {workspaceDetails.workspace.companyName && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Company Name
                      </div>
                      <div className="font-medium">
                        {workspaceDetails.workspace.companyName}
                      </div>
                    </div>
                  )}
                  {workspaceDetails.workspace.firstName && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Contact Person
                      </div>
                      <div className="font-medium">
                        {workspaceDetails.workspace.firstName}{' '}
                        {workspaceDetails.workspace.lastName}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Members</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceDetails.members.length > 0 ? (
                  <div className="space-y-2">
                    {workspaceDetails.members.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div>
                          <div className="font-medium">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            {member.userId}
                            <CopyButton value={member.userId} />
                          </div>
                        </div>
                        <div className="text-right flex gap-2">
                          <Badge variant="secondary">{member.role}</Badge>
                          {member.isPrimary && (
                            <Badge variant="default">Primary</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No members</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safe Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceDetails.safes.length > 0 ? (
                  <div className="space-y-2">
                    {workspaceDetails.safes.map((safe, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-md space-y-2 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Safe Address
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{safe.safeType}</Badge>
                            {safe.isEarnModuleEnabled && (
                              <Badge variant="default" className="bg-green-600">
                                Earn Enabled
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="font-mono text-sm flex items-center gap-2">
                          {safe.safeAddress}
                          <CopyButton value={safe.safeAddress} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No safes</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vaults</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceDetails.finances.vaultBreakdown &&
                workspaceDetails.finances.vaultBreakdown.length > 0 ? (
                  <div className="space-y-2">
                    {workspaceDetails.finances.vaultBreakdown.map(
                      (vault: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-base">
                              {vault.displayName}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">
                              {vault.vaultAddress}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-xl font-bold text-primary">
                              ${vault.balanceUsd.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              USDC
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No vault deposits found for this workspace
                  </div>
                )}
              </CardContent>
            </Card>

            {workspaceDetails.virtualAccount && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Virtual Account Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Account ID
                      </div>
                      <div className="font-mono text-xs flex items-center gap-2">
                        {workspaceDetails.virtualAccount.id}
                        <CopyButton
                          value={workspaceDetails.virtualAccount.id}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Status
                      </div>
                      <Badge
                        variant={
                          workspaceDetails.virtualAccount.status === 'active'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {workspaceDetails.virtualAccount.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Source Currency
                      </div>
                      <div className="font-medium uppercase">
                        {workspaceDetails.virtualAccount.source_currency ||
                          'USD'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Destination
                      </div>
                      <div className="font-medium">
                        {workspaceDetails.virtualAccount.destination_token?.toUpperCase()}{' '}
                        on {workspaceDetails.virtualAccount.destination_network}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Destination Address
                      </div>
                      <div className="font-mono text-xs flex items-center gap-2">
                        {workspaceDetails.virtualAccount.destination_address}
                        <CopyButton
                          value={
                            workspaceDetails.virtualAccount.destination_address
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-semibold mb-3">
                      Deposit Instructions
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Bank Name
                        </div>
                        <div className="font-medium">
                          {workspaceDetails.virtualAccount.deposit_instructions
                            ?.bank_name || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Beneficiary Name
                        </div>
                        <div className="font-medium">
                          {workspaceDetails.virtualAccount.deposit_instructions
                            ?.beneficiary_name ||
                            workspaceDetails.virtualAccount.deposit_instructions
                              ?.account_beneficiary_name ||
                            'N/A'}
                        </div>
                      </div>

                      {workspaceDetails.virtualAccount.deposit_instructions?.us
                        ?.account_number && (
                        <>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Account Number
                            </div>
                            <div className="font-mono text-xs flex items-center gap-2">
                              {
                                workspaceDetails.virtualAccount
                                  .deposit_instructions.us.account_number
                              }
                              <CopyButton
                                value={
                                  workspaceDetails.virtualAccount
                                    .deposit_instructions.us.account_number
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Routing Number
                            </div>
                            <div className="font-mono text-xs flex items-center gap-2">
                              {
                                workspaceDetails.virtualAccount
                                  .deposit_instructions.us.routing_number
                              }
                              <CopyButton
                                value={
                                  workspaceDetails.virtualAccount
                                    .deposit_instructions.us.routing_number
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {workspaceDetails.virtualAccount.deposit_instructions
                        ?.iban?.iban_number && (
                        <>
                          <div className="col-span-2">
                            <div className="text-xs text-muted-foreground mb-1">
                              IBAN
                            </div>
                            <div className="font-mono text-xs flex items-center gap-2">
                              {
                                workspaceDetails.virtualAccount
                                  .deposit_instructions.iban.iban_number
                              }
                              <CopyButton
                                value={
                                  workspaceDetails.virtualAccount
                                    .deposit_instructions.iban.iban_number
                                }
                              />
                            </div>
                          </div>
                          {workspaceDetails.virtualAccount.deposit_instructions
                            .iban.bic && (
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">
                                BIC
                              </div>
                              <div className="font-mono text-xs">
                                {
                                  workspaceDetails.virtualAccount
                                    .deposit_instructions.iban.bic
                                }
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total Deposited
                    </div>
                    <div className="text-2xl font-bold">
                      ${' '}
                      {formatUnits(
                        BigInt(workspaceDetails.finances.totalDeposited),
                        6,
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Deposits
                    </div>
                    <div className="text-2xl font-bold">
                      {workspaceDetails.finances.depositCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Safes</div>
                    <div className="text-2xl font-bold">
                      {workspaceDetails.finances.safeCount}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Auto-Earn Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {workspaceDetails.autoEarn.enabled ? (
                  <div className="space-y-3">
                    {workspaceDetails.autoEarn.configs.map((config, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-muted rounded-md space-y-1"
                      >
                        <div>
                          <strong>Safe:</strong> {config.safeAddress}
                        </div>
                        <div>
                          <strong>Allocation:</strong> {config.percentage}%
                        </div>
                        {config.lastTrigger && (
                          <div className="text-xs text-muted-foreground">
                            Last run:{' '}
                            {new Date(config.lastTrigger).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Auto-earn not configured
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Banking & Compliance IDs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      KYC Provider
                    </div>
                    <div className="font-medium">
                      {workspaceDetails.workspace.kycProvider || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      KYC Status
                    </div>
                    <Badge
                      className={getKycStatusColor(
                        workspaceDetails.workspace.kycStatus || 'none',
                      )}
                      variant="outline"
                    >
                      {workspaceDetails.workspace.kycStatus || 'none'}
                    </Badge>
                  </div>
                  {workspaceDetails.workspace.alignCustomerId && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Align Customer ID
                      </div>
                      <div className="font-mono text-xs flex items-center gap-2">
                        {workspaceDetails.workspace.alignCustomerId}
                        <CopyButton
                          value={workspaceDetails.workspace.alignCustomerId}
                        />
                      </div>
                    </div>
                  )}
                  {workspaceDetails.workspace.alignVirtualAccountId && (
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Align Virtual Account ID
                      </div>
                      <div className="font-mono text-xs flex items-center gap-2">
                        {workspaceDetails.workspace.alignVirtualAccountId}
                        <CopyButton
                          value={
                            workspaceDetails.workspace.alignVirtualAccountId
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No details available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
