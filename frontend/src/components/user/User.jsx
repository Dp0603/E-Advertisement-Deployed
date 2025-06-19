import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Box,
  CssBaseline,
  Avatar,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import UserSidebar from "./UserSidebar";

const Footer = () => (
  <Box
    sx={{
      width: "100%",
      background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
      color: "white",
      textAlign: "center",
      py: 2,
      mt: "auto",
      boxShadow: "0px -2px 12px rgba(33,203,243,0.08)",
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      © {new Date().getFullYear()} AdVerse. All rights reserved.
    </Typography>
  </Box>
);

export const User = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [savedAds, setSavedAds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch saved ads and bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch saved ads
        const savedRes = await API.get(`/user/saved-ads/${user._id}`);
        setSavedAds(savedRes.data || []);
        // Fetch bookings
        const bookingRes = await API.get(`/user/bookings/${user._id}`);
        setBookings(bookingRes.data || []);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    if (user._id) fetchData();
    else setLoading(false);
  }, [user._id]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <CssBaseline />
      <UserSidebar />

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
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* User Profile Card */}
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
                  <EmailIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                  {user.email}
                </Typography>
                <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
                  <CalendarMonthIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                  Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/userprofile/profile"
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: "30px",
                  fontWeight: 600,
                  borderColor: "#21cbf3",
                  color: "#21cbf3",
                  "&:hover": {
                    borderColor: "#1976d2",
                    background: "#e3f2fd",
                    color: "#1976d2",
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>

          {/* Dashboard Quick Actions */}
          <Grid container spacing={4} sx={{ mb: 5, justifyContent: "center" }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 6,
                  background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
                  border: "1.5px solid #21cbf3",
                  textAlign: "center",
                  height: "100%",
                  color: "#fff",
                }}
              >
                <BookmarkIcon sx={{ color: "#21cbf3", fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#21cbf3" }}>
                  Saved Ads
                </Typography>
                <Typography variant="body2" sx={{ color: "#e3f2fd", mb: 2 }}>
                  View and manage your saved advertisements.
                </Typography>
                <Button
                  component={Link}
                  to="/saved-ads"
                  variant="contained"
                  sx={{
                    background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                    color: "#fff",
                    borderRadius: "30px",
                    fontWeight: 600,
                    px: 3,
                    "&:hover": {
                      background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                    },
                  }}
                >
                  View Saved Ads
                </Button>
                <Typography variant="h4" sx={{ mt: 2, color: "#21cbf3" }}>
                  {savedAds.length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 6,
                  background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
                  border: "1.5px solid #21cbf3",
                  textAlign: "center",
                  height: "100%",
                  color: "#fff",
                }}
              >
                <AssignmentIcon sx={{ color: "#21cbf3", fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#21cbf3" }}>
                  My Bookings
                </Typography>
                <Typography variant="body2" sx={{ color: "#e3f2fd", mb: 2 }}>
                  Check your ad bookings and their status.
                </Typography>
                <Button
                  component={Link}
                  to="/getbookings"
                  variant="contained"
                  sx={{
                    background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                    color: "#fff",
                    borderRadius: "30px",
                    fontWeight: 600,
                    px: 3,
                    "&:hover": {
                      background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                    },
                  }}
                >
                  View Bookings
                </Button>
                <Typography variant="h4" sx={{ mt: 2, color: "#21cbf3" }}>
                  {bookings.length}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Saved Ads */}
          <Paper
            elevation={6}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
              border: "2px solid #21cbf3",
              boxShadow: 8,
              maxWidth: 1100,
              width: "100%",
              mx: "auto",
              mb: 5,
              color: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#21cbf3", mb: 2 }}>
              Recent Saved Ads
            </Typography>
            {loading ? (
              <CircularProgress sx={{ color: "#21cbf3" }} />
            ) : savedAds.length === 0 ? (
              <Typography sx={{ color: "#e3f2fd" }}>No saved ads yet.</Typography>
            ) : (
              <Grid container spacing={3}>
                {savedAds.slice(0, 3).map((ad) => (
                  <Grid item xs={12} sm={6} md={4} key={ad._id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 4,
                        background: "linear-gradient(135deg, #17375E 60%, #112240 100%)",
                        border: "1.5px solid #21cbf3",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        color: "#fff",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: 12,
                          borderColor: "#21cbf3",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={ad.adUrl || "/placeholder.jpg"}
                        alt={ad.title}
                        sx={{
                          objectFit: "cover",
                          borderRadius: "12px 12px 0 0",
                          borderBottom: "1.5px solid #21cbf3",
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: "#21cbf3" }}>
                          {ad.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#e3f2fd", mb: 1 }}>
                          {ad.description?.substring(0, 60)}...
                        </Typography>
                        <Button
                          component={Link}
                          to={`/viewdetails/${ad._id}`}
                          size="small"
                          sx={{
                            mt: 1,
                            color: "#21cbf3",
                            fontWeight: 600,
                            borderRadius: "20px",
                            border: "1px solid #21cbf3",
                            px: 2,
                            "&:hover": {
                              background: "#e3f2fd",
                              color: "#1976d2",
                              borderColor: "#1976d2",
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>

          {/* Recent Bookings */}
          <Paper
            elevation={6}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
              border: "2px solid #21cbf3",
              boxShadow: 8,
              maxWidth: 1100,
              width: "100%",
              mx: "auto",
              mb: 5,
              color: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#21cbf3", mb: 2 }}>
              Recent Bookings
            </Typography>
            {loading ? (
              <CircularProgress sx={{ color: "#21cbf3" }} />
            ) : bookings.length === 0 ? (
              <Typography sx={{ color: "#e3f2fd" }}>No bookings yet.</Typography>
            ) : (
              <List>
                {bookings.slice(0, 3).map((booking) => (
                  <ListItem key={booking._id} sx={{ mb: 2, borderRadius: 2, background: "#17375E" }}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon sx={{ color: "#21cbf3" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="bold" sx={{ color: "#21cbf3" }}>
                          {booking.adTitle}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
                            Status: {booking.status}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
                            Booked On: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                          </Typography>
                        </>
                      }
                    />
                    <Button
                      component={Link}
                      to={`/viewdetails/${booking.adId}`}
                      size="small"
                      sx={{
                        color: "#21cbf3",
                        fontWeight: 600,
                        borderRadius: "20px",
                        border: "1px solid #21cbf3",
                        px: 2,
                        "&:hover": {
                          background: "#e3f2fd",
                          color: "#1976d2",
                          borderColor: "#1976d2",
                        },
                      }}
                    >
                      View Ad
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Container>
        {/* Footer */}
        <Footer />
      </Box>
    </>
  );
};
