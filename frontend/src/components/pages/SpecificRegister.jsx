import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Navbar } from "../Navbar";
import { useToast } from "../../context/ToastContext"; // Add this

export const SpecificRegister = () => {
  const navigate = useNavigate();
  const { showToast } = useToast(); // Add this

  const handleRegister = (role) => {
    navigate(`/register/${role}`);
  };

  const submitHandler = async (data) => {
    try {
      // ...API call...
      showToast("Registration successful!", "success");
    } catch (error) {
      showToast("Registration failed.", "error");
    }
  };

  // Set a fixed width and height for both cards
  const cardSize = {
    width: 250,
    minWidth: 250,
    maxWidth: 250,
    height: 320,
    minHeight: 320,
    maxHeight: 320,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    p: 3,
    borderRadius: 3,
    boxShadow: 3,
    border: "2px solid #1976d2",
    background: "linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)",
    transition: "transform 0.3s, box-shadow 0.3s, border 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: 6,
      borderColor: "#21cbf3",
    },
    m: "auto",
  };

  // Match the submit button style and size from Registration/Login
  const buttonStyle = {
    background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "30px",
    boxShadow: "0 4px 20px rgba(25,118,210,0.1)",
    mt: 1,
    py: 1.2,
    fontSize: "0.7rem",
    letterSpacing: 1.2,
    minHeight: 48,
    maxHeight: 48,
    minWidth: "100%",
    maxWidth: "100%",
    transition: "all 0.2s",
    "&:hover": {
      background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
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
          pt: { xs: 8, md: 10 },
          pb: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              background: "linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)",
              border: "2px solid #1976d2",
              borderRadius: 4,
              boxShadow: 4,
              p: { xs: 3, sm: 5 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Register as
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="textSecondary"
              sx={{ mb: 4, maxWidth: 400 }}
            >
              Choose your role to get the best experience tailored for you.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Register as User */}
              <Card sx={cardSize}>
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 56,
                    height: 56,
                    mb: 2,
                    boxShadow: 2,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 32, color: "#fff" }} />
                </Avatar>
                <CardContent sx={{ p: 0, mb: 2 }}>
                  <Typography
                    variant="h6"
                    align="center"
                    fontWeight="bold"
                    sx={{ color: "#1976d2" }}
                  >
                    User
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    color="textSecondary"
                  >
                    For customers who want to explore and interact with ads.
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={buttonStyle}
                  onClick={() => handleRegister("user")}
                >
                  Register as User
                </Button>
              </Card>

              {/* Register as Advertiser */}
              <Card sx={cardSize}>
                <Avatar
                  sx={{
                    bgcolor: "#21cbf3",
                    width: 56,
                    height: 56,
                    mb: 2,
                    boxShadow: 2,
                  }}
                >
                  <CampaignIcon sx={{ fontSize: 32, color: "#fff" }} />
                </Avatar>
                <CardContent sx={{ p: 0, mb: 2 }}>
                  <Typography
                    variant="h6"
                    align="center"
                    fontWeight="bold"
                    sx={{ color: "#1976d2" }}
                  >
                    Advertiser
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    color="textSecondary"
                  >
                    For businesses or individuals who want to promote their
                    products or services.
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={buttonStyle}
                  onClick={() => handleRegister("advertiser")}
                >
                  Register as Advertiser
                </Button>
              </Card>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};
