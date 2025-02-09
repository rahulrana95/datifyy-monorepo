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
import { ActivityLevel, Sports, ChildrenPreference, Currency, DatifyyUserPartnerPreferences, DrinkingPreference, EducationLevel, FamousInterests, GenderPreference, Hobbies, MaritalStatus, PersonalityTraits, PetPreference, Profession, RelationshipGoals, SmokingPreference } from "./types";
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


export enum FormFieldType {
    Text = "text",
    Email = "email",
    Date = "date",
    Number = "number",
    Select = "select",
    MultiSelect = "multi-select",
    MultiSelectText = "multi-select-text",
    Checkbox = "checkbox",
    City = "city",
    Image = "image",
    TextArea = "textarea",
}


export interface FormField {
    name: keyof DatifyyUserPartnerPreferences;
    label: string;
    icon?: any;
    type: FormFieldType;
    options?: string[];
}

interface FormSection {
    section: string;
    fields: FormField[][];
}


enum FieldNames {
    GENDER_PREFERENCE = "genderPreference",
    MIN_AGE = "minAge",
    MAX_AGE = "maxAge",
    MIN_HEIGHT = "minHeight",
    MAX_HEIGHT = "maxHeight",
    LOCATION_PREFERENCE = "locationPreference",
    LOCATION_PREFERENCE_RADIUS = "locationPreferenceRadius",
    RELIGION = "religion",
    EDUCATION_LEVEL = "educationLevel",
    PROFESSION = "profession",
    MIN_INCOME = "minIncome",
    MAX_INCOME = "maxIncome",
    CURRENCY = "currency",
    SMOKING_PREFERENCE = "smokingPreference",
    DRINKING_PREFERENCE = "drinkingPreference",
    MARITAL_STATUS = "maritalStatus",
    CHILDREN_PREFERENCE = "childrenPreference",
    HOBBIES = "hobbies",
    INTERESTS = "interests",
    BOOKS_READING = "booksReading",
    MUSIC = "music",
    MOVIES = "movies",
    TRAVEL = "travel",
    SPORTS = "sports",
    PERSONALITY_TRAITS = "personalityTraits",
    RELATIONSHIP_GOALS = "relationshipGoals",
    LIFESTYLE_PREFERENCE = "lifestylePreference",
    ACTIVITY_LEVEL = "activityLevel",
    PET_PREFERENCE = "petPreference",
    RELIGION_COMPATIBILITY_SCORE = "religionCompatibilityScore",
    INCOME_COMPATIBILITY_SCORE = "incomeCompatibilityScore",
    EDUCATION_COMPATIBILITY_SCORE = "educationCompatibilityScore",
    APPEARANCE_COMPATIBILITY_SCORE = "appearanceCompatibilityScore",
    PERSONALITY_COMPATIBILITY_SCORE = "personalityCompatibilityScore",
    VALUES_COMPATIBILITY_SCORE = "valuesCompatibilityScore",
    MATCHING_SCORE = "matchingScore",
    WHAT_OTHER_PERSON_SHOULD_KNOW = "whatOtherPersonShouldKnow",


}


const formConfig: FormSection[] = [
    {
        section: "Partner Preferences",
        fields: [
            [
                {
                    name: FieldNames.GENDER_PREFERENCE,
                    label: "Gender Preference",
                    type: FormFieldType.Select,
                    icon: fieldIcons.genderPreference,
                    options: Object.values(GenderPreference)
                },
                { name: FieldNames.MIN_AGE, label: "Min Age", type: FormFieldType.Number, icon: fieldIcons.minAge },
                { name: FieldNames.MAX_AGE, label: "Max Age", type: FormFieldType.Number, icon: fieldIcons.minAge },
                { name: FieldNames.MIN_HEIGHT, label: "Min Height", type: FormFieldType.Text, icon: fieldIcons.minAge },
                { name: FieldNames.MAX_HEIGHT, label: "Max Height", type: FormFieldType.Text, icon: fieldIcons.minAge },
                {
                    name: FieldNames.LOCATION_PREFERENCE,
                    label: "Location Preference",
                    type: FormFieldType.City,
                    icon: fieldIcons.minAge,
                },
                {
                    name: FieldNames.LOCATION_PREFERENCE_RADIUS,
                    label: "Location Radius",
                    type: FormFieldType.Number,
                    icon: fieldIcons.minAge,
                },
            ],
            [
                {
                    name: FieldNames.RELIGION,
                    label: "Religion",
                    type: FormFieldType.Text,
                    icon: fieldIcons.minAge,
                },
                {
                    name: FieldNames.EDUCATION_LEVEL,
                    label: "Education Level",
                    type: FormFieldType.MultiSelect,
                    icon: fieldIcons.educationLevel,
                    options: Object.values(EducationLevel),
                },
                {
                    name: FieldNames.PROFESSION,
                    label: "Preferred Professions",
                    type: FormFieldType.MultiSelect,
                    icon: fieldIcons.minAge,
                    options: Object.values(Profession),
                },
                { name: FieldNames.MIN_INCOME, label: "Min Income", type: FormFieldType.Number, icon: fieldIcons.minAge },
                { name: FieldNames.MAX_INCOME, label: "Max Income", type: FormFieldType.Number, icon: fieldIcons.minAge },
                {
                    name: FieldNames.CURRENCY,
                    label: "Currency",
                    type: FormFieldType.Select,
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
                    name: FieldNames.SMOKING_PREFERENCE,
                    label: "Smoking Preference",
                    type: FormFieldType.Select,
                    icon: fieldIcons.smokingPreference,
                    options: Object.values(SmokingPreference),
                },
                {
                    name: FieldNames.DRINKING_PREFERENCE,
                    label: "Drinking Preference",
                    type: FormFieldType.Select,
                    icon: fieldIcons.drinkingPreference,
                    options: Object.values(DrinkingPreference),
                },
                {
                    name: FieldNames.MARITAL_STATUS,
                    label: "Marital Status",
                    type: FormFieldType.Select,
                    icon: fieldIcons.minAge,
                    options: Object.values(MaritalStatus),
                },
                {
                    name: FieldNames.CHILDREN_PREFERENCE,
                    label: "Children Preference",
                    type: FormFieldType.Select,
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
                { name: FieldNames.HOBBIES, label: "Hobbies", type: FormFieldType.MultiSelect, icon: fieldIcons.hobbies, options: Object.values(Hobbies) },
                { name: FieldNames.INTERESTS, label: "Interests", type: FormFieldType.MultiSelect, icon: fieldIcons.interests, options: Object.values(FamousInterests) },
                { name: FieldNames.BOOKS_READING, label: "Books", type: FormFieldType.MultiSelectText, icon: fieldIcons.minAge, },
                { name: FieldNames.MUSIC, label: "Music", type: FormFieldType.MultiSelectText, icon: fieldIcons.minAge },
                { name: FieldNames.MOVIES, label: "Movies", type: FormFieldType.MultiSelectText, icon: fieldIcons.minAge },
            ],
            [
                { name: FieldNames.TRAVEL, label: "Travel", type: FormFieldType.MultiSelectText, icon: fieldIcons.minAge },
                { name: FieldNames.SPORTS, label: "Sports", type: FormFieldType.MultiSelect, icon: fieldIcons.minAge, options: Object.values(Sports) },
            ],
        ],
    },
    {
        section: "Personality & Lifestyle",
        fields: [
            [
                { name: "personalityTraits", label: "Personality Traits", type: FormFieldType.MultiSelect, icon: fieldIcons.minAge, options: Object.values(PersonalityTraits) },
                { name: "relationshipGoals", label: "Relationship Goals", type: FormFieldType.Select, icon: fieldIcons.minAge, options: Object.values(RelationshipGoals) },
                { name: "lifestylePreference", label: "Lifestyle Preference", type: FormFieldType.MultiSelectText, icon: fieldIcons.minAge },
                { name: "activityLevel", label: "Activity Level", type: FormFieldType.Select, icon: fieldIcons.minAge, options: Object.values(ActivityLevel) },
                { name: "petPreference", label: "Pet Preference", type: FormFieldType.Select, icon: fieldIcons.minAge, options: Object.values(PetPreference) },
            ],
        ],
    },
    // {
    //     section: "Compatibility",
    //     fields: [
    //         [
    //             { name: "religionCompatibilityScore", label: "Religion Compatibility", type: FormFieldType.Number, icon: fieldIcons.minAge },
    //             { name: "incomeCompatibilityScore", label: "Income Compatibility", type: FormFieldType.Number, icon: fieldIcons.minAge },
    //             { name: "educationCompatibilityScore", label: "Education Compatibility", type: FormFieldType.Number, icon: fieldIcons.minAge },
    //         ],
    //         [
    //             { name: "appearanceCompatibilityScore", label: "Appearance Compatibility", type: FormFieldType.Number, icon: fieldIcons.minAge },
    //             { name: "personalityCompatibilityScore", label: "Personality Compatibility", type: FormFieldType.Number, icon: fieldIcons.minAge },
    //             { name: "valuesCompatibilityScore", label: "Values Compatibility", type: FormFieldType.Number, icon: fieldIcons.minAge },
    //             { name: "matchingScore", label: "Overall Match Score", type: FormFieldType.Number, icon: fieldIcons.minAge },
    //         ],
    //     ],
    // },
    {
        section: "Additional Details",
        fields: [
            [
                { name: "whatOtherPersonShouldKnow", label: "What They Should Know", type: FormFieldType.TextArea, icon: fieldIcons.minAge },
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

    const getValue = (type: string, name: keyof DatifyyUserPartnerPreferences, value: string | boolean) => {

        if (type === "multi-select" || type === "multi-select-text") {
            if (Array.isArray(profileData[name])) {
                // ure about array value
                // @ts-expect-error
                return [...profileData[name], value];
            }

            return [value];

        }

        return value;
    }



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setDraftProfileData((prev: Partial<DatifyyUserPartnerPreferences> | null) => ({
            ...prev,
            [name]: getValue(type, name as keyof DatifyyUserPartnerPreferences, type === 'checked' ? checked : value),
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

        let suffixText = <></>;
        let prefixText = <></>;

        if (fieldName === FieldNames.MIN_INCOME || fieldName === FieldNames.MAX_INCOME) {
            const currency = profileData.currency;
            let suffix = "Lakhs";
            if (currency !== Currency.INR) {
                suffix = "K";
            }
            suffixText = <Text fontSize={10} color={"gray.500"}>{suffix}</Text>;
        }

        if (fieldName === FieldNames.MIN_HEIGHT || fieldName === FieldNames.MAX_HEIGHT) {
            suffixText = <Text fontSize={10} color={"gray.500"}>cm</Text>;
        }

        if (fieldName === FieldNames.MIN_AGE || fieldName === FieldNames.MAX_AGE) {
            suffixText = <Text fontSize={10} color={"gray.500"}>years</Text>;
        }

        if (fieldName === FieldNames.LOCATION_PREFERENCE_RADIUS) {
            suffixText = <Text fontSize={10} color={"gray.500"}>Kms</Text>;
        }

        if (fieldName === FieldNames.TRAVEL) {
            prefixText = <Text fontSize={10} color={"gray.500"}>Countries/Cities Travelled</Text>;
        }

        if (fieldName === FieldNames.MUSIC) {
            prefixText = <Text fontSize={10} color={"gray.500"}>Artist / Genre</Text>;
        }

        if (fieldName === FieldNames.BOOKS_READING) {
            prefixText = <Text fontSize={10} color={"gray.500"}>Books you read</Text>;
        }

        if (fieldName === FieldNames.MOVIES) {
            prefixText = <Text fontSize={10} color={"gray.500"}>Movies / Genre you loved to watch</Text>;
        }

        return <Flex justifyContent="space-between" alignItems={"center"} border={"1px solid"} padding={4} pt={2} pb={2} borderColor={"gray.200"} borderRadius={8} fontSize={12} width={"100%"}>
            <HStack>
                <Box as={icon} mr={2} />
                <Text>{text}</Text>
            </HStack>
            <Flex gap={1} alignItems={"center"} direction={"column"}>
                {prefixText}
                <Text>{newValue}</Text>
                {suffixText}
            </Flex>

        </Flex>
    }

    const onChangeCity = (name: string, city: string) => {
        setDraftProfileData((prev: Partial<DatifyyUserPartnerPreferences> | null) => ({
            ...prev,
            [name]: city,
        }));
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
                            value={String(draftProfileData?.[field.name] ?? profileData[field.name] ?? "")}
                            onChange={handleChange}
                            isReadOnly={!isEditEnabled || isFieldReadOnly(field.name)}
                        />
                    ) : (
                        renderFieldReadView(field.label, String(draftProfileData?.[field.name] ?? profileData[field.name] ?? ""), field.icon, field.name)
                    )
                );

            case "select":
                return (
                    isEditEnabled ? (
                        <Select
                            id={field.name}
                            name={field.name}
                            value={String(draftProfileData?.[field.name] ?? profileData[field.name] ?? "")}
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
                            value={Array.isArray(draftProfileData?.[field.name] ?? profileData[field.name]) ? (draftProfileData?.[field.name] as string[] ?? profileData[field.name] as string[]) : []}
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
                            value={Array.isArray(draftProfileData?.[field.name] ?? profileData[field.name]) ? (draftProfileData?.[field.name] as string[] ?? profileData[field.name] as string[]) : []}
                            onChange={handleChangeTagInput}
                            isReadOnly={!isEditEnabled && isFieldReadOnly(field.name)}
                        />
                    ) : (
                        // @ts-expect-error
                        renderFieldReadView(field.label, Array.isArray(profileData[field.name]) ? profileData[field.name].join(", ") : String(profileData[field.name] ?? ""), field.icon, field.name)
                    )
                );
            // return "not implemented";

            case "checkbox":
                return (
                    isEditEnabled ? (
                        <Checkbox
                            id={field.name}
                            name={field.name}
                            isChecked={Boolean(draftProfileData?.[field.name]) ?? !!profileData[field.name] ?? false}
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
                return isEditEnabled ? <CitySelect value={draftProfileData?.[field.name] ?? profileData?.[field.name]} onChangeCity={(location) => onChangeCity(field.name, location)} /> : renderFieldReadView(field.label, String(profileData[field.name] ?? ""), field.icon, field.name);

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
