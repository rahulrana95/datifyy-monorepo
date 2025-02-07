import { useState } from "react";
import { Button, FormControl, FormLabel, Input, VStack, Text, HStack } from "@chakra-ui/react";
import authService from "../../service/authService";
import { useAuthStore } from "./authStore";

const SignupForm = ({ onLogin }: { onLogin: () => void }) => {
    const { toggleSignup } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // Send verification code to email
    const sendVerificationCode = async () => {
        try {
            const response = await authService.sendEmailCode({ to: [{ email, name: email }], type: "verifyEmail" });

            if (response.error) {
                return;
            }
            setIsCodeSent(true);
        } catch (error) {
            setIsCodeSent(false);
            console.error("Error sending verification code:", error);
        }
    };

    // Verify the entered code
    const verifyEmail = async () => {
        try {
            const response = await authService.verifyEmailCode({ email, verificationCode: code });
            if (!response.error) {
                setIsVerified(true);
            } else {
                alert("Invalid code. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying code:", error);
        }
    };

    // Handle user signup after email verification
    const handleSignup = async () => {
        if (!isVerified) {
            alert("Please verify your email before signing up.");
            return;
        }
        const response = await authService.register(password, email);

        if (!response.error) {
            return;
        } else {
            toggleSignup(false);
        }

    };

    return (
        <VStack spacing={4}>
            <FormControl>
                <FormLabel>Email</FormLabel>
                <HStack>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} isDisabled={isCodeSent} />
                    <Button colorScheme="blue" onClick={sendVerificationCode} isDisabled={isCodeSent}>
                        Send Code
                    </Button>
                </HStack>
            </FormControl>

            {isCodeSent && (
                <FormControl>
                    <FormLabel>Enter Verification Code</FormLabel>
                    <HStack>
                        <Input value={code} onChange={(e) => setCode(e.target.value)} />
                        <Button colorScheme="green" onClick={verifyEmail} isDisabled={isVerified}>
                            Verify
                        </Button>
                    </HStack>
                </FormControl>
            )}

            {isVerified && (
                <>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Button colorScheme="pink" w="full" onClick={handleSignup}>
                        Sign Up
                    </Button>
                </>
            )}

            <Text color="blue.500" cursor="pointer" onClick={onLogin}>
                Already have an account? Login
            </Text>
        </VStack>
    );
};

export default SignupForm;
