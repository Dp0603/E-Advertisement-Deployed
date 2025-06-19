import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Paper,
  Divider,
  Fade,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export const UserInfo = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const [user, setUser] = useState({ data: {} });
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserById();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user && user.data) {
      setValue("firstName", user.data.firstName || "");
      setValue("lastName", user.data.lastName || "");
      setValue("email", user.data.email || "");
    }
  }, [user, setValue]);

  const fetchUserById = async () => {
    try {
      const res = await API.get(`/auth/user/${userId}`);
      setUser(res.data);
    } catch (error) {
      toast.error("Failed to fetch user info");
    }
  };

  const submitHandler = async (data) => {
    try {
      await API.put(`/auth/userupdateprofile/${userId}`, data);
      toast.success("Details successfully updated!");
      setIsEdit(false);
      fetchUserById();
    } catch (error) {
      toast.error("Error updating details");
    }
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
        position: "relative",
      }}
    >
      {/* Back to Dashboard Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          borderRadius: 3,
          fontWeight: 600,
          borderColor: "#21cbf3",
          color: "#21cbf3",
          background: "#112240",
          px: 3,
          zIndex: 10,
          "&:hover": {
            borderColor: "#1976d2",
            color: "#1976d2",
            background: "#e3f2fd",
          },
        }}
        onClick={() => navigate("/user/dashboard")}
      >
        Back to Dashboard
      </Button>
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
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Profile Header */}
          <Box sx={{ position: "relative", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                sx={{
                  bgcolor: deepOrange[500],
                  height: 90,
                  width: 90,
                  fontWeight: "bold",
                  fontSize: "38px",
                  boxShadow: 2,
                }}
              >
                {user.data?.firstName ? (
                  user.data.firstName[0]
                ) : (
                  <PersonIcon fontSize="large" />
                )}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: "#21cbf3",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.data?.firstName} {user.data?.lastName}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#e3f2fd",
                    display: "flex",
                    alignItems: "center",
                    mt: 0.5,
                    minWidth: 0,
                  }}
                >
                  <EmailIcon
                    sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }}
                  />
                  <span
                    style={{
                      wordBreak: "break-all",
                      display: "block",
                      maxWidth: 260,
                    }}
                  >
                    {user.data?.email}
                  </span>
                </Typography>
              </Box>
            </Box>
            {!isEdit && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  borderRadius: "30px",
                  fontWeight: 600,
                  background:
                    "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                  color: "#fff",
                  px: 4,
                  minWidth: 80,
                  boxShadow: 2,
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                    color: "#fff",
                  },
                }}
                onClick={() => setIsEdit(true)}
              >
                Edit
              </Button>
            )}
          </Box>

          <Divider sx={{ borderColor: "#21cbf3", mb: 3 }} />

          <form onSubmit={handleSubmit(submitHandler)}>
            {/* Always use the same style and variant for both view and edit */}
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
              label="First Name"
              {...register("firstName", { required: "First name is required" })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              fullWidth
              disabled={!isEdit}
              value={user.data?.firstName || ""}
              InputProps={{
                readOnly: !isEdit,
                disableUnderline: true,
              }}
              onChange={(e) => setValue("firstName", e.target.value)}
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
              label="Last Name"
              {...register("lastName", { required: "Last name is required" })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              fullWidth
              disabled={!isEdit}
              value={user.data?.lastName || ""}
              InputProps={{
                readOnly: !isEdit,
                disableUnderline: true,
              }}
              onChange={(e) => setValue("lastName", e.target.value)}
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
              label="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              fullWidth
              disabled={!isEdit}
              value={user.data?.email || ""}
              InputProps={{
                readOnly: !isEdit,
                disableUnderline: true,
              }}
              onChange={(e) => setValue("email", e.target.value)}
            />

            {isEdit && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    borderRadius: "30px",
                    fontWeight: 600,
                    background:
                      "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                    color: "#fff",
                    px: 3,
                    boxShadow: 2,
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                      color: "#fff",
                    },
                  }}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  sx={{
                    borderRadius: "30px",
                    fontWeight: 600,
                    ml: 2,
                    borderColor: "#21cbf3",
                    color: "#21cbf3",
                    px: 3,
                    "&:hover": {
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      background: "#e3f2fd",
                    },
                  }}
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </form>
        </Paper>
      </Fade>
    </Box>
  );
};
