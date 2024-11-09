// src/components/Login.tsx

import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useUserStore } from "../stores/userStore";
import axios from "axios";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const params = useParams();
  const setUser = useUserStore((state) => state.setUser);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate a login by directly setting the user in Zustand
    if (email && password) {
      try {
        await axiosInstance.post(`/events/${params.eventId}/verify-passcode`);
      } catch (err) {
      } finally {
      }
      // Ideally, perform API call here to validate user credentials
      setUser(email);
      console.log("User logged in:", email);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 400,
        margin: "auto",
        mt: 8,
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Unique Passcode (You got it via email)"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
