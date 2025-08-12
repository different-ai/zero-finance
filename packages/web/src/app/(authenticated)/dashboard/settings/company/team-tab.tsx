'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { Users, Plus, UserMinus, Copy, Check, Trash2, AlertCircle, Shield } from 'lucide-react';

interface TeamTabProps {
  companyId?: string;
}

export function TeamTab({ companyId }: TeamTabProps) {
  const [workspaceSettings, setWorkspaceSettings] = useState({
    shareInbox: true,
    shareCompanyData: true,
  });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Fetch workspace data
  const { data: workspace } = api.inbox.getOrCreateWorkspace.useQuery();
  const { data: workspaceExpenses } = api.inbox.getWorkspaceExpenses.useQuery(
    { workspaceId: workspace?.workspaceId || '' },
    { enabled: !!workspace?.workspaceId }
  );

  const teamMembers: any[] = [];
  const teamInvites: any[] = [];

  const handleCreateTeamInvite = async () => {
    if (!workspace?.workspaceId) {
      toast.error('Workspace not found. Please try again.');
      return;
    }
    toast.success('Team invite feature coming soon!');
  };

  const copyTeamInviteLink = (token: string) => {
    const link = `${window.location.origin}/join-team?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(token);
    toast.success('Team invite link copied');
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Workspace
          </CardTitle>
          <CardDescription>
            Invite team members who need full access to inbox and expense data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
            <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Important: Team vs Contractors
            </h4>
            <div className="space-y-2 text-sm text-amber-800">
              <p>
                <strong>Team members</strong> can see ALL your inbox items, expenses, and company data.
                Use this for business partners and trusted internal team.
              </p>
              <p>
                <strong>Contractors</strong> can only see company profile data needed to create invoices.
                Use this for external vendors and clients.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-base">Share Inbox & Expenses</Label>
                <p className="text-sm text-muted-foreground">
                  Team members can view and manage all uploaded documents
                </p>
              </div>
              <Switch 
                checked={workspaceSettings.shareInbox}
                onCheckedChange={(checked) => setWorkspaceSettings(prev => ({ ...prev, shareInbox: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-base">Share Company Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Team members can view company settings
                </p>
              </div>
              <Switch 
                checked={workspaceSettings.shareCompanyData}
                onCheckedChange={(checked) => setWorkspaceSettings(prev => ({ ...prev, shareCompanyData: checked }))}
              />
            </div>
          </div>

          <Button onClick={handleCreateTeamInvite} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Team Invite Link
          </Button>

          {workspace && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                Workspace ID: <code className="font-mono">{workspace.workspaceId}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Team Members</CardTitle>
          <CardDescription>
            People with full access to your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">No team members yet</p>
            <p className="text-sm text-gray-400">
              Create invite links to add partners or team members.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
