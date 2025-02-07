import { useEffect, useState } from "react";
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

export enum LoginSignupView {
    LOGIN = "login",
    SIGNUP = "signup",
    FORGOT_PASSWORD = "forgotPassword"
}

const AuthModal = () => {
    const { isLoginOpen, isSignupOpen, isForgotPasswordOpen, showHideForgotPassword, showHideLogin, showHideSignup } = useAuthStore();


    const [view, setView] = useState<LoginSignupView.LOGIN | LoginSignupView.SIGNUP | LoginSignupView.FORGOT_PASSWORD>(LoginSignupView.LOGIN);

    useEffect(() => {
        if (isLoginOpen) {
            setView(LoginSignupView.LOGIN);
        } else if (isSignupOpen) {
            setView(LoginSignupView.SIGNUP);
        } else if (isForgotPasswordOpen) {
            setView(LoginSignupView.FORGOT_PASSWORD);
        }
    }, [isLoginOpen, isSignupOpen, isForgotPasswordOpen]);

    const isLoginView = view === LoginSignupView.LOGIN;
    const isSignupView = view === LoginSignupView.SIGNUP;
    const isForgotPasswordView = view === LoginSignupView.FORGOT_PASSWORD;

    console.log({ isLoginOpen, isSignupOpen, isForgotPasswordOpen });

    return (
        <Modal isOpen={isLoginOpen || isSignupOpen} onClose={() => {
            showHideForgotPassword(false);
            showHideLogin(false);
            showHideSignup(false);
            setView(LoginSignupView.LOGIN);
        }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {isLoginView && "Login"}
                    {isSignupView && "Sign Up"}
                    {isForgotPasswordView && "Reset Password"}
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {isLoginView && <LoginForm onSignup={() => setView(LoginSignupView.LOGIN)} onForgotPassword={() => setView(LoginSignupView.FORGOT_PASSWORD)} />}
                    {isSignupView && <SignupForm onLogin={() => setView(LoginSignupView.LOGIN)} />}
                    {isForgotPasswordView && <ForgotPasswordForm onLogin={() => setView(LoginSignupView.LOGIN)} />}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AuthModal;
