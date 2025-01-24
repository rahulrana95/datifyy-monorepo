import React, { useEffect } from 'react';
import { Flex, Text, Link, Card, Button, TextField } from '@radix-ui/themes';
import './header.css';
import { HeartIcon } from '@radix-ui/react-icons';
import {
    InstagramLogoIcon,
    TwitterLogoIcon,
    GitHubLogoIcon,
} from '@radix-ui/react-icons';
import { Form } from "radix-ui";

const launchDate = new Date('2025-01-31T00:00:00').getTime();

const HeartIconWithCircle = () => {
    return (
        <div className="heart-container">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="heart-icon"
            >
                <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="rgba(214, 77, 131, 0.1)" /* Heart opacity at 10% */
                />
            </svg>
        </div>
    );
};


const Countdown: React.FC = () => {
    const [timeLeft, setTimeLeft] = React.useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });


    useEffect(() => {
        setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
    }, []);
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
                        <Link href="/about" className="nav-link">
                            About
                        </Link>
                        <Link href="/contact" className="nav-link">
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
                                        {timeLeft[unit.toLowerCase() as keyof typeof timeLeft]}
                                    </Text>
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
                                        <input className="Input" type="name" required placeholder='Full Name' autoComplete='off' />
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
                                        <input className="Input" type="email" required placeholder='Email' autoComplete='off' />
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
                            <HeartIconWithCircle />
                        </div>
                    </div>
                    <Text size="4" weight="bold" className="feature-heading">
                        Smart Matching
                    </Text>
                    <br />
                    <Text size="2" color="gray" className="feature-description">
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
                    <Text size="4" weight="bold" className="feature-heading">
                        Safe Dating
                    </Text>
                    <br />
                    <Text size="2" color="gray" className="feature-description">
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
                    <Text size="4" weight="bold" className="feature-heading">
                        Fun Events
                    </Text>
                    <br />
                    <Text size="2" color="gray" className="feature-description">
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
