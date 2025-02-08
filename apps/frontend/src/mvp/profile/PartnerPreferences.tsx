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
    useToast,
    Textarea,
    Spinner,

} from "@chakra-ui/react";
import { FaUser, FaBirthdayCake, FaEnvelope, FaCheckCircle, FaIdCard, FaPhone, FaRuler, FaDumbbell, FaBeer, FaSmoking, FaHeart, FaCity, FaHome, FaCalendarAlt, FaBaby, FaBabyCarriage, FaTransgender, FaCamera, FaEdit, FaVenusMars, FaRulerVertical, FaWeight, FaUserTag, FaWineGlassAlt, FaUtensils, FaNotesMedical, FaSearch, FaUserFriends, FaGraduationCap, FaBriefcase, FaBuilding, FaIndustry, FaMoneyBillWave, FaMapMarkerAlt, FaGlobe, FaChild, FaStar, FaComments, FaPalette, FaMusic, FaFilm, FaBook, FaPizzaSlice, FaPlane, FaLandmark, FaPrayingHands, FaBalanceScale, FaPaw, FaSmokingBan, FaGlassCheers, FaLeaf } from "react-icons/fa";
import CitySelect from "./CitySelect";
import MalePreview from "../../assets/images/male-preview.jpeg";
import FemalePreview from "../../assets/images/female-preview.jpeg";
import ImageUploadButton from "./ImageUploadButton";
import userProfileService from "../../service/userService/userProfileService";
import { DatifyyUsersInformation, Gender } from "../../service/userService/UserProfileTypes";
import { Toast } from "@radix-ui/react-toast";
import { set } from "date-fns";
import { get } from "http";
import emptyPartnerPreferences from "./constants";
import { ChildrenPreference, Currency, DatifyyUserPartnerPreferences, FamousInterests, GenderPreference, Hobbies, MaritalStatus, PersonalityTraits, Profession, RelationshipGoals } from "./types";
import { Sports } from "@mui/icons-material";
import TagInput from "./TagInput";
import MultiSelect from "./MultiSelectWithChips";


const fieldIcons = {
    firstName: FaUser,
    lastName: FaUser,
    dob: FaBirthdayCake,
    gender: FaVenusMars,
    images: FaCamera,

    officialEmail: FaEnvelope,
    isOfficialEmailVerified: FaCheckCircle,
    isAadharVerified: FaIdCard,
    isPhoneVerified: FaPhone,

    height: FaRulerVertical,
    weight: FaWeight,
    bodyType: FaUserTag,
    exercise: FaDumbbell,
    drinking: FaWineGlassAlt,
    smoking: FaSmoking,
    diet: FaUtensils,
    healthIssues: FaNotesMedical,

    relationshipStatus: FaHeart,
    lookingFor: FaSearch,
    partnerPreferences: FaUserFriends,

    educationLevel: FaGraduationCap,
    jobTitle: FaBriefcase,
    company: FaBuilding,
    industry: FaIndustry,
    income: FaMoneyBillWave,

    currentCity: FaMapMarkerAlt,
    hometown: FaHome,
    relocateWillingness: FaGlobe,

    settleDownInMonths: FaCalendarAlt,
    haveKids: FaChild,
    wantsKids: FaBabyCarriage,
    starSign: FaStar,
    pronoun: FaTransgender,
    languageSpoken: FaComments,

    hobbies: FaPalette,
    interests: FaMusic,
    favoriteMovies: FaFilm,
    favoriteBooks: FaBook,
    favoriteCuisines: FaPizzaSlice,
    favoriteTravelDestinations: FaPlane,

    politicalViews: FaLandmark,
    religiousBeliefs: FaPrayingHands,
    moralValues: FaBalanceScale,

    petPreferences: FaPaw,
    smokingPreference: FaSmokingBan,
    drinkingPreference: FaGlassCheers,
    dietaryPreference: FaLeaf,
    genderPreference: FaVenusMars,
    minAge: FaRuler,
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
    name: keyof DatifyyUserPartnerPreferences;
    label: string;
    icon?: any;
    type: "text" | "email" | "date" | "select" | "checkbox" | "city" | "image" | "number" | "textarea" | "multi-select" | "multi-select-text";
    options?: string[];
}

interface FormSection {
    section: string;
    fields: FormField[][];
}

const formConfig: FormSection[] = [
    {
        section: "Partner Preferences",
        fields: [
            [
                {
                    name: "genderPreference",
                    label: "Gender Preference",
                    type: "select",
                    icon: fieldIcons.genderPreference,
                    options: Object.values(GenderPreference)
                },
                { name: "minAge", label: "Min Age", type: "number", icon: fieldIcons.minAge },
                { name: "maxAge", label: "Max Age", type: "number", icon: fieldIcons.minAge },
                { name: "minHeight", label: "Min Height", type: "text", icon: fieldIcons.minAge },
                { name: "maxHeight", label: "Max Height", type: "text", icon: fieldIcons.minAge },
                {
                    name: "locationPreference",
                    label: "Location Preference",
                    type: "text",
                    icon: fieldIcons.minAge,
                },
                {
                    name: "locationPreferenceRadius",
                    label: "Location Radius",
                    type: "number",
                    icon: fieldIcons.minAge,
                },
            ],
            [
                {
                    name: "religion",
                    label: "Religion",
                    type: "text",
                    icon: fieldIcons.minAge,
                },
                {
                    name: "educationLevel",
                    label: "Education Level",
                    type: "multi-select",
                    icon: fieldIcons.educationLevel,
                    options: enums.educationLevel,
                },
                {
                    name: "profession",
                    label: "Preferred Professions",
                    type: "multi-select",
                    icon: fieldIcons.minAge,
                    options: Object.values(Profession),
                },
                { name: "minIncome", label: "Min Income", type: "number", icon: fieldIcons.minAge },
                { name: "maxIncome", label: "Max Income", type: "number", icon: fieldIcons.minAge },
                {
                    name: "currency",
                    label: "Currency",
                    type: "select",
                    icon: fieldIcons.minAge,
                    options: Object.values(Currency),
                },

            ],
        ],
    },
    {
        section: "Lifestyle & Habits",
        fields: [
            [
                {
                    name: "smokingPreference",
                    label: "Smoking Preference",
                    type: "select",
                    icon: fieldIcons.smokingPreference,
                    options: enums.smoking,
                },
                {
                    name: "drinkingPreference",
                    label: "Drinking Preference",
                    type: "select",
                    icon: fieldIcons.drinkingPreference,
                    options: enums.drinking,
                },
                {
                    name: "maritalStatus",
                    label: "Marital Status",
                    type: "select",
                    icon: fieldIcons.minAge,
                    options: Object.values(MaritalStatus),
                },
                {
                    name: "childrenPreference",
                    label: "Children Preference",
                    type: "select",
                    icon: fieldIcons.minAge,
                    options: Object.values(ChildrenPreference),
                },
            ],
        ],
    },
    {
        section: "Hobbies & Interests",
        fields: [
            [
                { name: "hobbies", label: "Hobbies", type: "multi-select", icon: fieldIcons.hobbies, options: Object.values(Hobbies) },
                { name: "interests", label: "Interests", type: "multi-select", icon: fieldIcons.interests, options: Object.values(FamousInterests) },
                { name: "booksReading", label: "Books", type: "multi-select", icon: fieldIcons.minAge, },
                { name: "music", label: "Music", type: "multi-select-text", icon: fieldIcons.minAge },
                { name: "movies", label: "Movies", type: "multi-select-text", icon: fieldIcons.minAge },
            ],
            [
                { name: "travel", label: "Travel", type: "multi-select", icon: fieldIcons.minAge },
                { name: "sports", label: "Sports", type: "multi-select", icon: fieldIcons.minAge, options: Object.values(Sports) },
            ],
        ],
    },
    {
        section: "Personality & Lifestyle",
        fields: [
            [
                { name: "personalityTraits", label: "Personality Traits", type: "multi-select", icon: fieldIcons.minAge, options: Object.values(PersonalityTraits) },
                { name: "relationshipGoals", label: "Relationship Goals", type: "select", icon: fieldIcons.minAge, options: Object.values(RelationshipGoals) },
                { name: "lifestylePreference", label: "Lifestyle Preference", type: "text", icon: fieldIcons.minAge },
                { name: "activityLevel", label: "Activity Level", type: "select", icon: fieldIcons.minAge, options: Object.values(RelationshipGoals) },
                { name: "petPreference", label: "Pet Preference", type: "select", icon: fieldIcons.minAge, options: Object.values(RelationshipGoals) },
            ],
        ],
    },
    {
        section: "Compatibility",
        fields: [
            [
                { name: "religionCompatibilityScore", label: "Religion Compatibility", type: "number", icon: fieldIcons.minAge },
                { name: "incomeCompatibilityScore", label: "Income Compatibility", type: "number", icon: fieldIcons.minAge },
                { name: "educationCompatibilityScore", label: "Education Compatibility", type: "number", icon: fieldIcons.minAge },
            ],
            [
                { name: "appearanceCompatibilityScore", label: "Appearance Compatibility", type: "number", icon: fieldIcons.minAge },
                { name: "personalityCompatibilityScore", label: "Personality Compatibility", type: "number", icon: fieldIcons.minAge },
                { name: "valuesCompatibilityScore", label: "Values Compatibility", type: "number", icon: fieldIcons.minAge },
                { name: "matchingScore", label: "Overall Match Score", type: "number", icon: fieldIcons.minAge },
            ],
        ],
    },
    {
        section: "Additional Details",
        fields: [
            [
                { name: "whatOtherPersonShouldKnow", label: "What They Should Know", type: "textarea", icon: fieldIcons.minAge },
            ],
        ],
    },
];


const PartnerPreferences = () => {
    const theme = useTheme();
    const toast = useToast();
    const [profileData, setProfileData] = useState<DatifyyUserPartnerPreferences>(emptyPartnerPreferences);
    const [draftProfileData, setDraftProfileData] = useState<Partial<DatifyyUserPartnerPreferences> | null>(null);
    const [isEditMode, setIsEditMode] = useState<{
        [key: string]: boolean;
    }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPartnerPreferences();
    }, [])

    const fetchPartnerPreferences = () => {
        setLoading(true);
        userProfileService.getPartnerPreferences().then((response) => {
            if (response.error || !response?.response) {
                console.error(response.error);
                setLoading(false);
            } else {
                console.log(response);
                setProfileData(response.response);
                setLoading(false);
            }
        });
    }



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        let newVal: string[] = [];
        if (type === "multi-select" || type === "multi-select-text") {
            newVal = [value];
        }
        setDraftProfileData((prev: Partial<DatifyyUserPartnerPreferences> | null) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : newVal,
        }));
    };

    const onMultiSelectChange = (name: string, value: string[]) => {
        setDraftProfileData((prev: Partial<DatifyyUserPartnerPreferences> | null) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleChangeTagInput = (name: string, value: string[]) => {
        setDraftProfileData((prev: Partial<DatifyyUserPartnerPreferences> | null) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const file = e.target.files?.[0];
        // if (file) {
        //     const imageUrl = URL.createObjectURL(file);
        //     setImagePreview(imageUrl);
        // }
    };



    const isFieldReadOnly = (fieldName: string) => {
        const fields = ["isOfficialEmailVerified", "isAadharVerified", "isPhoneVerified", "officialEmail"];
        return fields.indexOf(fieldName) >= 0;
    }

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
            case "number": // ✅ Added number input support
                return (
                    isEditEnabled ? (
                        <Input
                            fontSize={13}
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={String(draftProfileData?.[field.name] ?? profileData[field.name] ?? "")}
                            onChange={handleChange}
                            disabled={!isEditEnabled || isFieldReadOnly(field.name)}
                            isReadOnly={!isEditEnabled || isFieldReadOnly(field.name)}
                        />
                    ) : (
                        renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name)
                    )
                );

            case "textarea": // ✅ Added text area support
                return (
                    isEditEnabled ? (
                        <Textarea
                            fontSize={13}
                            id={field.name}
                            name={field.name}
                            value={String(profileData[field.name] ?? "")}
                            onChange={handleChange}
                            isReadOnly={!isEditEnabled || isFieldReadOnly(field.name)}
                        />
                    ) : (
                        renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name)
                    )
                );

            case "select":
                return (
                    isEditEnabled ? (
                        <Select
                            id={field.name}
                            name={field.name}
                            value={String(profileData[field.name] ?? "")}
                            onChange={handleChange}
                            isReadOnly={!isEditEnabled && isFieldReadOnly(field.name)}
                            fontSize={13}
                        >
                            {field.options?.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select>
                    ) : (
                        renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name)
                    )
                );

            case "multi-select": // ✅ Added multi-select dropdown
                return (
                    isEditEnabled ? (
                        <MultiSelect
                            options={field.options ?? []}
                            name={field.name}
                            value={Array.isArray(profileData[field.name]) ? (profileData[field.name] as string[]) : []}
                            onChange={onMultiSelectChange}
                            isReadOnly={!isEditEnabled && isFieldReadOnly(field.name)}
                            fontSize={13}
                        />
                    ) : (
                        // @ts-expect-error
                        renderFieldReadView(field.label, Array.isArray(profileData?.[field.name]) ? profileData?.[field.name]?.join(", ") : String(profileData?.[field.name] ?? ""), field.icon, field.name)
                    )
                );

            case "multi-select-text": // ✅ Added multi-select with manual entry (tags input)
                return (
                    isEditEnabled ? (
                        <TagInput
                            name={field.name}
                            value={Array.isArray(profileData[field.name]) ? profileData[field.name] as string[] : []}
                            onChange={handleChangeTagInput}
                            isReadOnly={!isEditEnabled && isFieldReadOnly(field.name)}
                        />
                    ) : (
                        // @ts-expect-error
                        renderFieldReadView(field.label, Array.isArray(profileData[field.name]) ? profileData[field.name].join(", ") : String(profileData[field.name] ?? ""), field.icon, field.name)
                    )
                );

            case "checkbox":
                return (
                    isEditEnabled ? (
                        <Checkbox
                            id={field.name}
                            name={field.name}
                            isChecked={!!profileData[field.name] || false}
                            onChange={handleChange}
                            isDisabled={!isEditEnabled && isFieldReadOnly(field.name)}
                        >
                            {field.label}
                        </Checkbox>
                    ) : (
                        renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name)
                    )
                );

            case "city":
                return isEditEnabled ? <CitySelect /> : renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name);

            default:
                return null;
        }
    };


    const handleSave = (sectionId: string) => {
        setLoading(true);
        userProfileService.updatePartnerPreferences(draftProfileData ?? {}).then((response) => {
            if (response.error || !response?.response) {
                toast({
                    title: "Error",
                    description: "Failed to update profile",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                });
                setLoading(false);
            } else {
                setIsEditMode((isEditMode) => ({ ...isEditMode, [sectionId]: false }));
                toast({
                    title: "Success",
                    description: "Profile updated successfully",
                    status: "success",
                    duration: 1000,
                    isClosable: true,
                });
                fetchPartnerPreferences();
                setLoading(false);
            }
        });
    };

    const handleDiscard = (sectionId: string) => {
        setIsEditMode((isEditMode) => ({ ...isEditMode, [sectionId]: false }));
        // Discard logic goes here (e.g., revert changes)
    };

    const handleEdit = (sectionId: string) => {
        setIsEditMode((isEditMode) => ({ ...isEditMode, [sectionId]: true }));

    }

    const loadingOnlyBoxProps = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column" as const
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
                            _loading={{ opacity: 0.5 }}
                            minH={300}
                            {...(loading ? loadingOnlyBoxProps : {})}

                        >
                            {!loading && <>
                                <Flex justifyContent={"space-between"} alignItems={"flex-start"} mb={4}>
                                    <FormLabel fontSize="lg" fontWeight="bold">
                                        {section.section}
                                    </FormLabel>
                                    {!isEditMode[section.section] && <Box _hover={{ cursor: 'pointer' }} as={FaEdit} color={theme.colors.accent[500]} onClick={() => handleEdit(section.section)} />}
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
                                        <Button onClick={() => handleSave(section.section)} size={"sm"} bg={theme.colors.accent[500]} color="white" isLoading={loading}>Save</Button>
                                        <Button onClick={() => handleDiscard(section.section)} size={"sm"} bg={theme.colors.accent[800]} colorScheme="red">
                                            Discard
                                        </Button>
                                    </HStack>
                                )}
                            </>}

                            {loading && <Spinner size="xl" color="pink.500" />}

                        </Box>
                    ))}
                </VStack>
            </form>
        </Box>
    );
};

export default PartnerPreferences;
