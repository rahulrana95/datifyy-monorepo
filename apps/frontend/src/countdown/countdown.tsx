import React from 'react';
import { Flex, Text, Link, Card, Button, TextField } from '@radix-ui/themes';
import './header.css';
import { HeartIcon } from '@radix-ui/react-icons';
import {
    InstagramLogoIcon,
    TwitterLogoIcon,
    GitHubLogoIcon,
} from '@radix-ui/react-icons';
import { Form } from "radix-ui";


const Countdown: React.FC = () => {
    return (
        <header>
            {/* Header Section */}
            <div className="header">
                <Flex justify="between" align="center" className="header-container">
                    {/* Left: Logo */}
                    <Text size="5" weight="bold" className="header-logo">
                        Datifyy
                    </Text>

                    {/* Right: Navigation */}
                    <Flex gap="4" align="center" className="header-navigation">
                        <Link href="/about" color="gray" highContrast className="nav-link">
                            About
                        </Link>
                        <Link href="/contact" color="gray" highContrast className="nav-link">
                            Contact
                        </Link>
                    </Flex>
                </Flex>
            </div>

            {/* Coming Soon Section */}
            <div className="coming-soon-section">
                {/* Gradient Background */}
                <div className="gradient-bg">
                    <Flex direction="column" gap="6" align="center" className="coming-soon-content">
                        {/* Line 1: Coming Soon */}
                        <Text size="8" weight="bold" className="coming-soon-heading">
                            Coming Soon
                        </Text>
                        <Text size="4" weight="bold" className="form-heading">
                            Get ready for a revolutionary dating experience. Join our waitlist to be among  the first
                            first to find your perfect match.
                        </Text>

                        {/* Line 2: Countdown Cards */}
                        <Flex gap="4" justify="center" className="countdown-cards">
                            {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit, index) => (
                                <Card key={index} variant="classic" className="countdown-card">
                                    <Text size="7" weight="bold" className="countdown-number">
                                        00
                                    </Text>
                                    <br />
                                    <Text size="4" color="gray" className="countdown-label">
                                        {unit}
                                    </Text>
                                </Card>
                            ))}
                        </Flex>

                        {/* Line 3: Waitlist Form */}
                        <Card variant="ghost" className="waitlist-card">
                            <Text size="6" weight="bold" className="form-heading">
                                Join the Waitlist
                            </Text>

                            <Form.Root className="waitlist-form">
                                <Form.Field className="FormField" name="name">
                                    <Form.Control asChild>
                                        <input className="Input" type="name" required placeholder='Full Name' />
                                    </Form.Control>
                                </Form.Field>
                                <Form.Field className="FormField" name="email">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Form.Message className="FormMessage" match="valueMissing">
                                            Please enter your email
                                        </Form.Message>
                                        <Form.Message className="FormMessage" match="typeMismatch">
                                            Please provide a valid email
                                        </Form.Message>
                                    </div>
                                    <Form.Control asChild>
                                        <input className="Input" type="email" required placeholder='Email' />
                                    </Form.Control>
                                </Form.Field>
                                <Button variant="solid" className="submit-button">
                                    Join Waitlist <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                                </Button>
                            </Form.Root>


                            <Text size="3" color="gray" className="waitlist-info">
                                Already <strong>2,555</strong> people are on the waitlist!
                            </Text>
                        </Card>
                    </Flex>
                </div>
            </div>

            <Features />
            <Footer />

        </header>
    );
};




const Features = () => {
    return (
        <div className="features-section">
            <Flex direction="row" gap="8" align="center" className="features-container">
                {/* Feature 1: Smart Matching */}
                <Card variant="classic" className="feature-card">
                    <div className="feature-icon">
                        <div className="icon-circle">
                            <HeartIcon width="32" height="32" />
                        </div>
                    </div>
                    <Text size="6" weight="bold" className="feature-heading">
                        Smart Matching
                    </Text>
                    <br />
                    <Text size="4" color="gray" className="feature-description">
                        Advanced algorithm to find the perfect match based on interests and compatibility.
                    </Text>
                </Card>

                {/* Feature 2: Safe Dating */}
                <Card variant="ghost" className="feature-card">
                    <div className="feature-icon">
                        <div className="icon-circle">
                            shiedl
                        </div>
                    </div>
                    <Text size="6" weight="bold" className="feature-heading">
                        Safe Dating
                    </Text>
                    <br />
                    <Text size="4" color="gray" className="feature-description">
                        Aadhar Verified profiles and secure messaging to ensure a safe dating experience.
                    </Text>
                </Card>

                {/* Feature 3: Fun Events */}
                <Card variant="ghost" className="feature-card">
                    <div className="feature-icon">
                        <div className="icon-circle fun-events-icon">
                            🎉
                        </div>
                    </div>
                    <Text size="6" weight="bold" className="feature-heading">
                        Fun Events
                    </Text>
                    <br />
                    <Text size="4" color="gray" className="feature-description">
                        Regular online and offline events to match people and build connections.
                    </Text>
                </Card>
            </Flex>
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="footer">
            <Flex direction="column" align="center" gap="4" className="footer-container">
                {/* Brand Name */}
                <Text size="6" weight="bold" color="crimson">
                    Datifyy
                </Text>

                {/* Social Icons */}
                <Flex justify="center" align="center" gap="4">
                    <Link href="https://www.instagram.com/datifyy/" target="_blank" className="social-icon">
                        <InstagramLogoIcon width="24" height="24" />
                    </Link>
                    <Link href="https://x.com/datifyy" target="_blank" className="social-icon">
                        <TwitterLogoIcon width="24" height="24" />
                    </Link>
                </Flex>

                {/* Year */}
                <Text size="4" color="gray" className="footer-year">
                    &copy; 2025
                </Text>
            </Flex>
        </footer>
    );
};


export default Countdown;
