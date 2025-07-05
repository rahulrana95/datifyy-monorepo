import { useState } from "react";
import { Button, FormControl, FormLabel, Input, VStack, Text, HStack, Alert, AlertIcon } from "@chakra-ui/react";
import authService from "../../service/authService";
import { useAuthStore } from "./authStore";
import { set } from "date-fns";

const SignupForm = ({ onLogin }: { onLogin: () => void }) => {
    const { toggleSignup, showHideLogin, showHideSignup } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Send verification code to email
    const sendVerificationCode = async () => {
        setLoading(true);
        try {
            const response = await authService.sendEmailCode({ to: [{ email, name: email }], type: "verifyEmail" });

            if (response.error) {
                setError("Error sending verification code. Please try again.");
                setLoading(false);
                return;
            }
            setIsCodeSent(true);
        } catch (error) {
            setIsCodeSent(false);
            setError("Error sending verification code. Please try again.");
            console.error("Error sending verification code:", error);
        } finally {
            setLoading(false);
        }
    };

    // Verify the entered code
    const verifyEmail = async () => {
        setLoading(true);
        try {
            const response = await authService.verifyEmailCode({ email, verificationCode: code });
            if (!response.error) {
                setIsVerified(true);
            } else {
                setError("Invalid code. Please try again.");
                alert("Invalid code. Please try again.");
            }
        } catch (error) {
            setError("Error verifying code. Please try again.");
            console.error("Error verifying code:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle user signup after email verification
    const handleSignup = async () => {
        setLoading(true);
        if (!isVerified) {
            setLoading(false);
            setError("Please verify your email before signing up.");
            alert("Please verify your email before signing up.");
            return;
        }
        const response = await authService.register(password, email);

        if (!response.error) {
            setLoading(false);
            showHideSignup(false);
            showHideLogin(true);
            return;
        } else {
            toggleSignup(false);
            setError("There is an error in signing up. Please try again.");
            setLoading(false);
        }

    };

    return (
        <VStack spacing={4} minH={300}>
            <FormControl>
                <FormLabel>Email</FormLabel>
                <HStack>
                    <Input value={email} disabled={loading} onChange={(e) => setEmail(e.target.value)} isDisabled={isCodeSent} />
                    <Button disabled={loading} onClick={sendVerificationCode} isDisabled={isCodeSent} colorScheme="pink" _hover={{ cursor: "pointer" }}>
                        Send Code
                    </Button>
                </HStack>
            </FormControl>

            {isCodeSent && (
                <FormControl>
                    <FormLabel>Enter Verification Code</FormLabel>
                    <HStack>
                        <Input value={code} onChange={(e) => setCode(e.target.value)} />
                        <Button colorScheme="pink" onClick={verifyEmail} isDisabled={isVerified || loading} _hover={{ cursor: "pointer" }}>
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
                    <Button colorScheme="pink" w="full" onClick={handleSignup} _hover={{ cursor: "pointer" }} isLoading={loading} disabled={loading}>
                        Sign Up
                    </Button>
                </>
            )}

            {error && (
                <Alert status="error" rounded="md" fontSize={12}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            <Text color="blue.500" cursor="pointer" onClick={onLogin}>
                Already have an account? Login
            </Text>
        </VStack>
    );
};

export default SignupForm;
