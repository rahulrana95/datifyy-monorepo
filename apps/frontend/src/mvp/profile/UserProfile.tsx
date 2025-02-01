import React, { useState } from "react";
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
} from "@chakra-ui/react";
import CitySelect from "./CitySelect";
import MalePreview from '../../assets/images/male-preview.jpeg';
import FemalePreview from '../../assets/images/female-preview.jpeg';
import ImageUploadButton from "./ImageUploadButton";

const enums = {
    gender: ["Male", "Female", "Other"],
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

interface FormField {
    name: string;
    label: string;
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
                { name: "firstName", label: "First Name", type: "text" },
                { name: "lastName", label: "Last Name", type: "text" },
                { name: "dob", label: "Date of Birth", type: "date" },
                {
                    name: "gender",
                    label: "Gender",
                    type: "select",
                    options: enums.gender,
                },
            ],
            [
                {
                    name: "profileImage",
                    label: "Profile Image",
                    type: "image",
                },
            ]
        ],
    },
    {
        section: "Contact Details",
        fields: [
            [
                { name: "officialEmail", label: "Email", type: "email" },
                {
                    name: "isOfficialEmailVerified",
                    label: "Email Verified",
                    type: "checkbox",
                },
                {
                    name: "isAadharVerified",
                    label: "Aadhar Verified",
                    type: "checkbox",
                },
                { name: "isPhoneVerified", label: "Phone Verified", type: "checkbox" },
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
                    options: enums.exercise,
                },
                {
                    name: "drinking",
                    label: "Drinking",
                    type: "select",
                    options: enums.drinking,
                },
                {
                    name: "smoking",
                    label: "Smoking",
                    type: "select",
                    options: enums.smoking,
                },
                {
                    name: "lookingFor",
                    label: "Looking For",
                    type: "select",
                    options: enums.lookingFor,
                },
            ],
        ],
    },
    {
        section: "Location",
        fields: [
            [
                { name: "currentCity", label: "Current City", type: "city" },
                { name: "hometown", label: "Hometown", type: "city" },
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
                    type: "select",
                    options: enums.settleDownInMonths,
                },
                { name: "haveKids", label: "Have Kids", type: "checkbox" },
                { name: "wantsKids", label: "Wants Kids", type: "checkbox" },
                {
                    name: "starSign",
                    label: "Star Sign",
                    type: "select",
                    options: enums.starSign,
                },
                {
                    name: "pronoun",
                    label: "Pronoun",
                    type: "select",
                    options: enums.pronoun,
                },
            ],
        ],
    },
];

const ProfileForm = () => {
    const theme = useTheme();
    const [profileData, setProfileData] = useState<ProfileData>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    interface FormField {
        name: string;
        label: string;
        type: "text" | "email" | "date" | "select" | "checkbox" | "city" | "image";
        options?: string[];
    }

    interface FormSection {
        section: string;
        fields: FormField[];
    }

    interface ProfileData {
        [key: string]: string | boolean | undefined;
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setProfileData((prev: ProfileData) => ({
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

    const renderField = (field: FormField) => {
        switch (field.type) {
            case "text":
            case "email":
            case "date":
                return (
                    <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={String(profileData[field.name] ?? "")}
                        onChange={handleChange}
                    />
                );
            case "select":
                return (
                    <Select
                        id={field.name}
                        name={field.name}
                        value={String(profileData[field.name] ?? "")}
                        onChange={handleChange}
                    >
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Select>
                );
            case "checkbox":
                return (
                    <Checkbox
                        id={field.name}
                        name={field.name}
                        isChecked={!!profileData[field.name] || false}
                        onChange={handleChange}
                    >
                        {field.label}
                    </Checkbox>
                );
            case "city":
                return <CitySelect />;
            case "image":
                return <div className="image-upload">
                    <Box className="image-preview" mb={6}>
                        {!imagePreview ? <img src={MalePreview} width="200px" /> : <Image src={imagePreview ?? ''} boxSize="100px" objectFit="cover" />}
                    </Box>
                    <ImageUploadButton handleImageUpload={handleImageUpload} />
                </div>
            default:
                return null;
        }
    };

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
                            <FormLabel fontSize="lg" fontWeight="bold">
                                {section.section}
                            </FormLabel>
                            <SimpleGrid
                                columns={{ base: 1, md: section.fields.length }}
                                spacing={4}
                            >
                                {section.fields.map((fieldCol, colIndex) => (
                                    <VStack key={colIndex} spacing={4} align="stretch">
                                        {fieldCol.map((field) => (
                                            <FormControl key={field.name} isRequired>
                                                <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                                                {renderField(field)}
                                            </FormControl>
                                        ))}
                                    </VStack>
                                ))}
                            </SimpleGrid>
                        </Box>
                    ))}
                </VStack>
            </form>
        </Box>
    );
};

export default ProfileForm;
