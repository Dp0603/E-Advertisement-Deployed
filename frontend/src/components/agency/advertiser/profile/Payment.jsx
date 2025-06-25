import React from "react";
import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useToast } from "../../../../context/ToastContext";
import { useLoader } from "../../../../context/LoaderContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  const handlePayment = async () => {
    showLoader("Processing payment...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      showToast("Payment processed successfully!", "success");
    } catch (err) {
      showToast("Something went wrong during payment.", "error");
    }
    hideLoader();
  };

  // Get advertiserId from token (like PersonalInfo)
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const advertiserId = decodedToken.id;
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        py: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Back to Dashboard Button (like PersonalInfo) */}
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
        onClick={() => {
          if (advertiserId) {
            navigate(`/advertiser/dashboard/${advertiserId}`);
          } else {
            navigate("/login");
          }
        }}
      >
        Back to Dashboard
      </Button>

      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
          border: "2px solid #21cbf3",
          boxShadow: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: { xs: "90vw", sm: 400 },
          maxWidth: 500,
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
          <MonetizationOnIcon sx={{ color: "#fff", fontSize: 38 }} />
        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: "#21cbf3",
            mb: 2,
            letterSpacing: 1,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Payment
        </Typography>

        <Divider sx={{ width: "100%", mb: 2, borderColor: "#21cbf3" }} />

        <Typography
          variant="body1"
          sx={{
            color: "#fff",
            opacity: 0.9,
            textAlign: "center",
            mb: 2,
            fontSize: "1.1rem",
          }}
        >
          This is a placeholder for the advertiser payment functionality.
          <br />
          Integrate your payment gateway or payment details here.
        </Typography>

        <Button
          onClick={handlePayment}
          variant="contained"
          sx={{
            mt: 3,
            borderRadius: "30px",
            fontWeight: 600,
            px: 4,
            py: 1.2,
            fontSize: "1rem",
            background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
            },
          }}
        >
          Proceed to Pay
        </Button>
      </Paper>
    </Box>
  );
};

export default Payment;
