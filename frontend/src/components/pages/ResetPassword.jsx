import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

const ResetPassword = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await API.post(`/auth/resetpassword/${token}`, {
        password: data.password,
      });
      setLoading(false);
      if (res.data.message) {
        toast.success("Password reset successful! Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          "Invalid or expired link. Please try again."
      );
    }
  };

  return (
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
            position: "relative",
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.7)",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
              }}
            >
              <CircularProgress color="primary" />
              <Typography sx={{ mt: 2, color: "#1976d2" }}>
                Resetting Password...
              </Typography>
            </Box>
          )}

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
            <LockResetIcon sx={{ color: "#fff", fontSize: 38 }} />
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
            Reset Password
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Enter your new password below.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(submitHandler)}
            sx={{ width: "100%" }}
          >
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
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
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", color: "#1976d2" }}
          >
            Back to{" "}
            <Link to="/login" style={{ color: "#1976d2", fontWeight: 500 }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;