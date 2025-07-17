/**
 * Feature Flags Panel Component
 * UI for managing feature flags at runtime
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Text,
  Divider,
  useDisclosure,
  useToast,
  IconButton,
  Tooltip,
  Badge,
  Alert,
  AlertIcon,
  Code,
} from '@chakra-ui/react';
import { FiSettings, FiRefreshCw } from 'react-icons/fi';
import { 
  featureFlags, 
  updateFeatureFlag, 
  resetFeatureFlags,
  FeatureFlags 
} from '../config/featureFlags';

interface FeatureFlagsPanelProps {
  isFloating?: boolean;
}

const FeatureFlagsPanel: React.FC<FeatureFlagsPanelProps> = ({ isFloating = true }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [localFlags, setLocalFlags] = useState<FeatureFlags>(featureFlags);

  const handleFlagChange = (flag: keyof FeatureFlags, value: boolean) => {
    setLocalFlags(prev => ({ ...prev, [flag]: value }));
  };

  const handleSave = () => {
    // Save each changed flag
    Object.keys(localFlags).forEach((key) => {
      const flagKey = key as keyof FeatureFlags;
      if (localFlags[flagKey] !== featureFlags[flagKey]) {
        updateFeatureFlag(flagKey, localFlags[flagKey]);
      }
    });
    
    toast({
      title: 'Feature flags updated',
      description: 'The page will reload to apply changes',
      status: 'success',
      duration: 2000,
    });
  };

  const handleReset = () => {
    resetFeatureFlags();
    toast({
      title: 'Feature flags reset',
      description: 'The page will reload with default settings',
      status: 'info',
      duration: 2000,
    });
  };

  const hasChanges = Object.keys(localFlags).some(
    (key) => localFlags[key as keyof FeatureFlags] !== featureFlags[key as keyof FeatureFlags]
  );

  return (
    <>
      {isFloating && (
        <Tooltip label="Feature Flags" placement="left">
          <IconButton
            aria-label="Feature Flags"
            icon={<FiSettings />}
            position="fixed"
            bottom={4}
            right={4}
            colorScheme="brand"
            onClick={onOpen}
            size="lg"
            borderRadius="full"
            shadow="lg"
            zIndex={1000}
          />
        </Tooltip>
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack>
              <Text>Feature Flags</Text>
              {hasChanges && <Badge colorScheme="orange">Unsaved Changes</Badge>}
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch">
              <Alert status="info" fontSize="sm">
                <AlertIcon />
                Changes require a page reload to take effect
              </Alert>

              {/* Data Source Section */}
              <Box>
                <Text fontWeight="bold" mb={3}>Data Source</Text>
                <VStack spacing={3} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="mock-data" mb="0" flex={1}>
                      Use Mock Data
                      <Text fontSize="xs" color="gray.500">
                        Toggle between mock data and real API
                      </Text>
                    </FormLabel>
                    <Switch
                      id="mock-data"
                      isChecked={localFlags.useMockData}
                      onChange={(e) => handleFlagChange('useMockData', e.target.checked)}
                    />
                  </FormControl>

                  {!localFlags.useMockData && (
                    <Box p={3} bg="gray.50" borderRadius="md">
                      <Text fontSize="sm">API Base URL:</Text>
                      <Code fontSize="xs">{localFlags.apiBaseUrl}</Code>
                    </Box>
                  )}
                </VStack>
              </Box>

              <Divider />

              {/* Features Section */}
              <Box>
                <Text fontWeight="bold" mb={3}>Features</Text>
                <VStack spacing={3} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="admin-dashboard" mb="0" flex={1}>
                      Admin Dashboard
                    </FormLabel>
                    <Switch
                      id="admin-dashboard"
                      isChecked={localFlags.adminDashboard}
                      onChange={(e) => handleFlagChange('adminDashboard', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="curate-dates" mb="0" flex={1}>
                      Curate Dates
                    </FormLabel>
                    <Switch
                      id="curate-dates"
                      isChecked={localFlags.curateDates}
                      onChange={(e) => handleFlagChange('curateDates', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dates-management" mb="0" flex={1}>
                      Dates Management
                    </FormLabel>
                    <Switch
                      id="dates-management"
                      isChecked={localFlags.curatedDatesManagement}
                      onChange={(e) => handleFlagChange('curatedDatesManagement', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="revenue-tracking" mb="0" flex={1}>
                      Revenue Tracking
                    </FormLabel>
                    <Switch
                      id="revenue-tracking"
                      isChecked={localFlags.revenueTracking}
                      onChange={(e) => handleFlagChange('revenueTracking', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="notifications" mb="0" flex={1}>
                      Real-time Notifications
                      <Badge ml={2} colorScheme="gray" fontSize="xs">Coming Soon</Badge>
                    </FormLabel>
                    <Switch
                      id="notifications"
                      isChecked={localFlags.realTimeNotifications}
                      onChange={(e) => handleFlagChange('realTimeNotifications', e.target.checked)}
                      isDisabled
                    />
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              {/* Debug Section */}
              <Box>
                <Text fontWeight="bold" mb={3}>Debug Options</Text>
                <VStack spacing={3} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="logging" mb="0" flex={1}>
                      Enable Logging
                    </FormLabel>
                    <Switch
                      id="logging"
                      isChecked={localFlags.enableLogging}
                      onChange={(e) => handleFlagChange('enableLogging', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="devtools" mb="0" flex={1}>
                      Show Dev Tools
                    </FormLabel>
                    <Switch
                      id="devtools"
                      isChecked={localFlags.showDevTools}
                      onChange={(e) => handleFlagChange('showDevTools', e.target.checked)}
                    />
                  </FormControl>
                </VStack>
              </Box>
            </VStack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              leftIcon={<FiRefreshCw />}
              variant="outline"
              mr={3}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSave}
              isDisabled={!hasChanges}
            >
              Save & Reload
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FeatureFlagsPanel;