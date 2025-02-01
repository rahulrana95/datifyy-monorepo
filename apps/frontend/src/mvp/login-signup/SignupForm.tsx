import { useState } from "react";
import { Button, FormControl, FormLabel, Input, VStack, Text } from "@chakra-ui/react";
import authService from "../../service/authService";
import { useAuthStore } from "./authStore";

const SignupForm = ({ onLogin }: { onLogin: () => void }) => {
    const { toggleSignup } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        await authService.register(email, password, "");
        toggleSignup(false);
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
            <Button colorScheme="pink" w="full" onClick={handleSignup}>
                Sign Up
            </Button>
            <Text color="blue.500" cursor="pointer" onClick={onLogin}>
                Already have an account? Login
            </Text>
        </VStack>
    );
};

export default SignupForm;
