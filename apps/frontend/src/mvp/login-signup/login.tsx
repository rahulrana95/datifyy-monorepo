import { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react";
import authService from "../../service/authService";
import { useAuthStore } from "./authStore";

const AuthModal = () => {
    const { isLoginOpen, isSignupOpen, toggleLogin, toggleSignup } = useAuthStore();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");

    const handleSendCode = async () => {
        await authService.sendEmailCode();
        setStep(2);
    };

    const handleVerifyCode = async () => {
        const res = await authService.verifyCode();
        if (res.response) setStep(3);
    };

    const handleSignup = async () => {
        await authService.register(email, password, '');
        toggleSignup(false);
    };

    const handleLogin = async () => {
        await authService.login(email, password);
        toggleLogin(false);
    };

    return (
        <Modal isOpen={isLoginOpen || isSignupOpen} onClose={() => toggleLogin(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isLoginOpen ? "Login" : "Sign Up"}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {isLoginOpen ? (
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </FormControl>
                            <Button colorScheme="pink" w="full" onClick={handleLogin}>
                                Login
                            </Button>
                            <Text color="blue.500" cursor="pointer" onClick={() => toggleSignup(true)}>
                                Create an account
                            </Text>
                            <Text color="red.500" cursor="pointer">
                                Forgot Password?
                            </Text>
                        </VStack>
                    ) : (
                        <>
                            {step === 1 && (
                                <VStack spacing={4}>
                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </FormControl>
                                    <Button colorScheme="pink" w="full" onClick={handleSendCode}>
                                        Send Code
                                    </Button>
                                </VStack>
                            )}
                            {step === 2 && (
                                <VStack spacing={4}>
                                    <FormControl>
                                        <FormLabel>Enter Code</FormLabel>
                                        <Input value={code} onChange={(e) => setCode(e.target.value)} />
                                    </FormControl>
                                    <Button colorScheme="pink" w="full" onClick={handleVerifyCode}>
                                        Verify
                                    </Button>
                                </VStack>
                            )}
                            {step === 3 && (
                                <VStack spacing={4}>
                                    <FormControl>
                                        <FormLabel>Password</FormLabel>
                                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </FormControl>
                                    <Button colorScheme="pink" w="full" onClick={handleSignup}>
                                        Create Account
                                    </Button>
                                </VStack>
                            )}
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button onClick={() => toggleLogin(false)}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AuthModal;
