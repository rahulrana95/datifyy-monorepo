import React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBreakpointValue } from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import { FaRegUser } from "react-icons/fa";

const HeaderWithTabs: React.FC = () => {
    // Handle orientation and tabs' appearance based on screen size
    const tabOrientation = useBreakpointValue<"vertical" | "horizontal">({ base: 'vertical', md: 'horizontal' });

    // Handle if we are on mobile to switch to icons only for tabs
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box
            maxW="900px"
            width="100%"
            margin="0 auto"
            padding={4}
            display="flex"
            flexDirection="column"
            height="100vh"
        >
            <Tabs
                isLazy
                variant="soft-rounded"
                colorScheme="pink"
                align="center"
                orientation={tabOrientation}
                flex="1" // Ensure the content takes all available space
            >
                {/* Full-size Tabs for Desktop */}
                {!isMobile ? <TabList
                    display={{ base: 'none', md: 'flex' }} // Hide on mobile
                    gap={8}
                    justifyContent="center"
                >
                    <Tab _selected={{ color: 'white', bg: 'pink.500' }} padding="10px">
                        <FaRegUser style={{ marginRight: '8px' }} />
                        <Text display={{ base: 'none', md: 'inline' }}>Profile</Text>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: 'pink.500' }} padding="10px">
                        <PhoneIcon boxSize={5} style={{ marginRight: '8px' }} />
                        <Text display={{ base: 'none', md: 'inline' }}>Partner Preferences</Text>
                    </Tab>
                    <Tab _selected={{ color: 'white', bg: 'pink.500' }} padding="10px">
                        <PhoneIcon boxSize={5} style={{ marginRight: '8px' }} />
                        <Text display={{ base: 'none', md: 'inline' }}>Settings</Text>
                    </Tab>
                </TabList>
                    :
                    <Box
                        position="fixed"
                        bottom={0}
                        left={0}
                        right={0}
                        bg="white"
                        boxShadow="lg"
                        zIndex={999}
                        paddingY={2}
                        display={{ base: 'flex', md: 'none' }} // Mobile version only
                        justifyContent="space-around"
                        borderTop="1px solid #e2e8f0"
                    >
                        <Tab _selected={{ color: 'white', bg: 'pink.500' }} padding={2} flex="1" display="flex" justifyContent="center">
                            <FaRegUser />
                        </Tab>
                        <Tab _selected={{ color: 'white', bg: 'pink.500' }} padding={2} flex="1" display="flex" justifyContent="center">
                            <PhoneIcon boxSize={6} />
                        </Tab>
                        <Tab _selected={{ color: 'white', bg: 'pink.500' }} padding={2} flex="1" display="flex" justifyContent="center">
                            <PhoneIcon boxSize={6} />
                        </Tab>
                        <Tab _selected={{ color: 'white', bg: 'pink.500' }} padding={2} flex="1" display="flex" justifyContent="center">
                            <PhoneIcon boxSize={6} />
                        </Tab>
                        <Tab _selected={{ color: 'white', bg: 'pink.500' }} padding={2} flex="1" display="flex" justifyContent="center">
                            <PhoneIcon boxSize={6} />
                        </Tab>
                    </Box>}

                <TabPanels>
                    <TabPanel>
                        <Text>Profile content goes here...</Text>
                    </TabPanel>
                    <TabPanel>
                        <Text>Partner Preferences content goes here...</Text>
                    </TabPanel>
                    <TabPanel>
                        <Text>Settings content goes here...</Text>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default HeaderWithTabs;
