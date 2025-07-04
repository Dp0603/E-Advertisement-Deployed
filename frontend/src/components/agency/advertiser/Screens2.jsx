import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  FormHelperText,
  Tooltip,
  Fade,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import API from "../../../api/axios";
import { jwtDecode } from "jwt-decode";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CampaignIcon from "@mui/icons-material/Campaign";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { useLoader } from "../../../context/LoaderContext";
import PlaceIcon from "@mui/icons-material/Place";
import { Country, State, City } from "country-state-city";

export const Screens2 = () => {
  const [ads, setAds] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [specificAd, setSpecificAds] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const token = localStorage.getItem("token");
  const decodedtoken = jwtDecode(token);
  const advertiserId = decodedtoken.id;
  const navigate = useNavigate();

  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    fetchAds();
    getStates();
  }, [advertiserId]);

  const fetchAds = async () => {
    showLoader();
    try {
      const res = await API.get(`/ads/${advertiserId}`);
      setAds(res.data);
    } catch (error) {
      showToast("Failed to fetch ads", "error");
    } finally {
      hideLoader();
    }
  };

  const handleEditOpen = async (adId) => {
    const adToEdit = ads.find((ad) => ad._id === adId);
    setSelectedAd(adToEdit);
    if (adToEdit) {
      setValue("title", adToEdit.title || "");
      setValue("description", adToEdit.description || "");
      setValue("targetAudience", adToEdit.targetAudience || "");
      setValue("longitude_latitude", adToEdit.longitude_latitude || "");
      setValue("adType", adToEdit.adType || "");
      setValue("adDimensions", adToEdit.adDimensions || "");
      setValue("adDuration", adToEdit.adDuration || "");
      setValue("budget", adToEdit.budget || "");

      // Set country, state, city using isoCode
      setValue("country", adToEdit.countryIsoCode || "");
      setValue("state", adToEdit.stateIsoCode || "");
      setValue("city", adToEdit.cityIsoCode || "");

      // Fetch states and cities for dropdowns
      if (adToEdit.countryIsoCode) {
        setStates(State.getStatesOfCountry(adToEdit.countryIsoCode));
      }
      if (adToEdit.countryIsoCode && adToEdit.stateIsoCode) {
        setCities(
          City.getCitiesOfState(adToEdit.countryIsoCode, adToEdit.stateIsoCode)
        );
      }
    }
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    reset();
  };

  const handleViewOpen = (adId) => {
    if (!viewOpen) {
      const adToView = ads.find((ad) => ad._id === adId);
      setSelectedAd(adToView);
      setViewOpen(true);
    }
  };

  const handleViewCLose = () => {
    setViewOpen(false);
    reset();
  };

  const getStates = async () => {
    try {
      const res = await API.get("/getstates");
      setStates(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCityByStateId = async (id) => {
    if (!id) {
      setCities([]);
      return;
    }
    try {
      const res = await API.get(`/getcitybystateid/${id}`);
      setCities(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAdsByCity = async (id) => {
    if (!id) {
      setSpecificAds([]);
      setFilterActive(false);
      return;
    }
    try {
      const res = await API.get(`/ads/city/${id}`);
      setSpecificAds(res.data.ads);
      setFilterActive(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getAreaByCityId = async (id) => {
    if (!id) {
      setAreas([]);
      return;
    }
    try {
      const res = await API.get(`/getareabycity/${id}`);
      setAreas(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = async (data) => {
    if (!selectedAd) {
      console.error("No ad selected for update");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("targetAudience", data.targetAudience);
      formData.append("longitude_latitude", data.longitude_latitude);
      formData.append("adType", data.adType);
      formData.append("adDimensions", data.adDimensions);
      formData.append("adDuration", data.adDuration);
      formData.append("budget", data.budget);
      formData.append("stateId", data.stateId);
      formData.append("cityId", data.cityId);
      formData.append("areaId", data.areaId);
      formData.append("advertiserId", advertiserId);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await API.put(
        `/advertiser/updateadswithfile/${selectedAd._id}`,
        formData
      );
      handleEditClose();
      await fetchAds();
      showToast("Ad details updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update ad details", "error");
    }
  };

  const validations = {
    titleValidation: {
      required: { value: true, message: "Title is required" },
      minLength: {
        value: 3,
        message: "Title should contain at least 3 characters",
      },
    },
    descriptionValidation: {
      required: { value: true, message: "Description is required" },
      minLength: {
        value: 10,
        message: "Should contain at least 10 characters",
      },
    },
    targetValidation: {
      required: { value: true, message: "This field is required" },
    },
    cityValidation: {
      required: { value: true, message: "Field is required" },
    },
    adTypeValidation: {
      required: { value: true, message: "Field is required" },
    },
    adDurationValidation: {
      required: { value: true, message: "Duration is required" },
    },
    budgetValidation: {
      required: { value: true, message: "Budget is required" },
    },
  };

  const displayAds = filterActive ? specificAd : ads;

  // Helper to show value or fallback (handles array for targetAudience)
  const showValue = (val, fallback = "—") => {
    if (Array.isArray(val)) return val.length ? val.join(", ") : fallback;
    return val && val !== "N/A" ? val : fallback;
  };

  // --- Ensure all cards have the same height and width ---
  const CARD_HEIGHT = 420;
  const CARD_MEDIA_HEIGHT = 180;

  // --- Fix for new country/state/city/area schema ---
  // Use ad.stateId?.name, ad.cityId?.name, ad.areaId?.name for display
  // Use ad.stateId?._id, ad.cityId?._id, ad.areaId?._id for edit

  // --- Edit dialog: use AdDetails3-like logic for dropdowns ---
  // (see below for changes in the edit dialog)

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #0A192F 60%, #17375E 100%)",
        py: 5,
        px: { xs: 1, md: 4 },
      }}
    >
      {/* Back/Home Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 3,
          borderRadius: "30px",
          fontWeight: 600,
          letterSpacing: 1,
          borderColor: "#21cbf3",
          color: "#21cbf3",
          "&:hover": {
            borderColor: "#1976d2",
            background: "#e3f2fd",
            color: "#1976d2",
          },
        }}
        onClick={() => {
          if (advertiserId) {
            navigate(`/advertiser/dashboard/${advertiserId}`);
          } else {
            navigate("/login");
          }
        }}
      >
        Back to Dashboard
      </Button>

      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          color: "#21cbf3",
          fontWeight: "bold",
          letterSpacing: 1,
          mb: 4,
          textTransform: "uppercase",
        }}
      >
        <CampaignIcon sx={{ mr: 1, fontSize: 36, verticalAlign: "middle" }} />
        Your Advertisements
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: "#21cbf3" }}>State</InputLabel>
          <Select
            onChange={(e) => {
              getCityByStateId(e.target.value);
            }}
            label="State"
            defaultValue=""
            sx={{
              color: "#21cbf3",
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

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: "#21cbf3" }}>City</InputLabel>
          <Select
            onChange={(e) => {
              fetchAdsByCity(e.target.value);
            }}
            label="City"
            defaultValue=""
            sx={{
              color: "#21cbf3",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#21cbf3" },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {cities?.map((city) => (
              <MenuItem key={city._id} value={city._id}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Ads Grid */}
      <Grid container spacing={4} justifyContent="center">
        {displayAds && displayAds.length > 0 ? (
          displayAds.map((ad) => (
            <Grid item xs={12} sm={10} md={6} lg={4} key={ad._id}>
              <Fade in>
                <Card
                  sx={{
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, #112240 60%, #17375E 100%)",
                    color: "#000",
                    boxShadow: 6,
                    minHeight: CARD_HEIGHT,
                    maxHeight: CARD_HEIGHT,
                    height: CARD_HEIGHT,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: 12,
                      borderColor: "#21cbf3",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOpen(ad._id);
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        <CampaignIcon />
                      </Avatar>
                    }
                    title={
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#21cbf3" }}
                        noWrap
                      >
                        {showValue(ad.title)}
                      </Typography>
                    }
                    subheader={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PlaceIcon sx={{ fontSize: 18, color: "#21cbf3" }} />
                        <Typography variant="body2" sx={{ color: "#21cbf3" }}>
                          {showValue(ad.cityId?.name)}
                          {ad.areaId?.name ? `, ${ad.areaId.name}` : ""}
                        </Typography>
                      </Box>
                    }
                    action={
                      <Tooltip title="Edit Ad" arrow>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditOpen(ad._id);
                          }}
                          sx={{ color: "#21cbf3" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <CardMedia
                    component="img"
                    image={ad.adUrl}
                    alt={ad.title}
                    sx={{
                      width: "100%",
                      height: `${CARD_MEDIA_HEIGHT}px`,
                      objectFit: "contain", // Changed from "cover" to "contain"
                      borderRadius: 2,
                      mx: "auto",
                      my: 1,
                      border: "1.5px solid #21cbf3",
                      background: "#e3f2fd",
                      minHeight: CARD_MEDIA_HEIGHT,
                      maxHeight: CARD_MEDIA_HEIGHT,
                      display: "block",
                    }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      color="#e3f2fd"
                      sx={{
                        mb: 1,
                        minHeight: 48,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {showValue(ad.description)}
                    </Typography>
                    <Divider sx={{ my: 1, borderColor: "#21cbf3" }} />
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        icon={<GroupIcon />}
                        label={showValue(ad.targetAudience)}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={
                          ad.adDuration
                            ? `${ad.adDuration} days`
                            : "—"
                        }
                        color="info"
                        size="small"
                      />
                      <Chip
                        icon={<MonetizationOnIcon />}
                        label={
                          ad.budget
                            ? `${ad.budget} Rs`
                            : "—"
                        }
                        color="success"
                        size="small"
                      />
                      <Chip
                        icon={<AspectRatioIcon />}
                        label={showValue(ad.adDimensions)}
                        color="secondary"
                        size="small"
                      />
                      <Chip
                        icon={<CampaignIcon />}
                        label={showValue(ad.adType)}
                        color="warning"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography sx={{ mt: 2, color: "gray", textAlign: "center" }}>
              No Advertisements Available
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* View Dialog */}
      <Dialog
        open={viewOpen}
        onClose={handleViewCLose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)",
            border: "2px solid #1976d2",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#1976d2",
            letterSpacing: 1,
          }}
        >
          {showValue(selectedAd?.title)}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
          >
            <Box flex="0 0 45%" display="flex" justifyContent="center">
              <CardMedia
                component="img"
                image={selectedAd?.adUrl}
                alt={selectedAd?.title}
                sx={{
                  width: "100%",
                  maxHeight: 350,
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: 3,
                  border: "2px solid #21cbf3",
                }}
              />
            </Box>
            <Box flex="1" display="flex" flexDirection="column" gap={2}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                {showValue(selectedAd?.description)}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  icon={<LocationOnIcon />}
                  label={showValue(selectedAd?.cityId?.name)}
                  color="primary"
                />
                <Chip
                  icon={<LocationOnIcon />}
                  label={showValue(selectedAd?.areaId?.name)}
                  color="info"
                />
                <Chip
                  icon={<CampaignIcon />}
                  label={showValue(selectedAd?.adType)}
                  color="secondary"
                />
                <Chip
                  icon={<GroupIcon />}
                  label={showValue(selectedAd?.targetAudience)}
                  color="success"
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={
                    selectedAd?.adDuration
                      ? `${selectedAd.adDuration} days`
                      : "—"
                  }
                  color="warning"
                />
                <Chip
                  icon={<MonetizationOnIcon />}
                  label={
                    selectedAd?.budget
                      ? `${selectedAd.budget} Rs`
                      : "—"
                  }
                  color="error"
                />
                <Chip
                  icon={<AspectRatioIcon />}
                  label={showValue(selectedAd?.adDimensions)}
                  color="default"
                />
              </Box>
              <Typography variant="body2" sx={{ color: "#1976d2", mt: 2 }}>
                <strong>Longitude & Latitude:</strong>{" "}
                {showValue(selectedAd?.longitude_latitude)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleViewCLose}
            color="primary"
            variant="contained"
            sx={{ px: 3, py: 1 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            color: "#1976d2",
            letterSpacing: 1,
          }}
        >
          Edit Advertisement
        </DialogTitle>
        <form onSubmit={handleSubmit(submitHandler)}>
          <DialogContent>
            <Container
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                p: 0,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Title"
                  {...register("title", validations.titleValidation)}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  variant="outlined"
                  sx={inputStyles}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  {...register(
                    "description",
                    validations.descriptionValidation
                  )}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  variant="outlined"
                  sx={inputStyles}
                />

                <TextField
                  fullWidth
                  label="Target Audience"
                  {...register("targetAudience", validations.targetValidation)}
                  error={!!errors.targetAudience}
                  helperText={errors.targetAudience?.message}
                  variant="outlined"
                  sx={inputStyles}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <FormControl fullWidth error={!!errors.adType} sx={inputStyles}>
                    <InputLabel>Ad Type</InputLabel>
                    <Select
                      label="Ad Type"
                      {...register("adType", validations.adTypeValidation)}
                      defaultValue=""
                    >
                      <MenuItem value="Billboard">Billboard</MenuItem>
                      <MenuItem value="Digital">Digital</MenuItem>
                      <MenuItem value="Gantry">Gantry</MenuItem>
                      <MenuItem value="Unipole">Unipole</MenuItem>
                    </Select>
                    {errors.adType && (
                      <FormHelperText>{errors.adType.message}</FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Dimensions"
                    {...register("adDimensions", validations.cityValidation)}
                    error={!!errors.adDimensions}
                    helperText={errors.adDimensions?.message}
                    sx={inputStyles}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Ad Duration (Days)"
                    {...register("adDuration", validations.adDurationValidation)}
                    error={!!errors.adDuration}
                    helperText={errors.adDuration?.message}
                    variant="outlined"
                    sx={inputStyles}
                  />
                  <TextField
                    fullWidth
                    label="Budget (Rs)"
                    {...register("budget", validations.budgetValidation)}
                    error={!!errors.budget}
                    helperText={errors.budget?.message}
                    variant="outlined"
                    sx={inputStyles}
                  />
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormControl
                  fullWidth
                  error={!!errors.stateId}
                  sx={inputStyles}
                >
                  <InputLabel>State</InputLabel>
                  <Select
                    label="State"
                    value={watch("stateId") || ""}
                    onChange={async (e) => {
                      setValue("stateId", e.target.value);
                      await getCityByStateId(e.target.value);
                      setValue("cityId", "");
                      setValue("areaId", "");
                    }}
                  >
                    <MenuItem value="">Select State</MenuItem>
                    {states?.map((state) => (
                      <MenuItem key={state._id} value={state._id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.stateId && (
                    <FormHelperText>{errors.stateId.message}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth error={!!errors.cityId} sx={inputStyles}>
                  <InputLabel>City</InputLabel>
                  <Select
                    {...register("cityId", { required: "City is required" })}
                    onChange={(e) => {
                      getAreaByCityId(e.target.value);
                      setValue("areaId", "");
                    }}
                    label="City"
                    defaultValue=""
                  >
                    <MenuItem value="">Select City</MenuItem>
                    {cities?.map((city) => (
                      <MenuItem key={city._id} value={city._id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.cityId && (
                    <FormHelperText>{errors.cityId.message}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth error={!!errors.areaId} sx={inputStyles}>
                  <InputLabel>Area</InputLabel>
                  <Select
                    {...register("areaId", { required: "Area is required" })}
                    label="Area"
                    defaultValue=""
                  >
                    <MenuItem value="">Select Area</MenuItem>
                    {areas?.map((area) => (
                      <MenuItem key={area._id} value={area._id}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.areaId && (
                    <FormHelperText>{errors.areaId.message}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="Longitude and latitude"
                  {...register(
                    "longitude_latitude",
                    validations.cityValidation
                  )}
                  error={!!errors.longitude_latitude}
                  helperText={errors.longitude_latitude?.message}
                  variant="outlined"
                  sx={inputStyles}
                />

                <TextField
                  fullWidth
                  label="Country"
                  value={watch("country") || ""}
                  disabled
                  sx={inputStyles}
                />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Update Image (Optional)
                </Typography>
                <input type="file" {...register("image")} />
              </Box>
            </Container>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleEditClose}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Ad
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

const inputStyles = {
  mb: 2,
  "& .MuiInputBase-input": { color: "#000" },
  "& .MuiInputLabel-root": { color: "#21cbf3" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#21cbf3" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#21cbf3" },
    "&:hover fieldset": { borderColor: "#21cbf3" },
    "&.Mui-focused fieldset": { borderColor: "#21cbf3" },
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#21cbf3" },
  "& .MuiSvgIcon-root": { color: "#21cbf3" },
};

export default Screens2;
