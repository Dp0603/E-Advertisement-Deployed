import { Box, Button, Typography, Avatar, Divider, Tooltip, Fade } from "@mui/material";
import React from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";

export const AdvertiserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const advertiser = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const menu = [
    {
      label: "Profile",
      icon: <PersonIcon />,
      to: "profile",
      active: location.pathname.endsWith("/profile"),
      tooltip: "View or edit your profile",
    },
    {
      label: "Change Password",
      icon: <LockResetIcon />,
      to: "change-password",
      active: location.pathname.endsWith("/change-password"),
      tooltip: "Change your account password",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)", // Match UserProfile background
      }}
    >
      {/* Sidebar */}
      <Fade in>
        <Box
          sx={{
            width: { xs: "100%", sm: 270 },
            minWidth: 220,
            maxWidth: 300,
            background: "linear-gradient(135deg, #112240 60%, #17375E 100%)", // Match UserProfile sidebar
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 5,
            px: 2,
            boxShadow: 6,
            borderRight: "2px solid #21cbf3",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 80,
              height: 80,
              fontSize: 36,
              fontWeight: "bold",
              mb: 2,
              boxShadow: 2,
              border: "2px solid #21cbf3",
              color: "#fff",
            }}
          >
            {advertiser.firstName ? advertiser.firstName[0] : <PersonIcon fontSize="large" />}
          </Avatar>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#21cbf3", mb: 0.5 }}
          >
            {advertiser.firstName} {advertiser.lastName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#e3f2fd",
              mb: 2,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              wordBreak: "break-all",
              fontSize: 15,
              lineHeight: 1.4,
              px: 1,
              maxWidth: 230,
              mx: "auto",
            }}
          >
            <EmailIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
            <span style={{ wordBreak: "break-all" }}>{advertiser.email}</span>
          </Typography>
          <Divider sx={{ width: "100%", borderColor: "#21cbf3", mb: 3 }} />

          {menu.map((item) => (
            <Tooltip key={item.label} title={item.tooltip} placement="right" arrow>
              <Button
                component={Link}
                to={item.to}
                startIcon={item.icon}
                variant={item.active ? "contained" : "outlined"}
                sx={{
                  width: "100%",
                  mb: 2,
                  borderRadius: 3,
                  background: item.active
                    ? "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)"
                    : "transparent",
                  color: item.active ? "#fff" : "#21cbf3",
                  borderColor: "#21cbf3",
                  fontWeight: 600,
                  boxShadow: item.active ? 3 : 0,
                  letterSpacing: 1,
                  "&:hover": {
                    background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                    color: "#fff",
                    borderColor: "#21cbf3",
                  },
                }}
              >
                {item.label}
              </Button>
            </Tooltip>
          ))}

          <Tooltip title="Logout from your account" placement="right" arrow>
            <Button
              startIcon={<LogoutIcon />}
              variant="outlined"
              color="error"
              sx={{
                width: "100%",
                borderRadius: 3,
                fontWeight: 600,
                borderColor: "#D32F2F",
                color: "#fff",
                background: "rgba(211,47,47,0.08)",
                "&:hover": {
                  background: "#D32F2F",
                  color: "#fff",
                  borderColor: "#D32F2F",
                },
                mt: 2,
                letterSpacing: 1,
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ width: "100%", borderColor: "#21cbf3", mt: 3, mb: 1 }} />
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="caption" color="#21cbf3">
              <SettingsIcon
                sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
              />
              Account Settings
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "transparent",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          minHeight: "100vh",
          p: { xs: 2, md: 6 },
        }}
      >
        {location?.pathname === "/advertiserprofile" && (
          <Navigate to="profile" replace />
        )}
        <Outlet />
      </Box>
    </Box>
  );
};
