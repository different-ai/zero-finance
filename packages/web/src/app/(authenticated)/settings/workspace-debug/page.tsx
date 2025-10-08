import { Metadata } from 'next';
import { WorkspaceDebugView } from '@/components/settings/workspace-debug-view';

export const metadata: Metadata = {
  title: 'Workspace Debug - Zero Finance',
  description: 'Debug workspace memberships and settings',
};

export default function WorkspaceDebugPage() {
  return <WorkspaceDebugView />;
}
