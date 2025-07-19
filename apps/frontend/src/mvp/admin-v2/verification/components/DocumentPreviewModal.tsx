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
  Image,
  Box,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { FiDownload, FiCheck, FiX } from 'react-icons/fi';
import { UserVerification } from '../types';
import verificationService from '../services/VerificationService';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserVerification;
  documentType: string;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  user,
  documentType,
}) => {
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadDocument();
    }
  }, [isOpen, user.id, documentType]);

  const loadDocument = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { response, error } = await verificationService.getDocumentPreview(
        user.id,
        documentType
      );
      if (response) {
        setDocumentUrl(response.url);
      } else {
        setError(error?.message || 'Failed to load document');
      }
    } catch (err) {
      setError('Error loading document');
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentTitle = () => {
    const titles: Record<string, string> = {
      aadharId: 'Aadhar Card',
      collegeId: 'College ID Card',
      workId: 'Work ID Card',
      collegeMarksheet: 'College Marksheet',
    };
    return titles[documentType] || documentType;
  };

  const getDocumentInfo = () => {
    switch (documentType) {
      case 'aadharId':
        return {
          uploaded: user.documents.aadharUploaded,
          number: user.documents.aadharNumber,
          status: user.verificationStatus.aadharId,
        };
      case 'collegeId':
        return {
          uploaded: user.college?.studentIdUploaded,
          college: user.college?.name,
          status: user.verificationStatus.collegeId,
        };
      case 'workId':
        return {
          uploaded: user.work?.workIdUploaded,
          company: user.work?.company,
          status: user.verificationStatus.workId,
        };
      case 'collegeMarksheet':
        return {
          uploaded: user.college?.marksheetUploaded,
          college: user.college?.name,
          degree: user.college?.degree,
          year: user.college?.graduationYear,
          status: user.verificationStatus.collegeMarksheet,
        };
      default:
        return null;
    }
  };

  const docInfo = getDocumentInfo();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <Text>{getDocumentTitle()} - {user.name}</Text>
              <HStack spacing={2}>
                <Badge colorScheme="blue" fontSize="xs">
                  {user.userType === 'college_student' ? 'Student' : 'Professional'}
                </Badge>
                {docInfo?.status && (
                  <Badge
                    colorScheme={
                      docInfo.status === 'verified' ? 'green' :
                      docInfo.status === 'pending' ? 'yellow' :
                      docInfo.status === 'rejected' ? 'red' : 'gray'
                    }
                    fontSize="xs"
                  >
                    {docInfo.status}
                  </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Document Info */}
            <Box bg="gray.50" p={4} borderRadius="md">
              <VStack align="start" spacing={2}>
                {docInfo?.number && (
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium">Aadhar Number:</Text>
                    <Text fontSize="sm">{docInfo.number}</Text>
                  </HStack>
                )}
                {docInfo?.college && (
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium">College:</Text>
                    <Text fontSize="sm">{docInfo.college}</Text>
                  </HStack>
                )}
                {docInfo?.company && (
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium">Company:</Text>
                    <Text fontSize="sm">{docInfo.company}</Text>
                  </HStack>
                )}
                {docInfo?.degree && (
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium">Degree:</Text>
                    <Text fontSize="sm">{docInfo.degree} ({docInfo.year})</Text>
                  </HStack>
                )}
              </VStack>
            </Box>

            <Divider />

            {/* Document Preview */}
            <Box minH="400px" bg="gray.100" borderRadius="md" overflow="hidden">
              {isLoading ? (
                <Center h="400px">
                  <VStack>
                    <Spinner size="xl" color="brand.500" />
                    <Text mt={4}>Loading document...</Text>
                  </VStack>
                </Center>
              ) : error ? (
                <Center h="400px">
                  <Alert status="error" maxW="sm">
                    <AlertIcon />
                    {error}
                  </Alert>
                </Center>
              ) : (
                <Box position="relative">
                  {/* For demo, showing a placeholder image */}
                  <Image
                    src={`https://via.placeholder.com/800x600/f7fafc/4a5568?text=${encodeURIComponent(getDocumentTitle())}`}
                    alt={getDocumentTitle()}
                    w="100%"
                    h="auto"
                    maxH="600px"
                    objectFit="contain"
                  />
                  <Text
                    position="absolute"
                    top={4}
                    right={4}
                    bg="blackAlpha.700"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    Demo Document
                  </Text>
                </Box>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button
              variant="outline"
              leftIcon={<FiDownload />}
              onClick={() => {
                // Download document
                window.open(documentUrl, '_blank');
              }}
            >
              Download
            </Button>
            {docInfo?.status === 'pending' && (
              <>
                <Button
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<FiX />}
                  onClick={() => {
                    // Reject document
                    onClose();
                  }}
                >
                  Reject
                </Button>
                <Button
                  colorScheme="green"
                  leftIcon={<FiCheck />}
                  onClick={() => {
                    // Approve document
                    onClose();
                  }}
                >
                  Approve
                </Button>
              </>
            )}
            {docInfo?.status !== 'pending' && (
              <Button onClick={onClose}>
                Close
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DocumentPreviewModal;