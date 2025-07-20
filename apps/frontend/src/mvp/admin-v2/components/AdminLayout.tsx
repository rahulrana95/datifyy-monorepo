// apps/frontend/src/mvp/admin-v2/components/AdminLayout.tsx

import React, { useState } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    // Theme colors
    const mainBg = useColorModeValue('gray.50', 'gray.900');

    // Get page title based on route
    const getPageTitle = (pathname: string): string => {
        const routeTitles: Record<string, string> = {
            '/admin/dashboard': 'Dashboard',
            '/admin/users': 'User Management',
            '/admin/dates': 'Date Curation',
            '/admin/curate-dates': 'Curate Dates',
            '/admin/dates-management': 'Dates Management',
            '/admin/genie': 'Genie Section',
            '/admin/revenue': 'Revenue Analytics',
            '/admin/analytics': 'Match Analytics',
            '/admin/moderation': 'Content Moderation',
            '/admin/communication': 'Communication',
            '/admin/events': 'Events & Scheduling',
            '/admin/system': 'System Health',
            '/admin/settings': 'Settings',
        };

        return routeTitles[pathname] || 'Admin Panel';
    };

    // Get breadcrumb based on route
    const getBreadcrumb = (pathname: string): string[] => {
        const segments = pathname.split('/').filter(Boolean);
        const breadcrumb = ['Admin'];

        if (segments.length > 1) {
            const pageTitle = getPageTitle(pathname);
            if (pageTitle !== 'Admin Panel') {
                breadcrumb.push(pageTitle);
            }
        }

        return breadcrumb;
    };

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <Box minH="100vh" bg={mainBg}>
            {/* Sidebar */}
            <AdminSidebar isCollapsed={isSidebarCollapsed} />

            {/* Header */}
            <AdminHeader
                onToggleSidebar={handleToggleSidebar}
                isSidebarCollapsed={isSidebarCollapsed}
                pageTitle={getPageTitle(location.pathname)}
                breadcrumb={getBreadcrumb(location.pathname)}
            />

            {/* Main Content */}
            <Box
                ml={isSidebarCollapsed ? '80px' : '280px'}
                mt="80px" // Height of header
                transition="margin-left 0.2s"
                minH="calc(100vh - 80px)"
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;