import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import authService from '../../../service/authService';
import { useAuthStore } from '../../login-signup';

interface AdminProtectedRouteProps {
  children?: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const authStore = useAuthStore();

  useEffect(() => {
    validateAdminAccess();
  }, []);

  const validateAdminAccess = async () => {
    try {
      setIsValidating(true);

      // First check if user has token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      // Validate token with backend
      const { response, error } = await authService.verifyToken();

      if (error || !response) {
        // Token is invalid
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      // Get current user details to check if admin
      const userResponse = await authService.getCurrentUser();

      if (userResponse.error || !userResponse.response) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      const userData = userResponse.response;

      // Check if user is admin
      // @ts-ignore
      const isAdmin = response?.data?.user?.isAdmin ?? false;

      if (!isAdmin) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      // Update auth store
      authStore.setIsAuthenticated(true);
      authStore.setUserData({
        email: userData?.officialEmail || '',
        name: userData?.firstName || '',
        // @ts-ignore
        isAdmin: isAdmin,
        id: String(userData?.id || '')
      });

      setIsAuthorized(true);
      setIsValidating(false);

    } catch (error) {
      console.error('Error validating admin access:', error);
      setIsAuthorized(false);
      setIsValidating(false);
    }
  };

  // Show loading state while validating
  if (isValidating) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  // Redirect to admin login if not authorized
  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;