import { Box, Flex, Spacer, Button, Link, HStack } from "@chakra-ui/react";
import AuthModal from "./login-signup/login";
import { useAuthStore } from "./login-signup/authStore";

const Header = () => {
  const { toggleLogin } = useAuthStore();

  return (
    <>
      {/* HEADER */}
      <Box bg="white" px={6} py={4} boxShadow="md">
        <Flex align="center">
          <Box fontSize="2xl" fontWeight="bold" color="pink.500">
            Datifyy
          </Box>

          <Spacer />

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

          <HStack spacing={4}>
            <Button
              colorScheme="pink"
              variant="outline"
              onClick={() => toggleLogin(true)}
            >
              Sign Up
            </Button>
            <Button colorScheme="pink" onClick={() => toggleLogin(true)}>
              Login
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Authentication Modal */}
      <AuthModal />
    </>
  );
};

export default Header;
