import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { toast, Bounce } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Navbar } from "../Navbar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", data);
      const token = res.data?.token || res.data?.message?.token;
      const user = res.data?.user || res.data?.message?.user;
      if (token && user) {
        localStorage.removeItem("token");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); // Store user details
      } else {
        console.error("No token received from the server");
      }

      const decoded = jwtDecode(token);
      const userRole = decoded.role;
      const userId = decoded.id;
      if (userRole === "advertiser") {
        navigate(`/advertiser/dashboard/${userId}`);
      } else {
        navigate("/user/dashboard");
      }
      toast.success("Successfully logged in!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      toast.error("Login Failed. Please check your credentials", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };
  const validations = {
    emailValidation: {
      required: {
        value: true,
        message: "Email is required",
      },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Email is invalid !",
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
          py: 6,
        }}
      >
        <Container maxWidth="sm">
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
              <LockOutlinedIcon sx={{ color: "#fff", fontSize: 38 }} />
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
              Login
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Welcome back! Please login to your account.
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(submitHandler)}
              sx={{ width: "100%" }}
            >
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                {...register("email", validations.emailValidation)}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                variant="outlined"
                margin="normal"
                {...register("password", validations.passwordValidation)}
                error={!!errors.password}
                helperText={errors.password?.message}
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
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Don't have an account?{" "}
                <Link
                  to="/register/:role"
                  style={{ color: "#1976d2", fontWeight: 500 }}
                >
                  Register here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Login;
//Dhanush!@2807
