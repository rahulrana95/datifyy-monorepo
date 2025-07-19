/**
 * SendReminderModal Component
 * Modal for sending reminders with template selection
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  CheckboxGroup,
  Textarea,
  useColorModeValue,
  Alert,
  AlertIcon,
  Badge,
  Avatar,
  Divider,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { FiMail, FiMessageSquare, FiSend } from 'react-icons/fi';
import { format } from 'date-fns';
import { GenieDate, ReminderTemplate, SendReminderRequest } from '../types';

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: GenieDate | null;
  templates: ReminderTemplate[];
  onSendReminder: (request: SendReminderRequest) => void;
}

const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  onClose,
  date,
  templates,
  onSendReminder,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [recipients, setRecipients] = useState<string[]>(['both']);
  const [customMessage, setCustomMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  useEffect(() => {
    if (selectedTemplate && date) {
      // Replace template variables
      let message = selectedTemplate.body;
      const replacements: Record<string, string> = {
        userName: recipients.includes('both') ? 'there' : 
                 recipients.includes('user1') ? date.user1.firstName : date.user2.firstName,
        partnerName: recipients.includes('both') ? 'your match' :
                    recipients.includes('user1') ? date.user2.firstName : date.user1.firstName,
        dateTime: format(new Date(date.scheduledDate), 'EEEE, MMM d at h:mm a'),
        location: date.mode === 'online' ? 'Online Meeting' : date.location?.name || 'TBD',
        mode: date.mode,
      };

      Object.entries(replacements).forEach(([key, value]) => {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      setPreviewMessage(message);
    }
  }, [selectedTemplate, date, recipients]);

  if (!date) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const request: SendReminderRequest = {
      dateId: date.id,
      templateId: selectedTemplateId,
      recipients: recipients as any,
      customMessage: customMessage || undefined,
    };

    await onSendReminder(request);
    setIsSubmitting(false);
    onClose();
  };

  const isValid = selectedTemplateId && recipients.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Reminder</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Date Info */}
            <Box bg={bgColor} p={4} borderRadius="lg">
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <HStack>
                    <Avatar src={date.user1.profilePicture} size="sm" name={date.user1.firstName} />
                    <Text fontWeight="medium">{date.user1.firstName} {date.user1.lastName}</Text>
                    {date.remindersSent.user1 && (
                      <Badge colorScheme="green" fontSize="xs">Reminder Sent</Badge>
                    )}
                  </HStack>
                  <Text fontSize="sm" color="gray.500">with</Text>
                  <HStack>
                    <Avatar src={date.user2.profilePicture} size="sm" name={date.user2.firstName} />
                    <Text fontWeight="medium">{date.user2.firstName} {date.user2.lastName}</Text>
                    {date.remindersSent.user2 && (
                      <Badge colorScheme="green" fontSize="xs">Reminder Sent</Badge>
                    )}
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  📅 {format(new Date(date.scheduledDate), 'EEEE, MMM d at h:mm a')}
                </Text>
              </VStack>
            </Box>

            {/* Recipients */}
            <FormControl isRequired>
              <FormLabel>Send To</FormLabel>
              <RadioGroup value={recipients[0]} onChange={(value) => setRecipients([value])}>
                <Stack spacing={2}>
                  <Radio value="both">Both Users</Radio>
                  <Radio value="user1">
                    Only {date.user1.firstName}
                    {date.remindersSent.user1 && ' (Already sent)'}
                  </Radio>
                  <Radio value="user2">
                    Only {date.user2.firstName}
                    {date.remindersSent.user2 && ' (Already sent)'}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <Divider />

            {/* Template Selection */}
            <FormControl isRequired>
              <FormLabel>Select Template</FormLabel>
              <Select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                placeholder="Choose a reminder template"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.type})
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Template Preview */}
            {selectedTemplate && (
              <Box>
                <FormLabel>Preview</FormLabel>
                <Box
                  p={4}
                  bg={bgColor}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Badge colorScheme={
                        selectedTemplate.type === 'email' ? 'blue' :
                        selectedTemplate.type === 'sms' ? 'green' : 'purple'
                      }>
                        {selectedTemplate.type.toUpperCase()}
                      </Badge>
                      {selectedTemplate.type === 'email' && (
                        <Text fontSize="sm" fontWeight="medium">
                          Subject: {selectedTemplate.subject}
                        </Text>
                      )}
                    </HStack>
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {previewMessage}
                    </Text>
                  </VStack>
                </Box>
              </Box>
            )}

            {/* Custom Message */}
            <FormControl>
              <FormLabel>Additional Message (Optional)</FormLabel>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personalized message..."
                rows={3}
              />
            </FormControl>

            {/* Warning for already sent */}
            {((recipients.includes('user1') && date.remindersSent.user1) ||
              (recipients.includes('user2') && date.remindersSent.user2) ||
              (recipients.includes('both') && (date.remindersSent.user1 || date.remindersSent.user2))) && (
              <Alert status="warning">
                <AlertIcon />
                <Text fontSize="sm">
                  A reminder has already been sent to one or both users. Sending again may be redundant.
                </Text>
              </Alert>
            )}
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            leftIcon={<FiSend />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >
            Send Reminder
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendReminderModal;