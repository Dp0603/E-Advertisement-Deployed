import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card, Typography, Box, Select, MenuItem, FormControl, InputLabel, Button, IconButton
} from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import API from "../../api/axios";
import { Link, useNavigate } from 'react-router-dom';
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

export const BrowseAds = () => {
  const [ads, setAds] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [savedAds, setSavedAds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
    fetchSavedAds();
    getStates();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await API.get("/browseads");
      setAds(res.data);
      setFilteredAds(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedAds = async () => {
    try {
      const res = await API.get("/api/saved-ads");
      setSavedAds(new Set(res.data.map(ad => ad._id)));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSaveAd = async (adId) => {
    try {
      if (savedAds.has(adId)) {
        await API.delete(`/api/remove-ad/${adId}`);
        setSavedAds(prev => {
          const newSet = new Set(prev);
          newSet.delete(adId);
          return newSet;
        });
      } else {
        await API.post("/api/save-ad", { adId });
        setSavedAds(prev => new Set(prev).add(adId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStates = async () => {
    try {
      const res = await API.get("/getstates");
      setStates(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

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
    } catch (error) {
      console.log(error);
    }
  };

  const filterAdsByCity = async (id) => {
    setSelectedCity(id);
    if (!id) {
      if (selectedState) {
        try {
          const res = await API.get(`/ads/state/${selectedState}`);
          setFilteredAds(res.data.ads);
        } catch (error) {
          console.log(error);
        }
      } else {
        setFilteredAds(ads);
      }
      return;
    }
    try {
      const res = await API.get(`/ads/city/${id}`);
      setFilteredAds(res.data.ads);
    } catch (error) {
      console.log(error);
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
        Browse Ads
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 3, justifyContent: "center" }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>State</InputLabel>
          <Select value={selectedState} onChange={(e) => getCitiesByState(e.target.value)} label="State">
            <MenuItem value="">All</MenuItem> {/* Default: Fetch all ads */}
            {states?.map((state) => (
              <MenuItem key={state._id} value={state._id}>{state.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>City</InputLabel>
          <Select value={selectedCity} onChange={(e) => filterAdsByCity(e.target.value)} label="City">
            <MenuItem value="">All</MenuItem> {/* Default: Fetch ads for selected state */}
            {cities?.map((city) => (
              <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Ads Grid */}
      {loading ? (
        <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
          Loading Ads...
        </Typography>
      ) : (
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(600px, 1fr))",
          gap: "20px",
          justifyContent: "center",
        }}>
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => (
              <StyledCard key={ad._id}>
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
                  <Box sx={{ flex: 1, paddingLeft: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{ad.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {ad.cityId?.name || "City not available"}, {ad.areaId?.name || "Area not available"}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>{ad.description}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold", marginTop: 1 }}>₹{ad.budget}</Typography>
                    <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate("/viewdetails/" + ad._id)}>View Details</Button>
                    <Button variant="outlined" color="secondary" sx={{ marginTop: 2, marginLeft: 2 }} onClick={() => navigate("/bookings/" + ad._id)}>Book ad</Button>
                  </Box>

                  {/* Save Ad Icon */}
                  <IconButton onClick={() => toggleSaveAd(ad._id)}>
                    {savedAds.has(ad._id) ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                  </IconButton>
              </StyledCard>
            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
              No Ads Available
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BrowseAds;
