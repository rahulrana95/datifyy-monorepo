// apps/frontend/src/mvp/home/landingPage.tsx
import React from 'react';
import { Box } from '@chakra-ui/react';

// Import components
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTAAndFooter from './components/CTAAndFooter';

const LandingPage: React.FC = () => {
    return (
        <Box minH="100vh">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTAAndFooter />
        </Box>
    );
};

export default LandingPage;