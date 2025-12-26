import { redirect } from 'next/navigation';

// Redirect old /dashboard/settings/company to /dashboard/settings/workspace
// Team functionality is now at /dashboard/settings/team
export default function CompanySettingsRedirect() {
  redirect('/dashboard/settings/workspace');
}
