// apps/frontend/src/mvp/login-signup/components/ForgotPasswordForm.tsx
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
    Progress,
    Badge,
    useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, CheckIcon } from "@chakra-ui/icons";
import { FaHeart, FaEnvelope, FaLock } from "react-icons/fa";
import authService from "../../../service/authService";
import { useAuthStore } from "../store/authStore";

interface ForgotPasswordFormProps {
    onLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onLogin }) => {
    const {
        setLoading,
        setError,
        clearError,
        isLoading,
        error
    } = useAuthStore();

    const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
        code?: string;
        password?: string;
        confirmPassword?: string;
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

        if (currentStep === 'email') {
            if (!email.trim()) {
                errors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                errors.email = "Please enter a valid email";
            }
        }

        if (currentStep === 'code') {
            if (!code.trim()) {
                errors.code = "Reset code is required";
            } else if (code.length < 4) {
                errors.code = "Please enter the complete code";
            }
        }

        if (currentStep === 'password') {
            if (!newPassword.trim()) {
                errors.password = "New password is required";
            } else if (newPassword.length < 8) {
                errors.password = "Password must be at least 8 characters";
            }

            if (!confirmPassword.trim()) {
                errors.confirmPassword = "Please confirm your password";
            } else if (newPassword !== confirmPassword) {
                errors.confirmPassword = "Passwords don't match";
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSendCode = async () => {
        clearError();
        setFieldErrors({});

        if (!validateStep('email')) return;

        setLoading(true);

        try {
            const response = await authService.sendForgotPasswordCode(email.trim());

            if (response.error) {
                setError("Failed to send reset code. Please check your email and try again.");
                return;
            }

            setStep('code');
            toast({
                title: "Reset code sent! 📧",
                description: "Check your email for the password reset code",
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

    const handleVerifyCode = () => {
        clearError();
        setFieldErrors({});

        if (!validateStep('code')) return;

        // Move to password reset step
        setStep('password');

        toast({
            title: "Code verified! ✅",
            description: "Now create your new password",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
        });
    };

    const handleResetPassword = async () => {
        clearError();
        setFieldErrors({});

        if (!validateStep('password')) return;

        setLoading(true);

        try {
            const response = await authService.resetPassword({
                token: code,
                newPassword
            });

            if (response.error) {
                setError("Failed to reset password. Please try again.");
                return;
            }

            toast({
                title: "Password reset successful! 🎉",
                description: "You can now sign in with your new password",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });

            onLogin(); // Redirect to login
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStepProgress = () => {
        if (step === 'email') return 33;
        if (step === 'code') return 66;
        return 100;
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <VStack spacing={6} w="full">
            {/* Progress Bar */}
            <Box w="full">
                <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Step {step === 'email' ? '1' : step === 'code' ? '2' : '3'} of 3
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

            {/* Step 1: Email */}
            {step === 'email' && (
                <VStack spacing={4} w="full" className="fade-in">
                    <Box textAlign="center" mb={2}>
                        <Text fontSize="md" color="gray.600">
                            Enter your email address and we'll send you a reset code
                        </Text>
                    </Box>

                    <FormControl isInvalid={!!fieldErrors.email}>
                        <FormLabel color="gray.700" fontWeight="medium">
                            Email Address
                        </FormLabel>
                        <InputGroup size="lg">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) {
                                        setFieldErrors(prev => ({ ...prev, email: undefined }));
                                    }
                                }}
                                placeholder="your@email.com"
                                borderColor="gray.300"
                                _hover={{ borderColor: "gray.400" }}
                                _focus={{
                                    borderColor: "brand.500",
                                    boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                                }}
                            />
                            <InputRightElement>
                                <FaEnvelope color="gray.400" />
                            </InputRightElement>
                        </InputGroup>
                        {fieldErrors.email && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {fieldErrors.email}
                            </Text>
                        )}
                    </FormControl>

                    <Button
                        variant="love"
                        size="lg"
                        w="full"
                        rightIcon={<FaEnvelope />}
                        onClick={handleSendCode}
                        isLoading={isLoading}
                        loadingText="Sending code..."
                        cursor="pointer"
                    >
                        Send Reset Code
                    </Button>
                </VStack>
            )}

            {/* Step 2: Verification Code */}
            {step === 'code' && (
                <VStack spacing={4} w="full" className="fade-in">
                    <Box textAlign="center" mb={2}>
                        <Text fontSize="md" color="gray.600" mb={1}>
                            We sent a reset code to
                        </Text>
                        <Badge variant="subtle" colorScheme="brand" fontSize="sm" px={3} py={1}>
                            {email}
                        </Badge>
                    </Box>

                    <FormControl isInvalid={!!fieldErrors.code}>
                        <FormLabel color="gray.700" fontWeight="medium">
                            Reset Code
                        </FormLabel>
                        <Input
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                if (fieldErrors.code) {
                                    setFieldErrors(prev => ({ ...prev, code: undefined }));
                                }
                            }}
                            placeholder="Enter reset code"
                            size="lg"
                            textAlign="center"
                            letterSpacing="0.2em"
                            fontSize="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: "gray.400" }}
                            _focus={{
                                borderColor: "brand.500",
                                boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                            }}
                        />
                        {fieldErrors.code && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                                {fieldErrors.code}
                            </Text>
                        )}
                    </FormControl>

                    <HStack w="full" spacing={3}>
                        <Button
                            variant="outline"
                            size="lg"
                            flex={1}
                            onClick={() => setStep('email')}
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
                            cursor="pointer"
                        >
                            Verify Code
                        </Button>
                    </HStack>
                </VStack>
            )}

            {/* Step 3: New Password */}
            {step === 'password' && (
                <VStack spacing={4} w="full" className="fade-in">
                    <Box textAlign="center" mb={2}>
                        <Text fontSize="md" color="gray.600">
                            Create a new secure password for your account
                        </Text>
                    </Box>

                    <FormControl isInvalid={!!fieldErrors.password}>
                        <FormLabel color="gray.700" fontWeight="medium">
                            New Password
                        </FormLabel>
                        <InputGroup size="lg">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if (fieldErrors.password) {
                                        setFieldErrors(prev => ({ ...prev, password: undefined }));
                                    }
                                }}
                                placeholder="Enter new password"
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

                        {newPassword && (
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
                            Confirm New Password
                        </FormLabel>
                        <InputGroup size="lg">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (fieldErrors.confirmPassword) {
                                        setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                                    }
                                }}
                                placeholder="Confirm new password"
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
                            onClick={() => setStep('code')}
                            cursor="pointer"
                        >
                            Back
                        </Button>
                        <Button
                            variant="love"
                            size="lg"
                            flex={2}
                            rightIcon={<FaLock />}
                            onClick={handleResetPassword}
                            isLoading={isLoading}
                            loadingText="Resetting..."
                            className="heart-beat"
                            cursor="pointer"
                        >
                            Reset Password
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
                Remember your password?{" "}
                <Text
                    as="button"
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
                </Text>
            </Text>
        </VStack>
    );
};

export default ForgotPasswordForm;