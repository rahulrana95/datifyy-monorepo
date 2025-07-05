import { useState } from "react";
import { Alert, AlertIcon, Button, FormControl, FormLabel, Input, VStack, Box, HStack } from "@chakra-ui/react";
import authService from "../../service/authService";

const ForgotPasswordForm = ({ onLogin }: { onLogin: () => void }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await authService.sendForgotPasswordCode(email);
            if (response.error) {
                setError("Error sending verification code. Please try again.");
                return;
            }
            setStep(2);
        } catch (error) {
            setError("Error sending verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        // We will verify code with reset password.
        setStep(3);
    };

    const handleResetPassword = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await authService.resetPassword({ email, newPassword: password, resetCode: code });
            if (response.error) {
                setError("Error resetting password. Please try again.");
                return;
            }
            onLogin(); // Redirect to login after reset
        } catch (error) {
            setError("Error resetting password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const errorUi = error && (
        <Alert status="error" rounded="md" fontSize={12}>
            <AlertIcon />
            {error}
        </Alert>
    );

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minH="300">
            <VStack spacing={4} w="100%" boxShadow="lg" borderRadius="md" bg="white">
                {step === 1 && (
                    <>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormControl>
                        <Button colorScheme="pink" w="full" onClick={handleSendCode} isDisabled={loading} isLoading={loading}>
                            Send Code
                        </Button>
                        {errorUi}
                    </>
                )}
                {step === 2 && (
                    <>
                        <FormControl>
                            <FormLabel>Enter Code</FormLabel>
                            <Input disabled={loading} value={code} onChange={(e) => setCode(e.target.value)} />
                        </FormControl>
                        <HStack w="full">
                            <Button w="full" variant="outline" onClick={() => setStep(1)} isDisabled={loading}>
                                Back
                            </Button>
                            <Button colorScheme="pink" w="full" onClick={handleVerifyCode} isDisabled={loading} isLoading={loading}>
                                Verify
                            </Button>
                        </HStack>
                        {errorUi}
                    </>
                )}
                {step === 3 && (
                    <>
                        <FormControl>
                            <FormLabel>New Password</FormLabel>
                            <Input disabled={loading} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <HStack w="full">
                            <Button w="full" variant="outline" onClick={() => setStep(2)} isDisabled={loading}>
                                Back
                            </Button>
                            <Button colorScheme="pink" w="full" onClick={handleResetPassword} isDisabled={loading} isLoading={loading}>
                                Reset Password
                            </Button>
                        </HStack>
                        {errorUi}
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default ForgotPasswordForm;
