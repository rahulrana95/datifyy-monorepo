import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Avatar,
  HStack,
  VStack,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FiMoreVertical,
  FiEye,
  FiMail,
  FiCheck,
  FiX,
  FiDownload,
  FiUser,
} from 'react-icons/fi';
import { UserVerification, VerificationStatus } from '../types';
import DocumentPreviewModal from './DocumentPreviewModal';
import VerificationUpdateModal from './VerificationUpdateModal';

interface VerificationTableProps {
  users: UserVerification[];
  selectedUsers: string[];
  onUserSelect: (userId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onUpdateStatus: (userId: string, type: keyof UserVerification['verificationStatus'], status: VerificationStatus) => void;
  onSendEmail: (userIds: string[]) => void;
  isLoading?: boolean;
}

const VerificationTable: React.FC<VerificationTableProps> = ({
  users,
  selectedUsers,
  onUserSelect,
  onSelectAll,
  onUpdateStatus,
  onSendEmail,
  isLoading,
}) => {
  const [previewUser, setPreviewUser] = useState<UserVerification | null>(null);
  const [previewDocument, setPreviewDocument] = useState<string>('');
  const [updateUser, setUpdateUser] = useState<UserVerification | null>(null);
  const [updateType, setUpdateType] = useState<keyof UserVerification['verificationStatus'] | null>(null);
  
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();

  const getStatusBadge = (status: VerificationStatus) => {
    const colorScheme = {
      verified: 'green',
      pending: 'yellow',
      rejected: 'red',
      not_submitted: 'gray',
    };

    const label = status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

    return (
      <Badge
        colorScheme={colorScheme[status]}
        size="sm"
        px={2}
        py={1}
        borderRadius="full"
        textTransform="capitalize"
      >
        {label}
      </Badge>
    );
  };

  const handleDocumentPreview = (user: UserVerification, documentType: string) => {
    setPreviewUser(user);
    setPreviewDocument(documentType);
    onPreviewOpen();
  };

  const handleStatusUpdate = (user: UserVerification, type: keyof UserVerification['verificationStatus']) => {
    setUpdateUser(user);
    setUpdateType(type);
    onUpdateOpen();
  };

  const getVerificationActions = (user: UserVerification, type: keyof UserVerification['verificationStatus']) => {
    const status = user.verificationStatus[type];
    if (!status || status === 'not_submitted') return null;

    return (
      <HStack spacing={1}>
        {status === 'pending' && (
          <>
            <Tooltip label="Approve">
              <IconButton
                aria-label="Approve"
                icon={<FiCheck />}
                size="xs"
                colorScheme="green"
                variant="ghost"
                onClick={() => onUpdateStatus(user.id, type, 'verified')}
              />
            </Tooltip>
            <Tooltip label="Reject">
              <IconButton
                aria-label="Reject"
                icon={<FiX />}
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={() => handleStatusUpdate(user, type)}
              />
            </Tooltip>
          </>
        )}
        {(type === 'collegeMarksheet' || type === 'collegeId' || type === 'workId' || type === 'aadharId') && (
          <Tooltip label="View Document">
            <IconButton
              aria-label="View Document"
              icon={<FiEye />}
              size="xs"
              variant="ghost"
              onClick={() => handleDocumentPreview(user, type)}
            />
          </Tooltip>
        )}
      </HStack>
    );
  };

  return (
    <>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr bg="gray.50">
              <Th width="40px">
                <Checkbox
                  isChecked={selectedUsers.length === users.length && users.length > 0}
                  isIndeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </Th>
              <Th>User</Th>
              <Th>Type</Th>
              <Th>Location</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>Official Email</Th>
              <Th>Aadhar ID</Th>
              <Th>College/Work ID</Th>
              <Th>Marksheet</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id} _hover={{ bg: 'gray.50' }}>
                <Td>
                  <Checkbox
                    isChecked={selectedUsers.includes(user.id)}
                    onChange={() => onUserSelect(user.id)}
                  />
                </Td>
                <Td>
                  <HStack spacing={3}>
                    <Avatar
                      size="sm"
                      name={user.name}
                      src={user.profilePicture}
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" fontSize="sm">
                        {user.name}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {user.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <Badge
                    colorScheme={user.userType === 'college_student' ? 'blue' : 'purple'}
                    fontSize="xs"
                  >
                    {user.userType === 'college_student' ? 'Student' : 'Professional'}
                  </Badge>
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm">{user.city}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {user.state}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {getStatusBadge(user.verificationStatus.phone)}
                    {getVerificationActions(user, 'phone')}
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {getStatusBadge(user.verificationStatus.email)}
                    {getVerificationActions(user, 'email')}
                  </HStack>
                </Td>
                <Td>
                  {user.userType === 'working_professional' ? (
                    <HStack spacing={2}>
                      {getStatusBadge(user.verificationStatus.officialEmail)}
                      {getVerificationActions(user, 'officialEmail')}
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="gray.400">N/A</Text>
                  )}
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {getStatusBadge(user.verificationStatus.aadharId)}
                    {getVerificationActions(user, 'aadharId')}
                  </HStack>
                </Td>
                <Td>
                  {user.userType === 'college_student' ? (
                    <HStack spacing={2}>
                      {getStatusBadge(user.verificationStatus.collegeId || 'not_submitted')}
                      {getVerificationActions(user, 'collegeId')}
                    </HStack>
                  ) : (
                    <HStack spacing={2}>
                      {getStatusBadge(user.verificationStatus.workId || 'not_submitted')}
                      {getVerificationActions(user, 'workId')}
                    </HStack>
                  )}
                </Td>
                <Td>
                  {user.userType === 'college_student' ? (
                    <HStack spacing={2}>
                      {getStatusBadge(user.verificationStatus.collegeMarksheet || 'not_submitted')}
                      {getVerificationActions(user, 'collegeMarksheet')}
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="gray.400">N/A</Text>
                  )}
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FiUser />}
                        onClick={() => {/* View full profile */}}
                      >
                        View Profile
                      </MenuItem>
                      <MenuItem
                        icon={<FiMail />}
                        onClick={() => onSendEmail([user.id])}
                      >
                        Send Email
                      </MenuItem>
                      <MenuItem
                        icon={<FiDownload />}
                        onClick={() => {/* Export user data */}}
                      >
                        Export Data
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Document Preview Modal */}
      {previewUser && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={onPreviewClose}
          user={previewUser}
          documentType={previewDocument}
        />
      )}

      {/* Verification Update Modal */}
      {updateUser && updateType && (
        <VerificationUpdateModal
          isOpen={isUpdateOpen}
          onClose={onUpdateClose}
          user={updateUser}
          verificationType={updateType}
          onUpdate={(status, reason) => {
            onUpdateStatus(updateUser.id, updateType, status);
            onUpdateClose();
          }}
        />
      )}
    </>
  );
};

export default VerificationTable;