import { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from "@chakra-ui/react";
import { useAuthStore } from "./authStore";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthModal = () => {
    const { isLoginOpen, isSignupOpen, showHideForgotPassword, showHideLogin, showHideSignup } = useAuthStore();
    const [view, setView] = useState<"login" | "signup" | "forgotPassword">("login");

    return (
        <Modal isOpen={isLoginOpen || isSignupOpen} onClose={() => {
            showHideForgotPassword(false);
            showHideLogin(false);
            showHideSignup(false);
            setView("login");
        }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {view === "login" && "Login"}
                    {view === "signup" && "Sign Up"}
                    {view === "forgotPassword" && "Reset Password"}
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {view === "login" && <LoginForm onSignup={() => setView("signup")} onForgotPassword={() => setView("forgotPassword")} />}
                    {view === "signup" && <SignupForm onLogin={() => setView("login")} />}
                    {view === "forgotPassword" && <ForgotPasswordForm onLogin={() => setView("login")} />}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AuthModal;
