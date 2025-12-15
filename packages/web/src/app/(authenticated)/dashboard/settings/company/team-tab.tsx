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
  const {
    data: teamInvites,
    isLoading: isLoadingInvites,
    refetch: refetchInvites,
  } = api.workspace.getWorkspaceInvites.useQuery(
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
      toast.success('Team invite link created and copied!');
      refetchInvites();
    },
    onError: (error) => {
      console.error('Failed to create invite:', error);
      toast.error(error.message || 'Failed to create invite link');
    },
  });

  const deleteInvite = api.workspace.deleteWorkspaceInvite.useMutation({
    onSuccess: () => {
      toast.success('Invite deleted');
      refetchInvites();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete invite');
    },
  });

  const removeMember = api.workspace.removeTeamMember.useMutation({
    onSuccess: () => {
      toast.success('Team member removed');
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
    toast.success('Address copied to clipboard');
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
      <Card className="border-[#1B29FF]/20 bg-[#1B29FF]/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[#1B29FF]">
            <Users className="h-5 w-5" />
            How to Add Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B29FF] text-white text-sm flex items-center justify-center">
                1
              </div>
              <div>
                <p className="font-medium text-[#101010]">
                  Invite someone to view the dashboard
                </p>
                <p className="text-sm text-[#666666]">
                  Create an invite link below and share it with your team member
                </p>
              </div>
            </div>
            {isTechnical && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B29FF] text-white text-sm flex items-center justify-center">
                  2
                </div>
                <div>
                  <p className="font-medium text-[#101010]">
                    Once they join, add them as a Safe owner
                  </p>
                  <p className="text-sm text-[#666666]">
                    After they appear in the team list, go to{' '}
                    <a
                      href="/dashboard/settings/advanced-wallet"
                      className="text-[#1B29FF] underline"
                    >
                      Advanced Wallet Settings
                    </a>{' '}
                    to add them as a Safe owner
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Invite Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Invite Team Members
          </CardTitle>
          <CardDescription>
            Share this link to give someone access to view this dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {canManageTeam && (
            <div className="space-y-4">
              {/* Safe co-owner option - Technical mode only */}
              {isTechnical && (
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-[#F7F7F2]">
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
                      className="text-sm font-medium cursor-pointer"
                    >
                      Also add as Safe co-owner (requires confirmation)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      The invited user will be queued to become a Safe owner
                      after they join
                    </p>
                  </div>
                </div>
              )}
              <Button
                onClick={handleCreateTeamInvite}
                className="w-full bg-[#1B29FF] hover:bg-[#1420CC]"
                disabled={isLoadingWorkspace || createInvite.isPending}
              >
                {isLoadingWorkspace ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading workspace...
                  </>
                ) : createInvite.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating invite...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invite Link
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Active Invite Links */}
          {teamInvites && teamInvites.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-[#101010]">
                Active Invite Links
              </p>
              {teamInvites.map((invite: any) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono truncate text-[#666666]">
                      {window.location.origin}/join-team?token={invite.token}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyTeamInviteLink(invite.token)}
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
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Team Members
            {teamMembers && (
              <Badge variant="secondary">{teamMembers.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            People with access to this workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">
                          {member.name ||
                            member.email ||
                            member.userId ||
                            'Unknown User'}
                        </div>
                        {member.email && (
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        )}
                      </div>
                      {member.role === 'owner' && (
                        <Crown className="h-4 w-4 text-yellow-600" />
                      )}
                      <Badge
                        variant={
                          member.role === 'owner'
                            ? 'default'
                            : member.role === 'admin'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {member.role}
                      </Badge>
                      {/* Safe Owner badge - Technical mode only */}
                      {isTechnical &&
                        member.walletAddress &&
                        isSafeOwner(member.walletAddress) && (
                          <Badge
                            variant="outline"
                            className="border-[#1B29FF] text-[#1B29FF]"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Safe Owner
                          </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
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
              <Users className="h-12 w-12 text-[#101010]/20 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No team members yet. Create an invite link above to add team
                members.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safe Owners Section - Technical mode only */}
      {isTechnical && primarySafeAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safe Owners
              {safeOwners && (
                <Badge variant="secondary">{safeOwners.owners.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Wallet addresses that can approve transactions on your Safe
              (threshold: {safeOwners?.threshold || 1} of{' '}
              {safeOwners?.owners.length || 1})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSafeOwners ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : safeOwners && safeOwners.owners.length > 0 ? (
              <div className="space-y-2">
                {safeOwners.owners.map(
                  (ownerAddress: string, index: number) => (
                    <div
                      key={ownerAddress}
                      className="flex items-center justify-between p-3 border rounded-lg bg-[#F7F7F2]"
                    >
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono">
                          {formatAddress(ownerAddress)}
                        </code>
                        {isCurrentUser(ownerAddress) && (
                          <Badge variant="default">You</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyAddress(ownerAddress)}
                      >
                        {copiedAddress === ownerAddress ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No Safe owners found.
              </p>
            )}

            {/* Link to Advanced Wallet Settings */}
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  (window.location.href = '/dashboard/settings/advanced-wallet')
                }
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Safe Owners in Advanced Settings
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Safe Warning - Technical mode only */}
      {isTechnical && !primarySafeAddress && !isLoadingSafes && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              No Primary Safe Found
            </CardTitle>
            <CardDescription className="text-orange-600">
              Set up a primary Safe to manage account owners and enable
              multi-signature transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={() =>
                (window.location.href = '/dashboard/settings/advanced-wallet')
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Advanced Wallet Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>{memberToRemove?.name || memberToRemove?.email}</strong>{' '}
              from the team? They will lose access to all shared resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveMember}>
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
