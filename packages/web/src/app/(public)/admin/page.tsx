import { Metadata } from 'next';
import AdminPanel from '@/components/admin/admin-panel';

export const metadata: Metadata = {
  title: 'Admin Panel | Hypr',
  description: 'Hypr Admin Panel for system management',
};

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <AdminPanel />
    </div>
  );
} 