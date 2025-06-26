import { Typography, Box, Button, Paper, Chip, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from "../../api/axios";

export const ViewDetails = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/bookings/${id}`);
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
          background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
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
          background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        }}
      >
        <Typography color="error" variant="h6">{error}</Typography>
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
          background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
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
      <Paper
        elevation={8}
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 6,
          p: { xs: 3, md: 5 },
          background: "linear-gradient(135deg, #112240 60%, #17375E 100%)",
          border: "2px solid #21cbf3",
          boxShadow: "0 8px 32px 0 rgba(33,203,243,0.18)",
          color: "#fff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#21cbf3",
            mb: 2,
            letterSpacing: 1,
            textAlign: "center",
          }}
        >
          {ad.title}
        </Typography>

        {/* Ad Image */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <img
            src={ad.adUrl || ""}
            alt={ad.title}
            style={{
              width: "100%",
              maxWidth: 340,
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(33,203,243,0.18)",
              border: "2px solid #21cbf3",
              background: "#fff",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Details */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={ad.adType || "N/A"}
            color="info"
            sx={{ mr: 1, mb: 1, fontWeight: 600, background: "#21cbf3", color: "#112240" }}
          />
          <Chip
            label={ad.isFeatured ? "Featured" : "Standard"}
            color={ad.isFeatured ? "success" : "default"}
            sx={{ mb: 1, fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Location:</strong> {ad.cityId?.name || "N/A"}, {ad.areaId?.name || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Description:</strong> {ad.description}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Dimensions:</strong> {ad.adDimensions || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Duration:</strong> {ad.adDuration ? `${ad.adDuration} days` : "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Target Audience:</strong>{" "}
          {Array.isArray(ad.targetAudience)
            ? ad.targetAudience.join(", ")
            : ad.targetAudience || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Coordinates:</strong> {ad.longitude_latitude || "N/A"}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mt: 2,
            color: "#21cbf3",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Price: ₹{ad.budget}
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 4,
            width: "100%",
            fontWeight: "bold",
            fontSize: "1.1rem",
            borderRadius: "30px",
            background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
            boxShadow: "0 4px 20px rgba(25,118,210,0.10)",
            letterSpacing: 1,
            py: 1.3,
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
            },
          }}
          onClick={handleBooking}
        >
          Book Now
        </Button>
      </Paper>
    </Box>
  );
};

export default ViewDetails;
