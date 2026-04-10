
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const AdminPage = () => {
  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  );
};

export default AdminPage;
