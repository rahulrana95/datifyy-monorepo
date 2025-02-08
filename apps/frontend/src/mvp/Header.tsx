import {
  Box,
  Flex,
  Spacer,
  Button,
  Link,
  HStack,
  Image,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuthStore } from "./login-signup/authStore";
import AuthModal from "./login-signup/AuthModal";
import UserMenu from "./UserMenu";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import DatifyLogo from "../assets/images/datifyy-logo-v2.png";

const Header = () => {
  const { showHideLogin, showHideSignup, isAuthenticated } = useAuthStore();
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      navigate("/", { replace: true }); // Redirect to home
    }
  }, [authStore.isAuthenticated, navigate]);

  // Highlight active link
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* HEADER */}
      <Box
        bg={useColorModeValue("white", "gray.800")}
        px={6}
        py={4}
        boxShadow="lg"
        className="global-header"
        borderBottom="3px solid"
        borderColor="pink.400"
      >
        <Flex align="center">
          {/* Logo */}
          <Box>
            <Image
              src={DatifyLogo}
              alt="Datifyy Logo"
              boxSize="60px"
              objectFit="contain"
              cursor="pointer"
              onClick={() => navigate("/")}
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.1)" }}
            />
          </Box>

          <Spacer />

          {/* Navigation Links */}
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            {[
              { label: "Home", path: "/" },
              { label: "About Us", path: "/about-us" },
            ].map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                fontWeight="medium"
                fontSize="lg"
                color={isActive(path) ? "pink.500" : "gray.600"}
                textDecoration={isActive(path) ? "underline" : "none"}
                _hover={{
                  color: "pink.500",
                  transform: "scale(1.05)",
                  transition: "0.2s ease-in-out",
                }}
              >
                {label}
              </Link>
            ))}
          </HStack>

          <Spacer />

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <HStack spacing={4}>
              <Button
                colorScheme="pink"
                variant="ghost"
                _hover={{ bg: "pink.100" }}
                onClick={() => showHideSignup(true)}
              >
                Sign Up
              </Button>
              <Button
                colorScheme="pink"
                rightIcon={<FaHeart />}
                _hover={{
                  bgGradient: "linear(to-r, pink.400, red.400)",
                  color: "white",
                  transform: "scale(1.05)",
                  transition: "0.2s",
                }}
                onClick={() => showHideLogin(true)}
              >
                Login
              </Button>
            </HStack>
          ) : (
            <UserMenu />
          )}
        </Flex>
      </Box>

      {/* Authentication Modal */}
      <AuthModal />
    </>
  );
};

export default Header;
