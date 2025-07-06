import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { Button } from "../../common/button/button";

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Profile Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box textAlign="center" py={20}>
                    <Text fontSize="xl" color="red.500" mb={4}>
                        Something went wrong loading your profile
                    </Text>
                    <Button
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Try Again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}