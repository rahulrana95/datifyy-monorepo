// apps/frontend/src/mvp/login-signup/components/LoginForm.tsx
import React, { useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    useToast,
    Alert,
    AlertIcon,
    HStack,
    Divider,
    InputGroup,
    InputRightElement,
    IconButton,
    Box,
    Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGoogle, FaApple, FaHeart } from "react-icons/fa";
import authService from "../../../service/authService";
import { useAuthStore } from "../store/authStore";

interface LoginFormProps {
    onSignup: () => void;
    onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSignup, onForgotPassword }) => {
    const {
        hideAllModals,
        setIsAuthenticated,
        setUserData,
        setLoading,
        setError,
        clearError,
        isLoading,
        error
    } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const toast = useToast();

    const validateForm = () => {
        const errors: typeof fieldErrors = {};

        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email";
        }

        if (!password.trim()) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async () => {
        clearError();
        setFieldErrors({});

        if (!validateForm()) return;

        setLoading(true);

        try {
            const { error } = await authService.login(email.trim(), password);

            if (error) {
                setError("Invalid email or password. Please try again.");
                toast({
                    title: "Login failed",
                    description: "Please check your credentials and try again.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top",
                });
                return;
            }

            // Get user data after successful login
            const response = await authService.getCurrentUser();
            const userData = response?.response?.data;

            if (!response.error && userData) {
                setUserData({
                    email: userData.officialEmail || email,
                    name: userData.firstName || '',
                    // @ts-ignore
                    isAdmin: userData.isadmin || false,
                    id: userData.id || ''
                });

                setIsAuthenticated(true);
                hideAllModals();

                toast({
                    title: "Welcome back! 💕",
                    description: "Ready to find your perfect match?",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
            toast({
                title: "Connection error",
                description: "Please check your internet connection.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: 'google' | 'apple') => {
        toast({
            title: `${provider === 'google' ? 'Google' : 'Apple'} Sign In`,
            description: "Coming soon! 🚀",
            status: "info",
            duration: 3000,
            isClosable: true,
            position: "top",
        });
    };

    return (
        <VStack spacing={6} w="full">
            {/* Social Login Buttons */}
            <VStack spacing={3} w="full">
                <Button
                    variant="outline"
                    size="lg"
                    w="full"
                    leftIcon={<FaGoogle />}
                    colorScheme="gray"
                    borderColor="gray.300"
                    _hover={{
                        borderColor: "gray.400",
                        bg: "gray.50",
                        transform: "translateY(-1px)",
                    }}
                    onClick={() => handleSocialLogin('google')}
                    cursor="pointer"
                >
                    Continue with Google
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    w="full"
                    leftIcon={<FaApple />}
                    colorScheme="gray"
                    borderColor="gray.300"
                    _hover={{
                        borderColor: "gray.400",
                        bg: "gray.50",
                        transform: "translateY(-1px)",
                    }}
                    onClick={() => handleSocialLogin('apple')}
                    cursor="pointer"
                >
                    Continue with Apple
                </Button>
            </VStack>

            {/* Divider */}
            <HStack w="full" align="center">
                <Divider />
                <Text fontSize="sm" color="gray.500" px={3} whiteSpace="nowrap">
                    or sign in with email
                </Text>
                <Divider />
            </HStack>

            {/* Email Input */}
            <FormControl isInvalid={!!fieldErrors.email}>
                <FormLabel color="gray.700" fontWeight="medium">
                    Email Address
                </FormLabel>
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

            {/* Password Input */}
            <FormControl isInvalid={!!fieldErrors.password}>
                <FormLabel color="gray.700" fontWeight="medium">
                    Password
                </FormLabel>
                <InputGroup size="lg">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (fieldErrors.password) {
                                setFieldErrors(prev => ({ ...prev, password: undefined }));
                            }
                        }}
                        placeholder="Enter your password"
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
                {fieldErrors.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                        {fieldErrors.password}
                    </Text>
                )}
            </FormControl>

            {/* Forgot Password Link */}
            <Box w="full" textAlign="right">
                <Link
                    color="brand.500"
                    fontSize="sm"
                    fontWeight="medium"
                    onClick={onForgotPassword}
                    _hover={{
                        color: "brand.600",
                        textDecoration: "underline"
                    }}
                    cursor="pointer"
                >
                    Forgot your password?
                </Link>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert status="error" borderRadius="lg" className="fade-in">
                    <AlertIcon />
                    <Text fontSize="sm">{error}</Text>
                </Alert>
            )}

            {/* Login Button */}
            <Button
                variant="love"
                size="lg"
                w="full"
                rightIcon={<FaHeart />}
                onClick={handleLogin}
                isLoading={isLoading}
                loadingText="Signing you in..."
                className="heart-beat"
                _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(232, 93, 117, 0.4)",
                }}
                cursor="pointer"
            >
                Sign In
            </Button>

            {/* Sign Up Link */}
            <Text fontSize="sm" color="gray.600" textAlign="center">
                New to Datifyy?{" "}
                <Link
                    color="brand.500"
                    fontWeight="semibold"
                    onClick={onSignup}
                    _hover={{
                        color: "brand.600",
                        textDecoration: "underline"
                    }}
                    cursor="pointer"
                >
                    Create an account
                </Link>
            </Text>
        </VStack>
    );
};

export default LoginForm;