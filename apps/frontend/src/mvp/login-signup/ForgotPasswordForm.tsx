import { useState } from "react";
import { Alert, AlertIcon, Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import authService from "../../service/authService";
import { set } from "date-fns";

const ForgotPasswordForm = ({ onLogin }: { onLogin: () => void }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        setLoading(true);
        try {
            const response = await authService.sendForgotPasswordCode(email);

            if (response.error) {
                setError("Error sending verification code. Please try again.");
                return;
            }

            setStep(2);
        } catch (error) {
            setError("Error sending verification code. Please try again.");
            console.error("Error sending verification code:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setLoading(true);
        try {
            const response = await authService.verifyForgotPasswordCode({ email, verificationCode: code });

            if (response.error) {
                setError("Invalid code. Please try again.");
            } else {
                setStep(3);
            }
        } catch (error) {
            setError("Error verifying code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            const response = await authService.resetPassword({ email, password });

            if (response.error) {
                setLoading(false);
                setError("Error resetting password. Please try again.");
                return;
            }

            onLogin();
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
    )

    return (
        <VStack spacing={4} minH={300} verticalAlign={"center"} display={"flex"} flexDirection={"column"}>
            {step === 1 && (
                <>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <Button colorScheme="pink" w="full" onClick={handleSendCode} disabled={loading} _hover={{ cursor: "pointer" }} isLoading={loading}>
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
                    <Button colorScheme="pink" w="full" onClick={handleVerifyCode} disabled={loading} _hover={{ cursor: "pointer" }} isLoading={loading}>
                        Verify
                    </Button>
                    {errorUi}
                </>
            )}
            {step === 3 && (
                <>
                    <FormControl>
                        <FormLabel>New Password</FormLabel>
                        <Input disabled={loading} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Button colorScheme="pink" w="full" onClick={handleResetPassword} disabled={loading} _hover={{ cursor: "pointer" }} isLoading={loading}>
                        Reset Password
                    </Button>
                    {errorUi}
                </>
            )}
        </VStack>
    );
};

export default ForgotPasswordForm;
