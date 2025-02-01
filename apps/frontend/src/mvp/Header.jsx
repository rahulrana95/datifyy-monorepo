import { Box, Flex, Spacer, Button, Link, HStack } from "@chakra-ui/react";
import { useAuthStore } from "./login-signup/authStore";
import AuthModal from "./login-signup/AuthModal";
import UserMenu from "./UserMenu";

const Header = () => {
  const { showHideLogin, showHideSignup, isAuthenticated } = useAuthStore();

  return (
    <>
      {/* HEADER */}
      <Box bg="white" px={6} py={4} boxShadow="md" className="global-header">
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

          {!isAuthenticated && (
            <HStack spacing={4}>
              <Button
                colorScheme="pink"
                variant="outline"
                onClick={() => showHideSignup(true)}
              >
                Sign Up
              </Button>
              <Button
                colorScheme="pink"
                onClick={() => {
                  showHideLogin(true);
                }}
              >
                Login
              </Button>
            </HStack>
          )}
          {isAuthenticated && <UserMenu />}
        </Flex>
      </Box>

      {/* Authentication Modal */}
      <AuthModal />
    </>
  );
};

export default Header;
