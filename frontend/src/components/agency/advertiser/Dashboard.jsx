import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Typography,
  Tooltip,
  Fade,
} from "@mui/material";
import { useNavigate, useParams, Link, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashboardSidebar from "./DashboardSidebar";
import EventNoteIcon from "@mui/icons-material/EventNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";

export const Dashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line
  }, [id]);

  const checkUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/token");
    }
    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.role;
      const userId = decoded.id;
      if (userId !== id || userRole !== "advertiser") {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  // Card data for easy mapping
  const dashboardCards = [
    {
      title: "Bookings",
      description: "Manage all your advertisement bookings in one place.",
      icon: <EventNoteIcon sx={{ fontSize: 40, color: "#21cbf3" }} />, // Changed to lighter color
      buttonText: "Manage Bookings",
      to: "/managebookings",
      tooltip: "View and manage your bookings",
    },
    {
      title: "Screenings / Hoarding",
      description: "Browse available screens and hoardings for your ads.",
      icon: <VisibilityIcon sx={{ fontSize: 40, color: "#21cbf3" }} />,
      buttonText: "View Screens",
      to: "/screenings2",
      tooltip: "See available screens/hoardings",
    },
    {
      title: "Ad Detail Form",
      description: "Create a new advertisement and submit your details.",
      icon: <AddCircleOutlineIcon sx={{ fontSize: 40, color: "#21cbf3" }} />, // Changed to lighter color
      buttonText: "Create Ad",
      to: "/ad-details2",
      tooltip: "Create a new advertisement",
    },
  ];

  return (
    <>
      <CssBaseline />
      <DashboardSidebar />
      {/* Logout Button Top Right */}
      <Box
        sx={{
          position: "fixed",
          top: 32,
          right: 32,
          zIndex: 1200,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            borderColor: "#D32F2F",
            color: "#fff",
            background: "rgba(211,47,47,0.08)",
            px: 3,
            "&:hover": {
              background: "#D32F2F",
              color: "#fff",
              borderColor: "#D32F2F",
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 6,
          pb: 4,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "80vh",
          }}
        >
          {/* Dashboard Heading */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 4,
              textTransform: "uppercase",
              color: "#fff",
              textAlign: "center",
              letterSpacing: 2,
              fontFamily: "Montserrat, Roboto, Arial",
              textShadow: "0 4px 24px rgba(33,203,243,0.10)",
            }}
          >
            Advertiser Dashboard
          </Typography>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
            sx={{ width: "100%" }}
          >
            {dashboardCards.map((card, idx) => (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <Fade in timeout={600 + idx * 200}>
                  <Card
                    sx={{
                      background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
                      color: "#fff",
                      p: 3,
                      textAlign: "center",
                      borderRadius: 4,
                      boxShadow: 6,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "0.3s",
                      border: "2px solid #1976d2",
                      "&:hover": {
                        transform: "translateY(-6px) scale(1.04)",
                        boxShadow: 12,
                        borderColor: "#21cbf3",
                        background: "linear-gradient(135deg, #17375E 60%, #112240 100%)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                        boxShadow: 3,
                        mx: "auto",
                      }}
                    >
                      {card.icon}
                    </Box>
                    <CardContent sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          mb: 1,
                          color: "#21cbf3",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="inherit"
                        sx={{ mb: 2, minHeight: 48 }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                    <Tooltip title={card.tooltip} arrow>
                      <Button
                        component={Link}
                        to={card.to}
                        variant="contained"
                        size="large"
                        sx={{
                          background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "30px",
                          px: 4,
                          py: 1.2,
                          fontSize: "1rem",
                          letterSpacing: 1,
                          boxShadow: "0 4px 20px rgba(25,118,210,0.12)",
                          transition: "all 0.2s",
                          "&:hover": {
                            background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                            color: "#fff",
                          },
                        }}
                      >
                        {card.buttonText}
                      </Button>
                    </Tooltip>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Outlet />
    </>
  );
};
