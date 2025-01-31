import React, { useState, useEffect } from 'react';
import { Select, FormControl, FormLabel, Input, Button, VStack, HStack, Box, Textarea, RadioGroup, Radio, Stack, FormErrorMessage } from '@chakra-ui/react';
import CitySelect from './CitySelect';

type ProfileData = {
    firstName: string;
    lastName: string;
    dob: string | null;
    gender: string;
    officialEmail: string;
    isOfficialEmailVerified: boolean;
    isAadharVerified: boolean;
    isPhoneVerified: boolean;
    height: string | null;
    favInterest: string[];
    causesYouSupport: string[];
    qualityYouValue: string[];
    exercise: string;
    educationLevel: string[];
    currentCity: string;
    hometown: string;
    drinking: string;
    smoking: string;
    lookingFor: string;
    settleDownInMonths: string;
    haveKids: boolean;
    wantsKids: boolean;
    starSign: string;
    pronoun: string;
};

const enums = {
    gender: [
        { label: 'Male', id: 'Male' },
        { label: 'Female', id: 'Female' },
        { label: 'Other', id: 'Other' },
    ],
    exercise: [
        { label: 'Heavy', id: 'Heavy' },
        { label: 'Light', id: 'Light' },
        { label: 'Moderate', id: 'Moderate' },
        { label: 'None', id: 'None' },
    ],
    educationLevel: [
        { label: 'Graduate', id: 'Graduate' },
        { label: 'High School', id: 'High School' },
        { label: 'Postgraduate', id: 'Postgraduate' },
        { label: 'Undergraduate', id: 'Undergraduate' },
    ],
    drinking: [
        { label: 'Never', id: 'Never' },
        { label: 'Occasionally', id: 'Occasionally' },
        { label: 'Regularly', id: 'Regularly' },
    ],
    smoking: [
        { label: 'Never', id: 'Never' },
        { label: 'Occasionally', id: 'Occasionally' },
        { label: 'Regularly', id: 'Regularly' },
    ],
    lookingFor: [
        { label: 'Casual', id: 'Casual' },
        { label: 'Friendship', id: 'Friendship' },
        { label: 'Relationship', id: 'Relationship' },
    ],
    settleDownInMonths: [
        { label: '0-6', id: '0-6' },
        { label: '6-12', id: '6-12' },
        { label: '12-24', id: '12-24' },
        { label: '24+', id: '24+' },
    ],
    starSign: [
        { label: 'Aquarius', id: 'Aquarius' },
        { label: 'Aries', id: 'Aries' },
        { label: 'Cancer', id: 'Cancer' },
        { label: 'Capricorn', id: 'Capricorn' },
        { label: 'Gemini', id: 'Gemini' },
        { label: 'Leo', id: 'Leo' },
        { label: 'Libra', id: 'Libra' },
        { label: 'Pisces', id: 'Pisces' },
        { label: 'Sagittarius', id: 'Sagittarius' },
        { label: 'Scorpio', id: 'Scorpio' },
        { label: 'Taurus', id: 'Taurus' },
        { label: 'Virgo', id: 'Virgo' },
    ],
    pronoun: [
        { label: 'He/Him', id: 'He/Him' },
        { label: 'She/Her', id: 'She/Her' },
        { label: 'They/Them', id: 'They/Them' },
        { label: 'Other', id: 'Other' },
    ],
};

const ProfileForm: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        officialEmail: '',
        isOfficialEmailVerified: false,
        isAadharVerified: false,
        isPhoneVerified: false,
        height: '',
        favInterest: [],
        causesYouSupport: [],
        qualityYouValue: [],
        exercise: '',
        educationLevel: [],
        currentCity: '',
        hometown: '',
        drinking: '',
        smoking: '',
        lookingFor: '',
        settleDownInMonths: '',
        haveKids: false,
        wantsKids: false,
        starSign: '',
        pronoun: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Function to fetch city names (use an API endpoint to search cities)
    const loadCities = async (inputValue: string) => {
        const response = await fetch(`https://api.example.com/cities?search=${inputValue}`);
        const data = await response.json();
        return data.map((city: { name: string }) => ({
            label: city.name,
            value: city.name,
        }));
    };

    return (
        <Box maxW="900px" margin="0 auto" padding="4">
            <form>
                <VStack spacing={4} align="stretch">
                    {/* Personal Information */}
                    <Box>
                        <FormLabel fontSize="lg">Personal Information</FormLabel>
                        <HStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel htmlFor="firstName">First Name</FormLabel>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </HStack>
                        <FormControl isRequired>
                            <FormLabel htmlFor="officialEmail">Email</FormLabel>
                            <Input
                                id="officialEmail"
                                name="officialEmail"
                                type="email"
                                value={profileData.officialEmail}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </Box>

                    {/* Gender Dropdown */}
                    <Box>
                        <FormLabel fontSize="lg">Gender</FormLabel>
                        <FormControl isRequired>
                            <Select
                                id="gender"
                                name="gender"
                                value={profileData.gender}
                                onChange={handleChange}
                            >
                                {enums.gender.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Education Level MultiSelect Dropdown */}
                    <Box>
                        <FormLabel fontSize="lg">Education Level</FormLabel>
                        <FormControl>
                            <Select
                                id="educationLevel"
                                name="educationLevel"
                                value={profileData.educationLevel}
                                onChange={handleChange}
                                multiple
                            >
                                {enums.educationLevel.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* City Search Dropdown */}
                    <Box>
                        <FormLabel fontSize="lg">Current City</FormLabel>
                        <FormControl>

                            <CitySelect />
                        </FormControl>
                    </Box>

                    {/* Hometown Search Dropdown */}
                    <Box>
                        <FormLabel fontSize="lg">Hometown</FormLabel>
                        <FormControl>
                            <CitySelect />
                        </FormControl>
                    </Box>

                    {/* Submit Button */}
                    <HStack spacing={4} justify="center">
                        <Button colorScheme="blue" type="submit">
                            Save
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
};

export default ProfileForm;
