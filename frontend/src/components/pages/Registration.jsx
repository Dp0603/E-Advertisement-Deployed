import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../Navbar";
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useToast } from "../../context/ToastContext"; // Add this

const NAVBAR_HEIGHT = 72; // Match Login

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { role } = useParams();
  const { showToast } = useToast(); // Add this

  const validations = {
    nameValidation: {
      required: {
        value: true,
        message: "First name is required",
      },
      minLength: {
        value: 2,
        message: "Name should be at least 2 characters long!",
      },
    },
    lastNameValidation: {
      required: {
        value: true,
        message: "Last name is required",
      },
    },
    emailValidation: {
      required: {
        value: true,
        message: "Email is required",
      },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Email is invalid!",
      },
    },
    passwordValidation: {
      required: {
        value: true,
        message: "Password is required",
      },
      pattern: {
        value: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/,
        message:
          "Password should contain at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character",
      },
    },
  };

  const handlerSubmit = async (data) => {
    setLoading(true);
    const endpoint =
      role === "advertiser" ? "/auth/register/advertiser" : "/auth/register";
    try {
      const res = await API.post(endpoint, data);
      showToast("Registration successful!", "success");
      navigate("/login");
    } catch (error) {
      showToast("Registration failed. Please try again.", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #e3f2fd 60%, #f8fafc 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: `${NAVBAR_HEIGHT}px`,
          pb: 4,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)",
              border: "2px solid #1976d2",
              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                width: 70,
                height: 70,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: 2,
              }}
            >
              <PersonIcon sx={{ color: "#fff", fontSize: 38 }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "#1976d2",
                mb: 2,
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              Registration
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Create your account to get started!
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(handlerSubmit)}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...register("firstName", validations.nameValidation)}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  {...register("lastName", validations.lastNameValidation)}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("email", validations.emailValidation)}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", validations.passwordValidation)}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  background:
                    "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "30px",
                  boxShadow: "0 4px 20px rgba(25,118,210,0.1)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                  },
                }}
              >
                {loading ? "Registering..." : "Register"}
              </Button>

              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1976d2", fontWeight: 500 }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Registration;
