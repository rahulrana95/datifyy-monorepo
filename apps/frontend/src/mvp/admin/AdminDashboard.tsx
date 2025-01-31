import { Box, Flex, useTheme } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import WaitList from "./waitlist/WaitList";
import CollapsibleSidebar from "./Sidebar/SideBarV2";
import AdminContentArea from "./AdminContentArea";
import AdminSection from "./AdminSection";

const Layout = () => {
  const theme = useTheme();
  return (
    <Flex>
      {/* Sidebar */}
      <CollapsibleSidebar />
      <AdminContentArea title="Waitlist" description="Manage your waitlist here">
        <AdminSection>
          <Box as="main" flex="1" bg={theme.colors.lightBg} p={3} minH="100vh">
            <Routes>
              <Route path="waitlist" element={<WaitList />} />
            </Routes>
          </Box>
        </AdminSection>
      </AdminContentArea>
    </Flex>
  );
};

export default Layout;
