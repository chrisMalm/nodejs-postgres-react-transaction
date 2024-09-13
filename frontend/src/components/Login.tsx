import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider ";
// import {getUser} from "../api"

export const LoginForm = () => {
    const { login, error} = useAuth();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [userNameError, setUserNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    // const [bkError, setBkError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve token from session storage on
        //  if logged out it will return login
        const storedToken = sessionStorage.getItem('authToken');
        if (storedToken) {
            navigate("/home")
        }
      }, [navigate]);

    const validateUserName = () => {
      if (!userName) {
        setUserNameError("Username is required");
        return false;
      } else {
        setUserNameError("");
        return true;
      }
    };
    const validatePassword = () => {
      if (!password) {
        setPasswordError("Password is required");
        return false;
      } else {
        setPasswordError("");
        return true;
      }
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (validateUserName() && validatePassword()) {
        login(userName, password)
        setPassword("")
        setUserName("")
      }
    };
    return (
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Box
          borderWidth={1}
          px={4}
          width="md"
          borderRadius={8}
          boxShadow="lg"
          p={8}
        >
          <Box textAlign="center">
            <Heading>Login</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit}>
              <FormControl isInvalid={!!userNameError}>
                {!!error &&<FormErrorMessage>{error}</FormErrorMessage>
            }
                <FormLabel>Username</FormLabel>
                <Input
                  type="user"
                  placeholder="john"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={validateUserName}
                />
                <FormErrorMessage>{userNameError}</FormErrorMessage>
              </FormControl>
              <FormControl mt={6} isInvalid={!!passwordError}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                />
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              </FormControl>
              <Button
                width="full"
                mt={4}
                colorScheme="teal"
                type="submit"
                onClick={handleSubmit}
              >
                Sign In
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    );
  };
