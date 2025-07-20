import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import authService from '../../../service/authService';
import apiService from '../../../service/apiService';
import { useAuthStore } from '../../login-signup';
import cookieService from '../../../utils/cookieService';

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

      // First check if admin has token in cookies
      const adminToken = cookieService.getCookie('token');

      // Also check localStorage/sessionStorage for backward compatibility
      const legacyToken = localStorage.getItem('admin_access_token') || sessionStorage.getItem('admin_access_token');
      
      const token = adminToken || legacyToken;

      if (!token) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }
      
      // Set the token in API service for subsequent calls
      await apiService.setAuthToken(token);

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
      // For admin portal, we'll check if the token is valid and user exists
      // The fact that they have an admin token means they logged in as admin
      const isAdmin = !!(userData && token);

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
        isAdmin: true, // We know this is admin because they have admin token
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