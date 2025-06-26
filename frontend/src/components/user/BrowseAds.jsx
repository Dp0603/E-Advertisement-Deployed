import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  CircularProgress,
  Paper,
  Tooltip,
  Fade,
  Divider,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

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

export const BrowseAds = () => {
  const [ads, setAds] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [savedAds, setSavedAds] = useState(new Set());
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Get user from localStorage for profile card
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [adsRes, savedRes, statesRes] = await Promise.all([
        API.get("/browseads"),
        API.get("/api/saved-ads"),
        API.get("/getstates"),
      ]);
      setAds(adsRes.data);
      setFilteredAds(adsRes.data);
      setSavedAds(new Set(savedRes.data.map((ad) => ad._id)));
      setStates(statesRes.data.data);
    } catch (err) {
      setError("Failed to load ads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save or unsave ad
  const toggleSaveAd = async (adId) => {
    setSaving(adId);
    try {
      if (savedAds.has(adId)) {
        await API.delete(`/api/remove-ad/${adId}`);
        setSavedAds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(adId);
          return newSet;
        });
        setSnackbar({
          open: true,
          message: "Removed from saved ads.",
          severity: "info",
        });
      } else {
        await API.post("/api/save-ad", { adId });
        setSavedAds((prev) => new Set(prev).add(adId));
        setSnackbar({ open: true, message: "Ad saved!", severity: "success" });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update saved ads.",
        severity: "error",
      });
    } finally {
      setSaving("");
    }
  };

  // Fetch cities when state changes
  const getCitiesByState = async (id) => {
    setSelectedState(id);
    setCities([]);
    setSelectedCity("");
    if (!id) {
      setFilteredAds(ads);
      return;
    }
    try {
      const res = await API.get(`/getcitybystateid/${id}`);
      setCities(res.data.data);
      // Filter ads by state
      setFilteredAds(ads.filter((ad) => ad.stateId?._id === id));
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load cities.",
        severity: "error",
      });
    }
  };

  // Filter ads by city
  const filterAdsByCity = (id) => {
    setSelectedCity(id);
    if (!id) {
      // If city is reset, show all ads for selected state
      if (selectedState) {
        setFilteredAds(ads.filter((ad) => ad.stateId?._id === selectedState));
      } else {
        setFilteredAds(ads);
      }
      return;
    }
    setFilteredAds(ads.filter((ad) => ad.cityId?._id === id));
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedState("");
    setSelectedCity("");
    setCities([]);
    setFilteredAds(ads);
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
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
            {user.firstName ? (
              user.firstName[0]
            ) : (
              <PersonIcon fontSize="large" />
            )}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#21cbf3" }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" sx={{ color: "#21cbf3", mb: 1 }}>
              <EmailIcon
                sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }}
              />
              {user.email}
            </Typography>
            <Typography variant="body2" sx={{ color: "#e3f2fd" }}>
              <CalendarMonthIcon
                sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }}
              />
              Joined:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
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

      {/* Header */}
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
          Browse Ads
        </Typography>
        <Typography variant="body1" sx={{ color: "#e3f2fd", mb: 2 }}>
          Discover and book your favorite ads. Filter by state and city to find
          the best options for you!
        </Typography>
        <Divider sx={{ borderColor: "#21cbf3", mb: 2 }} />
      </Paper>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 3,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: "#21cbf3" }}>State</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) => getCitiesByState(e.target.value)}
            label="State"
            sx={{
              color: "#21cbf3",
              background: "#112240",
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#21cbf3" },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {states?.map((state) => (
              <MenuItem key={state._id} value={state._id}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: "#21cbf3" }}>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => filterAdsByCity(e.target.value)}
            label="City"
            sx={{
              color: "#21cbf3",
              background: "#112240",
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#21cbf3" },
            }}
            disabled={!selectedState}
          >
            <MenuItem value="">All</MenuItem>
            {cities?.map((city) => (
              <MenuItem key={city._id} value={city._id}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={resetFilters}
          sx={{
            borderColor: "#21cbf3",
            color: "#21cbf3",
            borderRadius: "30px",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              borderColor: "#1976d2",
              color: "#1976d2",
              background: "#e3f2fd",
            },
          }}
        >
          Reset Filters
        </Button>
      </Box>

      {/* Ads Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#21cbf3" }} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
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
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => (
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
                        background:
                          "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                        color: "#fff",
                        borderRadius: "30px",
                        fontWeight: 600,
                        px: 3,
                        boxShadow: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                          color: "#fff",
                        },
                      }}
                      onClick={() => navigate("/viewdetails/" + ad._id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 2,
                        ml: 2,
                        borderColor: "#21cbf3",
                        color: "#21cbf3",
                        borderRadius: "30px",
                        fontWeight: 600,
                        px: 3,
                        "&:hover": {
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          background: "#e3f2fd",
                        },
                      }}
                      onClick={() => navigate("/bookings/" + ad._id)}
                    >
                      Book Ad
                    </Button>
                  </Box>
                  {/* Save Ad Icon */}
                  <Tooltip
                    title={
                      savedAds.has(ad._id) ? "Remove from Saved" : "Save Ad"
                    }
                    arrow
                  >
                    <span>
                      <IconButton
                        onClick={() => toggleSaveAd(ad._id)}
                        disabled={saving === ad._id}
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
                        aria-label={
                          savedAds.has(ad._id) ? "Remove from saved" : "Save ad"
                        }
                      >
                        {saving === ad._id ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "#21cbf3" }}
                          />
                        ) : savedAds.has(ad._id) ? (
                          <BookmarkIcon color="primary" />
                        ) : (
                          <BookmarkBorderIcon />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </StyledCard>
              </Fade>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%", color: "#e3f2fd" }}
            >
              No Ads Available
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BrowseAds;
