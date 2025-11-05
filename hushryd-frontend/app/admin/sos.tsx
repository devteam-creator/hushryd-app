import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import SOSManagement from '../../components/admin/SOSManagement';

export default function AdminSOSPage() {
  return (
    <AdminLayout title="SOS Emergency Management" currentPage="sos">
      <SOSManagement />
    </AdminLayout>
  );
}
