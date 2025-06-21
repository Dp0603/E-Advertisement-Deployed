import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  Fade,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../../../api/axios";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../../../../context/ToastContext";
import { useLoader } from "../../../../context/LoaderContext";

export const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const advertiserId = decodedToken.id;

  const submitHandler = async (data) => {
    setLoading(true);
    showLoader("Updating password...");
    try {
      const res = await API.put(`/auth/updatepassword/${advertiserId}`, data);
      showToast(res?.data?.message || "Password updated", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Error updating password",
        "error"
      );
    }
    setLoading(false);
    hideLoader();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
        px: 2,
      }}
    >
      <Fade in>
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 520,
            mx: "auto",
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
            border: "2px solid #21cbf3",
            boxShadow: 8,
            color: "#fff",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "#21cbf3", mb: 1 }}
          >
            Change Password
          </Typography>
          <Divider sx={{ borderColor: "#21cbf3", mb: 3 }} />

          <form onSubmit={handleSubmit(submitHandler)}>
            <TextField
              sx={{
                mb: 3,
                borderRadius: 3,
                "& .MuiFilledInput-root": {
                  background: "#fff",
                  color: "#111",
                  fontWeight: 600,
                  fontSize: 18,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px 0 rgba(33,203,243,0.06)",
                  "&:hover": {
                    background: "#f5f5f5",
                  },
                  "&.Mui-focused": {
                    background: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 3,
                  background: "#fff",
                  px: 0.5,
                },
                "& .Mui-disabled": {
                  background: "#fff",
                  color: "#111",
                  opacity: 1,
                  borderRadius: 3,
                  WebkitTextFillColor: "#111",
                },
              }}
              label="Current Password"
              type="password"
              {...register("oldPassword", {
                required: "Current password is required",
              })}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword?.message}
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              fullWidth
            />

            <TextField
              sx={{
                mb: 3,
                borderRadius: 3,
                "& .MuiFilledInput-root": {
                  background: "#fff",
                  color: "#111",
                  fontWeight: 600,
                  fontSize: 18,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px 0 rgba(33,203,243,0.06)",
                  "&:hover": {
                    background: "#f5f5f5",
                  },
                  "&.Mui-focused": {
                    background: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 3,
                  background: "#fff",
                  px: 0.5,
                },
                "& .Mui-disabled": {
                  background: "#fff",
                  color: "#111",
                  opacity: 1,
                  borderRadius: 3,
                  WebkitTextFillColor: "#111",
                },
              }}
              label="New Password"
              type="password"
              {...register("newPassword", {
                required: "New password is required",
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              fullWidth
            />

            <TextField
              sx={{
                mb: 3,
                borderRadius: 3,
                "& .MuiFilledInput-root": {
                  background: "#fff",
                  color: "#111",
                  fontWeight: 600,
                  fontSize: 18,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px 0 rgba(33,203,243,0.06)",
                  "&:hover": {
                    background: "#f5f5f5",
                  },
                  "&.Mui-focused": {
                    background: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#000",
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 3,
                  background: "#fff",
                  px: 0.5,
                },
                "& .Mui-disabled": {
                  background: "#fff",
                  color: "#111",
                  opacity: 1,
                  borderRadius: 3,
                  WebkitTextFillColor: "#111",
                },
              }}
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: "30px",
                  fontWeight: 600,
                  background:
                    "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                  color: "#fff",
                  px: 4,
                  minWidth: 120,
                  boxShadow: 2,
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                    color: "#fff",
                  },
                }}
                disabled={loading}
              >
                {loading ? "Changing..." : "Change"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
};
