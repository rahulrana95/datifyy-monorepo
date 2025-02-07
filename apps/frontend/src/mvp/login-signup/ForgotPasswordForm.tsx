import { useState } from "react";
import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import authService from "../../service/authService";

const ForgotPasswordForm = ({ onLogin }: { onLogin: () => void }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");

    const handleSendCode = async () => {
        // await authService.sendEmailCode();
        setStep(2);
    };

    const handleVerifyCode = async () => {
        // const res = await authService.verifyCode();
        // if (res.response) setStep(3);
    };

    const handleResetPassword = async () => {
        // await authService.resetPassword(email, password);
        onLogin(); // Redirect back to login after successful reset
    };

    return (
        <VStack spacing={4}>
            {step === 1 && (
                <>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <Button colorScheme="pink" w="full" onClick={handleSendCode}>
                        Send Code
                    </Button>
                </>
            )}
            {step === 2 && (
                <>
                    <FormControl>
                        <FormLabel>Enter Code</FormLabel>
                        <Input value={code} onChange={(e) => setCode(e.target.value)} />
                    </FormControl>
                    <Button colorScheme="pink" w="full" onClick={handleVerifyCode}>
                        Verify
                    </Button>
                </>
            )}
            {step === 3 && (
                <>
                    <FormControl>
                        <FormLabel>New Password</FormLabel>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Button colorScheme="pink" w="full" onClick={handleResetPassword}>
                        Reset Password
                    </Button>
                </>
            )}
        </VStack>
    );
};

export default ForgotPasswordForm;
