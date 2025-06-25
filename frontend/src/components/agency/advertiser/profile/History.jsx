import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
// import Navbar from "../../Navbar"; // Adjust path if needed

const History = () => {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
          py: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
            <HistoryIcon sx={{ color: "#fff", fontSize: 38 }} />
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
            History
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
            This is a placeholder for the advertiser history page.
            <br />
            Display your booking/payment/ad history here.
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default History;
