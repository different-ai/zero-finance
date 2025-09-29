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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  Mail,
  Crown,
  UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
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

interface TeamTabProps {
  companyId?: string;
}

export function TeamTab({ companyId }: TeamTabProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
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

  // Fetch user's workspaces
  const { data: userWorkspaces } = api.workspace.getUserWorkspaces.useQuery();

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

  const updateSettings = api.workspace.updateWorkspaceSettings.useMutation({
    onSuccess: () => {
      toast.success('Workspace settings updated');
      refetchWorkspace();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });

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

  const handleToggleChange = (
    setting: 'shareInbox' | 'shareCompanyData',
    value: boolean,
  ) => {
    if (!workspace?.workspaceId) {
      toast.error('Workspace not found');
      return;
    }

    updateSettings.mutate({
      workspaceId: workspace.workspaceId,
      [setting]: value,
    });
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
      {/* Workspace Info Card */}
      {userWorkspaces && userWorkspaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Workspace Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userWorkspaces.map((ws: any) => (
                <div
                  key={ws.workspaceId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <span className="font-medium">
                      {ws.workspaceName || 'Personal Workspace'}
                    </span>
                    <Badge
                      variant={
                        ws.workspaceId === workspace?.workspaceId
                          ? 'default'
                          : 'outline'
                      }
                      className="ml-2"
                    >
                      {ws.role}
                    </Badge>
                    {ws.workspaceId === workspace?.workspaceId && (
                      <Badge variant="secondary" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Joined {new Date(ws.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workspace Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Workspace
          </CardTitle>
          <CardDescription>
            Manage team members and control access to shared resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              About Team Members
            </h4>
            <p className="text-sm text-blue-800">
              Team members share access to this workspace including safes,
              transactions, and company data. Only invite people you trust with
              full access to your workspace.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Active Team Members
            {teamMembers && (
              <Badge variant="secondary">{teamMembers.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            People who have access to this workspace
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
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
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
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No team members yet. Create invite links to add team members.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Team Invite Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Team Invite Links
            {teamInvites && teamInvites.length > 0 && (
              <Badge variant="secondary">{teamInvites.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Active invitation links for new team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {canManageTeam && (
            <div className="space-y-4 mb-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
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
                    Add invitee as co-owner of primary Safe
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    The invited user will be added as an owner to your primary
                    Safe wallet (requires manual confirmation)
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCreateTeamInvite}
                className="w-full"
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
                    Create Team Invite Link
                  </>
                )}
              </Button>
            </div>
          )}

          {isLoadingInvites ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : teamInvites && teamInvites.length > 0 ? (
            <div className="space-y-3">
              {teamInvites.map((invite: any) => (
                <div
                  key={invite.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {!invite.usedAt && (
                          <Badge variant="outline" className="text-green-600">
                            Active
                          </Badge>
                        )}
                        {invite.usedAt && (
                          <Badge variant="secondary">Used</Badge>
                        )}
                        <Badge variant="outline">
                          {invite.role || 'member'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Created{' '}
                          {new Date(invite.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-2 rounded border">
                        <p className="text-xs font-mono break-all">
                          {window.location.origin}/join-team?token=
                          {invite.token}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {invite.expiresAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Expires{' '}
                            {new Date(invite.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                        {invite.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            For: {invite.email}
                          </span>
                        )}
                        {invite.usedAt && (
                          <span className="flex items-center gap-1">
                            <UserCheck className="h-3 w-3" />
                            Used {new Date(invite.usedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {!invite.usedAt && canManageTeam && (
                      <div className="flex gap-2 ml-4">
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
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No active invite links. Create one to invite team members.
            </p>
          )}
        </CardContent>
      </Card>

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
