// apps/frontend/src/mvp/profile/UserProfile.tsx

import React from "react";
import {
    Box,
    VStack,
    useTheme,
    Spinner,
    Alert,
    AlertIcon,
    Text,
    Button,
    HStack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTimes, FaUser } from "react-icons/fa";

// Custom hooks
import { useUserProfile } from "./hooks/useUserProfile";
import { useProfileValidation } from "./hooks/useProfileValidation";

// Components
import { ProfileSection } from "./components/ProfileSection";
// import { ProfileImageUpload } from "./components/ProfileImageUpload";
import { ErrorBoundary } from "../common/ErrorBoundary";

// Types
import { DatifyyUsersInformation } from "../../service/userService/UserProfileTypes";
import { FormFieldConfig, FormSectionConfig } from "./types/ProfileFormTypes";
import { LoadingSpinner, ProfileCompletionBanner } from "./components/ProfileCompletionBanner";

/**
 * Enhanced User Profile Component
 * 
 * Features:
 * - Optimistic updates for better UX
 * - Section-wise editing with validation
 * - Profile completion tracking
 * - Image upload with preview
 * - Real-time validation feedback
 * - Responsive design with accessibility
 */
const UserProfile: React.FC = () => {
    const theme = useTheme();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    // Custom hooks for state management
    const {
        profile,
        loading,
        error,
        updateProfile,
        deleteProfile,
        refreshProfile,
        completionStats,
        isUpdating,
        lastUpdated
    } = useUserProfile();

    const {
        validateSection,
        getFieldError,
        clearErrors
    } = useProfileValidation();

    // Loading state
    if (loading) {
        return <LoadingSpinner message="Loading your profile..." />;
    }

    // Error state
    if (error) {
        return (
            <Box maxW="900px" margin="0 auto" pt={8}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={2}>
                        <Text fontWeight="semibold">Unable to load profile</Text>
                        <Text fontSize="sm">{error}</Text>
                        <Button size="sm" onClick={refreshProfile} colorScheme="red" variant="outline">
                            Retry
                        </Button>
                    </VStack>
                </Alert>
            </Box>
        );
    }

    return (
        <ErrorBoundary>
            <Box
                maxW="900px"
                margin="0 auto"
                pt={8}
                px={{ base: 4, md: 0 }}
                minH="100vh"
            >
                <VStack spacing={6} align="stretch">

                    {/* Profile Completion Banner */}
                    {completionStats && (
                        <ProfileCompletionBanner
                            stats={completionStats}
                            onActionClick={(field) => {
                                // Scroll to field and highlight it
                                const element = document.getElementById(`field-${field}`);
                                element?.scrollIntoView({ behavior: 'smooth' });
                                element?.focus();
                            }}
                        />
                    )}

                    {/* Profile Sections */}
                    {FORM_SECTIONS.map((section) => (
                        <ProfileSection
                            key={section.id}
                            section={section}
                            profile={profile}
                            onUpdate={updateProfile}
                            onValidate={validateSection}
                            getFieldError={getFieldError}
                            clearErrors={clearErrors}
                            isUpdating={isUpdating}
                            theme={theme}
                        />
                    ))}

                    {/* Danger Zone */}
                    <Box
                        bg="red.50"
                        p={6}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="red.200"
                    >
                        <VStack spacing={4} align="start">
                            <Text fontSize="lg" fontWeight="bold" color="red.600">
                                Danger Zone
                            </Text>
                            <Text fontSize="sm" color="red.600">
                                Once you delete your profile, there is no going back. Please be certain.
                            </Text>
                            <Button
                                colorScheme="red"
                                variant="outline"
                                size="sm"
                                onClick={onDeleteOpen}
                                // @ts-ignore
                                leftIcon={<FaTimes />}
                            >
                                Delete Profile
                            </Button>
                        </VStack>
                    </Box>

                    {/* Last Updated Info */}
                    {lastUpdated && (
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            Last updated: {new Date(lastUpdated).toLocaleString()}
                        </Text>
                    )}
                </VStack>

                {/* Delete Confirmation Modal */}
                <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader color="red.600">Delete Profile</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} align="start">
                                <Text>
                                    Are you absolutely sure you want to delete your profile?
                                    This action cannot be undone.
                                </Text>
                                <Box bg="red.50" p={4} borderRadius="md" w="full">
                                    <Text fontSize="sm" color="red.600">
                                        <strong>This will permanently:</strong>
                                    </Text>
                                    <VStack align="start" spacing={1} mt={2}>
                                        <Text fontSize="sm" color="red.600">• Delete all your profile information</Text>
                                        <Text fontSize="sm" color="red.600">• Remove you from all matches</Text>
                                        <Text fontSize="sm" color="red.600">• Cancel any active conversations</Text>
                                    </VStack>
                                </Box>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={async () => {
                                    await deleteProfile();
                                    onDeleteClose();
                                }}
                                isLoading={isUpdating}
                            >
                                Yes, Delete Profile
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </ErrorBoundary>
    );
};

// Form configuration - moved to separate constant for maintainability
const FORM_SECTIONS: FormSectionConfig[] = [
    {
        id: "personal-information",
        title: "Personal Information",
        description: "Basic information about yourself",
        icon: FaUser,
        fields: [
            [
                {
                    name: "firstName",
                    label: "First Name",
                    type: "text",
                    required: true,
                    placeholder: "Enter your first name",
                    maxLength: 50
                },
                {
                    name: "lastName",
                    label: "Last Name",
                    type: "text",
                    required: true,
                    placeholder: "Enter your last name",
                    maxLength: 50
                },
                {
                    name: "dob",
                    label: "Date of Birth",
                    type: "date",
                    required: true,
                    helpText: "You must be at least 18 years old"
                },
                {
                    name: "gender",
                    label: "Gender",
                    type: "select",
                    required: true,
                    options: ["Male", "Female", "Other"]
                },
            ],
            [
                {
                    name: "images",
                    label: "Profile Images",
                    type: "image",
                    helpText: "Add up to 6 photos to showcase your personality"
                },
            ],
        ],
    },
    {
        id: "contact-details",
        title: "Contact & Verification",
        description: "Your contact information and verification status",
        icon: FaCheck,
        fields: [
            [
                {
                    name: "officialEmail",
                    label: "Email Address",
                    type: "email",
                    required: true,
                    readOnly: true,
                    helpText: "Email cannot be changed here. Contact support if needed."
                },
                {
                    name: "isOfficialEmailVerified",
                    label: "Email Verified",
                    type: "verification",
                    readOnly: true
                },
                {
                    name: "isAadharVerified",
                    label: "Aadhar Verified",
                    type: "verification",
                    readOnly: true
                },
                {
                    name: "isPhoneVerified",
                    label: "Phone Verified",
                    type: "verification",
                    readOnly: true
                },
            ],
        ],
    },
    {
        id: "physical-attributes",
        title: "Physical Attributes",
        description: "Help others know more about your physical characteristics",
        fields: [
            [
                {
                    name: "height",
                    label: "Height (cm)",
                    type: "number",
                    min: 100,
                    max: 250,
                    placeholder: "Enter height in centimeters"
                },
                {
                    name: "exercise",
                    label: "Exercise Frequency",
                    type: "select",
                    options: ["None", "Light", "Moderate", "Heavy"]
                },
            ],
        ],
    },
    {
        id: "lifestyle-preferences",
        title: "Lifestyle & Preferences",
        description: "Your lifestyle choices and what you're looking for",
        fields: [
            [
                {
                    name: "drinking",
                    label: "Drinking Habits",
                    type: "select",
                    options: ["Never", "Occasionally", "Regularly"]
                },
                {
                    name: "smoking",
                    label: "Smoking Habits",
                    type: "select",
                    options: ["Never", "Occasionally", "Regularly"]
                },
                {
                    name: "lookingFor",
                    label: "Looking For",
                    type: "select",
                    required: true,
                    options: ["Friendship", "Casual", "Relationship"]
                },
            ],
        ],
    },
    {
        id: "location-information",
        title: "Location Information",
        description: "Where you're from and where you live",
        fields: [
            [
                {
                    name: "currentCity",
                    label: "Current City",
                    type: "city",
                    required: true,
                    placeholder: "Search for your city..."
                },
                {
                    name: "hometown",
                    label: "Hometown",
                    type: "city",
                    placeholder: "Search for your hometown..."
                },
            ],
        ],
    },
    {
        id: "personal-details",
        title: "Personal Details",
        description: "Additional information about yourself",
        fields: [
            [
                {
                    name: "bio",
                    label: "Bio",
                    type: "textarea",
                    placeholder: "Tell others about yourself...",
                    maxLength: 500,
                    helpText: "Write a compelling bio to attract compatible matches"
                },
            ],
            [
                {
                    name: "educationLevel",
                    label: "Education Level",
                    type: "select",
                    options: ["High School", "Undergraduate", "Graduate", "Postgraduate"]
                },
                {
                    name: "settleDownInMonths",
                    label: "Looking to Settle Down",
                    type: "select",
                    options: ["0-6", "6-12", "12-24", "24+"]
                },
                {
                    name: "haveKids",
                    label: "Have Kids",
                    type: "checkbox"
                },
                {
                    name: "wantsKids",
                    label: "Want Kids",
                    type: "checkbox"
                },
            ],
            [
                {
                    name: "starSign",
                    label: "Star Sign",
                    type: "select",
                    options: [
                        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
                    ]
                },
                {
                    name: "religion",
                    label: "Religion",
                    type: "text",
                    placeholder: "Your religious beliefs (optional)"
                },
                {
                    name: "pronoun",
                    label: "Pronouns",
                    type: "select",
                    options: ["He/Him", "She/Her", "They/Them", "Other"]
                },
            ],
        ],
    },
    {
        id: "interests-hobbies",
        title: "Interests & Hobbies",
        description: "What you love doing and what you care about",
        fields: [
            [
                {
                    name: "favInterest",
                    label: "Favorite Interests",
                    type: "tag-input",
                    placeholder: "Add your interests...",
                    maxTags: 10,
                    helpText: "Add interests to find people with similar hobbies"
                },
                {
                    name: "causesYouSupport",
                    label: "Causes You Support",
                    type: "tag-input",
                    placeholder: "Add causes you care about...",
                    maxTags: 5
                },
                {
                    name: "qualityYouValue",
                    label: "Qualities You Value",
                    type: "tag-input",
                    placeholder: "Add qualities you value in others...",
                    maxTags: 5
                },
            ],
        ],
    },
];

export default UserProfile;