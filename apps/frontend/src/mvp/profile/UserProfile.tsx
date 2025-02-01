import React, { useEffect, useState } from "react";
import {
    Select,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    HStack,
    Box,
    Checkbox,
    useTheme,
    Image,
    SimpleGrid,
    Text,
    Flex,
} from "@chakra-ui/react";
import { FaUser, FaBirthdayCake, FaEnvelope, FaCheckCircle, FaIdCard, FaPhone, FaRuler, FaDumbbell, FaBeer, FaSmoking, FaHeart, FaCity, FaHome, FaCalendarAlt, FaBaby, FaBabyCarriage, FaTransgender, FaCamera, FaEdit } from "react-icons/fa";
import CitySelect from "./CitySelect";
import MalePreview from "../../assets/images/male-preview.jpeg";
import FemalePreview from "../../assets/images/female-preview.jpeg";
import ImageUploadButton from "./ImageUploadButton";
import userProfileService from "../../service/userProfileService";
import { DatifyyUsersInformation, Gender } from "../../service/UserProfileTypes";


const fieldIcons = {
    firstName: FaUser,
    lastName: FaUser,
    dob: FaBirthdayCake,
    officialEmail: FaEnvelope,
    isOfficialEmailVerified: FaCheckCircle,
    isAadharVerified: FaIdCard,
    isPhoneVerified: FaPhone,
    height: FaRuler,
    exercise: FaDumbbell,
    drinking: FaBeer,
    smoking: FaSmoking,
    lookingFor: FaHeart,
    currentCity: FaCity,
    hometown: FaHome,
    settleDownInMonths: FaCalendarAlt,
    haveKids: FaBaby,
    wantsKids: FaBabyCarriage,
    starSign: FaCamera,
    pronoun: FaTransgender,
    profileImage: FaCamera
};

const enums = {
    gender: [Gender.Male, "Female", "Other"],
    exercise: ["Heavy", "Light", "Moderate", "None"],
    educationLevel: ["Graduate", "High School", "Postgraduate", "Undergraduate"],
    drinking: ["Never", "Occasionally", "Regularly"],
    smoking: ["Never", "Occasionally", "Regularly"],
    lookingFor: ["Casual", "Friendship", "Relationship"],
    settleDownInMonths: ["0-6", "6-12", "12-24", "24+"],
    starSign: [
        "Aquarius",
        "Aries",
        "Cancer",
        "Capricorn",
        "Gemini",
        "Leo",
        "Libra",
        "Pisces",
        "Sagittarius",
        "Scorpio",
        "Taurus",
        "Virgo",
    ],
    pronoun: ["He/Him", "She/Her", "They/Them", "Other"],
};

export interface FormField {
    name: keyof DatifyyUsersInformation;
    label: string;
    icon?: any;
    type: "text" | "email" | "date" | "select" | "checkbox" | "city" | "image";
    options?: string[];
}

interface FormSection {
    section: string;
    fields: FormField[][];
}

const formConfig: FormSection[] = [
    {
        section: "Personal Information",
        fields: [
            [
                { name: "firstName", label: "First Name", type: "text", icon: fieldIcons.firstName },
                { name: "lastName", label: "Last Name", type: "text", icon: fieldIcons.lastName },
                { name: "dob", label: "Date of Birth", type: "date", icon: fieldIcons.dob },
                {
                    name: "gender",
                    label: "Gender",
                    type: "select",
                    icon: fieldIcons.profileImage,
                    options: enums.gender,
                },
            ],
            [
                {
                    name: "images",
                    label: "Profile Image",
                    icon: fieldIcons.profileImage,
                    type: "image",
                },
            ],
        ],
    },
    {
        section: "Contact Details",
        fields: [
            [
                { name: "officialEmail", label: "Email", type: "email", icon: fieldIcons.officialEmail },
                {
                    name: "isOfficialEmailVerified",
                    label: "Email Verified",
                    type: "checkbox",
                    icon: fieldIcons.isOfficialEmailVerified,
                },
                {
                    name: "isAadharVerified",
                    label: "Aadhar Verified",
                    type: "checkbox",
                    icon: fieldIcons.isAadharVerified,
                },
                { name: "isPhoneVerified", label: "Phone Verified", type: "checkbox", icon: fieldIcons.isPhoneVerified },
            ],
        ],
    },
    {
        section: "Lifestyle & Preferences",
        fields: [
            [
                { name: "height", label: "Height", type: "text" },
                {
                    name: "exercise",
                    label: "Exercise",
                    type: "select",
                    icon: fieldIcons.exercise,
                    options: enums.exercise,
                },
                {
                    name: "drinking",
                    label: "Drinking",
                    icon: fieldIcons.drinking,
                    type: "select",
                    options: enums.drinking,
                },
                {
                    name: "smoking",
                    label: "Smoking",
                    type: "select",
                    icon: fieldIcons.smoking,
                    options: enums.smoking,
                },
                {
                    name: "lookingFor",
                    label: "Looking For",
                    type: "select",
                    icon: fieldIcons.lookingFor,
                    options: enums.lookingFor,
                },
            ],
        ],
    },
    {
        section: "Location",
        fields: [
            [
                { name: "currentCity", label: "Current City", type: "city", icon: fieldIcons.currentCity },
                { name: "hometown", label: "Hometown", type: "city", icon: fieldIcons.hometown },
            ],
        ],
    },
    {
        section: "Additional Information",
        fields: [
            [
                {
                    name: "settleDownInMonths",
                    label: "Settle Down In",
                    icon: fieldIcons.settleDownInMonths,
                    type: "select",
                    options: enums.settleDownInMonths,
                },
                { name: "haveKids", label: "Have Kids", type: "checkbox", icon: fieldIcons.haveKids },
                { name: "wantsKids", label: "Wants Kids", type: "checkbox", icon: fieldIcons.wantsKids },
                {
                    name: "starSign",
                    label: "Star Sign",
                    type: "select",
                    icon: fieldIcons.starSign,
                    options: enums.starSign,
                },
                {
                    name: "pronoun",
                    label: "Pronoun",
                    type: "select",
                    icon: fieldIcons.pronoun,
                    options: enums.pronoun,
                },
            ],
        ],
    },
];

const ProfileForm = () => {
    const theme = useTheme();
    const [profileData, setProfileData] = useState<DatifyyUsersInformation>({
        id: "",
        firstName: "",
        lastName: "",
        updatedAt: null,
        bio: null,
        images: null,
        dob: null,
        gender: null,
        officialEmail: "",
        isOfficialEmailVerified: false,
        isAadharVerified: false,
        isPhoneVerified: false,
        height: null,
        exercise: null,
        drinking: null,
        smoking: null,
        lookingFor: null,
        currentCity: null,
        hometown: null,
        settleDownInMonths: null,
        haveKids: false,
        wantsKids: false,
        starSign: null,
        pronoun: null,
        favInterest: null,
        causesYouSupport: null,
        qualityYouValue: null,
        prompts: null,
        educationLevel: null,
        religion: null,
        education: null,
        birthTime: null,
        kundliBeliever: null,
        isDeleted: false,
        userLoginId: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState<{
        [key: string]: boolean;
    }>({});

    useEffect(() => {
        userProfileService.getUserProfile().then((response) => {
            if (response.error || !response?.response) {
                console.error(response.error);
            } else {
                setProfileData(response.response);
            }
        });
    }, [])



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setProfileData((prev: DatifyyUsersInformation) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    const renderFieldReadView = (text: string, value: string, icon: any, fieldName: string) => {
        let newValue = value;
        if (fieldName === "dob") {
            const calculateAge = (dob: string) => {
                const birthDate = new Date(value);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDifference = today.getMonth() - birthDate.getMonth();
                if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            };

            newValue = `${value} (${calculateAge(value)} years)`;
        }
        return <Flex justifyContent="space-between" alignItems={"center"} border={"1px solid"} padding={4} pt={2} pb={2} borderColor={"gray.200"} borderRadius={8} fontSize={12} width={"100%"}>
            <HStack>
                <Box as={icon} mr={2} />
                <Text>{text}</Text>
            </HStack>
            <Text>{newValue ?? value}</Text>
        </Flex>
    }
    const renderField = (field: FormField, sectionId: string) => {
        const isEditEnabled = isEditMode[sectionId];
        switch (field.type) {
            case "text":
            case "email":
            case "date":
                return (
                    isEditEnabled ?
                        <Input
                            fontSize={13}
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={String(profileData[field.name] ?? "")}
                            onChange={handleChange}
                            isReadOnly={!isEditEnabled}
                        /> : renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name)
                );
            case "select":
                return (
                    isEditEnabled ?
                        <Select
                            id={field.name}
                            name={field.name}
                            value={String(profileData[field.name] ?? "")}
                            onChange={handleChange}
                            isReadOnly={!isEditEnabled}
                            fontSize={13}
                        >
                            {field.options?.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select> : renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name)
                );
            case "checkbox":
                return (
                    isEditEnabled ?
                        <Checkbox
                            id={field.name}
                            name={field.name}
                            isChecked={!!profileData[field.name] || false}
                            onChange={handleChange}
                            isDisabled={!isEditEnabled}
                        >
                            {field.label}
                        </Checkbox> : renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name)
                );
            case "city":
                return isEditEnabled ? <CitySelect /> : renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name);
            case "image":
                return (
                    <div className="image-upload">
                        <Box className="image-preview" mb={6}>
                            {!imagePreview ? (
                                <img src={MalePreview} width="200px" alt="Male Preview" />
                            ) : (
                                <Image
                                    src={imagePreview ?? ""}
                                    boxSize="100px"
                                    objectFit="cover"
                                />
                            )}
                        </Box>
                        {isEditEnabled && (
                            <ImageUploadButton handleImageUpload={handleImageUpload} />
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSave = (sectionId: string) => {
        setIsEditMode((isEditMode) => ({ ...isEditMode, [sectionId]: false }));
        // Save logic goes here (e.g., send data to server)
    };

    const handleDiscard = (sectionId: string) => {
        setIsEditMode((isEditMode) => ({ ...isEditMode, [sectionId]: false }));
        // Discard logic goes here (e.g., revert changes)
    };

    const handleEdit = (sectionId: string) => {
        setIsEditMode((isEditMode) => ({ ...isEditMode, [sectionId]: true }));

    }

    return (
        <Box maxW="900px" margin="0 auto" pt={8}>
            <form>
                <VStack spacing={6} align="stretch">
                    {formConfig.map((section) => (
                        <Box
                            key={section.section}
                            bg={theme.colors.white}
                            p={12}
                            borderRadius={20}
                            w="full"
                        >
                            <Flex justifyContent={"space-between"} alignItems={"center"} mb={4}>
                                <FormLabel fontSize="lg" fontWeight="bold">
                                    {section.section}
                                </FormLabel>
                                {!isEditMode[section.section] && <Box as={FaEdit} color={theme.colors.accent[500]} onClick={() => handleEdit(section.section)} />}
                            </Flex>

                            <SimpleGrid
                                columns={{ base: 1, md: section.fields.length }}
                                spacing={4}
                            >
                                {section.fields.map((fieldCol, colIndex) => (
                                    <VStack key={colIndex} spacing={4} align="stretch">
                                        {fieldCol.map((field) => (
                                            <FormControl key={field.name} isRequired style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                {isEditMode[section.section] && ['profileImage'].indexOf(field.name) < 0 && <FormLabel htmlFor={field.name} fontSize={12} width={"40%"} >
                                                    {field.label}
                                                </FormLabel>
                                                }
                                                {
                                                    renderField(field, section.section)
                                                }
                                            </FormControl>
                                        ))}

                                    </VStack>
                                ))}
                            </SimpleGrid>
                            {isEditMode[section.section] && (
                                <HStack spacing={4} mt={6}>
                                    <Button onClick={() => handleSave(section.section)} size={"sm"} bg={theme.colors.accent[500]} color="white">Save</Button>
                                    <Button onClick={() => handleDiscard(section.section)} size={"sm"} bg={theme.colors.accent[800]} colorScheme="red">
                                        Discard
                                    </Button>
                                </HStack>
                            )}

                        </Box>
                    ))}
                </VStack>
            </form>
        </Box>
    );
};

export default ProfileForm;
