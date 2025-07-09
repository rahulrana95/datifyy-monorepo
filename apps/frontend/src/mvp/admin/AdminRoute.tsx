import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { useAuthStore } from '../login-signup';

function AdminRoute() {
  const { isAuthenticated } = useAuthStore();

  // if (!isAuthenticated) {
  //   // Redirect to login if not authenticated
  //   return <Navigate to="/login" replace />;
  // }

  // if (!isAdmin) {
  //   // Redirect to unauthorized or error page if not an admin
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AdminRoute;
