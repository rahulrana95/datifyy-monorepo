import { useState } from "react";
import { Button, FormControl, FormLabel, Input, VStack, Text, useToast, Alert, AlertIcon } from "@chakra-ui/react";
import authService from "../../service/authService";
import { useAuthStore } from "./authStore";
import { set } from "date-fns";

const LoginForm = ({ onSignup, onForgotPassword }: { onSignup: () => void; onForgotPassword: () => void }) => {
    const { showHideLogin, setIsAuthenticated } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast(); // ✅ Initialize toast
    const authStore = useAuthStore();

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await authService.login(email, password);

        if (error) {
            setError("Invalid email or password.");
            toast({
                title: "Login failed.",
                description: "Something went wrong. 🚀",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            }); // ✅ Show toast on error
            setLoading(false);
            return;
        }

        const response = await authService.getCurrentUser();

        const data = response?.response?.data;
        if (!response.error) {
            authStore.setUserData({
                email: data?.officialEmail ?? '',
                name: data?.firstName ?? '',
                isAdmin: data?.isadmin ?? false,
                id: data?.id ?? ''
            })


            setIsAuthenticated(true);

            showHideLogin(false);
            toast({
                title: "Login successful.",
                description: "Welcome back! 🚀",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            }); // ✅ Show toast on success
            setLoading(false);
            return;
        } else {
            setLoading(false);
            setError("Invalid email or password.");
            toast({
                title: "Login failed.",
                description: "Something went wrong. 🚀",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            }); // ✅ Show toast on error
        }

    };

    return (
        <VStack spacing={4}>
            <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button colorScheme="pink" w="full" onClick={handleLogin} _hover={{ cursor: "pointer" }} isLoading={loading} disabled={loading}>
                Login
            </Button>
            {error && (
                <Alert status="error" rounded="md" fontSize={12}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <Text color="blue.500" cursor="pointer" onClick={onSignup} _hover={{ cursor: "pointer" }}>
                Create an account
            </Text>
            <Text color="red.500" cursor="pointer" onClick={onForgotPassword} _hover={{ cursor: "pointer" }}>
                Forgot Password?
            </Text>
        </VStack>
    );
};

export default LoginForm;
