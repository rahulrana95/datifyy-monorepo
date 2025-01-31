import { Box } from "@chakra-ui/react";
import AdminHeader from "./AdminHeader";

interface AdminContentAreaProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const AdminContentArea: React.FC<AdminContentAreaProps> = ({ title, description, children }) => {
    return (
        <Box w="full" px={{ base: 4, md: 6 }} py={6} h="100vh" overflow={{ base: "scroll" }}>
            <AdminHeader title="Join List" description="Manage the waitlist and perform actions on the users." />
            <Box mt={6}>{children}</Box>
        </Box>
    );
};

export default AdminContentArea;
