// apps/frontend/src/mvp/admin-v2/login/AdminLoginPage.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Card,
    CardBody,
    VStack,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    Checkbox,
    Alert,
    AlertIcon,
    useToast,
    Image,
    Center,
    InputGroup,
    InputRightElement,
    IconButton,
    Link,
    Divider,
    Badge
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import adminAuthService from '../../../service/adminAuthService';
import authService from '../../../service/authService';
import apiService from '../../../service/apiService';
import { useAuthStore } from '../../login-signup';
import cookieService from '../../../utils/cookieService';
import { 
    ADMIN_LOGIN, 
    FORM_LABELS, 
    PLACEHOLDERS, 
    ERROR_MESSAGES, 
    BUTTON_TEXT,
    AUTH_STORAGE_KEYS,
    ROUTES,
    TIME_CONSTANTS
} from '../../../constants';
import { validateEmail as validateEmailUtil, validatePassword as validatePasswordUtil } from '../../../utils/validation.utils';
import { APP_BRANDING } from '../../../constants/ui.constants';

/**
 * Admin login form data interface
 */
interface AdminLoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

/**
 * Admin login form errors interface
 */
interface AdminLoginFormErrors {
    email?: string;
    password?: string;
    general?: string;
}

/**
 * Admin Login Page Component
 * Provides secure authentication for admin users with validation
 * 
 * Features:
 * - Email and password validation
 * - Remember me functionality
 * - Security indicators
 * - Device tracking
 * - Error handling with user feedback
 * 
 * @returns {JSX.Element} Admin login page
 * 
 * @example
 * <Route path="/admin/login" element={<AdminLoginPage />} />
 */
const AdminLoginPage: React.FC = () => {
    // ===== STATE MANAGEMENT =====
    const [formData, setFormData] = useState<AdminLoginFormData>({
        email: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState<AdminLoginFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ===== HOOKS =====
    const navigate = useNavigate();
    const toast = useToast();
    const authStore = useAuthStore();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // ===== CHECK IF ALREADY LOGGED IN =====
    useEffect(() => {
        checkExistingAuth();
    }, []);

    const checkExistingAuth = async () => {
        try {
            // Check for admin token in cookies first
            const adminToken = cookieService.getCookie(AUTH_STORAGE_KEYS.TOKEN);
            
            // Also check localStorage/sessionStorage for backward compatibility
            const legacyToken = localStorage.getItem(AUTH_STORAGE_KEYS.ADMIN_TOKEN) || sessionStorage.getItem(AUTH_STORAGE_KEYS.ADMIN_TOKEN);
            
            const token = adminToken || legacyToken;
            
            if (!token) {
                setIsCheckingAuth(false);
                return;
            }

            // Set token in API service
            await apiService.setAuthToken(token);

            // Validate token
            const { response, error } = await authService.verifyToken();
            
            if (!error && response) {
                // Admin token is valid, redirect to dashboard
                navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
                return;
            }
            
            setIsCheckingAuth(false);
        } catch (error) {
            console.error('Error checking auth:', error);
            setIsCheckingAuth(false);
        }
    };

    // ===== FORM VALIDATION =====

    // Use validation utilities from utils
    const validateEmail = validateEmailUtil;
    const validatePassword = validatePasswordUtil;

    /**
     * Validate entire form and return errors
     * 
     * @returns {AdminLoginFormErrors} Validation errors object
     */
    const validateForm = (): AdminLoginFormErrors => {
        const newErrors: AdminLoginFormErrors = {};

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        return newErrors;
    };

    // ===== EVENT HANDLERS =====

    /**
     * Handle input field changes with validation
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear specific field error when user starts typing
        if (errors[name as keyof AdminLoginFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    /**
     * Handle form submission with validation and API call
     * 
     * @param {React.FormEvent} e - Form submit event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            console.log('🔐 Attempting admin login...', {
                email: formData.email,
                rememberMe: formData.rememberMe
            });

            const result = await adminAuthService.login(
                formData.email,
                formData.password,
                formData.rememberMe
            );

            if (result.response) {
                // Login successful
                console.log('✅ Admin login successful');

                toast({
                    title: 'Login Successful',
                    description: `Welcome back, ${result.response.data.admin.email}!`,
                    status: 'success',
                    duration: TIME_CONSTANTS.TOAST_DURATION,
                    isClosable: true,
                });

                // Redirect to admin dashboard
                navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });

            } else {
                // Login failed
                console.error('❌ Admin login failed:', result.error);

                const errorMessage = result.error?.message || ERROR_MESSAGES.LOGIN_FAILED;
                setErrors({ general: errorMessage });

                toast({
                    title: 'Login Failed',
                    description: errorMessage,
                    status: 'error',
                    duration: TIME_CONSTANTS.LONG_TOAST_DURATION,
                    isClosable: true,
                });
            }

        } catch (error: any) {
            console.error('❌ Admin login error:', error);

            const errorMessage = ERROR_MESSAGES.GENERIC_ERROR;
            setErrors({ general: errorMessage });

            toast({
                title: 'Login Error',
                description: errorMessage,
                status: 'error',
                duration: TIME_CONSTANTS.LONG_TOAST_DURATION,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Toggle password visibility
     */
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // ===== RENDER =====
    // Show loading while checking auth
    if (isCheckingAuth) {
        return (
            <Center minH="100vh">
                <VStack>
                    <Box className="animate-spin" borderRadius="full" border="4px solid" borderColor="brand.500" borderTopColor="transparent" w="50px" h="50px" />
                    <Text mt={4} color="gray.600">Checking authentication...</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Box
            minH="100vh"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Container maxW="md">
                <Card
                    variant="elevated"
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="2xl"
                >
                    <CardBody p={8}>
                        <VStack spacing={6}>

                            {/* Header Section */}
                            <VStack spacing={4} textAlign="center">
                                <Center>
                                    <Box
                                        p={3}
                                        bg="brand.50"
                                        borderRadius="full"
                                        border="2px solid"
                                        borderColor="brand.200"
                                    >
                                        <ViewOffIcon color="brand.500" boxSize={8} />
                                    </Box>
                                </Center>

                                <VStack spacing={2}>
                                    <Heading
                                        size="lg"
                                        color="gray.800"
                                        fontWeight="bold"
                                    >
                                        {ADMIN_LOGIN.TITLE}
                                    </Heading>
                                    <Text
                                        color="gray.600"
                                        fontSize="sm"
                                        textAlign="center"
                                    >
                                        {ADMIN_LOGIN.SUBTITLE}
                                    </Text>
                                    <Badge
                                        variant="subtle"
                                        colorScheme="blue"
                                        fontSize="xs"
                                        px={2}
                                        py={1}
                                    >
                                        {ADMIN_LOGIN.SECURITY_BADGE}
                                    </Badge>
                                </VStack>
                            </VStack>

                            <Divider />

                            {/* Error Alert */}
                            {errors.general && (
                                <Alert status="error" borderRadius="lg">
                                    <AlertIcon />
                                    <Text fontSize="sm">{errors.general}</Text>
                                </Alert>
                            )}

                            {/* Login Form */}
                            <Box as="form" onSubmit={handleSubmit} w="full">
                                <VStack spacing={4}>

                                    {/* Email Field */}
                                    <FormControl isInvalid={!!errors.email} isRequired>
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="gray.700"
                                        >
                                            {FORM_LABELS.EMAIL}
                                        </FormLabel>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder={PLACEHOLDERS.ADMIN_EMAIL}
                                            size="lg"
                                            borderRadius="lg"
                                            focusBorderColor="brand.500"
                                            bg="gray.50"
                                            _hover={{ bg: "white" }}
                                            _focus={{ bg: "white" }}
                                        />
                                        {errors.email && (
                                            <Text color="red.500" fontSize="xs" mt={1}>
                                                {errors.email}
                                            </Text>
                                        )}
                                    </FormControl>

                                    {/* Password Field */}
                                    <FormControl isInvalid={!!errors.password} isRequired>
                                        <FormLabel
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="gray.700"
                                        >
                                            {FORM_LABELS.PASSWORD}
                                        </FormLabel>
                                        <InputGroup size="lg">
                                            <Input
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder={PLACEHOLDERS.PASSWORD}
                                                borderRadius="lg"
                                                focusBorderColor="brand.500"
                                                bg="gray.50"
                                                _hover={{ bg: "white" }}
                                                _focus={{ bg: "white" }}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                    onClick={togglePasswordVisibility}
                                                    variant="ghost"
                                                    size="sm"
                                                    color="gray.500"
                                                    _hover={{ color: "gray.700" }}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        {errors.password && (
                                            <Text color="red.500" fontSize="xs" mt={1}>
                                                {errors.password}
                                            </Text>
                                        )}
                                    </FormControl>

                                    {/* Remember Me Checkbox */}
                                    <FormControl>
                                        <Checkbox
                                            name="rememberMe"
                                            isChecked={formData.rememberMe}
                                            onChange={handleInputChange}
                                            colorScheme="brand"
                                            size="sm"
                                        >
                                            <Text fontSize="sm" color="gray.600">
                                                {ADMIN_LOGIN.REMEMBER_ME_TEXT}
                                            </Text>
                                        </Checkbox>
                                    </FormControl>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        isLoading={isLoading}
                                        loadingText="Signing In..."
                                        colorScheme="brand"
                                        size="lg"
                                        width="full"
                                        borderRadius="lg"
                                        fontWeight="semibold"
                                        _hover={{
                                            transform: 'translateY(-1px)',
                                            boxShadow: 'lg'
                                        }}
                                        transition="all 0.2s"
                                    >
                                        {ADMIN_LOGIN.SIGN_IN_TITLE}
                                    </Button>

                                </VStack>
                            </Box>

                            {/* Footer Links */}
                            <VStack spacing={2} pt={2}>
                                <Link
                                    href={ROUTES.ADMIN_FORGOT_PASSWORD}
                                    fontSize="sm"
                                    color="brand.500"
                                    fontWeight="medium"
                                    _hover={{ color: "brand.600", textDecoration: "underline" }}
                                >
                                    {ADMIN_LOGIN.FORGOT_PASSWORD_TEXT}
                                </Link>

                                <Text fontSize="xs" color="gray.500" textAlign="center">
                                    {ADMIN_LOGIN.SECURITY_NOTE}
                                </Text>
                            </VStack>

                        </VStack>
                    </CardBody>
                </Card>

                {/* Footer */}
                <Center mt={6}>
                    <Text fontSize="xs" color="whiteAlpha.800" textAlign="center">
                        {APP_BRANDING.ADMIN_COPYRIGHT}
                    </Text>
                </Center>

            </Container>
        </Box>
    );
};

export default AdminLoginPage;