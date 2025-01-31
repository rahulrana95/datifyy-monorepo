import { Box } from "@chakra-ui/react";

interface SectionProps {
    children: React.ReactNode;
}

const AdminSection: React.FC<SectionProps> = ({ children }) => {
    return (
        <Box mb={6}>{children}</Box> // Ensures uniform spacing between sections
    );
};

export default AdminSection;
