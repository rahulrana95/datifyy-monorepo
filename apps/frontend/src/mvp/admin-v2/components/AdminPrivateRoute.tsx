import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { useAdminAuthStore } from '../login/store/adminAuthStore';

/**
 * Admin Private Route Component Props
 */
interface AdminPrivateRouteProps {
    /** Required permission level for access */
    requiredPermission?: 'viewer' | 'moderator' | 'admin' | 'super_admin' | 'owner';
    /** Fallback component when loading */
    fallback?: React.ReactNode;
    /** Custom redirect path for unauthorized users */
    redirectTo?: string;
    /** Child components to render when authenticated */
    children?: React.ReactNode;
}

/**
 * Admin Private Route Component
 * Protects admin routes with authentication and permission checks
 * 
 * Features:
 * - Authentication verification
 * - Permission level checking
 * - Loading states
 * - Automatic redirects
 * - Error handling
 * - Supports both children and Outlet patterns
 * 
 * @param {AdminPrivateRouteProps} props - Component props
 * @returns {JSX.Element} Protected route or redirect
 * 
 * @example
 * // With children
 * <Route 
 *   path="/admin/dashboard" 
 *   element={
 *     <AdminPrivateRoute requiredPermission="admin">
 *       <AdminDashboard />
 *     </AdminPrivateRoute>
 *   } 
 * />
 * 
 * // With nested routes (Outlet)
 * <Route 
 *   path="/admin/*" 
 *   element={<AdminPrivateRoute />}
 * >
 *   <Route path="dashboard" element={<AdminDashboard />} />
 * </Route>
 */
const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({
    requiredPermission = 'viewer',
    fallback,
    redirectTo = '/admin/login',
    children
}): JSX.Element => {
    const { isAuthenticated, admin, isLoading, checkAuthStatus } = useAdminAuthStore();

    // Check auth status on component mount
    React.useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // Show loading state
    if (isLoading) {
        return (
            <>
                {fallback || (
                    <Center minH="100vh" bg="gray.50">
                        <VStack spacing={4}>
                            <Spinner size="xl" color="brand.500" thickness="4px" />
                            <Text color="gray.600">Verifying admin access...</Text>
                        </VStack>
                    </Center>
                )}
            </>
        );
    }

    // Redirect if not authenticated
    if (!isAuthenticated || !admin) {
        console.log('❌ Admin not authenticated, redirecting to login');
        return <Navigate to={redirectTo} replace />;
    }

    // Check account status
    if (!admin.isActive || admin.accountStatus !== 'active') {
        console.log('❌ Admin account inactive or suspended');
        return (
            <Center minH="100vh" bg="gray.50">
                <VStack spacing={4} textAlign="center" maxW="md">
                    <Text fontSize="xl" fontWeight="bold" color="red.500">
                        Account Access Restricted
                    </Text>
                    <Text color="gray.600">
                        Your admin account is currently {admin.accountStatus}.
                        Please contact the system administrator for assistance.
                    </Text>
                </VStack>
            </Center>
        );
    }

    // Check permission level
    const permissionLevels = ['viewer', 'moderator', 'admin', 'super_admin', 'owner'];
    const currentIndex = permissionLevels.indexOf(admin.permissionLevel);
    const requiredIndex = permissionLevels.indexOf(requiredPermission);

    if (currentIndex < requiredIndex) {
        console.log('❌ Insufficient admin permissions', {
            required: requiredPermission,
            current: admin.permissionLevel
        });

        return (
            <Center minH="100vh" bg="gray.50">
                <VStack spacing={4} textAlign="center" maxW="md">
                    <Text fontSize="xl" fontWeight="bold" color="orange.500">
                        Insufficient Permissions
                    </Text>
                    <Text color="gray.600">
                        You need {requiredPermission} level access to view this page.
                        Your current level is {admin.permissionLevel}.
                    </Text>
                </VStack>
            </Center>
        );
    }

    // All checks passed, render protected content
    // If children are provided, render them; otherwise use Outlet for nested routes
    if (children) {
        return <>{children}</>;
    }

    return <Outlet />;
};

export default AdminPrivateRoute;
