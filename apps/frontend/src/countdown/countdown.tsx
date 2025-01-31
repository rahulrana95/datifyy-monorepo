import React, { useEffect } from "react";
import { Flex, Text, Link, Card, Button, TextField } from "@radix-ui/themes";
import "./header.css";
import { HeartIcon } from "@radix-ui/react-icons";
import {
    InstagramLogoIcon,
    TwitterLogoIcon,
    GitHubLogoIcon,
} from "@radix-ui/react-icons";
import { Form } from "radix-ui";
import { Toast } from "radix-ui";
import ToastC from "./toast";
import waitService from "../service/waitListService";
import { set } from "date-fns";

const launchDate = new Date("2025-02-06T00:00:00").getTime();

const HeartIconWithCircle = () => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(214, 77, 131, 0.1)",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="rgba(214, 77, 131, 0.9)"
            >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </div>
    );
};

const ShieldHeartIconWithCircle = () => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(214, 77, 131, 0.1)",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="rgba(214, 77, 131, 0.9)"
            >
                <path d="M12 2C7.69 2 4.06 3.64 4.06 3.64L4 3.66V12c0 4.95 3.8 9.74 8 11 4.2-1.26 8-6.05 8-11V3.66s-3.63-1.64-7.94-1.64H12zm0 9.5l-.91-.82C9.09 8.84 8 7.92 8 6.8c0-1.1.9-2 2-2 .74 0 1.47.4 1.91 1.03.44-.63 1.17-1.03 1.91-1.03 1.1 0 2 .9 2 2 0 1.12-1.09 2.04-3.09 3.88L12 11.5z" />
            </svg>
        </div>
    );
};

const FunEventsIconWithCircle = () => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(214, 77, 131, 0.1)",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="rgba(214, 77, 131, 0.9)"
            >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                <path d="M7 12h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
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

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [count, setCount] = React.useState(0);

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleAddToWaitlist = async () => {
        // Logic to add the user to the waitlist
        // After successful addition, show the toast
        setLoading(true);
        const response = await waitService.joinWaitlist({ name, email });
        setLoading(false);
        setOpen(true); // Show the toast
    };

    useEffect(() => {
        setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        waitService.getWaitlistData().then((response) => {
            if (response.error) {
                console.error("Error fetching waitlist data:", response.error.message);
                setLoading(false);
                return;
            }
            setCount(response.response.totalCount);
        });
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
                </Flex>
            </div>

            {/* Coming Soon Section */}
            <div className="coming-soon-section">
                {/* Gradient Background */}
                <div className="gradient-bg">
                    <Flex
                        direction="column"
                        gap="6"
                        align="center"
                        className="coming-soon-content"
                    >
                        {/* Line 1: Coming Soon */}
                        <Text size="9" weight="bold" className="coming-soon-heading">
                            Coming Soon
                        </Text>
                        <Text size="4" weight="bold" className="form-heading">
                            Get ready for a revolutionary dating experience. Join our waitlist
                            to be among the first first to find your perfect match.
                        </Text>

                        {/* Line 2: Countdown Cards */}
                        <Flex gap="4" justify="center" className="countdown-cards">
                            {["Days", "Hours", "Minutes", "Seconds"].map((unit, index) => (
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
                                        <input
                                            className="Input"
                                            type="name"
                                            required
                                            placeholder="Full Name"
                                            autoComplete="off"
                                            onChange={onNameChange}
                                        />
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
                                        <input
                                            className="Input"
                                            type="email"
                                            required
                                            placeholder="Email"
                                            autoComplete="off"
                                            onChange={onEmailChange}
                                        />
                                    </Form.Control>
                                </Form.Field>
                                <Button
                                    variant="solid"
                                    className="submit-button"
                                    onClick={handleAddToWaitlist}
                                    loading={loading}
                                    disabled={!email}
                                >
                                    Join Waitlist{" "}
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                                            fill="currentColor"
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                        ></path>
                                    </svg>
                                </Button>
                            </Form.Root>

                            <Text size="3" color="gray" className="waitlist-info">
                                Already <strong>{count}</strong> people are on the waitlist!
                            </Text>
                        </Card>
                    </Flex>
                </div>
            </div>

            <Features />
            <Footer />
            <ToastC
                open={open}
                setOpen={setOpen}
                type="error"
                desc=""
                title="Thanks for joining the waitlist."
            />
        </header>
    );
};

const Features = () => {
    return (
        <div className="features-section">
            <Flex
                direction="row"
                gap="8"
                align="center"
                className="features-container"
            >
                {/* Feature 1: Smart Matching */}
                <Card variant="classic" className="feature-card">
                    <div className="feature-icon">
                        <HeartIconWithCircle />
                    </div>
                    <Text size="4" weight="bold" className="feature-heading">
                        Smart Matching
                    </Text>
                    <br />
                    <Text size="2" color="gray" className="feature-description">
                        Advanced algorithm to find the perfect match based on interests and
                        compatibility.
                    </Text>
                </Card>

                {/* Feature 2: Safe Dating */}
                <Card variant="ghost" className="feature-card">
                    <div className="feature-icon">
                        <ShieldHeartIconWithCircle />
                    </div>
                    <Text size="4" weight="bold" className="feature-heading">
                        Safe Dating
                    </Text>
                    <br />
                    <Text size="2" color="gray" className="feature-description">
                        Aadhar Verified profiles and secure messaging to ensure a safe
                        dating experience.
                    </Text>
                </Card>

                {/* Feature 3: Fun Events */}
                <Card variant="ghost" className="feature-card">
                    <div className="feature-icon">
                        <FunEventsIconWithCircle />
                    </div>
                    <Text size="4" weight="bold" className="feature-heading">
                        Fun Events
                    </Text>
                    <br />
                    <Text size="2" color="gray" className="feature-description">
                        Regular online and offline events to match people and build
                        connections.
                    </Text>
                </Card>
            </Flex>
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="footer">
            <Flex
                direction="column"
                align="center"
                gap="4"
                className="footer-container"
            >
                {/* Brand Name */}
                <Text size="6" weight="bold" color="crimson">
                    Datifyy
                </Text>

                {/* Social Icons */}
                <Flex justify="center" align="center" gap="4">
                    <Link
                        href="https://www.instagram.com/datifyy/"
                        target="_blank"
                        className="social-icon"
                    >
                        <InstagramLogoIcon width="24" height="24" />
                    </Link>
                    <Link
                        href="https://x.com/datifyy"
                        target="_blank"
                        className="social-icon"
                    >
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
