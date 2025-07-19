import React, { useState } from 'react';
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
  Textarea,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';
import { UserVerification, VerificationStatus } from '../types';

interface VerificationUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserVerification;
  verificationType: keyof UserVerification['verificationStatus'];
  onUpdate: (status: VerificationStatus, reason?: string) => void;
}

const VerificationUpdateModal: React.FC<VerificationUpdateModalProps> = ({
  isOpen,
  onClose,
  user,
  verificationType,
  onUpdate,
}) => {
  const [status, setStatus] = useState<VerificationStatus>('rejected');
  const [rejectionReason, setRejectionReason] = useState('');

  const verificationLabels: Record<string, string> = {
    phone: 'Phone Number',
    email: 'Email Address',
    officialEmail: 'Official Email',
    aadharId: 'Aadhar ID',
    collegeId: 'College ID',
    workId: 'Work ID',
    collegeMarksheet: 'College Marksheet',
  };

  const commonRejectionReasons = [
    'Document is unclear or blurry',
    'Document appears to be edited or tampered',
    'Document has expired',
    'Name mismatch with profile',
    'Incomplete document uploaded',
    'Wrong document type uploaded',
  ];

  const handleUpdate = () => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      return; // Require reason for rejection
    }
    onUpdate(status, status === 'rejected' ? rejectionReason : undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Update Verification Status
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* User Info */}
            <Box bg="gray.50" p={3} borderRadius="md">
              <Text fontWeight="medium">{user.name}</Text>
              <Text fontSize="sm" color="gray.600">
                {verificationLabels[verificationType]} Verification
              </Text>
            </Box>

            {/* Status Selection */}
            <FormControl isRequired>
              <FormLabel>New Status</FormLabel>
              <RadioGroup value={status} onChange={(value) => setStatus(value as VerificationStatus)}>
                <Stack spacing={2}>
                  <Radio value="verified" colorScheme="green">
                    Verified - Document is valid and approved
                  </Radio>
                  <Radio value="rejected" colorScheme="red">
                    Rejected - Document needs to be resubmitted
                  </Radio>
                  <Radio value="pending" colorScheme="yellow">
                    Pending - Keep in review queue
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {/* Rejection Reason */}
            {status === 'rejected' && (
              <FormControl isRequired>
                <FormLabel>Rejection Reason</FormLabel>
                <VStack align="stretch" spacing={2}>
                  {/* Quick reasons */}
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Quick reasons:
                    </Text>
                    <Stack spacing={1}>
                      {commonRejectionReasons.map((reason) => (
                        <Button
                          key={reason}
                          size="xs"
                          variant="outline"
                          onClick={() => setRejectionReason(reason)}
                          justifyContent="start"
                        >
                          {reason}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                  
                  <Textarea
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </VStack>
              </FormControl>
            )}

            {/* Warning for rejection */}
            {status === 'rejected' && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  The user will be notified via email about the rejection and asked to resubmit.
                </Text>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme={
                status === 'verified' ? 'green' :
                status === 'rejected' ? 'red' : 'yellow'
              }
              onClick={handleUpdate}
              isDisabled={status === 'rejected' && !rejectionReason.trim()}
            >
              Update Status
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VerificationUpdateModal;