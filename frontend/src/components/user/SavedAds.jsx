import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card, Typography, Box, Button, IconButton, CircularProgress
} from "@mui/material";
import API from "../../api/axios";
import { useNavigate } from 'react-router-dom';
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BrowseBg from "../assets/images/BrowseAdsBg.jpg";

const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px",
  width: "100%",
  maxWidth: "600px",
  boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)"
  },
  borderRadius: "10px",
  backgroundColor: "#E3F2FD",
});

const ImagePlaceholder = styled(Box)({
  width: "120px",
  height: "120px",
  backgroundColor: "#f2f2f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  fontSize: "14px",
  color: "gray",
  fontWeight: "bold",
});


export const SavedAds = () => {
  const [savedAds, setSavedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedAds();
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
    try {
      await API.delete(`/api/remove-ad/${adId}`);
      setSavedAds(savedAds.filter(ad => ad._id !== adId));
    } catch (error) {
      console.error("Error removing saved ad:", error);
    }
  };

  return (
    <Box sx={{
      padding: "20px",
      maxWidth: "100%",
      margin: "auto",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundImage: `url(${BrowseBg})`,
      backgroundSize: "cover",
      backgroundPosition: "top",
      backgroundRepeat: "no-repeat"
    }}>
      <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: "bold", textAlign: "center" }}>
        Your Saved Ads <BookmarkIcon sx={{ color: "primary" }} />
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : savedAds.length > 0 ? (
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(600px, 1fr))",
          gap: "20px",
          justifyContent: "center",
        }}>
          {savedAds.map((ad) => (
            <StyledCard key={ad._id}>
               {/* Ad Image */}
               <Box sx={{ width: "120px", height: "120px", borderRadius: "8px", overflow: "hidden" }}>
                {ad.adUrl ? (
                  <img 
                    src={ad.adUrl} 
                    alt={ad.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                ) : (
                  <ImagePlaceholder>No Image</ImagePlaceholder>
                )}
              </Box>
              {/* Ad Details */}
              <Box sx={{ flex: 1, paddingLeft: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{ad.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {ad.cityId?.name || "City not available"}, {ad.areaId?.name || "Area not available"}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>{ad.description}</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", marginTop: 1 }}>₹{ad.budget}</Typography>

                <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate("/viewdetails/" + ad._id)}>
                  View Details
                </Button>
              </Box>

              {/* Remove Saved Ad Icon */}
              <IconButton onClick={() => removeSavedAd(ad._id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </StyledCard>
          ))}
        </Box>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", width: "100%", marginTop: 4 }}>
          No Saved Ads Yet.
        </Typography>
      )}
    </Box>
  );
};

export default SavedAds;
