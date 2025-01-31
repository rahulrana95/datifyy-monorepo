import { Box, Flex, Spacer, Button, Link, HStack } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box bg="white" px={6} py={4} boxShadow="md">
      <Flex align="center">
        {/* Left: Logo */}
        <Box fontSize="2xl" fontWeight="bold" color="pink.500">
          Datifyy
        </Box>

        <Spacer />

        {/* Center-Right: Navigation Links */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <Link
            href="/"
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: "pink.500" }}
          >
            Home
          </Link>
          <Link
            href="/about"
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: "pink.500" }}
          >
            About Us
          </Link>
        </HStack>

        <Spacer />

        {/* Right: Sign Up & Login Buttons */}
        <HStack spacing={4}>
          <Button as={Link} href="/signup" colorScheme="pink" variant="outline">
            Sign Up
          </Button>
          <Button as={Link} href="/login" colorScheme="pink">
            Login
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
