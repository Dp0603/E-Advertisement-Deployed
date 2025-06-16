import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Card, CardHeader, CardContent, CardActions, IconButton, Typography, Avatar, Collapse, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import API from "../../../api/axios";
import { jwtDecode } from "jwt-decode";

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "expand",
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
}));

export const Screens = () => {
  const [ads, setAds] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCity] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [specificAd, setSpecificAds] = useState([]);
  const token = localStorage.getItem("token");
  const decodedtoken = jwtDecode(token);
  const id = decodedtoken.id;



  useEffect(() => {
    const fetchAds = async () => {
      try {

        console.log("Current user:", id);
        const res = await API.get(`/ads/${id}`);
        console.log(res);
        console.log(res.data);
        console.log(token);
        setAds(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAds();
    getStates();
  }, []);

  const getStates = async () => {
    const res = await API.get("/getstates");
    console.log(res.data);
    setStates(res.data.data);
  };

  const getCityByStateId = async (id) => {
    setCity([]);
    setSpecificAds([]);
    setFilterActive(false);
    try {
      const res = await API.get(`/getcitybystateid/${id}`);
      console.log("City Response:", res.data);
      setCity(res.data.data);
    } catch (error) {
      console.log(error);
    }

  };

  const fetchAdsByCity = async (id) => {
    if (!id) {
      setSpecificAds([]);
      return;
    }
    try {
      const res = await API.get(`/ads/city/${id}`)
      console.log(res.data);
      setSpecificAds(res.data.ads);
      setFilterActive(true);
    } catch (error) {
      console.log(error);
    }
  }

  const handleExpand = (_id) => {
    setExpanded((prev) => ({
      ...prev,
      [_id]: !prev[_id],
    }));
  };

  const displayAds = filterActive ? specificAd : ads;


  return (

    <div style={{ padding: "20px" }}>

      <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
        Screens:
      </Typography>

      <Box sx={{ display: "flex", gap: 2, ml: 4 }}>
        <FormControl sx={{ minWidth: 120 }} >
          <InputLabel>State</InputLabel>
          <Select
            onChange={(e) => { getCityByStateId(e.target.value); }}
            label="State"
          >
            <MenuItem value="">All</MenuItem>
            {states?.map((state) => (
              <MenuItem key={state._id} value={state._id}>{state.name}</MenuItem>
            ))}
          </Select>

        </FormControl>

        <FormControl sx={{ minWidth: 120, mr: 2 }}  >
          <InputLabel>City</InputLabel>
          <Select
            onChange={(e) => {
              fetchAdsByCity(e.target.value);
            }}
            label="City"
          >
            <MenuItem value="" ></MenuItem>
            {cities?.map((city) => (
              <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
            ))}
          </Select>

        </FormControl>
      </Box>


      <div

        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          justifyItems: "center",
          alignItems: "start",
          padding: "20px",
        }}

      >
        {displayAds.length > 0 ? (
          displayAds.map((ad) => (
            <Card key={ad._id} sx={{
              width: "100%",
              maxWidth: 300,
              minHeight: "150px",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.05)", boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" },
            }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: "red" }}>{ad.title[0]}</Avatar>}
                title={ad.title}
                subheader={` ${ad.cityId?.name || "Cityname not available"}, ${ad.areaId?.name || "areaname not available"}`}

              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {ad.description}
                </Typography>
              </CardContent >
              <CardActions>
                <ExpandMore
                  onClick={() => handleExpand(ad._id)}
                  sx={{ transform: expanded[ad._id] ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse in={expanded[ad._id]} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="body2">Ad Type: {ad.adType}</Typography>
                  <Typography variant="body2">Target Audience: {ad.targetAudience}</Typography>
                  {ad.adDuration && <Typography variant="body2">Duration: {ad.adDuration} days</Typography>}
                  <Typography variant="body2">Longitude and Latitude:{ad.longitude_latitude}</Typography>
                  <Typography variant="body2">Budget:{ad.budget}</Typography>
                  <Typography variant="body2">Dimension:{ad.adDimensions}</Typography>
                </CardContent>
              </Collapse>
            </Card>
          ))

        ) : (
          <Typography sx={{ mt: 2, color: "gray" }}>No Screens available</Typography>
        )}
      </div>
    </div>
  );
}

export default Screens;
