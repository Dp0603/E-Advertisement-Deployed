import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
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

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/user/forgotpassword", data);
      setLoading(false);
      if (res.data.message) {
        toast.success("Reset Link Sent! Check your email.");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Email not found. Please check your Email!");
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
                Sending Reset Link...
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
            Forgot Password
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Enter your email to receive a reset link.
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
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
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
              {loading ? "Processing..." : "Send Reset Link"}
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", color: "#1976d2" }}
          >
            Remember your password?{" "}
            <Link to="/login" style={{ color: "#1976d2", fontWeight: 500 }}>
              Login here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
