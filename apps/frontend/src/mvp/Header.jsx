import { Flex, Text, Button } from '@radix-ui/themes';
import Login from './Login';
import Signup from './Signup';


import { useState } from 'react';
const Header = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const [isSignupVisible, setIsSignupVisible] = useState(false);

    const handleLoginClick = () => {
        setIsLoginVisible((isLoginVisible) => !isLoginVisible);
    };

    const handleSignupClick = () => {
        setIsSignupVisible(true);
    };
    return (
        <header>
            <div className="header">
                <Flex justify="between" align="center" className="header-container">
                    {/* Left: Logo */}
                    <Text size="5" weight="bold" className="header-logo">
                        Datifyy
                    </Text>

                    {/* Right: Buttons */}
                    <Flex gap="2">
                        <Button className="login-button" variant="solid" onClick={handleLoginClick}>Login</Button>
                        <Button className="signup-button" variant="solid" onClick={handleSignupClick}>Signup</Button>
                    </Flex>
                </Flex>
            </div>

            {/* Render Login Dialog */}
            {isLoginVisible && (
                <div className="login-dialog-overlay">
                    <Login />
                </div>
            )}
            {/* Render Signup Dialog */}
            {isSignupVisible && (
                <div className="dialog-overlay">
                    <Signup onClose={() => setIsSignupVisible(!isSignupVisible)} />
                </div>
            )}

        </header>
    );
};

export default Header;
