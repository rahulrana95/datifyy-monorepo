import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox,
  CheckboxGroup,
  Stack,
  Alert,
  AlertIcon,
  Badge,
  Box,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FiSend, FiUsers } from 'react-icons/fi';
import { EmailTemplate, BulkEmailRequest } from '../types';
import verificationService from '../services/VerificationService';

interface BulkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserIds: string[];
  unverifiedTypes?: string[];
}

const BulkEmailModal: React.FC<BulkEmailModalProps> = ({
  isOpen,
  onClose,
  selectedUserIds,
  unverifiedTypes = [],
}) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [targetUnverified, setTargetUnverified] = useState<string[]>([]);
  const [previewContent, setPreviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        // Simple preview with placeholders
        let preview = template.body;
        template.variables.forEach(variable => {
          preview = preview.replace(`{{${variable}}}`, `[${variable}]`);
        });
        setPreviewContent(preview);
      }
    }
  }, [selectedTemplate, templates]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const { response, error } = await verificationService.getEmailTemplates();
      if (response) {
        setTemplates(response);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      toast({
        title: 'Please select a template',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSending(true);
    try {
      const request: BulkEmailRequest = {
        userIds: selectedUserIds,
        templateId: selectedTemplate,
        targetUnverified: targetUnverified.length > 0 ? targetUnverified : undefined,
        customMessage: customMessage || undefined,
      };

      const { response, error } = await verificationService.sendBulkEmail(request);

      if (response) {
        toast({
          title: 'Emails sent successfully',
          description: `${response.emailsSent} emails have been queued for delivery`,
          status: 'success',
          duration: 5000,
        });
        onClose();
      } else {
        toast({
          title: 'Failed to send emails',
          description: error?.message || 'An error occurred',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: 'Error',
        description: 'Failed to send emails',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const verificationOptions = [
    { value: 'phone', label: 'Phone Verification' },
    { value: 'email', label: 'Email Verification' },
    { value: 'officialEmail', label: 'Official Email' },
    { value: 'aadharId', label: 'Aadhar ID' },
    { value: 'collegeId', label: 'College ID' },
    { value: 'workId', label: 'Work ID' },
    { value: 'collegeMarksheet', label: 'College Marksheet' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader>Send Bulk Email</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Recipients Info */}
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="medium">
                  <FiUsers style={{ display: 'inline', marginRight: '8px' }} />
                  {selectedUserIds.length} recipients selected
                </Text>
                {unverifiedTypes.length > 0 && (
                  <Text fontSize="sm" mt={1}>
                    Common unverified items: {unverifiedTypes.join(', ')}
                  </Text>
                )}
              </Box>
            </Alert>

            {/* Template Selection */}
            <FormControl isRequired>
              <FormLabel>Email Template</FormLabel>
              <Select
                placeholder="Select a template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                isDisabled={isLoading}
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
              <FormHelperText>
                Choose a pre-defined email template
              </FormHelperText>
            </FormControl>

            {/* Target Unverified Options */}
            {unverifiedTypes.length > 0 && (
              <FormControl>
                <FormLabel>Target Specific Verifications</FormLabel>
                <CheckboxGroup
                  value={targetUnverified}
                  onChange={(values) => setTargetUnverified(values as string[])}
                >
                  <Stack spacing={2}>
                    {verificationOptions
                      .filter(opt => unverifiedTypes.includes(opt.value))
                      .map(option => (
                        <Checkbox key={option.value} value={option.value}>
                          {option.label}
                        </Checkbox>
                      ))}
                  </Stack>
                </CheckboxGroup>
                <FormHelperText>
                  Send only to users missing these verifications
                </FormHelperText>
              </FormControl>
            )}

            {/* Custom Message */}
            <FormControl>
              <FormLabel>Additional Message (Optional)</FormLabel>
              <Textarea
                placeholder="Add a personalized message..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
              <FormHelperText>
                This will be added to the email template
              </FormHelperText>
            </FormControl>

            {/* Email Preview */}
            {previewContent && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight="medium" mb={2}>Email Preview</Text>
                  <Box
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Text whiteSpace="pre-wrap" fontSize="sm">
                      {previewContent}
                    </Text>
                    {customMessage && (
                      <>
                        <Divider my={3} />
                        <Text fontSize="sm" fontStyle="italic">
                          {customMessage}
                        </Text>
                      </>
                    )}
                  </Box>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Note: Variables in [brackets] will be replaced with actual user data
                  </Text>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose} isDisabled={isSending}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              leftIcon={<FiSend />}
              onClick={handleSendEmail}
              isLoading={isSending}
              loadingText="Sending..."
            >
              Send Email
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkEmailModal;