// apps/frontend/src/mvp/login-signup/components/SignupForm.tsx
import React, { useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    HStack,
    Alert,
    AlertIcon,
    InputGroup,
    InputRightElement,
    IconButton,
    Box,
    Link,
    Checkbox,
    useToast,
    Progress,
    Badge,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, CheckIcon } from "@chakra-ui/icons";
import { FaHeart } from "react-icons/fa";
import authService from "../../../service/authService";
import { useAuthStore } from "../store/authStore";

interface SignupFormProps {
    onLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onLogin }) => {
    const {
        hideAllModals,
        showLogin,
        setLoading,
        setError,
        clearError,
        isLoading,
        error
    } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const [verificationCode, setVerificationCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [step, setStep] = useState<'details' | 'verification' | 'password'>('details');

    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
        verificationCode?: string;
        terms?: string;
    }>({});

    const toast = useToast();

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        strength = Object.values(checks).filter(Boolean).length;
        return { strength, checks };
    };

    const validateStep = (currentStep: typeof step) => {
        const errors: typeof fieldErrors = {};

        if (currentStep === 'details') {
            if (!formData.email.trim()) {
                errors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = "Please enter a valid email";
            }

            if (!formData.agreeToTerms) {
                errors.terms = "Please agree to our terms";
            }
        }

        if (currentStep === 'verification') {
            if (!verificationCode.trim()) {
                errors.verificationCode = "Verification code is required";
            } else if (verificationCode.length < 4) {
                errors.verificationCode = "Please enter the complete code";
            }
        }

        if (currentStep === 'password') {
            if (!formData.password.trim()) {
                errors.password = "Password is required";
            } else if (formData.password.length < 8) {
                errors.password = "Password must be at least 8 characters";
            }

            if (!formData.confirmPassword.trim()) {
                errors.confirmPassword = "Please confirm your password";
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords don't match";
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSendCode = async () => {
        clearError();
        setFieldErrors({});

        if (!validateStep('details')) return;

        setLoading(true);

        try {
            const response = await authService.sendEmailCode({
                to: [{ email: formData.email.trim(), name: formData.email.trim() }],
                type: "verifyEmail"
            });

            if (response.error) {
                setError("Failed to send verification code. Please try again.");
                return;
            }

            setIsCodeSent(true);
            setStep('verification');

            toast({
                title: "Code sent! 📧",
                description: "Check your email for the verification code",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        clearError();
        setFieldErrors({});

        if (!validateStep('verification')) return;

        // For now, we'll skip actual verification and move to password step
        setIsVerified(true);
        setStep('password');

        toast({
            title: "Email verified! ✅",
            description: "Now create a secure password",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
        });
    };

    const handleSignup = async () => {
        clearError();
        setFieldErrors({});

        if (!validateStep('password')) return;

        setLoading(true);

        try {
            const response = await authService.register(
                formData.password,
                formData.email.trim(),
                verificationCode
            );

            if (!response.error) {
                hideAllModals();
                showLogin();

                toast({
                    title: "Account created! 🎉",
                    description: "Please sign in to start your dating journey",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            } else {
                setError("Failed to create account. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field as keyof typeof fieldErrors]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const getStepProgress = () => {
        if (step === 'details') return 33;
        if (step === 'verification') return 66;
        return 100;
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <VStack spacing={6} w="full">
            {/* Progress Bar */}
            <Box w="full">
                <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Step {step === 'details' ? '1' : step === 'verification' ? '2' : '3'} of 3
                    </Text>
                    <Text fontSize="sm" color="brand.500" fontWeight="medium">
                        {getStepProgress()}% Complete
                    </Text>
                </HStack>
                <Progress
                    value={getStepProgress()}
                    size="sm"
                    colorScheme="brand"
                    borderRadius="full"
                    bg="brand.100"
                />
            </Box>

            {/* Step 1: Email & Agreement */}
            {step === 'details' && (
                <VStack spacing={4} w="full" className="fade-in">
                    <FormControl isInvalid={!!fieldErrors.email}>
                        <FormLabel color="gray.700" fontWeight="medium">
                            Email Address
                        </FormLabel>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your@email.com"
                            size="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: "gray.400" }}
                            _focus={{
                                borderColor: "brand.500",
                                boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                            }}
                        />
                        {fieldErrors.email && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {fieldErrors.email}
                            </Text>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!fieldErrors.terms}>
                        <Checkbox
                            isChecked={formData.agreeToTerms}
                            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                            colorScheme="brand"
                            size="md"
                        >
                            <Text fontSize="sm" color="gray.600">
                                I agree to the{" "}
                                <Link color="brand.500" fontWeight="semibold" href="/tnc" target="_blank">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link color="brand.500" fontWeight="semibold" href="/privacy-policy" target="_blank">
                                    Privacy Policy
                                </Link>
                            </Text>
                        </Checkbox>
                        {fieldErrors.terms && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {fieldErrors.terms}
                            </Text>
                        )}
                    </FormControl>

                    <Button
                        variant="love"
                        size="lg"
                        w="full"
                        rightIcon={<FaHeart />}
                        onClick={handleSendCode}
                        isLoading={isLoading}
                        loadingText="Sending code..."
                        cursor="pointer"
                    >
                        Send Verification Code
                    </Button>
                </VStack>
            )}

            {/* Step 2: Email Verification */}
            {step === 'verification' && (
                <VStack spacing={4} w="full" className="fade-in">
                    <Box textAlign="center" mb={2}>
                        <Text fontSize="md" color="gray.600" mb={1}>
                            We sent a verification code to
                        </Text>
                        <Badge variant="subtle" colorScheme="brand" fontSize="sm" px={3} py={1}>
                            {formData.email}
                        </Badge>
                    </Box>

                    <FormControl isInvalid={!!fieldErrors.verificationCode}>
                        <FormLabel color="gray.700" fontWeight="medium">
                            Verification Code
                        </FormLabel>
                        <Input
                            value={verificationCode}
                            onChange={(e) => {
                                setVerificationCode(e.target.value);
                                if (fieldErrors.verificationCode) {
                                    setFieldErrors(prev => ({ ...prev, verificationCode: undefined }));
                                }
                            }}
                            placeholder="Enter 6-digit code"
                            size="lg"
                            textAlign="center"
                            letterSpacing="0.2em"
                            fontSize="lg"
                            maxLength={6}
                            borderColor="gray.300"
                            _hover={{ borderColor: "gray.400" }}
                            _focus={{
                                borderColor: "brand.500",
                                boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                            }}
                        />
                        {fieldErrors.verificationCode && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {fieldErrors.verificationCode}
                            </Text>
                        )}
                    </FormControl>

                    <HStack w="full" spacing={3}>
                        <Button
                            variant="outline"
                            size="lg"
                            flex={1}
                            onClick={() => setStep('details')}
                            cursor="pointer"
                        >
                            Back
                        </Button>
                        <Button
                            variant="love"
                            size="lg"
                            flex={2}
                            rightIcon={<CheckIcon />}
                            onClick={handleVerifyCode}
                            isLoading={isLoading}
                            loadingText="Verifying..."
                            cursor="pointer"
                        >
                            Verify Email
                        </Button>
                    </HStack>
                </VStack>
            )}

            {/* Step 3: Password Creation */}
            {step === 'password' && (
                <VStack spacing={4} w="full" className="fade-in">
                    <FormControl isInvalid={!!fieldErrors.password}>
                        <FormLabel color="gray.700" fontWeight="medium">
                            Create Password
                        </FormLabel>
                        <InputGroup size="lg">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Choose a strong password"
                                borderColor="gray.300"
                                _hover={{ borderColor: "gray.400" }}
                                _focus={{
                                    borderColor: "brand.500",
                                    boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                                }}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPassword(!showPassword)}
                                    cursor="pointer"
                                />
                            </InputRightElement>
                        </InputGroup>

                        {formData.password && (
                            <Box mt={2}>
                                <HStack justify="space-between" mb={1}>
                                    <Text fontSize="xs" color="gray.600">Password strength</Text>
                                    <Text fontSize="xs" color={
                                        passwordStrength.strength < 3 ? "red.500" :
                                            passwordStrength.strength < 4 ? "orange.500" : "green.500"
                                    }>
                                        {passwordStrength.strength < 3 ? "Weak" :
                                            passwordStrength.strength < 4 ? "Good" : "Strong"}
                                    </Text>
                                </HStack>
                                <Progress
                                    value={(passwordStrength.strength / 5) * 100}
                                    size="xs"
                                    borderRadius="full"
                                    colorScheme={
                                        passwordStrength.strength < 3 ? "red" :
                                            passwordStrength.strength < 4 ? "orange" : "green"
                                    }
                                />
                            </Box>
                        )}

                        {fieldErrors.password && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {fieldErrors.password}
                            </Text>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!fieldErrors.confirmPassword}>
                        <FormLabel color="gray.700" fontWeight="medium">
                            Confirm Password
                        </FormLabel>
                        <InputGroup size="lg">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="Confirm your password"
                                borderColor="gray.300"
                                _hover={{ borderColor: "gray.400" }}
                                _focus={{
                                    borderColor: "brand.500",
                                    boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                                }}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    cursor="pointer"
                                />
                            </InputRightElement>
                        </InputGroup>
                        {fieldErrors.confirmPassword && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {fieldErrors.confirmPassword}
                            </Text>
                        )}
                    </FormControl>

                    <HStack w="full" spacing={3}>
                        <Button
                            variant="outline"
                            size="lg"
                            flex={1}
                            onClick={() => setStep('verification')}
                            cursor="pointer"
                        >
                            Back
                        </Button>
                        <Button
                            variant="love"
                            size="lg"
                            flex={2}
                            rightIcon={<FaHeart />}
                            onClick={handleSignup}
                            isLoading={isLoading}
                            loadingText="Creating account..."
                            className="heart-beat"
                            cursor="pointer"
                        >
                            Create Account
                        </Button>
                    </HStack>
                </VStack>
            )}

            {/* Error Alert */}
            {error && (
                <Alert status="error" borderRadius="lg" className="fade-in">
                    <AlertIcon />
                    <Text fontSize="sm">{error}</Text>
                </Alert>
            )}

            {/* Login Link */}
            <Text fontSize="sm" color="gray.600" textAlign="center">
                Already have an account?{" "}
                <Link
                    color="brand.500"
                    fontWeight="semibold"
                    onClick={onLogin}
                    _hover={{
                        color: "brand.600",
                        textDecoration: "underline"
                    }}
                    cursor="pointer"
                >
                    Sign in
                </Link>
            </Text>
        </VStack>
    );
};

export default SignupForm;