import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Paper,
  Tooltip,
  Fade,
  Divider,
  Avatar,
} from "@mui/material";
import API from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "18px",
  width: "100%",
  maxWidth: "650px",
  minHeight: "160px",
  boxShadow: "0px 6px 24px 0 rgba(33,203,243,0.10)",
  transition: "transform 0.18s, box-shadow 0.18s",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
  border: "2px solid #21cbf3",
  color: "#fff",
  "&:hover": {
    transform: "scale(1.025)",
    boxShadow: "0px 12px 32px 0 rgba(33,203,243,0.18)",
    borderColor: "#21cbf3",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    maxWidth: "98vw",
    minHeight: "auto",
    padding: "12px",
  },
}));

const ImagePlaceholder = styled(Box)({
  width: "120px",
  height: "120px",
  background: "linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#1976d2",
  fontWeight: "bold",
  border: "1.5px solid #21cbf3",
});

const SavedAds = () => {
  const [savedAds, setSavedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState("");
  const navigate = useNavigate();

  // Get user from localStorage for profile card
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    fetchSavedAds();
    // eslint-disable-next-line
  }, []);

  const fetchSavedAds = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/saved-ads");
      setSavedAds(res.data);
    } catch (error) {
      console.error("Error fetching saved ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedAd = async (adId) => {
    setRemoving(adId);
    try {
      await API.delete(`/api/remove-ad/${adId}`);
      setSavedAds((prev) => prev.filter((ad) => ad._id !== adId));
    } catch (error) {
      console.error("Error removing saved ad:", error);
    } finally {
      setRemoving("");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
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
            to="/user/dashboard"
            variant="contained"
            startIcon={<DashboardIcon />}
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

      {/* Saved Ads Section */}
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
          <BookmarkIcon sx={{ color: "#21cbf3", mr: 1, fontSize: 36, verticalAlign: "middle" }} />
          Your Saved Ads
        </Typography>
        <Typography variant="body1" sx={{ color: "#e3f2fd", mb: 2 }}>
          All your favorite ads in one place. Quickly revisit, manage, or remove them.
        </Typography>
        <Divider sx={{ borderColor: "#21cbf3", mb: 2 }} />
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#21cbf3" }} />
        </Box>
      ) : savedAds.length > 0 ? (
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
          {savedAds.map((ad) => (
            <Fade in key={ad._id}>
              <StyledCard>
                {/* Ad Image */}
                <Box
                  sx={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "1.5px solid #21cbf3",
                    background: "#fff",
                  }}
                >
                  {ad.adUrl ? (
                    <img
                      src={ad.adUrl}
                      alt={ad.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    <ImagePlaceholder>No Image</ImagePlaceholder>
                  )}
                </Box>
                {/* Ad Details */}
                <Box sx={{ flex: 1, pl: { xs: 0, sm: 3 }, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#21cbf3",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ad.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
                    {ad.cityId?.name || "City not available"},{" "}
                    {ad.areaId?.name || "Area not available"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "#e3f2fd",
                      maxHeight: 48,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ad.description}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      mt: 1,
                      color: "#21cbf3",
                    }}
                  >
                    ₹{ad.budget}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
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
                    onClick={() => navigate("/viewdetails/" + ad._id)}
                  >
                    View Details
                  </Button>
                </Box>
                {/* Remove Saved Ad Icon */}
                <Tooltip title="Remove from Saved" arrow>
                  <span>
                    <IconButton
                      onClick={() => removeSavedAd(ad._id)}
                      disabled={removing === ad._id}
                      sx={{
                        ml: 2,
                        background: "rgba(33,203,243,0.08)",
                        color: "#fff",
                        "&:hover": {
                          background: "#21cbf3",
                          color: "#fff",
                        },
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                      }}
                    >
                      {removing === ad._id ? (
                        <CircularProgress size={24} sx={{ color: "#21cbf3" }} />
                      ) : (
                        <DeleteIcon color="error" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </StyledCard>
            </Fade>
          ))}
        </Box>
      ) : (
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
          <BookmarkIcon sx={{ color: "#21cbf3", fontSize: 48, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            No Saved Ads Yet.
          </Typography>
          <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
            You haven't saved any ads yet. Browse ads and click the bookmark icon to save your favorites!
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
            onClick={() => navigate("/browseads")}
          >
            Browse Ads
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default SavedAds;
