import React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useBreakpointValue, useTheme } from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import { FaRegUser } from "react-icons/fa";
import ProfileForm from './UserProfile';
import PartnerPreferences from './PartnerPreferences';
import { PreferenceSection } from './partnerPreferences/components/PreferenceSection';
import { PartnerPreferencesForm } from './partnerPreferences/components/PartnerPreferencesForm';

const HeaderWithTabs: React.FC = () => {
    const theme = useTheme();
    // Handle orientation and tabs' appearance based on screen size
    const tabOrientation = useBreakpointValue<"vertical" | "horizontal">({ base: 'vertical', md: 'horizontal' });

    // Handle if we are on mobile to switch to icons only for tabs
    const isMobile = useBreakpointValue({ base: true, md: false });

    const selectedTabStyle = {
        color: 'pink.500', borderColor: "pink.500",// Accent color for underline
        borderBottom: "3px solid",
    }

    const hovercursor = {
        cursor: 'pointer',
    }

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
                    bg={theme.colors.white}
                    pt={4}
                    pb={4}

                >
                    <Tab _selected={selectedTabStyle} padding="10px" _hover={{ ...hovercursor }}>
                        {/* @ts-ignore */}
                        <FaRegUser style={{ marginRight: '8px' }} />
                        <Text display={{ base: 'none', md: 'inline' }}>Personal Info</Text>
                    </Tab>
                    <Tab _selected={selectedTabStyle} padding="10px" _hover={{ ...hovercursor }}>
                        <PhoneIcon boxSize={5} style={{ marginRight: '8px' }} />
                        <Text display={{ base: 'none', md: 'inline' }}>Partner Preferences</Text>
                    </Tab>
                    <Tab _selected={selectedTabStyle} padding="10px" _hover={{ ...hovercursor }}>
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
                        <Tab _selected={selectedTabStyle} padding={2} flex="1" display="flex" justifyContent="center">
                            {/* @ts-ignore */}
                            <FaRegUser />
                        </Tab>
                        <Tab _selected={selectedTabStyle} padding={2} flex="1" display="flex" justifyContent="center">
                            <PhoneIcon boxSize={6} />
                        </Tab>
                        <Tab _selected={selectedTabStyle} padding={2} flex="1" display="flex" justifyContent="center">
                            <PhoneIcon boxSize={6} />
                        </Tab>
                        <Tab _selected={selectedTabStyle} padding={2} flex="1" display="flex" justifyContent="center">
                            <PhoneIcon boxSize={6} />
                        </Tab>
                        <Tab _selected={selectedTabStyle} padding={2} flex="1" display="flex" justifyContent="center">
                            <PhoneIcon boxSize={6} />
                        </Tab>
                    </Box>}

                <TabPanels >
                    <TabPanel padding={0} _hover={{ ...hovercursor }} >
                        <ProfileForm />
                    </TabPanel>
                    <TabPanel _hover={{ ...hovercursor }}>
                        {/* <Text><PartnerPreferences /></Text> */}
                        <Text><PartnerPreferencesForm /></Text>
                    </TabPanel>
                    <TabPanel _hover={{ ...hovercursor }}>
                        <Text>Settings content goes here...</Text>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default HeaderWithTabs;
