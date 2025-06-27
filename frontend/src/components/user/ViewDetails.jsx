import {
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

export const ViewDetails = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getAdvertiserId = () => {
    if (!ad) return "";
    if (typeof ad.advertiserId === "string") return ad.advertiserId;
    if (typeof ad.advertiserId === "object" && ad.advertiserId._id)
      return ad.advertiserId._id;
    return "";
  };

  const handleDashboard = () => {
    const userId = getAdvertiserId();
    if (userId) {
      navigate(`/advertiser/dashboard/${userId}`);
    }
  };

  const handleCreateAnotherAd = () => {
    navigate("/ad-details2");
  };

  const handleViewMyAds = () => {
    navigate("/screenings2");
  };

  useEffect(() => {
    fetchAdDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchAdDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/ad/${id}`);
      setAd(res.data);
    } catch (err) {
      setError("Failed to load ad details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 60% 10%, #21cbf3 0%, #0A192F 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#21cbf3" }} />
      </Box>
    );

  if (error)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 60% 10%, #21cbf3 0%, #0A192F 100%)",
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );

  if (!ad)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 60% 10%, #21cbf3 0%, #0A192F 100%)",
        }}
      >
        <Typography>No ad details found.</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(ellipse at 60% 10%, #0A192F 0%, #0A192F 100%)",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: { xs: 4, md: 8 },
        px: 2,
        position: "relative",
      }}
    >
      {/* Top right dashboard button */}
      <Tooltip title="Back to Dashboard">
        <IconButton
          onClick={handleDashboard}
          sx={{
            position: "absolute",
            top: 32,
            right: 48,
            color: "#21cbf3",
            background: "rgba(33,203,243,0.08)",
            "&:hover": { background: "#21cbf3", color: "#112240" },
            zIndex: 2,
          }}
        >
          <ArrowForwardIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
      <Paper
        elevation={16}
        sx={{
          width: "100%",
          maxWidth: 1200,
          minHeight: 650,
          borderRadius: 7,
          background: "rgba(17,34,64,0.95)",
          border: "2.5px solid #21cbf3",
          boxShadow: "0 8px 32px 0 rgba(33,203,243,0.22)",
          color: "#fff",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Left: Image & Status */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(120deg, #112240 60%, #17375E 100%)",
            py: 6,
            px: { xs: 2, md: 4 },
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: 320,
              height: 320,
              borderRadius: "24px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 32px 0 rgba(33,203,243,0.18)",
              border: "3px solid #21cbf3",
              mb: 2,
              overflow: "hidden",
            }}
          >
            <img
              src={ad.adUrl || ""}
              alt={ad.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "#fff",
              }}
            />
          </Box>
          <Chip
            icon={ad.isFeatured ? <StarIcon /> : undefined}
            label={ad.isFeatured ? "Featured" : "Standard"}
            color={ad.isFeatured ? "success" : "default"}
            sx={{
              fontWeight: 700,
              fontSize: 18,
              mt: 2,
              px: 2.5,
              py: 1,
              background: ad.isFeatured ? "#43e97b" : "#0A192F",
              color: ad.isFeatured ? "#112240" : "#21cbf3",
              border: ad.isFeatured ? "none" : "2px solid #21cbf3",
              boxShadow: ad.isFeatured
                ? "0 2px 8px 0 rgba(67,233,123,0.18)"
                : "0 2px 8px 0 rgba(33,203,243,0.18)",
            }}
          />
        </Box>
        {/* Right: Details */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 3, md: 7 },
            py: 6,
            background: "rgba(33,203,243,0.03)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "#21cbf3",
                letterSpacing: 2,
                textShadow: "0 2px 12px #17375E",
                textTransform: "uppercase",
              }}
            >
              {ad.title}
            </Typography>
            <Chip
              label={ad.adType || "N/A"}
              color="info"
              sx={{
                fontWeight: 700,
                background: "#21cbf3",
                color: "#112240",
                fontSize: 17,
                px: 2,
              }}
            />
          </Stack>
          <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
            {ad.stateId?.name && (
              <Chip
                label={ad.stateId.name}
                sx={{
                  fontWeight: 600,
                  background: "#17375E",
                  color: "#21cbf3",
                  fontSize: 15,
                }}
              />
            )}
            {ad.cityId?.name && (
              <Chip
                label={ad.cityId.name}
                sx={{
                  fontWeight: 600,
                  background: "#17375E",
                  color: "#21cbf3",
                  fontSize: 15,
                }}
              />
            )}
            {ad.areaId?.name && (
              <Chip
                label={ad.areaId.name}
                sx={{
                  fontWeight: 600,
                  background: "#17375E",
                  color: "#21cbf3",
                  fontSize: 15,
                }}
              />
            )}
          </Stack>
          <Divider sx={{ mb: 3, borderColor: "#21cbf3" }} />
          <Stack spacing={2}>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              <b>Description:</b> {ad.description}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              <b>Dimensions:</b> {ad.adDimensions || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              <b>Duration:</b> {ad.adDuration ? `${ad.adDuration} days` : "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              <b>Target Audience:</b>{" "}
              {Array.isArray(ad.targetAudience)
                ? ad.targetAudience.join(", ")
                : ad.targetAudience || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              <b>Location:</b>{" "}
              {[ad.areaId?.name, ad.cityId?.name, ad.stateId?.name]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              <b>Coordinates:</b> {ad.longitude_latitude || "N/A"}
            </Typography>
          </Stack>
          <Divider sx={{ my: 3, borderColor: "#21cbf3" }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#21cbf3",
              textAlign: "left",
              letterSpacing: 2,
              mb: 3,
            }}
          >
            Price: ₹{ad.budget}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mt={2}>
            <Button
              variant="contained"
              sx={{
                minWidth: 200,
                fontWeight: "bold",
                fontSize: "1.15rem",
                borderRadius: "30px",
                background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                boxShadow: "0 4px 20px rgba(25,118,210,0.10)",
                letterSpacing: 1,
                py: 1.3,
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                },
              }}
              onClick={handleCreateAnotherAd}
            >
              Create Another Ad
            </Button>
            <Button
              variant="contained"
              sx={{
                minWidth: 200,
                fontWeight: "bold",
                fontSize: "1.15rem",
                borderRadius: "30px",
                background: "linear-gradient(90deg, #21cbf3 60%, #1976d2 100%)",
                boxShadow: "0 4px 20px rgba(33,203,243,0.10)",
                letterSpacing: 1,
                py: 1.3,
                "&:hover": {
                  background: "linear-gradient(90deg, #00bcd4 60%, #1565c0 100%)",
                },
              }}
              onClick={handleViewMyAds}
            >
              View Your Created Ads
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewDetails;
