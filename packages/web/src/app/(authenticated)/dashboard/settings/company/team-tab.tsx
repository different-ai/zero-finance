'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import {
  Users,
  Plus,
  UserMinus,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Shield,
  Calendar,
  Link,
  Loader2,
  Crown,
  UserCheck,
  UserPlus,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePrivy } from '@privy-io/react-auth';
import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

interface TeamTabProps {
  companyId?: string; // Kept for backwards compatibility, but not used
}

export function TeamTab({ companyId }: TeamTabProps) {
  const { user } = usePrivy();
  const { isTechnical } = useBimodal();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const [addAsSafeOwner, setAddAsSafeOwner] = useState<boolean>(false);

  // Fetch workspace data
  const {
    data: workspace,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = api.workspace.getOrCreateWorkspace.useQuery();

  // Fetch team members
  const {
    data: teamMembers,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = api.workspace.getTeamMembers.useQuery(
    { workspaceId: workspace?.workspaceId || '' },
    { enabled: !!workspace?.workspaceId },
  );

  // Fetch team invites
  const { data: teamInvites, refetch: refetchInvites } =
    api.workspace.getWorkspaceInvites.useQuery(
      { workspaceId: workspace?.workspaceId || '' },
      { enabled: !!workspace?.workspaceId },
    );

  // Fetch user's Safes to find the primary one
  const { data: userSafes, isLoading: isLoadingSafes } =
    api.settings.userSafes.list.useQuery(undefined, {
      enabled: !!workspace?.workspaceId,
    });

  // Get the primary Safe address
  const primarySafeAddress = userSafes?.find(
    (safe: any) => safe.workspaceId === workspace?.workspaceId,
  )?.safeAddress;

  // Get Safe owners for the primary Safe
  const { data: safeOwners, isLoading: isLoadingSafeOwners } =
    api.safe.getSafeOwners.useQuery(
      { safeAddress: primarySafeAddress || '' },
      { enabled: !!primarySafeAddress, retry: false },
    );

  // Mutations
  const createInvite = api.workspace.createInvite.useMutation({
    onSuccess: (data) => {
      copyTeamInviteLink(data.token);
      toast.success(
        isTechnical
          ? 'Invite token generated and copied'
          : 'Team invite link created and copied!',
      );
      refetchInvites();
    },
    onError: (error) => {
      console.error('Failed to create invite:', error);
      toast.error(error.message || 'Failed to create invite link');
    },
  });

  const deleteInvite = api.workspace.deleteWorkspaceInvite.useMutation({
    onSuccess: () => {
      toast.success(isTechnical ? 'Invite revoked' : 'Invite deleted');
      refetchInvites();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete invite');
    },
  });

  const removeMember = api.workspace.removeTeamMember.useMutation({
    onSuccess: () => {
      toast.success(
        isTechnical ? 'Member removed from workspace' : 'Team member removed',
      );
      refetchMembers();
      setMemberToRemove(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove member');
      setMemberToRemove(null);
    },
  });

  // Get user's Privy addresses to match against Safe owners
  const userAddresses = user?.wallet?.address ? [user.wallet.address] : [];
  if (user?.linkedAccounts) {
    user.linkedAccounts.forEach((account) => {
      if (account.type === 'wallet' && account.address) {
        userAddresses.push(account.address);
      }
    });
  }

  const handleCreateTeamInvite = async () => {
    if (isLoadingWorkspace) {
      toast.error('Loading workspace data, please wait...');
      return;
    }

    if (workspaceError) {
      console.error('Workspace error:', workspaceError);
      toast.error('Failed to load workspace. Please refresh the page.');
      return;
    }

    if (!workspace?.workspaceId) {
      toast.info('Creating workspace...');
      const result = await refetchWorkspace();
      if (!result.data?.workspaceId) {
        toast.error('Failed to create workspace. Please try again.');
        return;
      }
    }

    if (workspace?.workspaceId) {
      createInvite.mutate({
        workspaceId: workspace.workspaceId,
        role: 'member' as const,
        addAsSafeOwner: addAsSafeOwner,
      });
    }
  };

  const copyTeamInviteLink = (token: string) => {
    const link = `${window.location.origin}/join-team?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(token);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success(
      isTechnical ? 'Address copied' : 'Address copied to clipboard',
    );
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCurrentUser = (ownerAddress: string) => {
    return userAddresses.some(
      (userAddr) => userAddr.toLowerCase() === ownerAddress.toLowerCase(),
    );
  };

  const isSafeOwner = (memberAddress?: string) => {
    if (!memberAddress || !safeOwners?.owners) return false;
    return safeOwners.owners.some(
      (owner: string) => owner.toLowerCase() === memberAddress.toLowerCase(),
    );
  };

  const handleRemoveMember = (member: any) => {
    setMemberToRemove(member);
  };

  const confirmRemoveMember = () => {
    if (!memberToRemove || !workspace?.workspaceId) return;

    removeMember.mutate({
      workspaceId: workspace.workspaceId,
      memberId: memberToRemove.id,
    });
  };

  // Get current user's role in workspace
  const currentUserRole = workspace?.membership?.role || 'member';
  const canManageTeam =
    currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="space-y-6">
      {/* E2E Flow Guide */}
      <div
        className={cn(
          'p-5 sm:p-6',
          isTechnical
            ? 'bg-[#1B29FF]/5 border border-[#1B29FF]/20'
            : 'bg-[#1B29FF]/5 border border-[#1B29FF]/20 rounded-lg',
        )}
      >
        <h3
          className={cn(
            'flex items-center gap-2 text-[#1B29FF] mb-4',
            isTechnical ? 'font-mono text-[16px]' : 'font-medium text-[17px]',
          )}
        >
          <Users className="h-5 w-5" />
          {isTechnical ? 'TEAM::ONBOARDING_FLOW' : 'How to Add Team Members'}
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex-shrink-0 w-6 h-6 bg-[#1B29FF] text-white text-sm flex items-center justify-center',
                isTechnical ? '' : 'rounded-full',
              )}
            >
              1
            </div>
            <div>
              <p
                className={cn(
                  'text-[#101010]',
                  isTechnical ? 'font-mono font-medium' : 'font-medium',
                )}
              >
                {isTechnical
                  ? 'Generate invite token'
                  : 'Invite someone to view the dashboard'}
              </p>
              <p
                className={cn(
                  'text-sm mt-1',
                  isTechnical
                    ? 'text-[#101010]/50 font-mono'
                    : 'text-[#666666]',
                )}
              >
                {isTechnical
                  ? 'Create an invite link and distribute to team member'
                  : 'Create an invite link below and share it with your team member'}
              </p>
            </div>
          </div>
          {isTechnical && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-[#1B29FF] text-white text-sm flex items-center justify-center">
                2
              </div>
              <div>
                <p className="font-mono font-medium text-[#101010]">
                  Configure Safe ownership
                </p>
                <p className="text-sm text-[#101010]/50 font-mono mt-1">
                  After they join, navigate to{' '}
                  <a
                    href="/dashboard/settings/advanced-wallet"
                    className="text-[#1B29FF] underline"
                  >
                    WALLET::ADVANCED
                  </a>{' '}
                  to add them as a Safe owner
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Invite Section */}
      <div
        className={cn(
          'bg-white shadow-sm',
          isTechnical
            ? 'border border-[#1B29FF]/20'
            : 'border border-[#101010]/10 rounded-lg',
        )}
      >
        <div
          className={cn(
            'border-b px-5 sm:px-6 py-4',
            isTechnical ? 'border-[#1B29FF]/20' : 'border-[#101010]/10',
          )}
        >
          <h3
            className={cn(
              'flex items-center gap-2 text-[#101010]',
              isTechnical ? 'font-mono text-[16px]' : 'font-medium text-[17px]',
            )}
          >
            <Link className="h-5 w-5" />
            {isTechnical ? 'INVITE::CREATE' : 'Invite Team Members'}
          </h3>
          <p
            className={cn(
              'text-sm mt-1',
              isTechnical ? 'text-[#101010]/50 font-mono' : 'text-[#666666]',
            )}
          >
            {isTechnical
              ? 'Generate shareable token for workspace access'
              : 'Share this link to give someone access to view this dashboard'}
          </p>
        </div>
        <div className="p-5 sm:p-6">
          {canManageTeam && (
            <div className="space-y-4">
              {/* Safe co-owner option - Technical mode only */}
              {isTechnical && (
                <div
                  className={cn(
                    'flex items-center space-x-2 p-3 border',
                    isTechnical
                      ? 'border-[#1B29FF]/20 bg-[#1B29FF]/5'
                      : 'border-[#101010]/10 rounded-lg bg-[#F7F7F2]',
                  )}
                >
                  <Checkbox
                    id="add-safe-owner"
                    checked={addAsSafeOwner}
                    onCheckedChange={(checked) =>
                      setAddAsSafeOwner(checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="add-safe-owner"
                      className={cn(
                        'text-sm font-medium cursor-pointer',
                        isTechnical && 'font-mono',
                      )}
                    >
                      {isTechnical
                        ? 'Queue as Safe co-owner'
                        : 'Also add as Safe co-owner (requires confirmation)'}
                    </Label>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        isTechnical
                          ? 'text-[#101010]/50 font-mono'
                          : 'text-muted-foreground',
                      )}
                    >
                      {isTechnical
                        ? 'User will be queued for Safe ownership post-join'
                        : 'The invited user will be queued to become a Safe owner after they join'}
                    </p>
                  </div>
                </div>
              )}
              <Button
                onClick={handleCreateTeamInvite}
                className={cn(
                  'w-full',
                  isTechnical
                    ? 'bg-[#1B29FF] hover:bg-[#1420CC] font-mono'
                    : 'bg-[#1B29FF] hover:bg-[#1420CC]',
                )}
                disabled={isLoadingWorkspace || createInvite.isPending}
              >
                {isLoadingWorkspace ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isTechnical ? 'Loading...' : 'Loading workspace...'}
                  </>
                ) : createInvite.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isTechnical ? 'Generating...' : 'Creating invite...'}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {isTechnical
                      ? 'Generate Invite Token'
                      : 'Create Invite Link'}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Active Invite Links */}
          {teamInvites && teamInvites.length > 0 && (
            <div className="mt-4 space-y-2">
              <p
                className={cn(
                  'text-sm font-medium text-[#101010]',
                  isTechnical && 'font-mono',
                )}
              >
                {isTechnical ? 'ACTIVE_TOKENS' : 'Active Invite Links'}
              </p>
              {teamInvites.map((invite: any) => (
                <div
                  key={invite.id}
                  className={cn(
                    'flex items-center justify-between p-3 border bg-white',
                    isTechnical
                      ? 'border-[#1B29FF]/20'
                      : 'border-[#101010]/10 rounded-lg',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-xs font-mono truncate',
                        isTechnical ? 'text-[#1B29FF]/70' : 'text-[#666666]',
                      )}
                    >
                      {window.location.origin}/join-team?token={invite.token}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        isTechnical
                          ? 'text-[#101010]/40 font-mono'
                          : 'text-muted-foreground',
                      )}
                    >
                      {isTechnical ? 'Created: ' : 'Created '}
                      {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyTeamInviteLink(invite.token)}
                      className={cn(
                        isTechnical &&
                          'border-[#1B29FF]/30 hover:bg-[#1B29FF]/5',
                      )}
                    >
                      {copiedLink === invite.token ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    {canManageTeam && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteInvite.mutate({ inviteId: invite.id })
                        }
                        disabled={deleteInvite.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Team Members List */}
      <div
        className={cn(
          'bg-white shadow-sm',
          isTechnical
            ? 'border border-[#1B29FF]/20'
            : 'border border-[#101010]/10 rounded-lg',
        )}
      >
        <div
          className={cn(
            'border-b px-5 sm:px-6 py-4',
            isTechnical ? 'border-[#1B29FF]/20' : 'border-[#101010]/10',
          )}
        >
          <h3
            className={cn(
              'flex items-center gap-2 text-[#101010]',
              isTechnical ? 'font-mono text-[16px]' : 'font-medium text-[17px]',
            )}
          >
            <UserCheck className="h-5 w-5" />
            {isTechnical ? 'TEAM::MEMBERS' : 'Team Members'}
            {teamMembers && (
              <Badge
                variant="secondary"
                className={cn(isTechnical && 'font-mono')}
              >
                {teamMembers.length}
              </Badge>
            )}
          </h3>
          <p
            className={cn(
              'text-sm mt-1',
              isTechnical ? 'text-[#101010]/50 font-mono' : 'text-[#666666]',
            )}
          >
            {isTechnical
              ? 'Users with workspace access permissions'
              : 'People with access to this workspace'}
          </p>
        </div>
        <div className="p-5 sm:p-6">
          {isLoadingMembers ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-3">
              {teamMembers.map((member: any) => (
                <div
                  key={member.id}
                  className={cn(
                    'flex items-center justify-between p-3 border',
                    isTechnical
                      ? 'border-[#1B29FF]/20'
                      : 'border-[#101010]/10 rounded-lg',
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div>
                        <div
                          className={cn(
                            'font-medium',
                            isTechnical && 'font-mono',
                          )}
                        >
                          {member.name ||
                            member.email ||
                            member.userId ||
                            'Unknown User'}
                        </div>
                        {member.email && (
                          <div
                            className={cn(
                              'text-sm',
                              isTechnical
                                ? 'text-[#101010]/50 font-mono'
                                : 'text-muted-foreground',
                            )}
                          >
                            {member.email}
                          </div>
                        )}
                      </div>
                      {member.role === 'owner' && (
                        <Crown
                          className={cn(
                            'h-4 w-4',
                            isTechnical ? 'text-[#1B29FF]' : 'text-yellow-600',
                          )}
                        />
                      )}
                      <Badge
                        variant={
                          member.role === 'owner'
                            ? 'default'
                            : member.role === 'admin'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={cn(isTechnical && 'font-mono')}
                      >
                        {isTechnical ? member.role.toUpperCase() : member.role}
                      </Badge>
                      {/* Safe Owner badge - Technical mode only */}
                      {isTechnical &&
                        member.walletAddress &&
                        isSafeOwner(member.walletAddress) && (
                          <Badge
                            variant="outline"
                            className="border-[#1B29FF] text-[#1B29FF] font-mono"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            SAFE_OWNER
                          </Badge>
                        )}
                    </div>
                    <p
                      className={cn(
                        'text-xs flex items-center gap-1 mt-1',
                        isTechnical
                          ? 'text-[#101010]/40 font-mono'
                          : 'text-muted-foreground',
                      )}
                    >
                      <Calendar className="h-3 w-3" />
                      {isTechnical ? 'Joined: ' : 'Joined '}
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.role !== 'owner' && canManageTeam && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveMember(member)}
                        disabled={removeMember.isPending}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users
                className={cn(
                  'h-12 w-12 mx-auto mb-4',
                  isTechnical ? 'text-[#1B29FF]/20' : 'text-[#101010]/20',
                )}
              />
              <p
                className={cn(
                  isTechnical
                    ? 'text-[#101010]/50 font-mono'
                    : 'text-muted-foreground',
                )}
              >
                {isTechnical
                  ? 'No team members. Generate invite token above.'
                  : 'No team members yet. Create an invite link above to add team members.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Safe Owners Section - Technical mode only */}
      {isTechnical && primarySafeAddress && (
        <div className="bg-white shadow-sm border border-[#1B29FF]/20">
          <div className="border-b border-[#1B29FF]/20 px-5 sm:px-6 py-4">
            <h3 className="flex items-center gap-2 text-[#101010] font-mono text-[16px]">
              <Shield className="h-5 w-5" />
              SAFE::OWNERS
              {safeOwners && (
                <Badge variant="secondary" className="font-mono">
                  {safeOwners.owners.length}
                </Badge>
              )}
            </h3>
            <p className="text-sm text-[#101010]/50 font-mono mt-1">
              Addresses authorized for transaction signing (threshold:{' '}
              {safeOwners?.threshold || 1}/{safeOwners?.owners.length || 1})
            </p>
          </div>
          <div className="p-5 sm:p-6">
            {isLoadingSafeOwners ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : safeOwners && safeOwners.owners.length > 0 ? (
              <div className="space-y-2">
                {safeOwners.owners.map((ownerAddress: string) => (
                  <div
                    key={ownerAddress}
                    className="flex items-center justify-between p-3 border border-[#1B29FF]/20 bg-[#1B29FF]/5"
                  >
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-[#1B29FF]">
                        {formatAddress(ownerAddress)}
                      </code>
                      {isCurrentUser(ownerAddress) && (
                        <Badge variant="default" className="font-mono">
                          YOU
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAddress(ownerAddress)}
                      className="text-[#1B29FF]/60 hover:text-[#1B29FF] hover:bg-[#1B29FF]/10"
                    >
                      {copiedAddress === ownerAddress ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#101010]/50 font-mono py-4">
                No Safe owners found.
              </p>
            )}

            {/* Link to Advanced Wallet Settings */}
            <div className="mt-4 pt-4 border-t border-[#1B29FF]/20">
              <Button
                variant="outline"
                className="w-full border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono"
                onClick={() =>
                  (window.location.href = '/dashboard/settings/advanced-wallet')
                }
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Safe Owners →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* No Safe Warning - Technical mode only */}
      {isTechnical && !primarySafeAddress && !isLoadingSafes && (
        <div className="bg-orange-50 border border-orange-200">
          <div className="border-b border-orange-200 px-5 sm:px-6 py-4">
            <h3 className="flex items-center gap-2 text-orange-700 font-mono text-[16px]">
              <AlertCircle className="h-5 w-5" />
              SAFE::NOT_FOUND
            </h3>
            <p className="text-sm text-orange-600 font-mono mt-1">
              Configure primary Safe for multi-sig transaction support
            </p>
          </div>
          <div className="p-5 sm:p-6">
            <Button
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-100 font-mono"
              onClick={() =>
                (window.location.href = '/dashboard/settings/advanced-wallet')
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Configure in WALLET::ADVANCED →
            </Button>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn(isTechnical && 'font-mono')}>
              {isTechnical ? 'CONFIRM::REMOVE_MEMBER' : 'Remove Team Member'}
            </AlertDialogTitle>
            <AlertDialogDescription className={cn(isTechnical && 'font-mono')}>
              {isTechnical ? (
                <>
                  Remove{' '}
                  <strong>
                    {memberToRemove?.name || memberToRemove?.email}
                  </strong>{' '}
                  from workspace? Access will be revoked immediately.
                </>
              ) : (
                <>
                  Are you sure you want to remove{' '}
                  <strong>
                    {memberToRemove?.name || memberToRemove?.email}
                  </strong>{' '}
                  from the team? They will lose access to all shared resources.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cn(isTechnical && 'font-mono')}>
              {isTechnical ? 'Cancel' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              className={cn(isTechnical && 'font-mono')}
            >
              {isTechnical ? 'Remove' : 'Remove Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
