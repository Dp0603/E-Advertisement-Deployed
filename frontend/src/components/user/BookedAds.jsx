import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Button,
  Paper,
  Divider,
  Fade,
} from "@mui/material";
import { CheckCircle, Close, Dashboard } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";

const BookedAds = () => {
  const [bookedAds, setBookedAds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user from localStorage for profile card
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchBookedAds = async () => {
      try {
        const res = await API.get("/getbookings");
        setBookedAds(res.data.data);
      } catch (error) {
        console.error("Error fetching booked ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookedAds();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: { xs: 4, md: 8 },
        px: 2,
      }}
    >
      {/* User Profile Card with Dashboard Button */}
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
          border: "2px solid #21cbf3",
          boxShadow: 8,
          maxWidth: 700,
          width: "100%",
          mx: "auto",
          mb: 5,
          color: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 80,
              height: 80,
              fontSize: 36,
              fontWeight: "bold",
              boxShadow: 2,
            }}
          >
            {user.firstName ? user.firstName[0] : <PersonIcon fontSize="large" />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#21cbf3" }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" sx={{ color: "#21cbf3", mb: 1 }}>
              {user.email}
            </Typography>
            <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
              <CalendarMonthIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
              Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/user/dashboard"
            variant="contained"
            startIcon={<Dashboard />}
            sx={{
              borderRadius: "30px",
              fontWeight: 600,
              background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
              color: "#fff",
              px: 3,
              boxShadow: 2,
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                color: "#fff",
              },
            }}
          >
            Dashboard
          </Button>
        </Box>
      </Paper>

      {/* Booked Ads Section */}
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          mb: 4,
          p: { xs: 2, md: 4 },
          borderRadius: 5,
          background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
          border: "2px solid #21cbf3",
          boxShadow: 8,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#21cbf3",
            mb: 1,
            letterSpacing: 1,
          }}
        >
          BOOKED ADS
        </Typography>
        <Typography variant="body1" sx={{ color: "#e3f2fd", mb: 2 }}>
          Here is the list of ads you have booked.
        </Typography>
        <Divider sx={{ borderColor: "#21cbf3", mb: 2 }} />
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#21cbf3" }} />
        </Box>
      ) : bookedAds.length === 0 ? (
        <Paper
          elevation={6}
          sx={{
            mt: 8,
            px: 4,
            py: 6,
            borderRadius: 4,
            background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
            border: "2px solid #21cbf3",
            color: "#fff",
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            No bookings found.
          </Typography>
          <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
            You haven't booked any ads yet. Browse ads and book your favorite slots!
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 3,
              background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
              color: "#fff",
              borderRadius: "30px",
              fontWeight: 600,
              px: 3,
              boxShadow: 2,
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                color: "#fff",
              },
            }}
            component={Link}
            to="/browseads"
          >
            Browse Ads
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "28px",
            justifyContent: "center",
            width: "100%",
            maxWidth: 1100,
          }}
        >
          {bookedAds.map((booking) => (
            <Fade in key={booking._id}>
              <Card
                sx={{
                  boxShadow: 6,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #17375E 60%, #112240 100%)",
                  border: "2px solid #21cbf3",
                  color: "#fff",
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  px: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#21cbf3" }}>
                    {booking.adId?.title || "Ad Title"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e3f2fd", mt: 1 }}>
                    📅 Start: {new Date(booking.startTime).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
                    🏁 End: {new Date(booking.endTime).toLocaleString()}
                  </Typography>
                  {/* STATUS with ICON */}
                  <Box display="flex" alignItems="center" mt={1}>
                    {booking.status === "confirmed" ? (
                      <>
                        <CheckCircle sx={{ color: "#21cbf3", mr: 1 }} />
                        <Typography variant="body2" fontWeight="bold" sx={{ color: "#21cbf3" }}>
                          Status: CONFIRMED
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Close sx={{ color: "#D32F2F", mr: 1 }} />
                        <Typography variant="body2" fontWeight="bold" sx={{ color: "#D32F2F" }}>
                          Status: REJECTED
                        </Typography>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BookedAds;
