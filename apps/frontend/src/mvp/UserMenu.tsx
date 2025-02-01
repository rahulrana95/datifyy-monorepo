import { Avatar, Box, Button, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Badge } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useAuthStore } from "./login-signup/authStore";
import { useNavigate, useRouteError } from "react-router-dom";
import authService from "../service/authService";

interface UserMenuProps {
}

const UserMenu: React.FC<UserMenuProps> = ({ }) => {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const user = authStore.user ?? { name: "", email: "" };
    const [isOpen, setIsOpen] = useState(false);
    const unreadNotifications = 2;


    const onProfileClick = () => {
        navigate("/profile");
    }

    const onSettingsClick = () => {
        navigate("/settings");
    }

    const onLogout = () => {
        authService.logout();
        authStore.setIsAuthenticated(false);
    }

    console.log(authStore)

    return (
        <HStack spacing={4}>
            {/* Notification Bell with Badge */}
            <IconButton
                aria-label="Notifications"
                icon={<BellIcon />}
                variant="ghost"
                position="relative"
                _hover={{ cursor: 'pointer' }}
            />

            {/* User Avatar with Dropdown Menu */}
            <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <MenuButton as={Button} variant="ghost" onClick={() => setIsOpen(!isOpen)} _hover={{ cursor: 'pointer' }}>
                    <Avatar name={user.email} src={''} size="sm" />
                </MenuButton>
                <MenuList>
                    <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                        <Text fontWeight="bold" fontSize="md" color="gray.800" whiteSpace="nowrap">
                            {user.email}
                        </Text>
                        <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
                            {user.email}
                        </Text>
                    </Box>
                    <MenuItem onClick={onProfileClick} width={"89%"} _hover={{ cursor: 'pointer' }}>Profile</MenuItem>
                    <MenuItem onClick={onSettingsClick} width={"89%"} _hover={{ cursor: 'pointer' }}>Settings</MenuItem>
                    <MenuItem onClick={onLogout} color="red.500" width={"89%"} _hover={{ cursor: 'pointer' }}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </HStack>
    );
};

export default UserMenu;
